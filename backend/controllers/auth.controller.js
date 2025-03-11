import asyncHandler from "express-async-handler";
import { User, validateLogin, validateSingup } from "../model/User.js";
import { genToken } from "../utils/genToken.js";

export const signup = asyncHandler(async (req, res) => {
  const { error } = validateSingup(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, email, password } = req.body;

  const foundEmail = await User.findOne({ email });
  if (foundEmail) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const foundUsername = await User.findOne({ username });
  if (foundUsername) {
    return res.status(400).json({
      success: false,
      message: "Username already exists",
    });
  }

  const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

  const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

  const newUser = new User({
    username,
    email,
    password,
    image,
  });

  genToken(newUser._id, res);
  await newUser.save();

  res.status(201).json({
    success: true,
    message: "user created successfully, login to continue",
    newUser: newUser.toJSON(),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.isMatchPsw(password))) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  genToken(user._id, res);

  res.status(200).json({
    success: true,
    user: user.toJSON(),
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("");
  res.status(200).json({ success: true, message: "logged out successfully" });
});

export const authCheck = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
