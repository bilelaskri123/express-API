const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 5,
      maxlength: 200,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

// hash password before saving
userSchema.pre("save", async function (next) {
  try {
    // check if password is modified
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Validation schema for creating a User
const userCreatingSchema = Joi.object({
  email: Joi.string().email().min(5).max(200).required(),
  username: Joi.string().min(3).max(100).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").required(),
});

// Validation schema for updating a User
const userUpdateSchema = Joi.object({
  email: Joi.string().email().min(5).max(200).optional(),
  username: Joi.string().min(3).max(100).optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("user", "admin").optional(),
});

// Validate schema for login User
const userLoginSchema = Joi.object({
  email: Joi.string().email().min(5).max(200).required(),
  password: Joi.string().min(6).required(),
});

const User = mongoose.model("User", userSchema);

// Export the User model and validation schemas

module.exports = {
  User,
  userCreatingSchema,
  userUpdateSchema,
  userLoginSchema,
};
