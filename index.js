let rows = 15;
let columns = 15;
let n = 32;
let beta = 0.25;
let islandsRemaining = n;

let puzzle = new Array(rows).fill(0).map((x) => new Array(columns).fill(0));

let firstRow = Math.floor(Math.random() * rows);
let firstCol = Math.floor(Math.random() * columns);

let islands = [];
let bridges = [];
islands.push({ row: firstRow, col: firstCol });

while (islandsRemaining > 0) {
  let selected = islands[Math.floor(Math.random() * islands.length)];

  let direction = Math.floor(Math.random() * 4);

  // top
  if (direction === 0) {
    let desiredLocation = Math.max(
      Math.floor(Math.random() * (selected.row - 2)),
      0
    );

    let bridgeDetected = false;
    if (selected.row - 2 < desiredLocation) {
      continue;
    }

    for (let row = selected.row - 1; row >= desiredLocation; row--) {
      if (detectBridges(puzzle[row][selected.col]) > 0) {
        bridgeDetected = true;
        break;
      }
    }
    if (!bridgeDetected) {
      if (!isSpaceAvailable(puzzle, desiredLocation, selected.col)) {
        continue;
      }

      puzzle[desiredLocation][selected.col] = 1;
      islands.push({ row: desiredLocation, col: selected.col });
      puzzle[selected.row][selected.col]++;
      islandsRemaining--;
      fillPuzzleWithBridge(
        puzzle,
        selected.row,
        selected.col,
        desiredLocation,
        selected.col
      );
      bridges.push([selected.row, selected.col, desiredLocation, selected.col]);
    }
  }

  // bottom
  if (direction === 2) {
    let desiredLocation = Math.min(
      Math.floor(selected.row + 2 + Math.random() * (rows - selected.row - 2)),
      rows - 1
    );

    let bridgeDetected = false;
    if (selected.row + 2 > desiredLocation) {
      continue;
    }

    for (let row = selected.row + 1; row <= desiredLocation; row++) {
      if (detectBridges(puzzle[row][selected.col]) > 0) {
        bridgeDetected = true;
        break;
      }
    }
    if (!bridgeDetected) {
      if (!isSpaceAvailable(puzzle, desiredLocation, selected.col)) {
        continue;
      }

      puzzle[desiredLocation][selected.col] = 1;
      islands.push({ row: desiredLocation, col: selected.col });
      puzzle[selected.row][selected.col]++;
      islandsRemaining--;
      fillPuzzleWithBridge(
        puzzle,
        selected.row,
        selected.col,
        desiredLocation,
        selected.col
      );
      bridges.push([selected.row, selected.col, desiredLocation, selected.col]);
    }
  }

  // left
  if (direction === 3) {
    let desiredLocation = Math.max(
      Math.floor(Math.random() * (selected.col - 2)),
      0
    );

    let bridgeDetected = false;
    if (selected.col - 2 < desiredLocation) {
      continue;
    }

    for (let col = selected.col - 1; col >= desiredLocation; col--) {
      if (detectBridges(puzzle[selected.row][col]) > 0) {
        bridgeDetected = true;
        break;
      }
    }
    if (!bridgeDetected) {
      if (!isSpaceAvailable(puzzle, selected.row, desiredLocation)) {
        continue;
      }

      puzzle[selected.row][desiredLocation] = 1;
      islands.push({ row: selected.row, col: desiredLocation });

      puzzle[selected.row][selected.col]++;
      islandsRemaining--;
      fillPuzzleWithBridge(
        puzzle,
        selected.row,
        selected.col,
        selected.row,
        desiredLocation
      );
      bridges.push([selected.row, selected.col, selected.row, desiredLocation]);
    }
  }

  // right
  if (direction === 1) {
    let desiredLocation = Math.min(
      Math.floor(selected.col + 2 + Math.random() * (rows - selected.col - 2)),
      columns - 1
    );

    let bridgeDetected = false;
    if (selected.col + 2 > desiredLocation) {
      continue;
    }

    for (let col = selected.col + 1; col <= desiredLocation; col++) {
      if (detectBridges(puzzle[selected.row][col]) > 0) {
        bridgeDetected = true;
        break;
      }
    }
    if (!bridgeDetected) {
      if (!isSpaceAvailable(puzzle, selected.row, desiredLocation)) {
        continue;
      }

      puzzle[selected.row][desiredLocation] = 1;
      islands.push({ row: selected.row, col: desiredLocation });

      puzzle[selected.row][selected.col]++;
      islandsRemaining--;
      fillPuzzleWithBridge(
        puzzle,
        selected.row,
        selected.col,
        selected.row,
        desiredLocation
      );
      bridges.push([selected.row, selected.col, selected.row, desiredLocation]);
    }
  }
}

let doubleBridges = Math.floor(n * beta);

for (let i = 0; i < doubleBridges; i++) {
  let index = Math.floor(Math.random() * bridges.length);
  let [row1, col1, row2, col2] = bridges[index];

  fillPuzzleWithBridge(puzzle, row1, col1, row2, col2, 2);
  puzzle[row1][col1]++;
  puzzle[row2][col2]++;
  bridges.splice(i, 1);
}

showPuzzle(puzzle);

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

function isSpaceAvailable(puzzle, row, col) {
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
/** Adds bridges to the puzzle. */
function fillPuzzleWithBridge(puzzle, x1, y1, x2, y2, numberOfBridges) {
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
        // sign = "=";
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
        // sign = "$";
      }
      puzzle[i][y1] = sign;
    }
  }
}

function showPuzzle(puzzle) {
  console.log("----------------------------------");
  const display = [];
  puzzle.forEach((row) => display.push(" ".repeat(columns)));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (
        (puzzle[i][j] > "0" && puzzle[i][j] < "9") ||
        puzzle[i][j] === "=" ||
        puzzle[i][j] === "-" ||
        puzzle[i][j] === "$" ||
        puzzle[i][j] === "|"
      ) {
        // place value inside string at correct position
        display[i] =
          display[i].slice(0, j) +
          puzzle[i][j] +
          display[i].slice(j + 1, columns);
      }
    }
  }
  display.forEach((row) => console.log(row));
  console.log("----------------------------------");
  return display;
}
