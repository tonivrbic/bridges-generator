export function showPuzzle(puzzle: string[][]) {
  const rows = puzzle.length;
  const columns = puzzle[0].length;

  console.log("----------------------------------");
  const display: string[] = [];
  for (const row of puzzle) {
    display.push(" ".repeat(columns));
  }
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
  for (const row of display) {
    console.log(row);
  }
  console.log("----------------------------------");
  return display;
}
