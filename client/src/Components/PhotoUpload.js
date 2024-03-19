import React, {useState} from "react";
import Navbar from "./navbar";

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
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              marginTop: "20px",
            }}
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
              style={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#87CEEB",
                color: "#fff",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                zIndex: 9999,
              }}
            >
              Your photo is added!
            </div>
          )}
        </div>
      </>
    );
  };
  
  export default PhotoUpload;