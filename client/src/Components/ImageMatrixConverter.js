/**
 * VERY IMPORTANT COMMENT: A LOT OF THE FUNCTIONS HERE ARE REDUNDANT, I DON'T KNOW WHY THEY COPIED ONTO HERE BUT THE ONES THAT ARE 
 * RUNNING ARE IN USERINTERFACE.JS. EXAMPLES: getRegion, outline, neighborsSame, coveredRegion, etc.
 */
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

  return imageData;
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
}

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
  
}

const getRegion = (mat, x, y, cov) => {
  const covered = cov.map(row => [...row]);
  const region = {value: mat[y][x], x: [], y: []};
  const value = mat[y][x];

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
}

const getBelowValue = (mat, region) => {
  let x = region.x[0];
  let y = region.y[0];
  while (mat[y][x] === region.value) {
      y++;
  }
  return mat[y][x];
}

const removeRegion = (mat, region) => {
  console.log("REGION REMOVED:", region);
  let newValue
  if (region.y[0] > 0) {
    newValue = mat[region.y[0] - 1][region.x[0]]; // assumes first pixel in list is topmost then leftmost of region.
  } else {
    newValue = getBelowValue(mat, region);
  }
  for (let i = 0; i < region.x.length; i++) {
    mat[region.y[i]][region.x[i]] = newValue;
  }
}

const coverRegion = (covered, region) => {
  for(let i = 0; i < region.x.length; i++) {
    const x = region.x[i];
    const y = region.y[i];
    if(covered[y] !== undefined && covered[y][x] !== undefined) {
      covered[y][x] = true;
    } else {
      console.error('covered[y] or covered[x] is undefined!!');
    }
  }
};

const getLabelLocs = (mat) => {
  let height = mat.length;
  let width = mat[0].length;
  let covered = Array.from({ length: height }, () => Array(width).fill(false));
  let labelLocs = [];
  let testCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      console.log("getLabelLocs pixel loop iteration", testCount, "x:", x, "y:", y);
      if (!covered[y][x]) {
        let region = getRegion(mat, x, y, covered);
        coverRegion(covered, region);
        if (region.x.length > 100) {
          // Threshold for size
          let labelLoc = {x: region.x[0] + 10, y: region.y[0] + 10, value: region.value}; // For simplicity, choose the 10th pixel (adds some padding)
          labelLocs.push(labelLoc);
          console.log("Successful location label:", labelLoc);
        } else {
          console.log("Too small, removing region.")
          removeRegion(mat, region);
        }
      } else {
        console.log('The pixel is already covered.');
      }
      testCount = testCount + 1;
    }
  }
  console.log("Returning labelLocs:", labelLocs);
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
          console.log("Smoothed matrix: YEEHAW", smoothedMatrix);

          const outlinedMatrix = outline(smoothedMatrix);
          setProcessedMatrix(outlinedMatrix);

          let covered = Array.from({ length: rawMatrix.length }, () =>
            Array(rawMatrix[0].length).fill(false)
          );
          let labelLocs = getLabelLocs(smoothedMatrix, covered);

          // Now you can use `labelLocs` for further processing or visualization
          console.log("Label locations:", labelLocs);
          setProcessedMatrix(outlinedMatrix);

          console.log("Outlined matrix:", outlinedMatrix);
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

  // const outline = (mat) => {
  //   const height = mat.length;
  //   const width = mat[0].length;
  //   const outlinedMat = new Array(height)
  //     .fill(null)
  //     .map(() => new Array(width).fill(0));

  //   for (let y = 0; y < height; y++) {
  //     for (let x = 0; x < width; x++) {
  //       // Simple edge detection by comparing the pixel value to its neighbors
  //       outlinedMat[y][x] = isEdge(mat, x, y) ? 255 : 0; // Edge marked with 255
  //     }
  //   }
  //   return outlinedMat;
  // };

  // const isEdge = (mat, x, y) => {
  //   const val = mat[y][x];
  //   const threshold = 15; // Define a threshold for edge detection
  //   const neighbors = getNeighborhood(mat, x, y, 1);

  //   return neighbors.some((n) => Math.abs(n - val) > threshold);
  // };

  const displayProcessedMatrix = () => {
    const outputCanvas = canvasRef.current; // Using the same canvas to display the processed image
    if (outputCanvas && processedMatrix.length > 0 && colorPalette.length > 0) {
      const ctx = outputCanvas.getContext("2d");
      ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height); // Clear the canvas before drawing new image
      const imageData = matrixToImageData(processedMatrix, colorPalette);
      ctx.putImageData(imageData, 0, 0);
    }
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
      {/* Additional UI components to display matrix and color palette */}
    </>
  );
};

export default ImageMatrixConverter;
