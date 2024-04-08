import React, { useState, useEffect, useRef } from "react";
import PhotoUpload from "../Components/PhotoUpload";
import Navbar from "../Components/navbar";
import Image from "./Nick_JA_DP.jpeg";
import ImageMatrixConverter from "../Components/ImageMatrixConverter";

import "../styles/UserInterface.css";

const UserInterface = () => {
  const [popupMessage, setPopupMessage] = useState("");
  const [imageData, setImageData] = useState({});
  const [successMessage, setSuccessMsg] = useState("");
  const [paintByNumberImage, setPaintByNumberImage] = useState(null);

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
        const matSmooth = e.data.matSmooth;
        const labelLocs = e.data.labelLocs;
        const matLine = e.data.matLine;
        worker.terminate();
  
        DisplayResults(matSmooth, matLine, labelLocs);
        getColorInfo(palette);  // adds hex and CMYK values for display
        setStep("result");
        setView("filled");
      }
    }, false);
    worker.postMessage({ mat: mat });
  };

  
  function newImage() {
    setPalette([]);
    if (canvasesRef.current) {
      canvasesRef.current.style.height = "0px";
    }
    setStep("load");
  };
  

  function recolor() {
    setStep("select");
  };

  function clearPalette() {
    setPalette([]);
  };

  function showColorInfo() {
    setColorInfoVisible(true);
  };

  function hideColorInfo() {
    setColorInfoVisible(false);
  };

  function viewFilled() {
    setView("filled");
  };

  function viewOutline() {
    setView("outline");
  };

  function saveFilled() {
    const win = window.open();
    win.document.write('<html><head><title>PBN filled</title></head><body><img src="' + c2.toDataURL() + '"></body></html>');
    // win.print();
  };

  function saveOutline() {
    const win = window.open();
    win.document.write('<html><head><title>PBN outline</title></head><body><img src="' + c3.toDataURL() + '"></body></html>');
    // win.print();
  };

  function savePalette() {
    const canvas = document.createElement('canvas');
    canvas.width = 80 * Math.min(palette.length, 10);
    canvas.height = 80 * (Math.floor((palette.length - 1) / 10) + 1);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    for (let i = 0; i < palette.length; i++) {
      const col = palette[i];
      ctx.fillStyle = "rgba(" + col.r + ", " + col.g + ", " + col.b + ", 255)";
      const x = 80 * (i % 10);
      const y = 80 * Math.floor(i / 10);
      ctx.fillRect(x + 10, y + 10, 60, 60);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 10, y + 10, 20, 20);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(i + 1, x + 20, y + 26);
      ctx.strokeRect(x + 10, y + 10, 60, 60);
    }

    const win = window.open(); {
    win.document.write('<html><head><title>PBN palette</title></head><body><img src="' + canvas.toDataURL() + '"></body></html>');
    // win.print();
  };
}

  function printResult() {
    if (!outlineCanvasRef.current) return;
    const img = outlineCanvasRef.current.toDataURL('image/png');
    const win = window.open();
    win.document.write(`<img src="${img}" onload="window.print();window.close()" />`);
  };

  function removePhoto() {
    setImageData('');
    setPopupMessage('Your photo is removed');
  }
 

  return (
    <>
      <ImageMatrixConverter />
    </>
  );
};

export default UserInterface;
