import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  searchHistory: {
    type: Array,
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isMatchPsw = async function (entredPsw) {
  try {
    return await bcrypt.compare(entredPsw, this.password);
  } catch (error) {
    throw new Error("error comparing passwords");
  }
};

userSchema.methods.toJSON = function(){
  const user = this.toObject();
  delete user.password;
  return user;
}

export const User = mongoose.model("User", userSchema);

export const validateSingup = (user) => {
  const schema = Joi.object({
    username: Joi.string().required().trim().min(4).max(15),
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().trim().min(8).max(20),
  });
  return schema.validate(user);
};

export const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().trim().min(8).max(20),
  });
  return schema.validate(user);
};
