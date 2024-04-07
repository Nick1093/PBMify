import React, { useState, useEffect } from 'react';
import _ from 'lodash';

function ProcessImage(mat) {
    const [processedMat, setProcessedMat] = useState(null);
    const [labelLocs, setLabelLocs] = useState([]);
    const [matLine, setMatLine] = useState(null);

    useEffect(() => {
        if (mat) {
            processMat(mat);
        }
    }, [mat]);

    function getVicinVals(mat, x, y, range) {
        const width = mat[0].length;
        const height = mat.length;
        const vicinVals = [];
        for (let xx = x - range; xx <= x + range; xx++) {
            for (let yy = y - range; yy <= y + range; yy++) {
                if (xx >= 0 && xx < width && yy >= 0 && yy < height) {
                    vicinVals.push(mat[yy][xx]);
                }
            }
        }
        return vicinVals;
    };

    function smooth(mat) {
        const width = mat[0].length;
        const height = mat.length;
        const simp = [];
        for (let i = 0; i < height; i++) {
            simp[i] = new Array(width);
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const vicinVals = getVicinVals(mat, x, y, 4);
                simp[y][x] = Number(_.chain(vicinVals).countBy().toPairs().maxBy(_.last).head().value());
            }
        }
        return simp;
    };

    function neighborsSame(mat, x, y) {
        const width = mat[0].length;
        const height = mat.length;
        const val = mat[y][x];
        const xRel = [1, 0];
        const yRel = [0, 1];
        for (let i = 0; i < xRel.length; i++) {
            const xx = x + xRel[i];
            const yy = y + yRel[i];
            if (xx >= 0 && xx < width && yy >= 0 && yy < height) {
                if (mat[yy][xx] != val) {
                    return false;
                }
            }
        }
        return true;
    };

    function outline(mat) {
        const width = mat[0].length;
        const height = mat.length;
        const line = [];
        for (let i = 0; i < height; i++) {
            line[i] = new Array(width);
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                line[y][x] = neighborsSame(mat, x, y) ? 0 : 1;
            }
        }
        return line;
    };

    function getRegion(mat, covered, x, y) {
        const width = mat[0].length;
        const height = mat.length;
        const region = { value: mat[y][x], x: [], y: [] };
        const value = mat[y][x];
        const queue = [[x, y]];
        while (queue.length > 0) {
            const [currX, currY] = queue.shift();
            if (!covered[currY][currX] && mat[currY][currX] === value) {
                region.x.push(currX);
                region.y.push(currY);
                covered[currY][currX] = true;
                [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
                    const nextX = currX + dx, nextY = currY + dy;
                    if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height) {
                        queue.push([nextX, nextY]);
                    }
                });
            }
        }
        return region;
    }
    

    function processMat(mat) {
        const width = mat[0].length;
        const height = mat.length;
        const covered = Array.from({ length: height }, () => Array(width).fill(false));

        const matSmooth = smooth(mat);
        const matLine = outline(matSmooth);

        const labelLocs = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (!covered[y][x]) {
                    const region = getRegion(matSmooth, covered, x, y);
                    if (region.x.length > 100) { // example threshold
                        labelLocs.push({ value: region.value, x: region.x[0], y: region.y[0] }); // simplified
                    }
                }
            }
        }

        setProcessedMat(matSmooth);
        setLabelLocs(labelLocs);
        setMatLine(matLine);
    };
};

export default ProcessImage;