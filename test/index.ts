import { generate } from "../src";

let timings = [];
for (let index = 0; index < 25; index++) {
  // console.time("all");
  // console.log(`generating ${index}`);
  let result = generate(15, 15, 15, 0.35);
  timings.push({ gen: result.genTime, solve: result.solveTime });
  console.log(
    `[${index}] solved = ${result.solveTime}ms gen=${result.genTime}ms retries=${result.puzzleRetries}`
  );
  // console.timeEnd("all");
  // console.log("retries", result.puzzleRetries);
}
// showPuzzle(result.solution);
// console.table(timings);
