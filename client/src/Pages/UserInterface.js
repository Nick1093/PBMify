import React, { useState } from "react";

import Navbar from "../Components/navbar";

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
import React, { useState } from 'react';

import "../styles/UserInterface.css"

function UserInterface() {
  const [popupMessage, setPopupMessage] = useState('');
  const [imageData, setImageData] = useState('');

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function (e) {
          setPopupMessage('Your photo is added');
          setImageData(e.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        alert('Please drop an image file.');
      }
    }
  }

  function displaySelectedPhoto(event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setPopupMessage('Your photo is added');
        setImageData(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  function removePhoto() {
    setImageData('');
    setPopupMessage('Your photo is removed');
  }

  return (
    <div className="container">
      <div
        id="dropZone"
        onDragOver={allowDrop}
        onDrop={drop}

        style={{
          width: '600px',
          height: '400px',
          border: '2px dashed #aaa',
          textAlign: 'center',
          lineHeight: '380px',
          margin: '20px auto',
        }}
      >
        
        {imageData ? (
          <img
            src={imageData}
            alt="Your Image"
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          />
        ) : (
            <h1 style={{ color: 'lightgray' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet">
            Drag and Drop Your Photo
            </link>
            </link>
            </link>
            </h1>
        )}
      </div>
      <label htmlFor="photoInput" id="addPhotoBtn">
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet">
            Add Photo
        </link>
        </link>
        </link>

      </label>
      <input
        type="file"
        id="photoInput"
        accept="image/*"
        onChange={displaySelectedPhoto}
        style={{ display: 'none' }}
      />
      <button id="removePhotoBtn" onClick={removePhoto}>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet">
            Remove Photo
        </link>
        </link>
        </link>
      </button>
      {popupMessage && <div className="popup">{popupMessage}</div>}
    </div>
  );
}

export default UserInterface;
