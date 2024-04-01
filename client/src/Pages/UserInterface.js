import React, { useState, useEffect } from "react";
import PhotoUpload from "../Components/PhotoUpload";
import Navbar from "../Components/navbar";
//import server from "../server/server";

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
          setTimeout(() => setPopupMessage(''), 5000);
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
        setTimeout(() => setPopupMessage(''), 5000);
      };

      reader.readAsDataURL(file);
    }
  }

  function removePhoto() {
    setImageData('');
    setPopupMessage('Your photo is removed');
    setTimeout(() => setPopupMessage(''), 5000);
  }

  
  const saveImage = async () => {

    const getUserId = (req) => {
      return req.session.userId;
    }

    const getImage = (req) => {
      return req.session.image;
    }

    const getTitle = (req) => {
      return req.session.title;
    }

    try {
      const userId = getUserId();
      const image = getImage();
      const title = getTitle();

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('image', image);
      formData.append('title', title);
  
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
      
      <label htmlFor="photoInput" className="addPhoto">
        
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
      <button id="removePhotoBtn" className="removePhoto" onClick={removePhoto}>
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

      <button id="savePhotoBtn" className="savePhoto" onClick={saveImage}>Save Photo</button>
      {successMessage && <div className="saveSuccess">{successMessage}</div>}

    </div>

    
  );

}

export default UserInterface;

/*
import React, { useState } from "react";
import PhotoUpload from "../Components/PhotoUpload";
import Navbar from "../Components/navbar";
// import server from "../server/server";




import "../styles/UserInterface.css"




const UserInterface = () => {
 const [popupMessage, setPopupMessage] = useState('');
 const [imageData, setImageData] = useState({});
 const [successMessage, setSuccessMsg] = useState('');




 function allowDrop(event) {
   event.preventDefault();
 }




 function drop(event) {
   event.preventDefault();
   const files = event.dataTransfer.files;
   console.log(files)
   console.log("files.length:",files.length)


   if (files.length > 0) {
     const file = files[0];
     console.log("file:", file)


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
  console.log("displaySelectedPhoto is running now.")
   const file = event.target.files[0];


   if (file) {
    console.log("file has occured")
     const reader = new FileReader();


     reader.onload = function (e) {
      const img = new Image();
      img.onload = function() {
        setPopupMessage('Your photo is added');
        setImageData({
          dataUrl: e.target.result,
          width: img.naturalWidth,
          height: img.naturalHeight
        });
        console.log("height:",img.height)
        console.log("width:",img.width)
      };
      img.src = e.target.result;
     };
     reader.readAsDataURL(file);
   }
 }




 function getNearest(palette, col) {
   var nearest;
   const nearestDistsq = 1000000;
   for (const i = 0; i < palette.length; i++) {
       const pcol = palette[i];
       const distsq = Math.pow(pcol.r - col.r, 2) +
     Math.pow(pcol.g - col.g, 2) +
     Math.pow(pcol.b - col.b, 2);
       if (distsq < nearestDistsq) {
     nearest = i;
     nearestDistsq = distsq;
       }
   }
   return nearest;
   };




 function convertImageToMatrix(imageData, palette) {
  console.log("imageData:", imageData)
   const mat = [];
   for (const i = 0; i < imageData.height; i++) {
     mat[i] = new Array(imageData.width);
     console.log("for loop, This is running")
   }
   console.log("height:", imageData.height)


   for (const i = 0; i < imageData.data.length; i += 4) {
       const nearestI = getNearest(palette, {
         r: imageData.data[i],
         g: imageData.data[i + 1],
         b: imageData.data[i + 2]
       });
       const x = (i / 4) % imageData.width;
       const y = Math.floor((i / 4) / imageData.width);
       mat[y][x] = nearestI;
   }
   return mat;
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
                       { <link rel="preconnect" href="https://fonts.googleapis.com">
                       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> }
                       { <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet"> }
                       Drag and Drop Your Photo
                       { </link>
                       </link>
                       </link> }
                   </h1>
               </>
           )}
       </div>
       <label htmlFor="photoInput" id="addPhotoBtn">
           { <link rel="preconnect" href="https://fonts.googleapis.com">
           <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
           <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet">
               Add Photo
           </link>
           </link>
           </link> }
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
           { <link rel="preconnect" href="https://fonts.googleapis.com">
           <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
           <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tilt+Warp&display=swap" rel="stylesheet">
               Remove Photo
           </link>
           </link>
           </link> }
           Remove Photo
       </button>
       {popupMessage && <div className="popup">{popupMessage}</div>}
       { <button onClick={saveImage}>Save Image</button> }
       {successMessage && <div className="saveSuccess">{successMessage}</div>}
       {imageData && (
           <div>
               <button onClick={convertImageToMatrix}>Convert and Display Matrix</button>
               
           </div>
       )}
   </div>
);








}




export default UserInterface;*/