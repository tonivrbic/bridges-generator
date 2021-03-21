import { solver } from "bridges-solver";
import { detectBridges } from "./detectBridges";
import { fillPuzzleWithBridge } from "./fillPuzzleWithBridge";
import { isSpaceAvailable } from "./isSpaceAvailable";
import { removeBridges } from "./removeBridges";
import { showPuzzle } from "./showPuzzle";

export const generate = (
  rows: number,
  columns: number,
  numberOfIslands: number
) => {
  let beta = 0.25;
  let puzzle = generateEmptyPuzzle(rows, columns);

  let islands: { row: number; col: number }[] = [];
  let bridges: [number, number, number, number][] = [];

  fillPuzzleWithIslands(
    rows,
    columns,
    islands,
    numberOfIslands,
    puzzle,
    bridges
  );

  addDoubleBridges(numberOfIslands, beta, bridges, puzzle);

  showPuzzle(puzzle);

  isPuzzleSolveable(puzzle);
};

function isPuzzleSolveable(puzzle: any[][]) {
  let emptyPuzzle = removeBridges(puzzle);
  let result = solver(emptyPuzzle);
  console.log(result.solved);
}

function addDoubleBridges(
  numberOfIslands: number,
  beta: number,
  bridges: [number, number, number, number][],
  puzzle: any[][]
) {
  let doubleBridges = Math.floor(numberOfIslands * beta);

  for (let i = 0; i < doubleBridges; i++) {
    let index = Math.floor(Math.random() * bridges.length);
    let [row1, col1, row2, col2] = bridges[index];

    fillPuzzleWithBridge(puzzle, row1, col1, row2, col2, 2);
    puzzle[row1][col1]++;
    puzzle[row2][col2]++;
    bridges.splice(i, 1);
  }
}

function fillPuzzleWithIslands(
  rows: number,
  columns: number,
  islands: { row: number; col: number }[],
  numberOfIslands: number,
  puzzle: any[][],
  bridges: [number, number, number, number][]
) {
  let [firstRow, firstCol] = generateFirstIsland(rows, columns);
  islands.push({ row: firstRow, col: firstCol });

  let islandsRemaining = numberOfIslands;
  while (islandsRemaining > 0) {
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
  }
}

function generateEmptyPuzzle(rows: number, columns: number): any[][] {
  return new Array(rows).fill(0).map(x => new Array(columns).fill(0));
}

function generateFirstIsland(rows: number, columns: number) {
  let row = Math.floor(Math.random() * rows);
  let column = Math.floor(Math.random() * columns);
  return [row, column];
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
  puzzle: any[][],
  selected: any,
  islands: any[],
  bridges: any[],
  columns: number
): boolean {
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

function tryGeneratingNaighborDown(
  puzzle: any[][],
  selected: any,
  islands: any[],
  bridges: any[],
  rows: number
): boolean {
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

function tryGeneratingNaighborLeft(
  puzzle: any[][],
  selected: any,
  islands: any[],
  bridges: any[]
): boolean {
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
