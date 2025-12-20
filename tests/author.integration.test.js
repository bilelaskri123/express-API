const request = require("supertest");
const app = require("../app");

async function registerAndLogin(role = "admin") {
  const data = {
    email: `${role}_${Math.random().toString(36).slice(2, 8)}@test.com`,
    username: `${role}user${Math.random().toString(36).slice(2, 4)}`,
    password: "password123",
    role,
  };
  const reg = await request(app).post("/auth/register").send(data).expect(201);
  const token = reg.body.token;
  return { token, data };
}

describe("Authors API", () => {
  test("Admin can create, update and delete author", async () => {
    const { token } = await registerAndLogin("admin");

    // create
    const createRes = await request(app)
      .post("/authors")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "John", lastName: "Doe", nationality: "Neverland" })
      .expect(201);

    const authorId = createRes.body._id;

    // get all
    const all = await request(app).get("/authors").expect(200);
    expect(Array.isArray(all.body)).toBe(true);
    expect(all.body.length).toBeGreaterThanOrEqual(1);

    // get by id
    const one = await request(app).get(`/authors/${authorId}`).expect(200);
    expect(one.body.firstName).toBe("John");

    // update
    const updated = await request(app)
      .put(`/authors/${authorId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nationality: "Wonderland" })
      .expect(200);
    expect(updated.body.nationality).toBe("Wonderland");

    // delete
    await request(app)
      .delete(`/authors/${authorId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // ensure deleted
    await request(app).get(`/authors/${authorId}`).expect(404);
  });

  test("Non-admin cannot create author", async () => {
    const { token } = await registerAndLogin("user");
    await request(app)
      .post("/authors")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "No", lastName: "Admin", nationality: "NA" })
      .expect(403);
  });
});
