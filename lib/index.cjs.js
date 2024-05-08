"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  generate: () => generate,
});
module.exports = __toCommonJS(src_exports);
var import_bridges_solver = require("bridges-solver");

// src/detectBridges.ts
function detectBridges(field) {
  if (field === "=" || field === "$") {
    return 2;
  }
  if (field === "-" || field === "|") {
    return 1;
  }
  if (typeof field === "number" && field > 0 && field < 9) {
    return 3;
  }
  return 0;
}

// src/fillPuzzleWithBridge.ts
function fillPuzzleWithBridge(puzzle, x1, y1, x2, y2, numberOfBridges = 1) {
  if (numberOfBridges === 0) {
    return;
  }
  let sign = "";
  if (x1 === x2) {
    sign = numberOfBridges === 2 ? "=" : "-";
    for (let j = Math.min(y1, y2) + 1; j <= Math.max(y1, y2) - 1; j++) {
      if (puzzle[x1][j] === "=") {
        break;
      }
      if (puzzle[x1][j] === "-" && sign === "-") {
      }
      puzzle[x1][j] = sign;
    }
  } else if (y1 === y2) {
    sign = numberOfBridges === 2 ? "$" : "|";
    for (let i = Math.min(x1, x2) + 1; i <= Math.max(x1, x2) - 1; i++) {
      if (puzzle[i][y1] === "$") {
        break;
      }
      if (puzzle[i][y1] === "|" && sign === "|") {
      }
      puzzle[i][y1] = sign;
    }
}

// src/isSpaceAvailable.ts
function isSpaceAvailable(puzzle, row, col) {
  const rows = puzzle.length;
  const columns = puzzle[0].length;
  if (row > 0 && puzzle[row - 1][col] > 0) {
    return false;
  }
  if (row + 1 < rows && puzzle[row + 1][col] > 0) {
    return false;
  }
  if (col > 0 && puzzle[row][col - 1] > 0) {
    return false;
  }
  if (col + 1 < columns && puzzle[row][col + 1] > 0) {
    return false;
  }
  return true;
}

// src/removeBridges.ts
function removeBridges(puzzle) {
  const newPuzzle = JSON.parse(JSON.stringify(puzzle));
  newPuzzle.forEach((row, i) =>
    row.forEach((field, j) => {
      switch (field) {
        case "-":
        case "=":
        case "|":
        case "$":
          newPuzzle[i][j] = 0;
          break;
        default:
          break;
      }
    }),
  );
  return newPuzzle;
}

// src/index.ts
var generate = (rows, columns, numberOfIslands, doubleBridges = 0.25) => {
  let puzzleGenerated = false;
  while (puzzleGenerated === false) {
    const puzzle = generateEmptyPuzzle(rows, columns);
    const islands = [];
    const bridges = [];
    puzzleGenerated = fillPuzzleWithIslands(
      rows,
      columns,
      islands,
      numberOfIslands,
      puzzle,
      bridges,
    );
    if (!puzzleGenerated) {
      continue;
    }
    addDoubleBridges(numberOfIslands, doubleBridges, bridges, puzzle);
    const result = isPuzzleSolvable(puzzle);
    if (!result.solved || !result.solution || result.multipleSolutions) {
      puzzleGenerated = false;
      continue;
    }
    return {
      puzzle: removeBridges(puzzle),
      solution: result.solution,
    };
  }
  return {};
};
function isPuzzleSolvable(puzzle) {
  const emptyPuzzle = removeBridges(puzzle);
  return (0, import_bridges_solver.solver)(emptyPuzzle);
}
function addDoubleBridges(numberOfIslands, beta, bridges, puzzle) {
  const doubleBridges = Math.floor(numberOfIslands * beta);
  for (let i = 0; i < doubleBridges; i++) {
    const index = Math.floor(Math.random() * bridges.length);
    const [row1, col1, row2, col2] = bridges[index];
    fillPuzzleWithBridge(puzzle, row1, col1, row2, col2, 2);
    puzzle[row1][col1]++;
    puzzle[row2][col2]++;
    bridges.splice(i, 1);
  }
}
function fillPuzzleWithIslands(
  rows,
  columns,
  islands,
  numberOfIslands,
  puzzle,
  bridges,
) {
  const [firstRow, firstCol] = generateFirstIsland(rows, columns);
  islands.push({ row: firstRow, col: firstCol });
  let islandsRemaining = numberOfIslands;
  islandsRemaining--;
  let iterations = 0;
  while (islandsRemaining > 0) {
    iterations++;
    const selected = islands[Math.floor(Math.random() * islands.length)];
    const direction = Math.floor(Math.random() * 4);
    let generated = false;
    switch (direction) {
      case 0:
        generated = tryGeneratingNeighborUp(puzzle, selected, islands, bridges);
        break;
      case 1:
        generated = tryGeneratingNeighborRight(
          puzzle,
          selected,
          islands,
          bridges,
          columns,
        );
        break;
      case 2:
        generated = tryGeneratingNeighborDown(
          puzzle,
          selected,
          islands,
          bridges,
          rows,
        );
        break;
      case 3:
        generated = tryGeneratingNeighborLeft(
          puzzle,
          selected,
          islands,
          bridges,
        );
        break;
      default:
        break;
    }
    return true;
}
function generateEmptyPuzzle(rows, columns) {
  return new Array(rows).fill(0).map((x) => new Array(columns).fill(0));
}
function generateFirstIsland(rows, columns) {
  const row = Math.floor(Math.random() * rows);
  const column = Math.floor(Math.random() * columns);
  return [row, column];
}
function tryGeneratingNeighborUp(puzzle, selected, islands, bridges) {
  const desiredLocation = Math.max(
    Math.floor(Math.random() * (selected.row - 2)),
    0,
  );
  let bridgeDetected = false;
  if (selected.row - 2 < desiredLocation) {
    return false;
  }
  for (let row = selected.row - 1; row >= desiredLocation; row--) {
    if (detectBridges(puzzle[row][selected.col]) > 0) {
      bridgeDetected = true;
      break;
    }
    for (let row = selected.row - 1; row >= desiredLocation; row--) {
        if (detectBridges(puzzle[row][selected.col]) > 0) {
            bridgeDetected = true;
            break;
        }
    }
    if (!bridgeDetected) {
        if (!isSpaceAvailable(puzzle, desiredLocation, selected.col)) {
            return false;
        }
        puzzle[desiredLocation][selected.col] = 1;
        islands.push({ row: desiredLocation, col: selected.col });
        puzzle[selected.row][selected.col]++;
        fillPuzzleWithBridge(puzzle, selected.row, selected.col, desiredLocation, selected.col);
        bridges.push([selected.row, selected.col, desiredLocation, selected.col]);
        return true;
    }
    puzzle[desiredLocation][selected.col] = 1;
    islands.push({ row: desiredLocation, col: selected.col });
    puzzle[selected.row][selected.col]++;
    fillPuzzleWithBridge(
      puzzle,
      selected.row,
      selected.col,
      desiredLocation,
      selected.col,
    );
    bridges.push([selected.row, selected.col, desiredLocation, selected.col]);
    return true;
  }
}
function tryGeneratingNeighborRight(
  puzzle,
  selected,
  islands,
  bridges,
  columns,
) {
  const desiredLocation = Math.min(
    Math.floor(selected.col + 2 + Math.random() * (columns - selected.col - 2)),
    columns - 1,
  );
  let bridgeDetected = false;
  if (selected.col + 2 > desiredLocation) {
    return false;
  }
  for (let col = selected.col + 1; col <= desiredLocation; col++) {
    if (detectBridges(puzzle[selected.row][col]) > 0) {
      bridgeDetected = true;
      break;
    }
    for (let col = selected.col + 1; col <= desiredLocation; col++) {
        if (detectBridges(puzzle[selected.row][col]) > 0) {
            bridgeDetected = true;
            break;
        }
    }
    if (!bridgeDetected) {
        if (!isSpaceAvailable(puzzle, selected.row, desiredLocation)) {
            return false;
        }
        puzzle[selected.row][desiredLocation] = 1;
        islands.push({ row: selected.row, col: desiredLocation });
        puzzle[selected.row][selected.col]++;
        fillPuzzleWithBridge(puzzle, selected.row, selected.col, selected.row, desiredLocation);
        bridges.push([selected.row, selected.col, selected.row, desiredLocation]);
        return true;
    }
    puzzle[selected.row][desiredLocation] = 1;
    islands.push({ row: selected.row, col: desiredLocation });
    puzzle[selected.row][selected.col]++;
    fillPuzzleWithBridge(
      puzzle,
      selected.row,
      selected.col,
      selected.row,
      desiredLocation,
    );
    bridges.push([selected.row, selected.col, selected.row, desiredLocation]);
    return true;
  }
}
function tryGeneratingNeighborDown(puzzle, selected, islands, bridges, rows) {
  const desiredLocation = Math.min(
    Math.floor(selected.row + 2 + Math.random() * (rows - selected.row - 2)),
    rows - 1,
  );
  let bridgeDetected = false;
  if (selected.row + 2 > desiredLocation) {
    return false;
  }
  for (let row = selected.row + 1; row <= desiredLocation; row++) {
    if (detectBridges(puzzle[row][selected.col]) > 0) {
      bridgeDetected = true;
      break;
    }
    for (let row = selected.row + 1; row <= desiredLocation; row++) {
        if (detectBridges(puzzle[row][selected.col]) > 0) {
            bridgeDetected = true;
            break;
        }
    }
    if (!bridgeDetected) {
        if (!isSpaceAvailable(puzzle, desiredLocation, selected.col)) {
            return false;
        }
        puzzle[desiredLocation][selected.col] = 1;
        islands.push({ row: desiredLocation, col: selected.col });
        puzzle[selected.row][selected.col]++;
        fillPuzzleWithBridge(puzzle, selected.row, selected.col, desiredLocation, selected.col);
        bridges.push([selected.row, selected.col, desiredLocation, selected.col]);
        return true;
    }
    puzzle[desiredLocation][selected.col] = 1;
    islands.push({ row: desiredLocation, col: selected.col });
    puzzle[selected.row][selected.col]++;
    fillPuzzleWithBridge(
      puzzle,
      selected.row,
      selected.col,
      desiredLocation,
      selected.col,
    );
    bridges.push([selected.row, selected.col, desiredLocation, selected.col]);
    return true;
  }
}
function tryGeneratingNeighborLeft(puzzle, selected, islands, bridges) {
  const desiredLocation = Math.max(
    Math.floor(Math.random() * (selected.col - 2)),
    0,
  );
  let bridgeDetected = false;
  if (selected.col - 2 < desiredLocation) {
    return false;
  }
  for (let col = selected.col - 1; col >= desiredLocation; col--) {
    if (detectBridges(puzzle[selected.row][col]) > 0) {
      bridgeDetected = true;
      break;
    }
    for (let col = selected.col - 1; col >= desiredLocation; col--) {
        if (detectBridges(puzzle[selected.row][col]) > 0) {
            bridgeDetected = true;
            break;
        }
    }
    if (!bridgeDetected) {
        if (!isSpaceAvailable(puzzle, selected.row, desiredLocation)) {
            return false;
        }
        puzzle[selected.row][desiredLocation] = 1;
        islands.push({ row: selected.row, col: desiredLocation });
        puzzle[selected.row][selected.col]++;
        fillPuzzleWithBridge(puzzle, selected.row, selected.col, selected.row, desiredLocation);
        bridges.push([selected.row, selected.col, selected.row, desiredLocation]);
        return true;
    }
    puzzle[selected.row][desiredLocation] = 1;
    islands.push({ row: selected.row, col: desiredLocation });
    puzzle[selected.row][selected.col]++;
    fillPuzzleWithBridge(
      puzzle,
      selected.row,
      selected.col,
      selected.row,
      desiredLocation,
    );
    bridges.push([selected.row, selected.col, selected.row, desiredLocation]);
    return true;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    generate,
  });
