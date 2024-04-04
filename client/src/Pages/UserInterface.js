import React, { useState, useEffect } from "react";
import PhotoUpload from "../Components/PhotoUpload";
import Navbar from "../Components/navbar";
import { getColourPalette } from "../Components/ColorUtils";
//import server from "../server/server";
import "../styles/UserInterface.css"

import React, { useState, useRef } from "react";

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
    const gray = Math.round(255 * (1 - document.getElementById("darknessSlider").value / 100));
    const bw = [{ r: 255, g: 255, b: 255 }, { r: gray, g: gray, b: gray }];
    const ctx = outlineCanvas.getContext("2d");
    const imgData = matToImageData(matLine, bw, ctx);
    ctx.putImageData(imgData, 0, 0);

    ctx.font = "12px Georgia";
    ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
    labelLocs.forEach((label) => {
      ctx.fillText(label.value + 1, label.x - 3, label.y + 4);
    });
  };

  return (
    <div>
      <canvas id="filled-canvas" ref={filledCanvasRef}></canvas>
      <canvas id="outline-canvas" ref={outlineCanvasRef}></canvas>
    </div>
  );
};

const UserInterface = () => {
  const [step, setStep] = useState("load");
  const [view, setView] = useState("");
  const [status, setStatus] = useState("");
  const [palette, setPalette] = useState([]);
  const [colorInfoVisible, setColorInfoVisible] = useState(false);
  const [c, setC] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [c2, setC2] = useState(null);
  const [c3, setC3] = useState(null);
  const [loaderStyle, setLoaderStyle] = useState({
    border: "4px dashed #777777"
  });

  const imageLoaded = (imgSrc) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const c = document.getElementById("img-canvas");
      c.width = document.getElementById("widthSlider").value;
      const scale = c.width / img.naturalWidth;
      c.height = img.naturalHeight * scale;
      document.getElementById("canvases").style.height = (c.height + 20) + "px";
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
    document.getElementById("canvases").style.height = "0px";
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

export default UserInterface;