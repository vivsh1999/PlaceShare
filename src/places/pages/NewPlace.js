import React, { useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";

import "./PlaceForm.css";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/AuthContext";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const NewPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId=useContext(AuthContext).userId;

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (err) {
      console.log(err);
    }
    console.log(formState.inputs);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
    <form className="place-form" onSubmit={formSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay/>}
      <Input
        id="title"
        element="input"
        type="text"
        label="*Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="This Field is required."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="*Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Enter at least 5 character"
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        type="text"
        label="*Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="This Field is required."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </React.Fragment>
  );
};

export default NewPlace;
