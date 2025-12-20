const authorController = require("../controllers/authorController");
const { Author } = require("../models/Author");

describe("authorController.createAuthor", () => {
  test("creates an author and returns 201", async () => {
    const req = {
      body: { firstName: "Aaaaaa", lastName: "Bbbbbb", nationality: "Xxxxxx" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authorController.createAuthor(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();

    const created = await Author.findOne({ firstName: "Aaaaaa" });
    expect(created).not.toBeNull();
  });

  test("validation error returns 400", async () => {
    const req = { body: { lastName: "OnlyLastName" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authorController.createAuthor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
