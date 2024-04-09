import React, {useState} from "react";
import Navbar from "./navbar";

import "../styles/photoupload.css"

const PhotoUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
  
    const fileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Hide the message after 5 seconds
    };
  
    const dragOver = (event) => {
      event.preventDefault();
    };
  
    const drop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Hide the message after 5 seconds
    };
  
    return (
      <>
        <Navbar></Navbar>
        <div>
          <input type="file" onChange={fileChange} />
          <div
            onDragOver={dragOver}
            onDrop={drop}
          >
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <p>Select your photo here.</p>
            )}
          </div>
          {showMessage && (
            <div
            >
              Your photo is added!
            </div>
          )}
        </div>
      </>
    );
  };
  
  export default PhotoUpload;