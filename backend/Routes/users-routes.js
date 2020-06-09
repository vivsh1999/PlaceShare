const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const userController = require("../controllers/users-controller");

router.get("/", userController.getAllUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6, max: 12 }),
  ],
  userController.signupUser
);

router.post("/login", userController.loginUser);

module.exports = router;
