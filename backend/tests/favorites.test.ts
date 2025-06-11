import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";
import { hashPassword } from "../src/utils/password";

describe("Favorites API", () => {
  let authToken: string;
  let userId: string;
  let sportPlaceId: string;

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

  describe("POST /api/favorites", () => {
    it("should add a favorite", async () => {
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ sportPlaceId })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.userId).toBe(userId);
      expect(response.body.sportPlaceId).toBe(sportPlaceId);
    });

    it("should not add favorite without authentication", async () => {
      await request(app)
        .post("/api/favorites")
        .send({ sportPlaceId })
        .expect(401);
    });

    it("should not add duplicate favorite", async () => {
      // Add first favorite
      await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ sportPlaceId });

      // Try to add same favorite again
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ sportPlaceId })
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });

    it("should not add favorite with invalid sport place id", async () => {
      await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ sportPlaceId: "invalid-id" })
        .expect(400);
    });
  });

  describe("GET /api/favorites", () => {
    beforeEach(async () => {
      // Add some favorites
      await prisma.favorite.create({
        data: {
          userId,
          sportPlaceId,
        },
      });
    });

    it("should list user favorites", async () => {
      const response = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].sportPlaceId).toBe(sportPlaceId);
    });

    it("should not list favorites without authentication", async () => {
      await request(app).get("/api/favorites").expect(401);
    });
  });

  describe("DELETE /api/favorites/:id", () => {
    let favoriteId: string;

    beforeEach(async () => {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          sportPlaceId,
        },
      });
      favoriteId = favorite.id;
    });

    it("should remove favorite", async () => {
      await request(app)
        .delete(`/api/favorites/${favoriteId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // Verify favorite is deleted
      const favorite = await prisma.favorite.findUnique({
        where: { id: favoriteId },
      });
      expect(favorite).toBeNull();
    });

    it("should not remove favorite without authentication", async () => {
      await request(app).delete(`/api/favorites/${favoriteId}`).expect(401);
    });

    it("should not remove another user's favorite", async () => {
      // Create another user and favorite
      const otherUser = await prisma.user.create({
        data: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          password: await hashPassword("password123"),
          roles: ["ROLE_USER"],
        },
      });

      const otherFavorite = await prisma.favorite.create({
        data: {
          userId: otherUser.id,
          sportPlaceId,
        },
      });

      await request(app)
        .delete(`/api/favorites/${otherFavorite.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });
  });
});
