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
  res.status(200).json({ users: users });
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

  const createdUser = new User({
    name,
    email,
    password,
    places: [],
    image:
      "https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg",
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Sign up failed.Try again." + error, 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Login failed", 500));
  }

  if (!user || user.password !== password) {
    return next(new HttpError("Wrong Email or Password", 401));
  }

  res.status(200).json({ user:user.toObject({getters:true}) });
};

exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
