const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Express Project API",
    version: "1.0.0",
    description:
      "API documentation for the Express Project (Books, Authors, Users, Auth)",
  },
  servers: [{ url: "http://localhost:3000", description: "Local server" }],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Authors", description: "Author management" },
    { name: "Books", description: "Book management" },
    { name: "Users", description: "User management" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          email: { type: "string" },
          username: { type: "string" },
          role: { type: "string", enum: ["user", "admin"] },
        },
      },
      Author: {
        type: "object",
        properties: {
          _id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          nationality: { type: "string" },
        },
      },
      Book: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          author: { $ref: "#/components/schemas/Author" },
          price: { type: "number" },
          coverImage: { type: "string", enum: ["soft cover", "hard cover"] },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  username: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string" },
                },
                required: ["email", "username", "password", "role"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: { "application/json": { schema: { type: "object" } } },
          },
          409: { description: "Conflict: Email already in use" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/authors": {
      get: {
        tags: ["Authors"],
        summary: "List authors",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Author" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Authors"],
        summary: "Create author (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  nationality: { type: "string" },
                },
                required: ["firstName", "lastName", "nationality"],
              },
            },
          },
        },
        responses: {
          201: { description: "Created" },
          400: { description: "Bad Request" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/authors/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["Authors"],
        summary: "Get author",
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Authors"],
        security: [{ bearerAuth: [] }],
        summary: "Update author (admin)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string", default: "" },
                  lastName: { type: "string", default: "" },
                  nationality: { type: "string", default: "" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Authors"],
        security: [{ bearerAuth: [] }],
        summary: "Delete author (admin)",
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/books": {
      get: {
        tags: ["Books"],
        summary: "List books",
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        summary: "Create book (admin)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Book" },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/books/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["Books"],
        summary: "Get book",
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        summary: "Update book (admin)",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Book" },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        summary: "Delete book (admin)",
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users (admin)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/users/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["Users"],
        summary: "Get user (admin or owner)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "OK" },
          403: { description: "Forbidden" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user (admin or owner)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        summary: "Delete user (admin or owner)",
        responses: { 200: { description: "Deleted" } },
      },
    },
  },
};

module.exports = swaggerSpec;
