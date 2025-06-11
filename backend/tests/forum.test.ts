import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";
import { hashPassword } from "../src/utils/password";

describe("Forum API", () => {
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

  describe("POST /api/forum-posts", () => {
    it("should create a forum post", async () => {
      const postData = {
        title: "Test Post",
        content: "This is a test post content",
        sportPlaceId,
      };

      const response = await request(app)
        .post("/api/forum-posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(postData.title);
      expect(response.body.content).toBe(postData.content);
      expect(response.body.userId).toBe(userId);
    });

    it("should not create post without authentication", async () => {
      const postData = {
        title: "Test Post",
        content: "This is a test post content",
      };

      await request(app).post("/api/forum-posts").send(postData).expect(401);
    });

    it("should not create post with invalid data", async () => {
      const postData = {
        title: "Te", // Too short
        content: "Short", // Too short
      };

      const response = await request(app)
        .post("/api/forum-posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send(postData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/forum-posts", () => {
    beforeEach(async () => {
      // Create test posts
      await prisma.forumPost.createMany({
        data: [
          {
            title: "Post 1",
            content: "Content 1",
            userId,
            sportPlaceId,
          },
          {
            title: "Post 2",
            content: "Content 2",
            userId,
            sportPlaceId,
          },
        ],
      });
    });

    it("should list forum posts", async () => {
      const response = await request(app).get("/api/forum-posts").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it("should filter posts by sport place", async () => {
      const response = await request(app)
        .get(`/api/forum-posts?sportPlaceId=${sportPlaceId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(
        response.body.every((post: any) => post.sportPlaceId === sportPlaceId)
      ).toBe(true);
    });
  });

  describe("PUT /api/forum-posts/:id", () => {
    let postId: string;

    beforeEach(async () => {
      const post = await prisma.forumPost.create({
        data: {
          title: "Original Title",
          content: "Original Content",
          userId,
          sportPlaceId,
        },
      });
      postId = post.id;
    });

    it("should update own post", async () => {
      const updateData = {
        title: "Updated Title",
        content: "Updated Content",
      };

      const response = await request(app)
        .put(`/api/forum-posts/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
    });

    it("should not update post without authentication", async () => {
      const updateData = {
        title: "Updated Title",
        content: "Updated Content",
      };

      await request(app)
        .put(`/api/forum-posts/${postId}`)
        .send(updateData)
        .expect(401);
    });

    it("should not update another user's post", async () => {
      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          password: await hashPassword("password123"),
          roles: ["ROLE_USER"],
        },
      });

      // Create post for other user
      const otherPost = await prisma.forumPost.create({
        data: {
          title: "Other Post",
          content: "Other Content",
          userId: otherUser.id,
          sportPlaceId,
        },
      });

      const updateData = {
        title: "Updated Title",
        content: "Updated Content",
      };

      await request(app)
        .put(`/api/forum-posts/${otherPost.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(403);
    });
  });

  describe("DELETE /api/forum-posts/:id", () => {
    let postId: string;

    beforeEach(async () => {
      const post = await prisma.forumPost.create({
        data: {
          title: "Test Post",
          content: "Test Content",
          userId,
          sportPlaceId,
        },
      });
      postId = post.id;
    });

    it("should delete own post", async () => {
      await request(app)
        .delete(`/api/forum-posts/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // Verify post is deleted
      const post = await prisma.forumPost.findUnique({
        where: { id: postId },
      });
      expect(post).toBeNull();
    });

    it("should not delete post without authentication", async () => {
      await request(app).delete(`/api/forum-posts/${postId}`).expect(401);
    });

    it("should not delete another user's post", async () => {
      // Create another user and post
      const otherUser = await prisma.user.create({
        data: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          password: await hashPassword("password123"),
          roles: ["ROLE_USER"],
        },
      });

      const otherPost = await prisma.forumPost.create({
        data: {
          title: "Other Post",
          content: "Other Content",
          userId: otherUser.id,
          sportPlaceId,
        },
      });

      await request(app)
        .delete(`/api/forum-posts/${otherPost.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });
  });
});
