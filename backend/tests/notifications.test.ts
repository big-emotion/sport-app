import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";
import { hashPassword } from "../src/utils/password";

describe("Notifications API", () => {
  let authToken: string;
  let userId: string;
  let adminToken: string;

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

  describe("POST /api/notifications", () => {
    it("should create notification as admin", async () => {
      const notificationData = {
        title: "Test Notification",
        message: "This is a test notification message",
        userId,
      };

      const response = await request(app)
        .post("/api/notifications")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(notificationData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(notificationData.title);
      expect(response.body.message).toBe(notificationData.message);
      expect(response.body.userId).toBe(userId);
      expect(response.body.read).toBe(false);
    });

    it("should not create notification without admin role", async () => {
      const notificationData = {
        title: "Test Notification",
        message: "This is a test notification message",
        userId,
      };

      await request(app)
        .post("/api/notifications")
        .set("Authorization", `Bearer ${authToken}`)
        .send(notificationData)
        .expect(403);
    });

    it("should not create notification with invalid data", async () => {
      const notificationData = {
        title: "Te", // Too short
        message: "Short", // Too short
        userId,
      };

      const response = await request(app)
        .post("/api/notifications")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(notificationData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/notifications", () => {
    beforeEach(async () => {
      // Create test notifications
      await prisma.notification.createMany({
        data: [
          {
            title: "Notification 1",
            message: "Message 1",
            userId,
            read: false,
          },
          {
            title: "Notification 2",
            message: "Message 2",
            userId,
            read: true,
          },
        ],
      });
    });

    it("should list user notifications", async () => {
      const response = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it("should filter unread notifications", async () => {
      const response = await request(app)
        .get("/api/notifications?read=false")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].read).toBe(false);
    });

    it("should not list notifications without authentication", async () => {
      await request(app).get("/api/notifications").expect(401);
    });
  });

  describe("PATCH /api/notifications/:id", () => {
    let notificationId: string;

    beforeEach(async () => {
      const notification = await prisma.notification.create({
        data: {
          title: "Test Notification",
          message: "Test Message",
          userId,
          read: false,
        },
      });
      notificationId = notification.id;
    });

    it("should mark notification as read", async () => {
      const response = await request(app)
        .patch(`/api/notifications/${notificationId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ read: true })
        .expect(200);

      expect(response.body.read).toBe(true);
    });

    it("should not update another user's notification", async () => {
      // Create another user and notification
      const otherUser = await prisma.user.create({
        data: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          password: await hashPassword("password123"),
          roles: ["ROLE_USER"],
        },
      });

      const otherNotification = await prisma.notification.create({
        data: {
          title: "Other Notification",
          message: "Other Message",
          userId: otherUser.id,
          read: false,
        },
      });

      await request(app)
        .patch(`/api/notifications/${otherNotification.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ read: true })
        .expect(403);
    });

    it("should not update notification without authentication", async () => {
      await request(app)
        .patch(`/api/notifications/${notificationId}`)
        .send({ read: true })
        .expect(401);
    });
  });

  describe("DELETE /api/notifications/:id", () => {
    let notificationId: string;

    beforeEach(async () => {
      const notification = await prisma.notification.create({
        data: {
          title: "Test Notification",
          message: "Test Message",
          userId,
          read: false,
        },
      });
      notificationId = notification.id;
    });

    it("should delete notification as admin", async () => {
      await request(app)
        .delete(`/api/notifications/${notificationId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);

      // Verify notification is deleted
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });
      expect(notification).toBeNull();
    });

    it("should not delete notification without admin role", async () => {
      await request(app)
        .delete(`/api/notifications/${notificationId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });

    it("should not delete notification without authentication", async () => {
      await request(app)
        .delete(`/api/notifications/${notificationId}`)
        .expect(401);
    });
  });
});
