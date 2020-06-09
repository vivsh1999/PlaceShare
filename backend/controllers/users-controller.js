const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const DUMMY_USERS = [
  {
    name: "u1",
    email: "u1@mail.com",
    password: "pass",
  },
  {
    name: "u2",
    email: "u2@mail.com",
    password: "pass",
  },
];

const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signupUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Incorrect input(s).", 422));
  }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => (u.email = email));

  if (hasUser) {
    return next(
      new HttpError("Already have account registered with that email.", 409)
    );
  }

  const createdUser = {
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return next(new HttpError("Wrong Email or Password", 401));
  }

  res.status(200).json({ user });
};

exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
