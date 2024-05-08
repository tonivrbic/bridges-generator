export function isSpaceAvailable(puzzle: number[][], row: number, col: number) {
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
