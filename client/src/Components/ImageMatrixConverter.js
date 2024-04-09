import React, { useRef, useEffect, useState } from "react";
import { extractColors } from "extract-colors";

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

  console.log("Matrix converted to image")

  return imageData;
};

const getRegion = (mat, x, y, covered) => {
  let queue = [[x, y]];
  let region = { value: mat[y][x], pixels: [] };

  while (queue.length > 0) {
    let [cx, cy] = queue.shift();

    if (covered[cy][cx] || mat[cy][cx] !== region.value) continue;

    covered[cy][cx] = true;
    region.pixels.push({ x: cx, y: cy });

    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].forEach(([dx, dy]) => {
      let nx = cx + dx,
        ny = cy + dy;
      if (
        nx >= 0 &&
        nx < mat[0].length &&
        ny >= 0 &&
        ny < mat.length &&
        !covered[ny][nx]
      ) {
        queue.push([nx, ny]);
      }
    });
  }

  return region;
};

const coverRegion = (covered, region) => {
  region.pixels.forEach(({ x, y }) => {
    covered[y][x] = true;
  });
};

const getLabelLocs = (mat) => {
  let height = mat.length;
  let width = mat[0].length;
  let covered = Array.from({ length: height }, () => Array(width).fill(false));
  let labelLocs = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!covered[y][x]) {
        let region = getRegion(mat, x, y, covered);
        if (region.pixels.length > 100) {
          // Threshold for size
          let labelLoc = region.pixels[0]; // For simplicity, choose the first pixel
          labelLocs.push({ ...labelLoc, value: region.value });
        }
      }
    }
  }

  return labelLocs;
};

const ImageMatrixConverter = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [matrix, setMatrix] = useState([]);
  const [processedMatrix, setProcessedMatrix] = useState([]);
  const [colorPalette, setColorPalette] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const processFile = async (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imgSrc = e.target.result;
        const img = new Image();
        img.onload = async () => {
          const canvas = canvasRef.current;
          if (!canvas) {
            console.error("Canvas not found");
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
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

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log("Image data:", imageData);

          const rawMatrix = imageDataToSimpMat(imageData, colors); // Pass the loaded color palette
          setMatrix(rawMatrix);
          console.log("Raw matrix:", rawMatrix);

          const smoothedMatrix = smooth(rawMatrix);
          console.log("Smoothed matrix:", smoothedMatrix);

          const outlinedMatrix = outline(smoothedMatrix);
          console.log("Outlined matrix:", outlinedMatrix);
          setProcessedMatrix(outlinedMatrix);

          let covered = Array.from({ length: rawMatrix.length }, () =>
            Array(rawMatrix[0].length).fill(false)
          );
          let labelLocs = getLabelLocs(smoothedMatrix, covered);

          // Now you can use `labelLocs` for further processing or visualization
          console.log(labelLocs);
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

  const outline = (mat) => {
    const height = mat.length;
    const width = mat[0].length;
    const outlinedMat = new Array(height)
      .fill(null)
      .map(() => new Array(width).fill(0));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Simple edge detection by comparing the pixel value to its neighbors
        outlinedMat[y][x] = isEdge(mat, x, y) ? 255 : 0; // Edge marked with 255
      }
    }
    return outlinedMat;
  };

  const isEdge = (mat, x, y) => {
    const val = mat[y][x];
    const threshold = 15; // Define a threshold for edge detection
    const neighbors = getNeighborhood(mat, x, y, 1);

    return neighbors.some((n) => Math.abs(n - val) > threshold);
  };

  const displayProcessedMatrix = () => {
    const outputCanvas = canvasRef.current; // Using the same canvas to display the processed image
    if (outputCanvas && processedMatrix.length > 0 && colorPalette.length > 0) {
      const ctx = outputCanvas.getContext("2d");
      ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height); // Clear the canvas before drawing new image
      const imageData = matrixToImageData(processedMatrix, colorPalette);
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const displayImageData = (imageData) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
  };

  const processMatrix = () => {
    if (!matrix.length || !colorPalette.length) {
      console.error("Matrix or color palette is not set.");
      return;
    }
    const imageData = matrixToImageData(matrix, colorPalette);
    displayImageData(imageData);
  };



  return (
    <>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onClick}
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid black",
          cursor: "pointer",
          position: "relative",
        }}
      >
        Drop or click to upload an image
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
          accept="image/*"
        />
        <canvas
          ref={canvasRef}
          style={{
            display: imageLoaded ? "block" : "none",
            maxWidth: "100%",
            maxHeight: "500px",
          }}
        />

        

      </div>

      <div>
        <button id="Matrix to image" onClick={() => processMatrix()}>Proceed Matrix</button>
      </div>
      {/* Additional UI components to display matrix and color palette */}
    </>
  );
};

export default ImageMatrixConverter;
