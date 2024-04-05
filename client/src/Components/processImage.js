// ColorUtils.js
import React from 'react';

// Import any necessary libraries for color manipulation
const ColorThief = require('colorthief');

// Function to get the color palette from an image
const getColourPalette = async (imageData) => {
  try {
    const img = new Image();
    img.src = imageData;
    await img.decode(); // Ensure image is fully loaded

    const colorThief = new ColorThief();
    const palette = await colorThief.getPalette(img, 5); // Get palette with 5 colors
    return palette;
  } catch (error) {
    throw new Error("Error getting color palette: " + error.message);
  }
};

export default getColourPalette;

// Takes a 2D matrix (mat) representing the image, coordinates (x and y), and a range value
// Returns array of values from mat that are within the specified range around the coordinate (x and y)
const getVicinVals = (mat, x, y, range ) => {
  const width = mat[0].length;
  const height = mat.length;
  const vicinVals = [];
  for(let xx = x - range; xx <= x + range; xx++) {
    for(let yy = y - range; yy <= y + range; yy++) {
      if (xx >= 0 && xx < width && yy >= 0 && yy < height) {
        vicinVals.push(mat[yy][xx]);
    }
    }
  }

  return vicinVals;
}

const smooth = (mat) => {
  const width = mat[0].length;
    const height = mat.length;
    const simp = [];  // 2D matrix holding simplified image 

    // Initializes the 2D array simp to hold smoothed values
    for (let i = 0; i < height; i++) {
      simp[i] = new Array(width);
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const vicinVals = getVicinVals(mat, x, y, 4);
        const counts = {};
        let maxCount = 0;
        let maxVal;
      }
    }
    return simp;

  }


const neighborsSame = (mat, x, y) => {
  const width = mat[0].length;
  const height = mat.length;
  const val = mat[y][x];
  const xRel = [1, 0];
  const yRel = [0, 1];
  for (let i = 0; i < xRel.length; i++) {
      const xx = x + xRel[i];
      const yy = y + yRel[i];
      if (xx >= 0 && xx < width && yy >= 0 && yy < height) {
          if (mat[yy][xx] !== val) {
              return false;
          }
      }
  }
  return true;
};

const outline = (mat) => {
    const width = mat[0].length;
    const height = mat.length;
    const line = new Array(height).fill(null).map(() => new Array(width).fill(0));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            line[y][x] = neighborsSame(mat, x, y) ? 0 : 1;
        }
    }
    return line;
};


const getRegion = (mat, cov, x, y) => {
  // Custom deep clone for a 2D array instead of using lodash
  const deepClone2DArray = (array) => array.map(arr => [...arr]);
  const covered = deepClone2DArray(cov);

  const region = { value: mat[y][x], x: [], y: [] };
  const value = mat[y][x];

  const queue = [[x, y]];
  while (queue.length > 0) {
    const [currentX, currentY] = queue.shift();

    if (!covered[currentY][currentX] && mat[currentY][currentX] === value) {
      region.x.push(currentX);
      region.y.push(currentY);
      covered[currentY][currentX] = true;

      if (currentX > 0) queue.push([currentX - 1, currentY]);
      if (currentX < mat[0].length - 1) queue.push([currentX + 1, currentY]);
      if (currentY > 0) queue.push([currentX, currentY - 1]);
      if (currentY < mat.length - 1) queue.push([currentX, currentY + 1]);
    }
  }

  return region;
};

// Marks specific cells within the matrix as "covered"
const coverRegion = (covered, region) => {
  for(let i = 0; i < region.x.length; i++) {
    covered[region.y[i]][region.x[i]] = true;
  }
}

//Traverses a matrix starting from specific cell, moving in 
//indicated direction by the increments incX and incY
//Counts number of consecutive cells in given dir
const sameCount = (mat, x, y, incX, incY) => {
  const value = mat[y][x];
  let count = -1;
  while (x >= 0 && x < mat[0].length && y >= 0 && y < mat.length && mat[y][x] === value) {
    count++;
    x += incX;
    y += incY;
  }
  return count;
};

// Finds best location to put the colour label in a given region
const getLabelLoc = (mat, region) => {
  let bestI = 0;
  let best = 0;
  for (let i = 0; i < region.x.length; i++) {
    const goodness = sameCount(mat, region.x[i], region.y[i], -1, 0) *
                     sameCount(mat, region.x[i], region.y[i], 1, 0) *
                     sameCount(mat, region.x[i], region.y[i], 0, -1) *
                     sameCount(mat, region.x[i], region.y[i], 0, 1);
    if (goodness > best) {
      best = goodness;
      bestI = i;
    }
  }
  return {
    value: region.value,
    x: region.x[bestI],
    y: region.y[bestI]
  };
};

// Returns the colour of the first pixel directly below the current one that is 
// a different colour from the current pixel. If all cells below are same
// as region's colour value until the bottom of the matrix, it returns null
const getBelowValue = (mat, region) => {
  let x = region.x[0];
  let y = region.y[0];
  while (y < mat.length && mat[y][x] === region.value) {
    y++;
  }
  // Check if y is within bounds after incrementing
  if (y < mat.length) {
    return mat[y][x];
  } else {
    // Handle cases where no different value is found within the matrix bounds
    return null; // or any other value indicating an out-of-bounds or not found scenario
  }
};


// Removes a colour region to decresae the number of colours. Merges colour regions together.
const removeRegion = (mat, region) => {
  let newValue;
  if (region.y[0] > 0) {
    newValue = mat[region.y[0] - 1][region.x[0]]; // Assumes first pixel in list is topmost then leftmost of region.
  } else {
    newValue = getBelowValue(mat, region); // Use getBelowValue if the region is at the very top.
  }

  for (let i = 0; i < region.x.length; i++) {
    mat[region.y[i]][region.x[i]] = newValue; // Replace each cell in the region with the new value.
  }
};

// Returns a list of all the parts of the mat where a label will be
const getLabelLocs = (mat) => {
  const width = mat[0].length;
  const height = mat.length;
  const covered = new Array(height).fill(null).map(() => new Array(width).fill(false));

  const labelLocs = [];

  // If pixel is uncovered, identify that whole region that it belongs to to section it off
  // Mark the section as covered -> essentially this loop finds uncovered regions
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!covered[y][x]) {
        const region = getRegion(mat, covered, x, y);
        coverRegion(covered, region);
        if (region.x.length > 100) {
          // If region is valid, get best location to put number colour label
          labelLocs.push(getLabelLoc(mat, region));
        } else {
          //If region is too small (<100 cells), remove it and merge with surrounding regions
          removeRegion(mat, region);
        }
      }
    }
  }

  return labelLocs;
};