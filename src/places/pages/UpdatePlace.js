import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

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

const UpdatePlace = (props) => {
  const placeId = useParams().placeId;

  const [isLoading,setIsLoading]=useState(true);

  const [formState, inputHandler,setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(()=>{
    setFormData({
      title: {
        value: identifiedPlace.title,
        isValid: true,
      },
      description: {
        value: identifiedPlace.description,
        isValid: true,
      },
    },true);
    setIsLoading(false);
  } ,[setFormData,identifiedPlace]);

  const formSubmitHandler=(event)=>{
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find the place.</h2>
      </div>
    );
  }

  if(isLoading){
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initValue={formState.inputs.title.value}
        initValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="input"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description(at least 5 character)."
        onInput={inputHandler}
        initValue={formState.inputs.description.value}
        initValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
