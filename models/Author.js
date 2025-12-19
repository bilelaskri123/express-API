const mongoose = require("mongoose");
const Joi = require("joi");

const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 200,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 200,
    },
    nationality: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    image: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  }
);

// Validation schema for creating Author
const authorCreatingSchema = Joi.object({
  firstName: Joi.string().min(3).max(200).required(),
  lastName: Joi.string().min(3).max(200).required(),
  nationality: Joi.string().min(3).max(100).required(),
  image: Joi.string().allow("").optional(),
});

// Validation schema for updating Author
const authorUpdateSchema = Joi.object({
  firstName: Joi.string().min(3).max(200).optional(),
  lastName: Joi.string().min(3).max(200).optional(),
  nationality: Joi.string().min(3).max(100).optional(),
  image: Joi.string().allow("").optional(),
});

const Author = mongoose.model("Author", authorSchema);

module.exports = { Author, authorCreatingSchema, authorUpdateSchema };
