/**
 * Generates a random hashi puzzle.
 * @param rows Number of rows.
 * @param columns Number of columns.
 * @param numberOfIslands Number of islands in the puzzle.
 * @param doubleBridges Percentage of double bridges in the generated puzzle.
 * The value must be between 0 and 1.
 * @returns Returns the puzzle as a two-dimensional array.
 */
declare const generate: (
  rows: number,
  columns: number,
  numberOfIslands: number,
  doubleBridges?: number
) => {
  puzzle: number[][];
  solution: string[][];
  puzzleRetries: number;
};

export { generate };
