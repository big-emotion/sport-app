import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";
import { hashPassword } from "../src/utils/password";

describe("Usage Statistics API", () => {
  let authToken: string;
  let userId: string;
  let adminToken: string;
  let sportPlaceId: string;

  beforeEach(async () => {
    // Create regular user
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

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        email: "admin@test.com",
        password: hashedPassword,
        roles: ["ROLE_USER", "ROLE_ADMIN"],
      },
    });

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

    // Get tokens
    const userLogin = await request(app).post("/api/auth/login").send({
      email: "john@test.com",
      password: "password123",
    });
    authToken = userLogin.body.token;

    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "password123",
    });
    adminToken = adminLogin.body.token;
  });

  describe("POST /api/usage-statistics", () => {
    it("should log user action", async () => {
      const actionData = {
        action: "VIEW_SPORT_PLACE",
        entityId: sportPlaceId,
        entityType: "SPORT_PLACE",
      };

      const response = await request(app)
        .post("/api/usage-statistics")
        .set("Authorization", `Bearer ${authToken}`)
        .send(actionData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.action).toBe(actionData.action);
      expect(response.body.entityId).toBe(actionData.entityId);
      expect(response.body.entityType).toBe(actionData.entityType);
      expect(response.body.userId).toBe(userId);
    });

    it("should log action without authentication", async () => {
      const actionData = {
        action: "VIEW_SPORT_PLACE",
        entityId: sportPlaceId,
        entityType: "SPORT_PLACE",
      };

      const response = await request(app)
        .post("/api/usage-statistics")
        .send(actionData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.action).toBe(actionData.action);
      expect(response.body.entityId).toBe(actionData.entityId);
      expect(response.body.entityType).toBe(actionData.entityType);
      expect(response.body.userId).toBeNull();
    });

    it("should not log action with invalid data", async () => {
      const actionData = {
        action: "INVALID_ACTION",
        entityId: sportPlaceId,
        entityType: "INVALID_TYPE",
      };

      await request(app)
        .post("/api/usage-statistics")
        .set("Authorization", `Bearer ${authToken}`)
        .send(actionData)
        .expect(400);
    });
  });

  describe("GET /api/usage-statistics/summary", () => {
    beforeEach(async () => {
      // Create test actions
      await prisma.userAction.createMany({
        data: [
          {
            action: "VIEW_SPORT_PLACE",
            entityId: sportPlaceId,
            entityType: "SPORT_PLACE",
            userId,
          },
          {
            action: "FAVORITE_SPORT_PLACE",
            entityId: sportPlaceId,
            entityType: "SPORT_PLACE",
            userId,
          },
          {
            action: "VIEW_SPORT_PLACE",
            entityId: sportPlaceId,
            entityType: "SPORT_PLACE",
            // No userId for anonymous action
          },
        ],
      });
    });

    it("should get statistics summary as admin", async () => {
      const response = await request(app)
        .get("/api/usage-statistics/summary")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("totalActions");
      expect(response.body.totalActions).toBe(3);
      expect(response.body).toHaveProperty("actionsByType");
      expect(response.body.actionsByType.VIEW_SPORT_PLACE).toBe(2);
      expect(response.body.actionsByType.FAVORITE_SPORT_PLACE).toBe(1);
      expect(response.body).toHaveProperty("anonymousActions");
      expect(response.body.anonymousActions).toBe(1);
      expect(response.body).toHaveProperty("authenticatedActions");
      expect(response.body.authenticatedActions).toBe(2);
    });

    it("should not get statistics without admin role", async () => {
      await request(app)
        .get("/api/usage-statistics/summary")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });

    it("should not get statistics without authentication", async () => {
      await request(app).get("/api/usage-statistics/summary").expect(401);
    });

    it("should filter statistics by date range", async () => {
      const response = await request(app)
        .get("/api/usage-statistics/summary")
        .query({
          startDate: new Date(Date.now() - 86400000).toISOString(), // Last 24 hours
          endDate: new Date().toISOString(),
        })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("totalActions");
      expect(response.body).toHaveProperty("actionsByType");
      expect(response.body).toHaveProperty("timeRange");
    });

    it("should filter statistics by entity type", async () => {
      const response = await request(app)
        .get("/api/usage-statistics/summary")
        .query({ entityType: "SPORT_PLACE" })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.totalActions).toBe(3);
      expect(Object.keys(response.body.actionsByType)).toContain(
        "VIEW_SPORT_PLACE"
      );
      expect(Object.keys(response.body.actionsByType)).toContain(
        "FAVORITE_SPORT_PLACE"
      );
    });
  });
});
