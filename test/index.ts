import { generate } from "../src";
import { showPuzzle } from "../src/showPuzzle";

const columns = 10;
const rows = 10;
const islands = 20;
const result = generate(rows, columns, islands);

if (result) {
  console.log(
    `Generated a C:${columns} by R:${rows} puzzle with ${islands} islands`,
  );
  showPuzzle(result.solution);
}
