import React from "react";

import Input from "../../shared/components/FormElements/Input";
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from "../../shared/util/validators";
import "./NewPlace.css";
const NewPlace = () => {
  const titleChangeHandler=(id,value,isValid)=>{

  };
  const descChangeHandler=(id,value,isValid)=>{

  };

  return (
    <form className="place-form">
      <Input
        id="title"
        element="input"
        type="text"
        label="*Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="This Field is required"
        onInput={titleChangeHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="*Description"
        validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(5)]}
        errorText="Enter at least 5 character"
        onInput={descChangeHandler}
      />
    </form>
  );
};

export default NewPlace;
