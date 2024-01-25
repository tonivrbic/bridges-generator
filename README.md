# Hashi Puzzle Generator

A library for generating random Hashi puzzles written in TypeScript. Hashi (also known as Bridges, and Hashiwokakero) is a logic puzzle that involves connecting islands with bridges without creating any loops. This library provides a simple API for generating Hashi puzzles of various sizes and difficulty levels.

## Links 

### Generator 
You can play with the generator on the Hashi Puzzles application at the following link:
- [Hashi Puzzles App](https://hashi-puzzles.com/generator)

###  Solver 
Also, I have a hashi **solver** library that is available on
- [Hashi Puzzles App](https://hashi-puzzles.com/solve)
- [Github](https://github.com/tonivrbic/bridges-solver)
- [npm](https://www.npmjs.com/package/bridges-solver) 

## Installation

To install the library, run the following command in your terminal:

```sh
npm install bridges-generator
```

## Usage instructions

The library exports a function called `generate` that takes four parameters:

* `rows`: The number of rows in the puzzle.
* `columns`: The number of columns in the puzzle.
* `numberOfIslands`: The number of islands in the puzzle.
* `doubleBridges`: (Optional) The percentage of double bridges in the generated puzzle. The value must be between 0 and 1. If not specified, a default value of 0.2 will be used.

The `generate` function returns an object with two properties:

* `puzzle`: A two-dimensional array representing the puzzle grid. Each element in the array represents the number of that island (0 if there is no island).
* `solution`: A two-dimensional array representing the solution to the puzzle. Each element in the array is a string representing the island or the bridge. The following element are can be in the solution:
  - `0` - represents empty space
  - `number from 1 to 8` - represents the island
  - `|` - one vertical bridge
  - `$` - two vertical bridges
  - `-` - one horizontal bridge
  - `=` - two horizontal bridges

Here is an example of how to use the library to generate a 10x10 puzzle with 5 islands and 20% double bridges:

```javascript
import { generate } from 'bridges-generator';

const generated = generate(10, 10, 5, 0.2);
console.log(generated.puzzle);
console.log(generated.solution);
```

### Result

Example of generated puzzle:
```javascript
[
    [0, 2, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 4, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 2, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]

```

The solution to the generated puzzle:
```javascript
[
    ['0', '2', '-', '-', '-', '3', '-', '-', '1', '0', '0', '0', '0', '1', '0'],
    ['0', '|', '0', '0', '0', '|', '0', '0', '0', '0', '0', '0', '0', '|', '0'],
    ['0', '|', '0', '0', '0', '|', '0', '0', '0', '0', '0', '0', '0', '|', '0'],
    ['0', '|', '1', '-', '-', '4', '-', '-', '-', '-', '4', '-', '-', '2', '0'],
    ['0', '|', '0', '0', '0', '|', '0', '0', '0', '0', '$', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '1', '0', '0', '0', '0', '$', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '0', '0', '0', '0', '0', '$', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '0', '0', '0', '0', '0', '$', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '0', '0', '0', '0', '0', '$', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '0', '0', '0', '0', '0', '$', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '0', '0', '0', '0', '0', '$', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '3', '=', '=', '=', '=', '5', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '|', '0', '0', '0', '0', '|', '0', '0', '0', '0'],
    ['0', '|', '0', '0', '0', '3', '=', '=', '2', '0', '2', '-', '1', '0', '0'],
    ['0', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
]
```

Without code, the solution looks like this:
``` 
2---3--1    1
|   |       |
|   |       |
|1--4----4--2
|   |    $
|   1    $
|        $
|        $
|        $
|        $
|        $
|   3====5
|   |    |
|   3==2 2-1
1
```
