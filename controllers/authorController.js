const {
  Author,
  authorCreatingSchema,
  authorUpdateSchema,
} = require("../models/Author");

exports.createAuthor = async (req, res) => {
  const { error, value } = authorCreatingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const newAuthor = new Author(value);
  const savedAuthor = await newAuthor.save();
  res.status(201).json(savedAuthor);
};

exports.getAuthors = async (req, res) => {
  const authors = await Author.find();
  res.status(200).json(authors);
};

exports.getAuthorById = async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ error: "Author not found" });
  res.status(200).json(author);
};

exports.updateAuthor = async (req, res) => {
  const { error, value } = authorUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, value, {
    new: true,
  });
  if (!updatedAuthor)
    return res.status(404).json({ error: "Author not found" });
  res.status(200).json(updatedAuthor);
};

exports.deleteAuthor = async (req, res) => {
  const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
  if (!deletedAuthor)
    return res.status(404).json({ error: "Author not found" });
  res.status(200).json({ message: "Author deleted successfully" });
};
