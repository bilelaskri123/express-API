const mongoose = require("mongoose");
const Joi = require("joi");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 200,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minLength: 10,
      maxLength: 250,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    coverImage: {
      type: String,
      trim: true,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

// validateion schemas can be added here as needed
const bookCreatingSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(250).required(),
  author: Joi.string().required(),
  price: Joi.number().min(0).required(),
  coverImage: Joi.string().valid("soft cover", "hard cover").required(),
});

// validation schema for updating Book can be added similarly
const bookUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(250).optional(),
  author: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  coverImage: Joi.string().valid("soft cover", "hard cover").optional(),
});

// Export the Book model and validation schemas
module.exports = { Book, bookCreatingSchema, bookUpdateSchema };
