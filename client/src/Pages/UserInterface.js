import React, { useState, useEffect, useRef } from "react";
import PhotoUpload from "../Components/PhotoUpload";
import Navbar from "../Components/navbar";
import getColourPalette from "../Components/ColorUtils";

//import server from "../server/server";
import "../styles/UserInterface.css"

const UserInterface = () => {
<<<<<<< HEAD
const [popupMessage, setPopupMessage] = useState('');
const [imageData, setImageData] = useState(null);
const [successMessage, setSuccessMsg] = useState('');
const [paintByNumberImage, setPaintByNumberImage] = useState(null);

useEffect(() => {
 if (imageData) {
   generatePaintByNumberImage();
 }
}, [imageData]);

const generatePaintByNumberImage = async () => {
 try {
  console.log("PBN Image running");

  console.log("imageData:", imageData);

   // Get color palette from the uploaded image
   const palette = await getColourPalette(imageData);
   console.log("palette:", palette);

   // Limit palette to 20 colors
   const limitedPalette = palette.slice(0, 20);

   // Map colors to numbers
   const colorMap = {};
   limitedPalette.forEach((color, index) => {
     colorMap[color] = index + 1; // Assigning numbers starting from 1
   });

   // Convert image to grid
   const canvas = document.createElement("canvas");
   const context = canvas.getContext("2d");
   const img = new Image();
   img.onload = function () {
     canvas.width = img.width;
     canvas.height = img.height;
     context.drawImage(img, 0, 0, img.width, img.height);
     const imageData = context.getImageData(0, 0, img.width, img.height)
     const data = imageData.data;

     for (let i = 0; i < data.length; i += 4) {
       const red = data[i];
       const green = data[i + 1];
       const blue = data[i + 2];
       const rgb = `rgb(${red},${green},${blue})`;
       if (rgb in colorMap) {
         const number = colorMap[rgb];
         data[i] = number;
         data[i + 1] = number;
         data[i + 2] = number;
     }
   }

   context.putImageData(imageData, 0, 0);
     document.body.appendChild(canvas);
 };

 img.src = imageData;

 } catch (error) {
   console.error("Error generating Paint by Number image:", error);
 }
};

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


/*function getNearest(palette, col) {
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
  };*/
  

function removePhoto() {
 setImageData('');
 setPopupMessage('Your photo is removed');
 document.getElementById("photoInput").value = "";
}
=======
  const [step, setStep] = useState("load");
  const [view, setView] = useState("");
  const [status, setStatus] = useState("");
  const [palette, setPalette] = useState([]);
  const [image, setImageSrc] = useState([]);
  const [colorInfoVisible, setColorInfoVisible] = useState(false);
  const [c, setC] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [c2, setC2] = useState(null);
  const [c3, setC3] = useState(null);
  const imgCanvasRef = useRef(null);
  const widthSliderRef = useRef(null);
  const canvasesRef = useRef(null);
  const [darknessSliderValue, setDarknessSliderValue] = useState(50);
  const [loaderStyle, setLoaderStyle] = useState({
    border: "4px dashed #777777"
  });

  const matToImageData = (mat, palette, context) => {
    const imgData = context.createImageData(mat[0].length, mat.length);
    for (let y = 0; y < mat.length; y++) {
      for (let x = 0; x < mat[0].length; x++) {
        const i = (y * mat[0].length + x) * 4;
        const col = palette[mat[y][x]];
        imgData.data[i] = col.r;
        imgData.data[i + 1] = col.g;
        imgData.data[i + 2] = col.b;
        imgData.data[i + 3] = 255;
      }
    }
    return imgData;
  };
  
  const DisplayResults = ({ matSmooth, matLine, labelLocs, palette }) => {
    const filledCanvasRef = useRef(null);
    const outlineCanvasRef = useRef(null);
  
    const drawFilled = () => {
      const filledCanvas = filledCanvasRef.current;
      const ctx = filledCanvas.getContext("2d");
      const imgData = matToImageData(matSmooth, palette, ctx);
      ctx.putImageData(imgData, 0, 0);
    };
  
    const drawOutlines = () => {
  const outlineCanvas = outlineCanvasRef.current;
  const gray = Math.round(255 * (1 - darknessSliderValue / 100));
  const bw = [{ r: 255, g: 255, b: 255 }, { r: gray, g: gray, b: gray }];
  const ctx = outlineCanvas.getContext("2d");
  const imgData = matToImageData(matLine, bw, ctx);
  ctx.putImageData(imgData, 0, 0);
  
  ctx.font = "12px Georgia";
  ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
  labelLocs.forEach((label) => {
    ctx.fillText(label.value + 1, label.x - 3, label.y + 4);
  });
  
  
    return (
      <div>
        <canvas id="filled-canvas" ref={filledCanvasRef}></canvas>
        <canvas id="outline-canvas" ref={outlineCanvasRef}></canvas>
      </div>
    );
  };
>>>>>>> b6309cc3eaf66ea2c69ac71c8c21a811b6614dd6

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const imageLoaded = (imgSrc) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const c = imgCanvasRef.current;
      const scale = c.width / img.naturalWidth;
      c.height = img.naturalHeight * scale;
      if (canvasesRef.current) {
        canvasesRef.current.style.height = (c.height + 20) + "px";
      }
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, c.width, c.height);
      setStep("select");
    };
  };

  const addColor = (color) => {
    setPalette([...palette, color]);
  };

  const removeColor = (color) => {
    setPalette(palette.filter((c) => c !== color));
  };

  const getNearest = (palette, col) => {
    let nearest;
    let nearestDistsq = 1000000;
    for (let i = 0; i < palette.length; i++) {
      const pcol = palette[i];
      const distsq =
        Math.pow(pcol.r - col.r, 2) +
        Math.pow(pcol.g - col.g, 2) +
        Math.pow(pcol.b - col.b, 2);
      if (distsq < nearestDistsq) {
        nearest = i;
        nearestDistsq = distsq;
      }
    }
    return nearest;
  };
  
  const imageDataToSimpMat = (imgData, palette) => {
    const mat = [];
    for (let i = 0; i < imgData.height; i++) {
      mat[i] = new Array(imgData.width);
    }
    for (let i = 0; i < imgData.data.length; i += 4) {
      const nearestI = getNearest(palette, {
        r: imgData.data[i],
        g: imgData.data[i + 1],
        b: imgData.data[i + 2]
      });
      const x = (i / 4) % imgData.width;
      const y = Math.floor(i / 4 / imgData.width);
      mat[y][x] = nearestI;
    }
    return mat;
  };
  
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  const rgbToCmyk = (r, g, b) => {
    const k = 1 - Math.max(r / 255, g / 255, b / 255);
    let c, m, y;
    if (k === 1) {
      c = 0;
      m = 0;
      y = 0;
    } else {
      c = (1 - r / 255 - k) / (1 - k);
      m = (1 - g / 255 - k) / (1 - k);
      y = (1 - b / 255 - k) / (1 - k);
    }
  
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const rgbToHsl = (r, g, b) => {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    
    let h;
    if (M === m) {
      h = 0;
    } else if (M === r) {
      h = 60 * (g - b) / (M - m);
    } else if (M === g) {
      h = 60 * (b - r) / (M - m) + 120;
    } else {
      h = 60 * (r - g) / (M - m) + 240;
    }
    
    const l = (M + m) / 2;
    let s;
    if (l === 0 || l === 1) {
      s = 0;	// So it isn't NaN for black or white.
    } else {
      s = (M - m) / (1 - Math.abs(2 * l - 1));
    }
    
    return {
      h: ((Math.round(h) % 360) + 360) % 360,  // js modulo isn't always positive
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };
  
  const rgbToHsv = (r, g, b) => {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    
    let h;
    if (M === m) {
      h = 0;
    } else if (M === r) {
      h = 60 * (g - b) / (M - m);
    } else if (M === g) {
      h = 60 * (b - r) / (M - m) + 120;
    } else {
      h = 60 * (r - g) / (M - m) + 240;
    }
  
    let s;
    if (M === 0) {
      s = 0;	// So it isn't NaN for black.
    } else {
      s = (M - m) / M;
    }
    
    return {
      h: ((Math.round(h) % 360) + 360) % 360,
      s: Math.round(s * 100),
      v: Math.round(M * 100)
    };
  };
  
  const getColorInfo = (palette) => {
    for (let i = 0; i < palette.length; i++) {
      const col = palette[i];
      col.hex = rgbToHex(col.r, col.g, col.b);
      col.cmyk = rgbToCmyk(col.r, col.g, col.b);
      col.hsl = rgbToHsl(col.r, col.g, col.b);
      col.hsv = rgbToHsv(col.r, col.g, col.b);
    }
  };
  
  const pbnify = () => {
    setStep("process");
    const width = c.width;
    const height = c.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const mat = imageDataToSimpMat(imgData, palette);
  
    const worker = new Worker('scripts/processImage.js');
    worker.addEventListener('message', (e) => {
      if (e.data.cmd === "status") {
        setStatus(e.data.status);
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

  
  const newImage = () => {
    setPalette([]);
    if (canvasesRef.current) {
      canvasesRef.current.style.height = "0px";
    }
    setStep("load");
  };
  

  const recolor = () => {
    setStep("select");
  };

  const clearPalette = () => {
    setPalette([]);
  };

  const showColorInfo = () => {
    setColorInfoVisible(true);
  };

  const hideColorInfo = () => {
    setColorInfoVisible(false);
  };

  const viewFilled = () => {
    setView("filled");
  };

  const viewOutline = () => {
    setView("outline");
  };

  const saveFilled = () => {
    const win = window.open();
    win.document.write('<html><head><title>PBN filled</title></head><body><img src="' + c2.toDataURL() + '"></body></html>');
    // win.print();
  };

  const saveOutline = () => {
    const win = window.open();
    win.document.write('<html><head><title>PBN outline</title></head><body><img src="' + c3.toDataURL() + '"></body></html>');
    // win.print();
  };

  const savePalette = () => {
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

    const win = window.open();
    win.document.write('<html><head><title>PBN palette</title></head><body><img src="' + canvas.toDataURL() + '"></body></html>');
    // win.print();
  };
}

<<<<<<< HEAD
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
                 alt="Drag and Drop You Photo"
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
      {/* <button onClick={saveImage}>Save Image</button> */}
      {successMessage && <div className="saveSuccess">{successMessage}</div>}
      {imageData && (
          <div>
             
          </div>
      )}
  </div>
);
=======
>>>>>>> b6309cc3eaf66ea2c69ac71c8c21a811b6614dd6


}

export default UserInterface;