import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

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
    id: "p1",
    imageUrl:
      "https://images.adsttc.com/media/images/5aec/7d64/f197/cc33/4300/037e/slideshow/704-x-489.jpg",
    title: "Eiffel Tower",
    description:
      "Gustave Eiffel's iconic, wrought-iron 1889 tower, with steps and elevators to observation decks.",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    creator: "u2",
    location: {
      lat: 31.6103144,
      lng: 3.4560389,
    },
  },
];

const UserPlaces = (props) => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
