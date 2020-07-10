const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const userController = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");

router.get("/", userController.getAllUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6, max: 15 }),
  ],
  userController.signupUser
);

router.post("/login",[check('email').normalizeEmail()], userController.loginUser);

module.exports = router;
