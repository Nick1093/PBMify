import React, { useState } from "react";
import PhotoUpload from "../Components/PhotoUpload";
import Navbar from "../Components/navbar";
import server from "../server/server";

import "../styles/UserInterface.css"

const UserInterface = () => {
  const [popupMessage, setPopupMessage] = useState('');
  const [imageData, setImageData] = useState('');
  const [successMessage, setSuccessMsg] = useState('');

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

  function convertImageToMatrix(imageData) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
            const matrix = [];
            for (let y = 0; y < img.height; y++) {
                const row = [];
                for (let x = 0; x < img.width; x++) {
                    const index = (y * img.width + x) * 4;
                    // Extract RGB values and calculate grayscale value
                    const grayscale = (imageData[index] + imageData[index + 1] + imageData[index + 2]) / 3;
                    // Normalize grayscale value to range [0, 1]
                    const normalized = grayscale / 255;
                    row.push(normalized);
                }
                matrix.push(row);
            }
            resolve(matrix);
        };
        img.onerror = function(error) {
            reject(error);
        };
        img.src = imageData;
    });
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
                <>
                    <h1 style={{ color: 'lightgray' }}>
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
            style={{ display: 'none' }}
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
        <button onClick={saveImage}>Save Image</button>
        {successMessage && <div className="saveSuccess">{successMessage}</div>}
        {imageData && (
            <div>
                <button onClick={convertAndDisplayMatrix}>Convert and Display Matrix</button>
                <pre>{JSON.stringify(matrix, null, 2)}</pre>
            </div>
        )}
    </div>
);


}

export default UserInterface;
