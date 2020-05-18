import React from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import {useForm} from '../../shared/hooks/form-hook';

import "./NewPlace.css";



const NewPlace = () => {
  const [formState,inputHandler]=useForm({
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
  false)

  

  const formSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  return (
    <form className="place-form" onSubmit={formSubmitHandler}>
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
  );
};

export default NewPlace;
