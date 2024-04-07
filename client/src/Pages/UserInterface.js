import React, { useState, useEffect, useRef } from "react";
import PhotoUpload from "../Components/PhotoUpload";
import Navbar from "../Components/navbar";
import { getColourPalette } from "../Components/ColorUtils";
import ProcessImage from "../Components/ProcessImage"
//import server from "../server/server";
import "../styles/UserInterface.css"

const UserInterface = () => {
  const [step, setStep] = useState("load");
  const [view, setView] = useState("");
  const [status, setStatus] = useState("");
  const [palette, setPalette] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [colorInfoVisible, setColorInfoVisible] = useState(false);
  const [c, setC] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [c2, setC2] = useState(null);
  const [c3, setC3] = useState(null);
  const imgCanvasRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [imageData, setImageData] = useState({});
  const [successMessage, setSuccessMsg] = useState('');
  const widthSliderRef = useRef(null);
  const canvasesRef = useRef(null);
  const outlineCanvasRef = useRef(null);
  const darknessSliderRef = useRef(null);
  const [widthSliderValue, setWidthSliderValue] = useState(800); // Default width slider value
  const [darknessSliderValue, setDarknessSliderValue] = useState(40); // Default darkness slider value
  const fileInputRef = useRef(null);
  const loaderStyle = {
    border: '4px dashed #777777',
    padding: '20px',
    textAlign: 'center',
    margin: '20px',
  };

  useEffect(() => {
    console.log("useEffect for imageSrc called:", imageSrc);
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = imgCanvasRef.current;
        if (canvas && canvas.getContext) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  }, [imageSrc]);
  

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
  

  function handleWidthSliderChange(e) {
    setWidthSliderValue(e.target.value);
  };

  function handleDarknessSliderChange(e) {
    setDarknessSliderValue(e.target.value);
  };

  function matToImageData(mat, palette, context) {
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
  
  function DisplayResults({ matSmooth, matLine, labelLocs, palette }) {
    const filledCanvasRef = useRef(null);
    const outlineCanvasRef = useRef(null);
  
    function drawFilled() {
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
  };

  function handleImageUpload(e) {
    const file = e.target.files[0]; // Getting the uploaded file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result); // Set the uploaded image's base64 encoded URL
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  function imageLoaded(imageSrc){
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = imgCanvasRef.current;
      if (!canvas) return;
  
      // Set the canvas dimensions to match the uploaded image's dimensions
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Draw the image onto the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
  
      // Proceed to the next step in your application logic
      setStep("select");
    };
  };
  

  function addColor(color) {
    setPalette([...palette, color]);
  };

  function removeColor(color) {
    setPalette(palette.filter((c) => c !== color));
  };

  function getNearest(palette, col) {
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
  
  function imageDataToSimpMat(imgData, palette) {
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
  
  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  function rgbToCmyk(r, g, b) {
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

  function rgbToHsl(r, g, b) {
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
  
  function rgbToHsv(r, g, b) {
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
  
  function getColorInfo(palette) {
    for (let i = 0; i < palette.length; i++) {
      const col = palette[i];
      col.hex = rgbToHex(col.r, col.g, col.b);
      col.cmyk = rgbToCmyk(col.r, col.g, col.b);
      col.hsl = rgbToHsl(col.r, col.g, col.b);
      col.hsv = rgbToHsv(col.r, col.g, col.b);
    }
  };
  
  function pbnify() {
    setStep("process");
    const width = c.width;
    const height = c.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const mat = imageDataToSimpMat(imgData, palette);
  
    const worker = new Worker(ProcessImage);
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
    <div className="col">
      {/* Description section explaining each step of the process */}
      <div id="description">
        {/* Dynamic classes applied based on the current step to highlight the active step */}
        <p className={step !== 'load' ? 'other-step' : ''}>1. Load an image.</p>
        <p className={step !== 'select' ? 'other-step' : ''}>2. Click some points on the image to select your color palette.</p>
        <p className={step !== 'select' || palette.length < 2 ? 'other-step' : ''}>3. Click PBNify and the image will be converted to a paint by number template.</p>
        <p className={step !== 'result' ? 'other-step' : ''}>4. Save the outline and palette, print them out, and paint/color.</p>
        {/* Privacy note */}
      </div>

      {/* Width Slider */}
      {/* Conditional rendering based on the 'load' step */}
      {step === 'load' && (
        <div>
          <label htmlFor="widthSlider">Resize width to: <span>{widthSliderValue}</span>px</label>
          {/* Slider input for adjusting the width */}
          <input
            type="range"
            min="400"
            max="2000"
            step="10"
            value={widthSliderValue}
            onChange={handleWidthSliderChange}
            id="widthSlider"
          />
        </div>
      )}

      {/* Darkness Slider */}
      {/* Similar conditional rendering for the darkness adjustment slider */}
      {step === 'load' && (
        <div>
          <label htmlFor="darknessSlider">Outline darkness: <span style={{ color: `rgb(${255 * (1 - darknessSliderValue / 100)}, ${255 * (1 - darknessSliderValue / 100)}, ${255 * (1 - darknessSliderValue / 100)})` }}>{darknessSliderValue}</span></label>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={darknessSliderValue}
            onChange={handleDarknessSliderChange}
            id="darknessSlider"
          />
        </div>
      )}

      {/* Image Upload Section */}
      {/* Conditionally displayed based on the current step */}
      {step === 'load' && (
      <div className="PhotoUploadZone">
      <div
          id="dropZone"
          onDragOver={allowDrop}
          onDrop={drop}
          style={loaderStyle}
      >
          {imageData ? (
              <img
                  src={imageData}
                  alt="Drag and drop your photo"
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
      </div>  
      )}

<div className="col" id="toolbar">
  {step !== 'process' && (
    <div id="buttons">
      {(step === 'select' || step === 'result') && (
        <button type="button" className="btn btn-secondary" onClick={newImage}>new image</button>
      )}
      {step === 'select' && palette.length > 0 && (
        <button type="button" className="btn btn-secondary" onClick={clearPalette}>clear palette</button>
      )}
      {step === 'select' && palette.length > 1 && (
        <button type="button" className="btn btn-primary" onClick={pbnify}>PBNify</button>
      )}
      {step === 'result' && (
        <button type="button" className="btn btn-secondary" onClick={recolor}>recolor</button>
      )}
      {step === 'result' && (
        <>
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-primary" onClick={viewFilled}>filled</button>
            <button type="button" className="btn btn-success" onClick={saveFilled}>save</button>
          </div>
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-primary" onClick={viewOutline}>outline</button>
            <button type="button" className="btn btn-success" onClick={saveOutline}>save</button>
          </div>
          <button type="button" className="btn btn-success" onClick={savePalette}>save palette</button>
        </>
      )}
    </div>
  )}
  {step === 'process' && (
    <div>
      <img id="spinner" src="images/spinner.png" alt="Loading" /> {status}
    </div>
  )}
  </div>

  <div className="col" id="palette">
    {palette.map((color, index) => (
      <div className="swatch" key={index} style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}>
        {step === 'result' && (view === 'outline' || colorInfoVisible) && (
          <div className="swatch-label">{index + 1}</div>
        )}
        {step === 'select' && (
          <img src="images/delete.png" alt="Delete" onClick={() => removeColor(color)} />
        )}
      </div>
    ))}
  </div>

  {step === 'result' && (
    <div className="col" id="color-info">
      {!colorInfoVisible && (
        <button type="button" className="btn btn-secondary" onClick={showColorInfo}>show color info</button>
      )}
      {colorInfoVisible && (
        <button type="button" className="btn btn-secondary" onClick={hideColorInfo}>hide color info</button>
      )}
      {colorInfoVisible && palette.map((color, index) => (
        <p key={index}>
          <strong>{index + 1}</strong>: {color.hex} |
          <strong>RGB</strong>({color.r}, {color.g}, {color.b}) |
          <strong>HSL</strong>({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%) |
          <strong>HSV/HSB</strong>({color.hsv.h}, {color.hsv.s}%, {color.hsv.v}%) |
          <strong>CMYK</strong>({color.cmyk.c}%, {color.cmyk.m}%, {color.cmyk.y}%, {color.cmyk.k}%)
        </p>
      ))}
    </div>
  )}

  {step !== 'load' && (
    <div className="col" id="canvases">
      {(step === 'select' || step === 'process') && (
        <div className="canvas-container">
          <canvas id="img-canvas"></canvas>
          {palette.map((color, index) => (
            <div 
              className="sample-point" 
              key={index} 
              style={{ left: `${color.x - 5}px`, top: `${color.y - 5}px` }}
            ></div>
          ))}
        </div>
      )}
      {step === 'result' && view === 'filled' && (
        <div className="canvas-container">
          <canvas id="filled-canvas"></canvas>
        </div>
      )}
      {step === 'result' && view === 'outline' && (
        <div className="canvas-container">
          <canvas id="outline-canvas"></canvas>
        </div>
      )}
    </div>
  )}

      </div>

      
  
    
  );
}

export default UserInterface;