import { generate } from "../src";
const fs = require("fs");

let timings = [];
let easy = 50;
let medium = 23;
let hard = 50;
// while (easy < 50 || medium < 50 || hard < 50) {
// for (let index = 0; index < 25; index++) {
// console.time("all");
// console.log(`generating ${index}`);
// let result = generate(15, 9, 27 + Math.floor(Math.random() * 5), 0.55);
// timings.push({ gen: result.genTime, solve: result.solveTime });
// console.log(
//   `[${index}] solved = ${result.solveTime}ms gen=${result.genTime}ms retries=${result.puzzleRetries}`
// );
// showPuzzle(result.solution);
// console.log(`solved in ${result.solveTime} retries=${result.puzzleRetries}`);
// if (easy < 50 && result.solveTime < 5) {
//   easy++;
//   fs.writeFileSync(
//     `gen/easy/${easy}.json`,
//     JSON.stringify({ puzzle: result.puzzle, solution: result.solution })
//   );
//   console.timeEnd("all");
//   console.log("easy", easy);
// } else if (medium < 50 && result.solveTime >= 1.3 && result.solveTime < 50) {
//   medium++;
//   fs.writeFileSync(
//     `gen/medium/${medium}.json`,
//     JSON.stringify({ puzzle: result.puzzle, solution: result.solution })
//   ); // console.timeEnd("all");
//   console.log("medium", medium);
// } else if (hard < 50 && result.solveTime >= 50) {
//   hard++;
//   fs.writeFileSync(
//     `gen/hard/${hard}.json`,
//     JSON.stringify({ puzzle: result.puzzle, solution: result.solution })
//   ); // console.timeEnd("all");
//   console.log("hard", hard, new Date());
// }
// fs.writeFileSync(`gen/puzzle-${index}.json`,
// JSON.stringify({puzzle:result.puzzle,solution:result.solution}));  // console.timeEnd("all");
// console.log("retries", result.puzzleRetries);
// }
// showPuzzle(result.solution);
// console.table(timings);

let num = 200;
let all = [];
while (num < 1000) {
  num++;
  let result = generate(15, 9, 27 + Math.floor(Math.random() * 5), 0.5);
  all.push({ puzzle: result.puzzle, solution: result.solution });
  if (num % 100 === 0) {
    fs.writeFileSync(`gen/${num / 100}.json`, JSON.stringify(all));
    console.log(num);
    all = [];
  }
}
