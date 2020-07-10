import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import useHttpClient from "../../shared/hooks/http-hook";

import "./PlaceForm.css";
import { AuthContext } from "../../shared/context/AuthContext";

const UpdatePlace = (props) => {
  const placeId = useParams().placeId;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [place, setPlace] = useState();
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const getCurrentData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_WEB_URL}/places/${placeId}`
        );
        setPlace(responseData);
        if (responseData) {
          setFormData(
            {
              title: {
                value: responseData.title,
                isValid: true,
              },
              description: {
                value: responseData.description,
                isValid: true,
              },
            },
            true
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCurrentData();
  }, [setFormData, placeId, sendRequest]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    console.log();
    try {
      await sendRequest(
        `${process.env.REACT_APP_WEB_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/${auth.userId}/places`);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!place && error) {
    return (
      <div className="center">
        <Card>Could not find the place.</Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && place && (
        <form className="place-form" onSubmit={formSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initValue={place.title}
            initValid={true}
          />
          <Input
            id="description"
            element="input"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description(at least 5 character)."
            onInput={inputHandler}
            initValue={place.description}
            initValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
