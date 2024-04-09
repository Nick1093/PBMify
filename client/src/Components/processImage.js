/* eslint-env worker */
// labelLocsWorker.js
importScripts("./lodash"); // If lodash is needed

// Place your computationally intensive functions here, for example, getLabelLocs
const getRegion = (mat, x, y, cov) => {
  const region = { value: mat[y][x], x: [], y: [] };
  const value = mat[y][x];
  const covered = _.cloneDeep(cov);

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

const getLabelLocs = (mat) => {
  console.log("Getting labellocs. This may take a while.");
  let height = mat.length;
  let width = mat[0].length;
  let labelLocs = [];
  let covered = [];
  for (let i = 0; i < height; i++) {
    covered[i] = _.fill(Array(width), false);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // console.log("getLabelLocs pixel loop iteration", testCount, "x:", x, "y:", y);
      if (!covered[y][x]) {
        let region = getRegion(mat, x, y, covered);
        coverRegion(covered, region);
        console.log("Finished covering the regions");
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
  // console.log("Returning labelLocs:", labelLocs);
  return labelLocs;
};

onmessage = function (e) {
  const { mat } = e.data;
  // Compute label locations
  console.log("Received matrix in worker:", mat);
  const labelLocs = getLabelLocs(mat);
  postMessage(labelLocs);
};
