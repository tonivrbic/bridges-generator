import * as fs from "fs";
import { generate } from "../src";

generateLeveledPuzzles();

// random generation
generateRandomPuzzles();

// daily generation
generateDailyPuzzles();

function generateLeveledPuzzles() {
  let easy = 50;
  let medium = 50;
  let hard = 47;
  while (easy < 50 || medium < 50 || hard < 50) {
    for (let index = 0; index < 25; index++) {
      let result = generate(15, 9, 27 + Math.floor(Math.random() * 5), 0.55);
      if (easy < 50 && result.solveTime < 5) {
        easy++;
        fs.writeFileSync(
          `gen/easy/${easy}.json`,
          JSON.stringify({ puzzle: result.puzzle, solution: result.solution })
        );
        console.log("easy", easy);
      } else if (
        medium < 50 &&
        result.solveTime >= 1.3 &&
        result.solveTime < 50
      ) {
        medium++;
        fs.writeFileSync(
          `gen/medium/${medium}.json`,
          JSON.stringify({ puzzle: result.puzzle, solution: result.solution })
        );
        console.log("medium", medium);
      } else if (hard < 50 && result.solveTime >= 50) {
        hard++;
        fs.writeFileSync(
          `gen/hard/${hard}.json`,
          JSON.stringify({ puzzle: result.puzzle, solution: result.solution })
        );
        console.log("hard", hard, new Date());
      }
    }
  }
}

function generateRandomPuzzles() {
  let num = 0;
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
}

function generateDailyPuzzles() {
  let num = 0;
  while (num < 1000) {
    let date = new Date();
    date.setDate(date.getDate() + num);
    num++;
    let result = generate(15, 9, 27 + Math.floor(Math.random() * 5), 0.5);
    fs.writeFileSync(
      `gen/daily/${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")}.json`,
      JSON.stringify({ puzzle: result.puzzle, solution: result.solution })
    );
    console.log(date);
  }
}
