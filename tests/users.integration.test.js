const request = require("supertest");
const app = require("../app");

async function registerAndLogin(role = "user") {
  const data = {
    email: `${role}_${Math.random().toString(36).slice(2, 8)}@test.com`,
    username: `${role}user${Math.random().toString(36).slice(2, 4)}`,
    password: "password123",
    role,
  };
  const reg = await request(app).post("/auth/register").send(data).expect(201);
  const token = reg.body.token;
  const id = reg.body.user._id;
  return { token, data, id };
}

describe("Users API", () => {
  test("Admin can get all users", async () => {
    const admin = await registerAndLogin("admin");
    await registerAndLogin("user");

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test("User can get own profile and cannot get others", async () => {
    const user1 = await registerAndLogin("user");
    const user2 = await registerAndLogin("user");

    // own profile
    await request(app)
      .get(`/users/${user1.id}`)
      .set("Authorization", `Bearer ${user1.token}`)
      .expect(200);
    // try to get other profile
    await request(app)
      .get(`/users/${user2.id}`)
      .set("Authorization", `Bearer ${user1.token}`)
      .expect(403);
  });

  test("User can update own profile; admin can update any profile", async () => {
    const user = await registerAndLogin("user");
    const admin = await registerAndLogin("admin");

    // user updates own username
    const newName = { username: "newname" };
    const updated = await request(app)
      .put(`/users/${user.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send(newName)
      .expect(200);
    expect(updated.body.username).toBe(newName.username);

    // admin updates user's role
    const roleUpdate = { role: "admin" };
    const adminUpdated = await request(app)
      .put(`/users/${user.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send(roleUpdate)
      .expect(200);
    expect(adminUpdated.body.role).toBe(roleUpdate.role);
  });

  test("User can delete own account; admin can delete others", async () => {
    const user = await registerAndLogin("user");
    const admin = await registerAndLogin("admin");

    // user deletes own
    await request(app)
      .delete(`/users/${user.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .expect(200);
    await request(app)
      .get(`/users/${user.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(404);

    // admin deletes other
    const victim = await registerAndLogin("user");
    await request(app)
      .delete(`/users/${victim.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(200);
  });
});
