const {
  Book,
  bookCreatingSchema,
  bookUpdateSchema,
} = require("../models/Book");

exports.createBook = async (req, res) => {
  const { error, value } = bookCreatingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const newBook = new Book(value);
  const savedBook = await newBook.save();
  res.status(201).json(savedBook);
};

exports.getBooks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const books = await Book.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author");
  res.status(200).json(books);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author", [
    "firstName",
    "lastName",
    "_id",
  ]);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.status(200).json(book);
};

exports.updateBook = async (req, res) => {
  const { error, value } = bookUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, value, {
    new: true,
  });
  if (!updatedBook) return res.status(404).json({ error: "Book not found" });
  res.status(200).json(updatedBook);
};

exports.deleteBook = async (req, res) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);
  if (!deletedBook) return res.status(404).json({ error: "Book not found" });
  res.status(200).json({ message: "Book deleted successfully" });
};
