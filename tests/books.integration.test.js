const request = require("supertest");
const app = require("../app");
const { Author } = require("../models/Author");
const { Book } = require("../models/Book");

describe("Books API", () => {
  let author;
  beforeEach(async () => {
    author = await new Author({
      firstName: "Test",
      lastName: "Author",
      nationality: "Nowhere",
    }).save();
    await Book.insertMany([
      {
        title: "Aaaaa",
        description: "First book description",
        author: author._id,
        price: 9.99,
        coverImage: "soft cover",
      },
      {
        title: "Bbbbbb",
        description: "Second book description",
        author: author._id,
        price: 12,
        coverImage: "hard cover",
      },
    ]);
  });

  test("GET /books returns list", async () => {
    const res = await request(app).get("/books").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test("GET /books/:id returns one book", async () => {
    const book = await Book.findOne();
    const res = await request(app).get(`/books/${book._id}`).expect(200);
    expect(res.body.title).toBe(book.title);
    expect(res.body.author).toHaveProperty("_id");
  });
});
