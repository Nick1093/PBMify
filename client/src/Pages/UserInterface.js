import React, { useState } from 'react';
//import './styles.css';

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
          <h1 style={{ color: 'lightgray' }}>Drag and Drop Your Photo</h1>
        )}
      </div>
      <label htmlFor="photoInput" id="addPhotoBtn">
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
        Remove Photo
      </button>
      {popupMessage && <div className="popup">{popupMessage}</div>}
    </div>
  );
}

export default UserInterface;
