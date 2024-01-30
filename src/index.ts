import { solver } from "bridges-solver";
import { detectBridges } from "./detectBridges";
import { EmptyPuzzle } from "./emptyPuzzle";
import { fillPuzzleWithBridge } from "./fillPuzzleWithBridge";
import { isSpaceAvailable } from "./isSpaceAvailable";
import { removeBridges } from "./removeBridges";

export type GeneratedPuzzle = {
  puzzle: number[][];
  solution: string[][];
};

/**
 * Generates a random hashi puzzle.
 * @param rows Number of rows.
 * @param columns Number of columns.
 * @param numberOfIslands Number of islands in the puzzle.
 * @param doubleBridges Percentage of double bridges in the generated puzzle.
 * The value must be between 0 and 1.
 * @returns Returns the puzzle as a two-dimensional array.
 */
export const generate = (
  rows: number,
  columns: number,
  numberOfIslands: number,
  doubleBridges = 0.25,
): GeneratedPuzzle => {
  let puzzleGenerated = false;
  while (puzzleGenerated === false) {
    const puzzle = generateEmptyPuzzle(rows, columns);

    const islands: { row: number; col: number }[] = [];
    const bridges: [number, number, number, number][] = [];

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

    // showPuzzle(puzzle);

    const result = isPuzzleSolvable(puzzle);

    if (!result.solved || !result.solution || result.multipleSolutions) {
      puzzleGenerated = false;
      continue;
    }

    return {
      puzzle: removeBridges(puzzle) as number[][],
      solution: result.solution,
    } satisfies GeneratedPuzzle;
  }

  return {} as GeneratedPuzzle;
};

function isPuzzleSolvable(puzzle: EmptyPuzzle) {
  const emptyPuzzle = removeBridges(puzzle);
  return solver(emptyPuzzle);
}

function addDoubleBridges(
  numberOfIslands: number,
  beta: number,
  bridges: [number, number, number, number][],
  puzzle: EmptyPuzzle,
) {
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
  rows: number,
  columns: number,
  islands: { row: number; col: number }[],
  numberOfIslands: number,
  puzzle: EmptyPuzzle,
  bridges: [number, number, number, number][],
) {
  const [firstRow, firstCol] = generateFirstIsland(rows, columns);
  islands.push({ row: firstRow, col: firstCol });

  let islandsRemaining = numberOfIslands;
  // Decrease the number of islands by one because the first island is already generated.
  islandsRemaining--;

  let iterations = 0;
  while (islandsRemaining > 0) {
    iterations++;

    const selected = islands[Math.floor(Math.random() * islands.length)];

    const direction = Math.floor(Math.random() * 4);

    let generated: boolean | undefined = false;
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

    if (generated) {
      islandsRemaining--;
    }

    if (iterations > numberOfIslands * 100) {
      return false;
    }
  }

  return true;
}

function generateEmptyPuzzle(rows: number, columns: number): EmptyPuzzle {
  return new Array(rows).fill(0).map((x) => new Array(columns).fill(0));
}

function generateFirstIsland(rows: number, columns: number) {
  const row = Math.floor(Math.random() * rows);
  const column = Math.floor(Math.random() * columns);
  return [row, column];
}

function tryGeneratingNeighborUp(
  puzzle: EmptyPuzzle,
  selected: { row: number; col: number },
  islands: { row: number; col: number }[],
  bridges: [number, number, number, number][],
): boolean | undefined {
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
      selected.col,
    );
    bridges.push([selected.row, selected.col, desiredLocation, selected.col]);

    return true;
  }
}
function tryGeneratingNeighborRight(
  puzzle: EmptyPuzzle,
  selected: { row: number; col: number },
  islands: { row: number; col: number }[],
  bridges: [number, number, number, number][],
  columns: number,
): boolean | undefined {
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
      desiredLocation,
    );
    bridges.push([selected.row, selected.col, selected.row, desiredLocation]);

    return true;
  }
}

function tryGeneratingNeighborDown(
  puzzle: EmptyPuzzle,
  selected: { row: number; col: number },
  islands: { row: number; col: number }[],
  bridges: [number, number, number, number][],
  rows: number,
): boolean | undefined {
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
      selected.col,
    );
    bridges.push([selected.row, selected.col, desiredLocation, selected.col]);

    return true;
  }
}

function tryGeneratingNeighborLeft(
  puzzle: EmptyPuzzle,
  selected: { row: number; col: number },
  islands: { row: number; col: number }[],
  bridges: [number, number, number, number][],
): boolean | undefined {
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
      desiredLocation,
    );
    bridges.push([selected.row, selected.col, selected.row, desiredLocation]);

    return true;
  }
}
