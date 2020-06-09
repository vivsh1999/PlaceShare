const express = require("express");
const { check } = require("express-validator");
const placeController = require("../controllers/places-controller");
const router = express.Router();

router.get("/:pid", placeController.getPlaceByPlaceId);

router.get("/user/:uid", placeController.getPlaceByUserId);

router.post(
  "/",
  [
    check(["title", "address"]).not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  placeController.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeController.updatePlace
);

router.delete("/:pid", placeController.deletePlace);

module.exports = router;
