export function removeBridges(puzzle: any[][]) {
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
