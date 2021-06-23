"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var bridgesSolver = require("bridges-solver");

function detectBridges(field) {
  if (field === "=" || field === "$") {
    return 2;
  }
  if (field === "-" || field === "|") {
    return 1;
  }
  if (field > 0 && field < 9) {
    return 3;
  }
  return 0;
}

/** Adds bridges to the puzzle. */
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
      if (puzzle[x1][j] === "-" && sign === "-");
      puzzle[x1][j] = sign;
    }
  } else if (y1 === y2) {
    sign = numberOfBridges === 2 ? "$" : "|";
    for (let i = Math.min(x1, x2) + 1; i <= Math.max(x1, x2) - 1; i++) {
      if (puzzle[i][y1] === "$") {
        break;
      }
      if (puzzle[i][y1] === "|" && sign === "|");
      puzzle[i][y1] = sign;
    }
  }
}

function isSpaceAvailable(puzzle, row, col) {
  let rows = puzzle.length;
  let columns = puzzle[0].length;
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

function removeBridges(puzzle) {
  let newPuzzle = JSON.parse(JSON.stringify(puzzle));
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
    })
  );
  return newPuzzle;
}

const { performance } = require("perf_hooks");
/**
 * Generates a random hashi puzzle.
 * @param rows Number of rows.
 * @param columns Number of columns.
 * @param numberOfIslands Number of islands in the puzzle.
 * @param doubleBridges Percentage of double bridges in the generated puzzle.
 * The value must be between 0 and 1.
 * @returns Returns the puzzle as a two-dimensional array.
 */
const generate = (rows, columns, numberOfIslands, doubleBridges = 0.25) => {
  console.log(`generating ${numberOfIslands}`);
  let puzzleGenerated = false;
  let puzzleRetries = 0;
  while (puzzleGenerated === false) {
    puzzleRetries++;
    let genStart = performance.now();
    let puzzle = generateEmptyPuzzle(rows, columns);
    let islands = [];
    let bridges = [];
    puzzleGenerated = fillPuzzleWithIslands(
      rows,
      columns,
      islands,
      numberOfIslands,
      puzzle,
      bridges
    );
    let genEnd = performance.now();
    // console.timeEnd("generation");
    if (!puzzleGenerated) {
      continue;
    }
    let first = JSON.parse(JSON.stringify(puzzle));
    addDoubleBridges(numberOfIslands, doubleBridges, bridges, puzzle);
    // showPuzzle(puzzle);
    // console.time("solving");
    let solveStart = performance.now();
    let result = isPuzzleSolveable(puzzle);
    let solveEnd = performance.now();
    if (!result.solved) {
      // if (!isSolutionCorrect(puzzle, result.solution)) {
      puzzleGenerated = false;
      // console.log(`retry:${puzzleRetries} bridges:${numberOfIslands}`);
      continue;
    }
    return {
      puzzle: removeBridges(puzzle),
      solution: result.solution,
      puzzleRetries,
      genTime: genEnd - genStart,
      solveTime: solveEnd - solveStart
    };
  }
};
function isPuzzleSolveable(puzzle) {
  let emptyPuzzle = removeBridges(puzzle);
  return bridgesSolver.solver(emptyPuzzle);
}
function addDoubleBridges(numberOfIslands, beta, bridges, puzzle) {
  let doubleBridges = Math.floor(numberOfIslands * beta);
  for (let j = 0; j < doubleBridges; j++) {
    let index = Math.floor(Math.random() * bridges.length);
    let [row1, col1, row2, col2] = bridges[index];
    fillPuzzleWithBridge(puzzle, row1, col1, row2, col2, 2);
    puzzle[row1][col1]++;
    puzzle[row2][col2]++;
    bridges.splice(index, 1);
  }
}
function fillPuzzleWithIslands(
  rows,
  columns,
  islands,
  numberOfIslands,
  puzzle,
  bridges
) {
  let [firstRow, firstCol] = generateFirstIsland(rows, columns);
  islands.push({ row: firstRow, col: firstCol });
  let islandsRemaining = numberOfIslands;
  let iterations = 0;
  while (islandsRemaining > 0) {
    iterations++;
    let selected = islands[Math.floor(Math.random() * islands.length)];
    let direction = Math.floor(Math.random() * 4);
    let generated = false;
    switch (direction) {
      case 0:
        generated = tryGeneratingNaighborUp(puzzle, selected, islands, bridges);
        break;
      case 1:
        generated = tryGeneratingNaighborRight(
          puzzle,
          selected,
          islands,
          bridges,
          columns
        );
        break;
      case 2:
        generated = tryGeneratingNaighborDown(
          puzzle,
          selected,
          islands,
          bridges,
          rows
        );
        break;
      case 3:
        generated = tryGeneratingNaighborLeft(
          puzzle,
          selected,
          islands,
          bridges
        );
        break;
      default:
        break;
    }
    if (generated) {
      islandsRemaining--;
    }
    if (iterations > numberOfIslands * 50) {
      return false;
    }
  }
  return true;
}
function generateEmptyPuzzle(rows, columns) {
  return new Array(rows).fill(0).map(x => new Array(columns).fill(0));
}
function generateFirstIsland(rows, columns) {
  let positions = [
    [0, 0],
    [0, columns - 1],
    [rows - 1, columns - 1],
    [rows - 1, 0]
  ];
  return positions[Math.floor(Math.random() * positions.length)];
}
function tryGeneratingNaighborUp(puzzle, selected, islands, bridges) {
  let desiredLocation = Math.max(
    Math.floor(Math.random() * (selected.row - 2)),
    0
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
  }
  if (!bridgeDetected) {
    if (!isSpaceAvailable(puzzle, desiredLocation, selected.col)) {
      return false;
    }
    puzzle[desiredLocation][selected.col] = 1;
    islands.push({ row: desiredLocation, col: selected.col });
    puzzle[selected.row][selected.col]++;
    fillPuzzleWithBridge(
      puzzle,
      selected.row,
      selected.col,
      desiredLocation,
      selected.col
    );
    bridges.push([selected.row, selected.col, desiredLocation, selected.col]);
    return true;
  }
}
function tryGeneratingNaighborRight(
  puzzle,
  selected,
  islands,
  bridges,
  columns
) {
  let desiredLocation = Math.min(
    Math.floor(selected.col + 2 + Math.random() * (columns - selected.col - 2)),
    columns - 1
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
  }
  if (!bridgeDetected) {
    if (!isSpaceAvailable(puzzle, selected.row, desiredLocation)) {
      return false;
    }
    puzzle[selected.row][desiredLocation] = 1;
    islands.push({ row: selected.row, col: desiredLocation });
    puzzle[selected.row][selected.col]++;
    fillPuzzleWithBridge(
      puzzle,
      selected.row,
      selected.col,
      selected.row,
      desiredLocation
    );
    bridges.push([selected.row, selected.col, selected.row, desiredLocation]);
    return true;
  }
}
function tryGeneratingNaighborDown(puzzle, selected, islands, bridges, rows) {
  let desiredLocation = Math.min(
    Math.floor(selected.row + 2 + Math.random() * (rows - selected.row - 2)),
    rows - 1
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
  }
  if (!bridgeDetected) {
    if (!isSpaceAvailable(puzzle, desiredLocation, selected.col)) {
      return false;
    }
    puzzle[desiredLocation][selected.col] = 1;
    islands.push({ row: desiredLocation, col: selected.col });
    puzzle[selected.row][selected.col]++;
    fillPuzzleWithBridge(
      puzzle,
      selected.row,
      selected.col,
      desiredLocation,
      selected.col
    );
    bridges.push([selected.row, selected.col, desiredLocation, selected.col]);
    return true;
  }
}
function tryGeneratingNaighborLeft(puzzle, selected, islands, bridges) {
  let desiredLocation = Math.max(
    Math.floor(Math.random() * (selected.col - 2)),
    0
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
  }
  if (!bridgeDetected) {
    if (!isSpaceAvailable(puzzle, selected.row, desiredLocation)) {
      return false;
    }
    puzzle[selected.row][desiredLocation] = 1;
    islands.push({ row: selected.row, col: desiredLocation });
    puzzle[selected.row][selected.col]++;
    fillPuzzleWithBridge(
      puzzle,
      selected.row,
      selected.col,
      selected.row,
      desiredLocation
    );
    bridges.push([selected.row, selected.col, selected.row, desiredLocation]);
    return true;
  }
}

exports.generate = generate;
