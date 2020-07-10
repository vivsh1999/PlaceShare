import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import useHttpClient from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = (props) => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    const getPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_WEB_URL}/places/user/${userId}` 
        );
        setPlaces(responseData.places);
      } catch (err) {
        console.log(err);
      }
    };
    getPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (placeId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== placeId)
    );
  };

  return (
    <React.Fragment>
      {error !== "User has no places." && (
        <ErrorModal error={error} onClear={clearError} />
      )}
      {isLoading && <LoadingSpinner asOverlay />}
      <PlaceList items={places} onPlaceDelete={placeDeleteHandler} />
    </React.Fragment>
  );
};

export default UserPlaces;
