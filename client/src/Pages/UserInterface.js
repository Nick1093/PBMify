import React, { useRef, useEffect, useState } from "react";
import { extractColors } from "extract-colors";
import NavBar from "../Components/navbar";
// import cloneDeep from "lodash/cloneDeep";
import "../styles/UserInterface.css";
// import _ from "lodash";
import _ from "../Components/lodash.js";
import { getRandomEquation } from "../Components/equations.js";

// Define the getNearest function that takes a color palette and a target color
const getNearest = (palette, color) => {
  let nearestIndex = 0;
  // Set an initial minimum distance to Infinity to ensure any first comparison is smaller
  let minDistance = Infinity;

  // Iterate over each color in the palette to find the nearest color to the given one
  palette.forEach((pColor, index) => {
    // Calculate the Euclidean distance between the current palette color and the given color
    const distance = Math.sqrt(
      (pColor.red - color.r) ** 2 + // Square difference in red component
        (pColor.green - color.g) ** 2 + // Square difference in green component
        (pColor.blue - color.b) ** 2 // Square difference in blue component
    );

    // If this distance is smaller than the current minimum distance, update minDistance and nearestIndex
    if (distance < minDistance) {
      minDistance = distance; // Update the smallest found distance
      nearestIndex = index; // Update the index of the nearest color
      // console.log("New index for min distance: ", nearestIndex, minDistance);
    }
  });

  // console.log("Final index: ", nearestIndex);
  // Return the index of the nearest color in the palette
  return nearestIndex;
};

const getNeighborhood = (mat, x, y, range) => {
  const values = [];
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      const nx = x + i;
      const ny = y + j;
      if (nx >= 0 && nx < mat[0].length && ny >= 0 && ny < mat.length) {
        values.push(mat[ny][nx]);
      }
    }
  }
  return values;
};

const neighborsSame = (mat, x, y) => {
  let height = mat.length;
  let width = mat[0].length;
  let val = mat[y][x];
  let xRel = [1, 0];
  let yRel = [0, 1];

  for (let i = 0; i < xRel.length; i++) {
    let xx = x + xRel[i];
    let yy = y + yRel[i];
    if (xx >= 0 && xx < width && yy >= 0 && yy < height) {
      if (mat[yy][xx] !== val) {
        return false;
      }
    }
  }
  return true;
};

// Function to convert matrix back to ImageData
const matrixToImageData = (mat, palette) => {
  const height = mat.length;
  const width = mat[0].length;
  const imageData = new ImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const colorIndex = mat[y][x];
      const color = palette[colorIndex];
      const dataIndex = (y * width + x) * 4;

      imageData.data[dataIndex] = color.red;
      imageData.data[dataIndex + 1] = color.green;
      imageData.data[dataIndex + 2] = color.blue;
      imageData.data[dataIndex + 3] = 255; // Full opacity
    }
  }

  console.log("Matrix converted to image");

  return imageData;
};

const getRegion = (mat, x, y, cov) => {
  const region = { value: mat[y][x], x: [], y: [] };
  const value = mat[y][x];
  // const covered = _.cloneDeep(cov);
  const covered = cov.map((row) => row.slice());

  const queue = [[x, y]];

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();

    if (!covered[cy][cx] && mat[cy][cx] === value) {
      region.x.push(cx);
      region.y.push(cy);
      covered[cy][cx] = true;

      if (cx > 0) queue.push([cx - 1, cy]);
      if (cx < mat[0].length - 1) queue.push([cx + 1, cy]);
      if (cy > 0) queue.push([cx, cy - 1]);
      if (cy < mat.length - 1) queue.push([cx, cy + 1]);
    }
  }
  return region;
};

const getBelowValue = (mat, region) => {
  let x = region.x[0];
  let y = region.y[0];
  while (mat[y][x] === region.value) {
    y++;
  }
  return mat[y][x];
};

const removeRegion = (mat, region) => {
  // console.log("REGION REMOVED:", region);
  let newValue;
  if (region.y[0] > 0) {
    newValue = mat[region.y[0] - 1][region.x[0]]; // assumes first pixel in list is topmost then leftmost of region.
  } else {
    newValue = getBelowValue(mat, region);
  }
  for (let i = 0; i < region.x.length; i++) {
    mat[region.y[i]][region.x[i]] = newValue;
  }
};

const coverRegion = (covered, region) => {
  for (let i = 0; i < region.x.length; i++) {
    const x = region.x[i];
    const y = region.y[i];
    if (covered[y] !== undefined && covered[y][x] !== undefined) {
      covered[y][x] = true;
    } else {
      console.error("covered[y] or covered[x] is undefined!!");
    }
  }
};

const pairColorsWithEquations = (colorPalette) => {
  // Check if colorPalette is defined and has elements
  if (!colorPalette || colorPalette.length === 0) {
    console.error('colorPalette is undefined or empty');
    return [];
  }

  // Mapping over the colorPalette to pair each color with an equation
  const pairedList = colorPalette.map((color, index) => {
    // Adjusting index to match numbers 1 through 20 for getRandomEquation
    const numberForEquation = (index % 20) + 1; // Use modulo to ensure number is between 1 and 20
    const equation = getRandomEquation(numberForEquation);
    return { color, equation };
  });

  return pairedList;
}

const UserInterface = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [matrix, setMatrix] = useState([]);
  const [showUploadOptions, setShowUploadOptions] = useState(true);
  const [outlinedMatrix, setOutlinedMatrix] = useState([]);

  const [processedMatrix, setProcessedMatrix] = useState([]);
  const [colorPalette, setColorPalette] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [labelLocs, setLabelLocs] = useState([]);

  const processFile = async (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const imgSrc = e.target.result;
        const img = new Image();
        img.onload = async () => {
          const canvas = canvasRef.current;

          canvas.width = img.width;
          canvas.height = img.height;
          console.log("Canvas dimensions:", canvas.width, canvas.height);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          setImageLoaded(true);

          const options = {
            pixels: 64000,
            distance: 0.11,
            saturationDistance: 0.2,
            lightnessDistance: 0.2,
            hueDistance: 0.083333333,
          };

          const colors = await extractColors(imgSrc, options);
          setColorPalette(colors);
          console.log("Color palette:", colors);

          // Make sure the palette is loaded before processing the image
          // console.log(canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log("Image data:", imageData);

          const rawMatrix = imageDataToSimpMat(imageData, colors); // Pass the loaded color palette
          setMatrix(rawMatrix);
          console.log("Raw matrix:", rawMatrix);

          const smoothedMatrix = smooth(rawMatrix);
          console.log("Smoothed matrix:", smoothedMatrix);

          let labelLocs = getLabelLocs(smoothedMatrix);
          setLabelLocs(labelLocs);
          // Send the smoothed matrix to the worker
          // workerRef.current.postMessage({ mat: smoothedMatrix });

          const outlinedMatrix = outline(smoothedMatrix);
          console.log("Outlined matrix:", outlinedMatrix);
          setProcessedMatrix(outlinedMatrix);
        };
        img.src = imgSrc;
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onClick = () => {
    fileInputRef.current.click(); // Simulate click on the file input when the drop zone is clicked
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const imageDataToSimpMat = (imgData, palette) => {
    const width = imgData.width;
    const height = imgData.height;
    const mat = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const color = {
          r: imgData.data[index],
          g: imgData.data[index + 1],
          b: imgData.data[index + 2],
        };
        const nearestIndex = getNearest(palette, color);
        row.push(nearestIndex);
      }
      mat.push(row);
    }

    return mat;
  };

  const smooth = (mat) => {
    const height = mat.length;
    const width = mat[0].length;
    const smoothedMat = new Array(height)
      .fill(null)
      .map(() => new Array(width).fill(0));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Get the average of the surrounding pixels
        const values = getNeighborhood(mat, x, y, 1); // Using 1 for immediate neighborhood
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        smoothedMat[y][x] = avg;
      }
    }
    return smoothedMat;
  };

  const getLabelLocs = (mat) => {
    console.log("Getting labellocs. This may take a while.");
    let height = mat.length;
    let width = mat[0].length;
    let labelLocs = [];
    let covered = [];
    for (let i = 0; i < height; i++) {
      covered[i] = _.fill(Array(width), false);
    }
    // console.log("Covered:", covered);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!covered[y][x]) {
          let region = getRegion(mat, x, y, covered);
          coverRegion(covered, region);
          // console.log("Finished covering the regions");
          if (region.x.length > 100) {
            // Threshold for size
            let labelLoc = {
              x: region.x[0] + 10,
              y: region.y[0] + 10,
              value: region.value,
            }; // For simplicity, choose the 10th pixel (adds some padding)
            labelLocs.push(labelLoc);
            // console.log("Successful location label:", labelLoc);
          } else {
            // console.log("Too small, removing region.")
            removeRegion(mat, region);
          }
        }
      }
    }
    console.log("Returning labelLocs:", labelLocs);
    return labelLocs;
  };

  const outline = (mat) => {
    let height = mat.length;
    let width = mat[0].length;
    let line = Array.from({ length: height }, () => new Array(width).fill(0));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        line[y][x] = neighborsSame(mat, x, y) ? 0 : 1;
      }
    }

    return line;
  };

  const displaySmoothedImage = () => {
    const canvas = canvasRef.current;
    if (!matrix.length) {
      console.error("Matrix or color palette is not set.");
      return;
    }
    const imageData = matrixToImageData(matrix, colorPalette);
    console.log(imageData);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    if (displaySmoothedImage) {
      displayColorPalette();
    }
    
    // Check if the color palette container exists and remove it if it does
    /*const paletteContainer = document.getElementById("colorPaletteContainer");
    if (paletteContainer) {
      paletteContainer.remove();
    }*/
  };
  
  const displayOutlinedImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!matrix.length) {
      console.error("Matrix or color palette is not set.");
      return;
    }
  
    const bw = [
      { red: 255, green: 255, blue: 255 },
      { red: 0, green: 0, blue: 0 },
    ];
  
    const outlinedData = matrixToImageData(processedMatrix, bw);
  
    // console.log(outlinedData);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(outlinedData, 0, 0);
  
    let gray = 128; // Example: mid-tone gray, adjust as needed
  
    ctx.font = "12px Georgia";
    ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`; // Template literal for easier readability
    labelLocs.forEach((labelLoc) => {
      ctx.fillText(labelLoc.value + 1, labelLoc.x - 3, labelLoc.y + 4);
    });
  
    /* Check if the color palette container exists and remove it if it does
    const paletteContainer = document.getElementById("colorPaletteContainer");
    if (paletteContainer) {
      paletteContainer.remove();
    }*/
  };
  
  const displayColorPalette = () => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure the canvas ref is available
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    if (!imageData.data.some((value) => value !== 0)) {
      return; // Exit if the canvas is empty
    }
  
    const pixelData = imageData.data;
    const colorPalette = [];
  
    for (let i = 0; i < pixelData.length; i += 4) {
      const red = pixelData[i];
      const green = pixelData[i + 1];
      const blue = pixelData[i + 2];
      const alpha = pixelData[i + 3] / 255; // Adjust alpha for CSS use
      const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  
      if (!colorPalette.includes(color)) {
        colorPalette.push(color);
      }
    }
  
    let paletteContainer = document.getElementById("colorPaletteContainer");
    if (!paletteContainer) {
      paletteContainer = document.createElement("div");
      paletteContainer.id = "colorPaletteContainer";
      document.body.appendChild(paletteContainer);
    }
  
    paletteContainer.innerHTML = "";
  
    const paletteMessage = document.createElement("div");
    paletteMessage.textContent = "Color Palette";
    paletteMessage.style.textAlign = "center";
    paletteContainer.appendChild(paletteMessage);
  
    const paletteWrapper = document.createElement("div");
    paletteWrapper.style.display = "flex";
    paletteWrapper.style.flexWrap = "wrap"; // Allow wrapping for multiple items
    paletteWrapper.style.justifyContent = "center";
    paletteContainer.appendChild(paletteWrapper);
  
    // Assume pairColorsWithEquations function is available and returns paired list
    const pairedList = colorPalette.map((color, index) => {
      // Add 1 to the index for the equation number to match the intended solution
      const equationNumber = index + 1;
      const equation = getRandomEquation(equationNumber);
      // Ensure the equation includes the result, which should match equationNumber
      return { color, equation: `${equation} ${equationNumber}` }; // Concatenate the result here
    });

    pairedList.forEach((item, index) => {
      const colorBox = document.createElement("div");
      colorBox.style.backgroundColor = item.color;
      colorBox.style.width = "100px"; // Increased width for better visibility
      colorBox.style.height = "60px"; // Increased height for additional content
      colorBox.style.margin = "10px";
      colorBox.style.border = "1px solid black";
      colorBox.style.position = "relative";
      colorBox.style.display = "flex";
      colorBox.style.flexDirection = "column";
      colorBox.style.alignItems = "center";
      colorBox.style.justifyContent = "center";
  
      const equationText = document.createElement("span");
      equationText.textContent = item.equation; 
      equationText.style.color = "black";
      equationText.style.fontSize = "12px";
      equationText.style.textAlign = "center";
      equationText.style.marginBottom = "5px"; // Margin for spacing between color and equation
  
      const indexText = document.createElement("span");
      indexText.textContent = `Color ${index + 1}`;
      indexText.style.color = "black";
      indexText.style.fontSize = "10px";
      indexText.style.textShadow = "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white";
  
      colorBox.appendChild(equationText); // Append equation text first
      colorBox.appendChild(indexText); // Then, append the index text
      paletteWrapper.appendChild(colorBox);
    });
};

  
  
  

  const removePhoto = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    setImageLoaded(false); // Reset image loaded state
    //Check if the color palette container exists and remove it if it does
    const paletteContainer = document.getElementById("colorPaletteContainer");
    if (paletteContainer) {
      paletteContainer.remove();
    }

  };

  return (
    <>
      <NavBar />
      &nbsp;
      <div className="DropOrClick" style={{ textAlign: "center", fontFamily: "'Climate Crisis', sans-serif" }}>
        
        Drop or click to upload an image
      </div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onClick}
        style={{
          width: "90%",
          height: "500px",
          border: "4px dashed #aaa",
          cursor: "pointer",
          position: "relative", // Change to relative or absolute
          margin: "20px auto", // Center horizontally
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Conditionally render the instruction text based on imageLoaded */}
        {!imageLoaded && (
          <div style={{ textAlign: "center"}}>
            <button className="browse-button">Browse files</button>
          </div>
        )}
  
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
          accept="image/*"
          onClick={(event) => (event.target.value = null)} // Add this line
        />
  
        <canvas
          ref={canvasRef}
          style={{
            display: imageLoaded ? "block" : "none",
            maxWidth: "100%",
            maxHeight: "90%",
          }}
        />
      </div>
  
      {/* Button container div */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {(imageLoaded || !imageLoaded) && (
            <button className="blue-button" onClick={removePhoto}>Remove Photo</button>
          )}
          <button className="blue-button" id="Matrix to image" onClick={() => displaySmoothedImage()}>View Smoothed Image</button>
          <button className="blue-button" id="Outlined image" onClick={() => displayOutlinedImage()}>View Outlined Image</button>
        </div>
      </div>
      <p>&nbsp;</p>
      {/* Additional UI components to display matrix and color palette */}
    </>
  );
  
};

export default UserInterface;
