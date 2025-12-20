const userController = require("../controllers/userController");
const { User } = require("../models/User");

describe("userController.updateUser", () => {
  test("updates and returns updated user", async () => {
    const created = await new User({
      email: "user1@test",
      username: "user1",
      password: "password",
      role: "user",
    }).save();

    const req = {
      params: { id: created._id.toString() },
      body: { username: "updated" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userController.updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    const updated = await User.findById(created._id);
    expect(updated.username).toBe("updated");
  });

  test("returns 404 when user not found", async () => {
    const req = {
      params: { id: "ffffffffffffffffffffffff" },
      body: { username: "noone" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userController.updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("userController.deleteUser", () => {
  test("deletes a user and returns 200", async () => {
    const created = await new User({
      email: "user2@test",
      username: "user2",
      password: "password",
      role: "user",
    }).save();

    const req = { params: { id: created._id.toString() } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userController.deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const found = await User.findById(created._id);
    expect(found).toBeNull();
  });
});
