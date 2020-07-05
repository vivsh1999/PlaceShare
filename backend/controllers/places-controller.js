const fs = require('fs');
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Place = require("../models/place");
const User = require("../models/user");

const getPlaceByPlaceId = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching place.", 500)
    );
  }
  if (!place) {
    return next(new HttpError("No Place Found.", 404));
  }
  res.json(place.toObject({ getters: true }));
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let UserWithPlaces;
  try {
    UserWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(
      new HttpError("Something went wrong while fetching places." + error, 500)
    );
  }

  if (!UserWithPlaces || UserWithPlaces.places.length === 0) {
    return next(new HttpError("User has no places.", 404));
  }

  res.json({
    places: UserWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Incorrect input(s)", 422));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    creator,
    imageUrl: req.file.path,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Unable to create Place", 500));
  }

  if (!user) {
    return next(new HttpError("No such user exists.", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("create place failed, try again!", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Incorrect input(s)", 422));
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findByIdAndUpdate(
      placeId,
      { title: title, description: description },
      { new: true }
    );
  } catch (err) {
    const error = new HttpError("update place failed, try again!", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  let placeId = req.params.pid;
  let imgPath=null;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    let creator;
    await Place.findByIdAndDelete(placeId, { session: sess }, (err, docs) => {
      if (err) {
        throw err;
      }
      if (!docs) {
        return next(
          new HttpError("Could not found a place with that id.", 404)
        );
      }
      creator = docs.creator;
      imgPath=docs.imageUrl;
    });
    await User.findByIdAndUpdate(
      creator,
      { $pull: { places: placeId } },
      { session: sess }
    );
    sess.commitTransaction();
    fs.unlink(imgPath,(err)=>console.log(err));
  } catch (err) {
    const error = new HttpError("delete place failed, try again!" + err, 500);
    console.log(err);
    return next(error);
  }
  
  res.status(200).json({ message: "deleted successfully!" });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlaceById;
exports.deletePlace = deletePlaceById;
