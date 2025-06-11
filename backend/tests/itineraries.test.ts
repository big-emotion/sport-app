import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";
import { hashPassword } from "../src/utils/password";

describe("Itineraries API", () => {
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

  describe("POST /api/itineraries", () => {
    it("should create an itinerary", async () => {
      const itineraryData = {
        name: "Test Itinerary",
        description: "Test Description",
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        sportPlaceIds: [sportPlaceId],
      };

      const response = await request(app)
        .post("/api/itineraries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(itineraryData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(itineraryData.name);
      expect(response.body.description).toBe(itineraryData.description);
      expect(response.body.userId).toBe(userId);
      expect(response.body.sportPlaces).toHaveLength(1);
      expect(response.body.sportPlaces[0].id).toBe(sportPlaceId);
    });

    it("should not create itinerary without authentication", async () => {
      const itineraryData = {
        name: "Test Itinerary",
        description: "Test Description",
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        sportPlaceIds: [sportPlaceId],
      };

      await request(app)
        .post("/api/itineraries")
        .send(itineraryData)
        .expect(401);
    });

    it("should not create itinerary with invalid data", async () => {
      const itineraryData = {
        name: "Te", // Too short
        description: "Test",
        startDate: new Date(Date.now() - 86400000).toISOString(), // Past date
        endDate: new Date(Date.now() + 86400000).toISOString(),
        sportPlaceIds: [sportPlaceId],
      };

      const response = await request(app)
        .post("/api/itineraries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(itineraryData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("should not create itinerary with end date before start date", async () => {
      const itineraryData = {
        name: "Test Itinerary",
        description: "Test Description",
        startDate: new Date(Date.now() + 172800000).toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(), // Before start date
        sportPlaceIds: [sportPlaceId],
      };

      await request(app)
        .post("/api/itineraries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(itineraryData)
        .expect(400);
    });
  });

  describe("GET /api/itineraries", () => {
    beforeEach(async () => {
      // Create test itineraries
      await prisma.itinerary.create({
        data: {
          name: "Itinerary 1",
          description: "Description 1",
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          userId,
          sportPlaces: {
            connect: [{ id: sportPlaceId }],
          },
        },
      });
    });

    it("should list user itineraries", async () => {
      const response = await request(app)
        .get("/api/itineraries")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe("Itinerary 1");
    });

    it("should not list itineraries without authentication", async () => {
      await request(app).get("/api/itineraries").expect(401);
    });

    it("should paginate itineraries", async () => {
      // Create another itinerary
      await prisma.itinerary.create({
        data: {
          name: "Itinerary 2",
          description: "Description 2",
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          userId,
          sportPlaces: {
            connect: [{ id: sportPlaceId }],
          },
        },
      });

      const response = await request(app)
        .get("/api/itineraries?page=1&limit=1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("items");
      expect(response.body.items).toHaveLength(1);
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("totalPages");
    });
  });

  describe("PUT /api/itineraries/:id", () => {
    let itineraryId: string;

    beforeEach(async () => {
      const itinerary = await prisma.itinerary.create({
        data: {
          name: "Original Itinerary",
          description: "Original Description",
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          userId,
          sportPlaces: {
            connect: [{ id: sportPlaceId }],
          },
        },
      });
      itineraryId = itinerary.id;
    });

    it("should update own itinerary", async () => {
      const updateData = {
        name: "Updated Itinerary",
        description: "Updated Description",
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        sportPlaceIds: [sportPlaceId],
      };

      const response = await request(app)
        .put(`/api/itineraries/${itineraryId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
    });

    it("should not update another user's itinerary", async () => {
      // Create another user and itinerary
      const otherUser = await prisma.user.create({
        data: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          password: await hashPassword("password123"),
          roles: ["ROLE_USER"],
        },
      });

      const otherItinerary = await prisma.itinerary.create({
        data: {
          name: "Other Itinerary",
          description: "Other Description",
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          userId: otherUser.id,
          sportPlaces: {
            connect: [{ id: sportPlaceId }],
          },
        },
      });

      const updateData = {
        name: "Updated Itinerary",
        description: "Updated Description",
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        sportPlaceIds: [sportPlaceId],
      };

      await request(app)
        .put(`/api/itineraries/${otherItinerary.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(403);
    });
  });

  describe("DELETE /api/itineraries/:id", () => {
    let itineraryId: string;

    beforeEach(async () => {
      const itinerary = await prisma.itinerary.create({
        data: {
          name: "Test Itinerary",
          description: "Test Description",
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          userId,
          sportPlaces: {
            connect: [{ id: sportPlaceId }],
          },
        },
      });
      itineraryId = itinerary.id;
    });

    it("should delete own itinerary", async () => {
      await request(app)
        .delete(`/api/itineraries/${itineraryId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // Verify itinerary is deleted
      const itinerary = await prisma.itinerary.findUnique({
        where: { id: itineraryId },
      });
      expect(itinerary).toBeNull();
    });

    it("should not delete itinerary without authentication", async () => {
      await request(app).delete(`/api/itineraries/${itineraryId}`).expect(401);
    });

    it("should not delete another user's itinerary", async () => {
      // Create another user and itinerary
      const otherUser = await prisma.user.create({
        data: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          password: await hashPassword("password123"),
          roles: ["ROLE_USER"],
        },
      });

      const otherItinerary = await prisma.itinerary.create({
        data: {
          name: "Other Itinerary",
          description: "Other Description",
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          userId: otherUser.id,
          sportPlaces: {
            connect: [{ id: sportPlaceId }],
          },
        },
      });

      await request(app)
        .delete(`/api/itineraries/${otherItinerary.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });
  });
});
