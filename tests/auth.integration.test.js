const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  test("Register and login flow (admin) works", async () => {
    const admin = {
      email: "admin@example.test.com",
      username: "admin",
      password: "password123",
      role: "admin",
    };

    const regRes = await request(app)
      .post("/auth/register")
      .send(admin)
      .expect(201);
    console.log(regRes);

    expect(regRes.body).toHaveProperty("token");
    expect(regRes.body.user.email).toBe(admin.email);

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: admin.email, password: admin.password })
      .expect(200);
    expect(loginRes.body).toHaveProperty("token");
    expect(loginRes.body.user).toHaveProperty("email", admin.email);
  });

  test("Duplicate register returns 409", async () => {
    const user = {
      email: "dup@example.test.com",
      username: "duper",
      password: "password123",
      role: "user",
    };

    await request(app).post("/auth/register").send(user).expect(201);
    await request(app).post("/auth/register").send(user).expect(409);
  });
});
