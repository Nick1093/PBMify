import React, { useState, useEffect } from "react";
import PhotoUpload from "../Components/PhotoUpload";
import Navbar from "../Components/navbar";
// import { getColourPalette } from "../Components/ColorUtils";
import { extractColors } from "extract-colors";
import Image from "./Nick_JA_DP.jpeg";

import "../styles/UserInterface.css";

const UserInterface = () => {
  const [popupMessage, setPopupMessage] = useState("");
  const [imageData, setImageData] = useState({});
  const [successMessage, setSuccessMsg] = useState("");
  const [paintByNumberImage, setPaintByNumberImage] = useState(null);

  // const src = "Nick_JA_DP.jpeg";
  const src = Image;
  extractColors(src)
    .then((colorPalette) => {
      console.log(colorPalette);
      // Now colorPalette is an array of colors extracted from the image
    })
    .catch(console.error); // Proper error handling

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    console.log(files);
    console.log("files.length:", files.length);

    if (files.length > 0) {
      const file = files[0];
      console.log("file:", file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = function (e) {
          setPopupMessage("Your photo is added");
          setImageData(e.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        alert("Please drop an image file.");
      }
    }
  }

  function displaySelectedPhoto(event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setPopupMessage("Your photo is added");
        setImageData(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  function removePhoto() {
    setImageData("");
    setPopupMessage("Your photo is removed");
    document.getElementById("photoInput").value = "";
  }

  const saveImage = async () => {
    const getUserId = (req) => {
      return req.session.userId;
    };

    const getImage = (req) => {
      return req.session.image;
    };

    const getTitle = (req) => {
      return req.session.title;
    };

    try {
      const userId = getUserId();
      const image = getImage();
      const title = getTitle();

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("image", image);
      formData.append("title", title);

      const response = await fetch("http://localhost:8001/create-post", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save image. Please try again.");
      }

      const successMessage = await response.json();
      if (successMessage.message === "Post added successfully") {
        setSuccessMsg("Image saved successfully to user's profile.");
      } else {
        throw new Error("Failed to save image. Please try again.");
      }
    } catch (error) {
      console.error("Error saving image:", error.message);
      setSuccessMsg("Failed to save image. Please try again.");
    }
  };

  return (
    <div className="container">
      <div
        id="dropZone"
        onDragOver={allowDrop}
        onDrop={drop}
        style={{
          width: "600px",
          height: "400px",
          border: "2px dashed #aaa",
          textAlign: "center",
          lineHeight: "380px",
          margin: "20px auto",
        }}
      >
        {imageData ? (
          <img
            src={imageData}
            alt="Drag and Drop You Photo"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        ) : (
          <>
            <h1 style={{ color: "lightgray" }}>
              {/* <link rel="preconnect" href="https://fonts.googleapis.com">
                       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> */}
              {/* <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet"> */}
              Drag and Drop Your Photo
              {/* </link>
                      </link>
                      </link> */}
            </h1>
          </>
        )}
      </div>
      <label htmlFor="photoInput" id="addPhotoBtn">
        {/* <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet">
              Add Photo
          </link>
          </link>
           </link> */}
        Add Photo
      </label>
      <input
        type="file"
        id="photoInput"
        accept="image/*"
        onChange={displaySelectedPhoto}
        style={{ display: "none" }}
      />
      <button id="removePhotoBtn" onClick={removePhoto}>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet">
            Remove Photo
          </link>
          </link>
           </link> */}
        Remove Photo
      </button>
      {popupMessage && <div className="popup">{popupMessage}</div>}
      {/* <button onClick={saveImage}>Save Image</button> */}
      {successMessage && <div className="saveSuccess">{successMessage}</div>}
      {imageData && <div></div>}
    </div>
  );
};

export default UserInterface;
