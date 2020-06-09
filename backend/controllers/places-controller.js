const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const DUMMY_PLACES = [
  {
    id: "p1",
    imageUrl:
      "https://images.adsttc.com/media/images/5aec/7d64/f197/cc33/4300/037e/slideshow/704-x-489.jpg",
    title: "Eiffel Tower",
    description:
      "Gustave Eiffel's iconic, wrought-iron 1889 tower, with steps and elevators to observation decks.",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    creator: "u1",
    location: {
      lat: 31.6103144,
      lng: 3.4560389,
    },
  },
  {
    id: "p2",
    imageUrl:
      "https://images.adsttc.com/media/images/5aec/7d64/f197/cc33/4300/037e/slideshow/704-x-489.jpg",
    title: "Eiffel Tower",
    description:
      "Gustave Eiffel's iconic, wrought-iron 1889 tower, with steps and elevators to observation decks.",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    creator: "u1",
    location: {
      lat: 31.6103144,
      lng: 3.4560389,
    },
  },
];

const getPlaceByPlaceId = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError("No Place Found.", 404);
  }
  res.json(place);
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(new HttpError("User has no places.", 404));
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Incorrect input(s)",422));
  }
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Incorrect input(s)",422));
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;

  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  const updatedPlace = { ...DUMMY_PLACES[placeIndex] };
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  if(!DUMMY_PLACES.find(p=>p.id===placeId)){
    return next(new HttpError("Could not found a place with that id.",404));
  }
  DUMMY_PLACES.splice(
    DUMMY_PLACES.findIndex((p) => p.id === placeId),
    1
  );
  res.status(200).json({ message: "deleted successfully!" });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlaceById;
exports.deletePlace = deletePlaceById;
