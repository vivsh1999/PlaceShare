const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Could not get users.Try again.", 500));
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Incorrect input(s).", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Something went wrong.Try Again.", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("Already have account registered with that email.", 409)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Something went wrong.Try Again.", 500));
  }
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    places: [],
    image: req.file.path,
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Sign up failed.Try again." + error, 500));
  }
  //making jwt token
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Sign up failed.Try again." + err, 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  let isValidPass = false;
  try {
    user = await User.findOne({ email: email });
    isValidPass = await bcrypt.compare(password, user.password);
  } catch (error) {
    return next(new HttpError("Login failed", 500));
  }

  if (!user || !isValidPass) {
    return next(new HttpError("Wrong Email or Password", 403));
  }

  let token;
  try {
    token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    return next(new HttpError("Logging in failed.Try again." + err, 500));
  }

  res.status(200).json({ userId: user.id, email: user.email, token });
};

exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
