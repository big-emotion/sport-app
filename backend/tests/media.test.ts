import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";
import { hashPassword } from "../src/utils/password";
import path from "path";
import fs from "fs";

describe("Media API", () => {
  let authToken: string;
  let userId: string;
  let sportPlaceId: string;
  const testImagePath = path.join(__dirname, "fixtures", "test-image.jpg");

  beforeAll(async () => {
    // Create test image if it doesn't exist
    const fixturesDir = path.join(__dirname, "fixtures");
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir);
    }
    if (!fs.existsSync(testImagePath)) {
      // Create a small test image
      const imageBuffer = Buffer.alloc(100 * 100 * 3); // 100x100 RGB image
      fs.writeFileSync(testImagePath, imageBuffer);
    }
  });

  beforeEach(async () => {
    // Create test user
    const hashedPassword = await hashPassword("password123");
    const user = await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        password: hashedPassword,
        roles: ["ROLE_USER"],
      },
    });
    userId = user.id;

    // Create test sport
    const sport = await prisma.sport.create({
      data: {
        name: "Test Sport",
        description: "Test Sport Description",
      },
    });

    // Create test sport place
    const sportPlace = await prisma.sportPlace.create({
      data: {
        name: "Test Place",
        description: "Test Place Description",
        sportId: sport.id,
        createdById: userId,
      },
    });
    sportPlaceId = sportPlace.id;

    // Login to get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "john@test.com",
      password: "password123",
    });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test image
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  describe("POST /api/media", () => {
    it("should upload an image", async () => {
      const response = await request(app)
        .post("/api/media")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", testImagePath)
        .field("sportPlaceId", sportPlaceId)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("url");
      expect(response.body.sportPlaceId).toBe(sportPlaceId);
      expect(response.body.userId).toBe(userId);
    });

    it("should not upload without authentication", async () => {
      await request(app)
        .post("/api/media")
        .attach("file", testImagePath)
        .field("sportPlaceId", sportPlaceId)
        .expect(401);
    });

    it("should not upload without file", async () => {
      await request(app)
        .post("/api/media")
        .set("Authorization", `Bearer ${authToken}`)
        .field("sportPlaceId", sportPlaceId)
        .expect(400);
    });

    it("should not upload with invalid sport place id", async () => {
      await request(app)
        .post("/api/media")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", testImagePath)
        .field("sportPlaceId", "invalid-id")
        .expect(400);
    });
  });

  describe("GET /api/media", () => {
    beforeEach(async () => {
      // Create test media entries
      await prisma.media.createMany({
        data: [
          {
            url: "test-url-1.jpg",
            userId,
            sportPlaceId,
          },
          {
            url: "test-url-2.jpg",
            userId,
            sportPlaceId,
          },
        ],
      });
    });

    it("should list media", async () => {
      const response = await request(app).get("/api/media").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it("should filter media by sport place", async () => {
      const response = await request(app)
        .get(`/api/media?sportPlaceId=${sportPlaceId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(
        response.body.every((media: any) => media.sportPlaceId === sportPlaceId)
      ).toBe(true);
    });

    it("should paginate media", async () => {
      const response = await request(app)
        .get("/api/media?page=1&limit=1")
        .expect(200);

      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBe(1);
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("totalPages");
    });
  });

  describe("DELETE /api/media/:id", () => {
    let mediaId: string;

    beforeEach(async () => {
      const media = await prisma.media.create({
        data: {
          url: "test-url.jpg",
          userId,
          sportPlaceId,
        },
      });
      mediaId = media.id;
    });

    it("should delete own media", async () => {
      await request(app)
        .delete(`/api/media/${mediaId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // Verify media is deleted
      const media = await prisma.media.findUnique({
        where: { id: mediaId },
      });
      expect(media).toBeNull();
    });

    it("should not delete media without authentication", async () => {
      await request(app).delete(`/api/media/${mediaId}`).expect(401);
    });

    it("should not delete another user's media", async () => {
      // Create another user and media
      const otherUser = await prisma.user.create({
        data: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          password: await hashPassword("password123"),
          roles: ["ROLE_USER"],
        },
      });

      const otherMedia = await prisma.media.create({
        data: {
          url: "other-url.jpg",
          userId: otherUser.id,
          sportPlaceId,
        },
      });

      await request(app)
        .delete(`/api/media/${otherMedia.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });
  });
});
