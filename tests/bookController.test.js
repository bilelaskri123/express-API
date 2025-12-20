const bookController = require("../controllers/bookController");
const { Book } = require("../models/Book");
const { Author } = require("../models/Author");

describe("bookController.createBook", () => {
  test("creates a book and returns 201", async () => {
    const author = await new Author({
      firstName: "Xxxxx",
      lastName: "Yyyyyy",
      nationality: "Nnnnnn",
    }).save();
    const req = {
      body: {
        title: "New Book",
        description: "A good book description",
        author: author._id.toString(),
        price: 10,
        coverImage: "soft cover",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await bookController.createBook(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const created = await Book.findOne({ title: "New Book" });
    expect(created).not.toBeNull();
  });
});
