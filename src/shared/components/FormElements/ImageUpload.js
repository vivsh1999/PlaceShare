import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const filePickerRef = useRef();

  const [file,setFile]=useState();
  const [preview,setPreview]=useState();

  useEffect(()=>{
    if(!file){
      return
    }
    const fileReader=new FileReader();
    fileReader.onload=()=>{
      setPreview(fileReader.result);
    };
    fileReader.readAsDataURL(file);

  },[file])
  const pickedHandler = event => {
    let pickedFile;
    if(event.target.files && event.target.files.length===1){
      pickedFile=event.target.files[0];
      console.log(pickedFile);
      setFile(pickedFile);
    }else{}
    props.onInput(props.id,pickedFile,true);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          <img src={preview} alt="Preview" />
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
    </div>
  );
};

export default ImageUpload;
