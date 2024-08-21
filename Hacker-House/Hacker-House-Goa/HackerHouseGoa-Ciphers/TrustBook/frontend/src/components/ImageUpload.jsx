import React, { useEffect, useRef, useState } from "react";
import "./ImageUpload.css";
import Button from "./Button";
const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewURL] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    //Using fileReader to read file and show preview
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => setPreviewURL(fileReader.result);
  }, [file]);

  const filePickerRef = useRef();

  const pickHandler = (e) => {
    //Checking whether the input contains any files or not by e.target.files (native javascript)
    let pickedFile;
    let fileIsValid = isValid;
    if (e.target.files || e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    return filePickerRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          <img src={previewUrl} alt="Preview" />
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE{" "}
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
