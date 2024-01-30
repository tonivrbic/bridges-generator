import { EmptyPuzzle } from "./emptyPuzzle";

export function removeBridges(puzzle: (string | number)[][]): EmptyPuzzle {
  const newPuzzle = JSON.parse(JSON.stringify(puzzle)) as typeof puzzle;

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

  return newPuzzle as EmptyPuzzle;
}
