import { cube } from './jsutils.js'
import { SVG } from '@svgdotjs/svg.js'
let n: number = 4
console.log(cube(10)*n)
let draw = SVG().addTo('body').size(1900, 800)
const cellSize = 3;

const colors = [
  '#e6194B', '#ffe119', '#4363d8', '#f58231', '#911eb4', 
  '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', 
  '#9A6324', '#fffac8', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075',
]

// Define the twelve pentominoes as 1D arrays.
const pentominoes: number[][] = [
  [1,2,10,11,21], // F
  [0,1,2,3,4],    // I
  [0,1,2,3,10],   // L
  [0,1,2,12,13],  // N
  [0,1,2,10,11],  // P
  [0,1,2,11,21],  // T
  [0,1,2,10,12],  // U
  [0,1,2,10,20],  // V
  [0,1,11,12,22], // W
  [1,10,11,12,21],// X
  [0,1,2,3,11],   // Y
  [0,1,11,21,22], // Z
]

function drawPentomino(shape: number[], startX: number, startY: number, color: number) {
  for (let i = 0; i < 5; i++) {
    const x = (shape[i] % 10) * cellSize + startX;
    const y = Math.floor(shape[i] / 10) * cellSize + startY;
    draw.rect(cellSize, cellSize).move(x, y).attr({ fill: colors[color] });
  }
}

// Return the distinct orientations for the given pentomino.
function findOrientations(pentomino: number[]): number[][][] {
  let result: number[][][] = [];
  let orientation: number[][] = pentomino.map(
          (cell: number) => [Math.floor(cell / 10), cell % 10]);
    for (let k = 0; k < 4; k++) {
      for (let kk = 0; kk < 2; kk++) {
        orientation = canonicalize(orientation); // candidate.
        if (!member(orientation, result)) {
          result.push(orientation);
        }
        orientation = flip(orientation);
      }
      orientation = rotate(orientation);
    }
  return result;
}

const orientations: number[][][][] = pentominoes.map(findOrientations);
console.log(orientations)

function member(yss: number[][], xsss: number[][][]): boolean {
  for (const xss of xsss) {  // xss: number[][]
    if (yss.every((y,i) => xss[i][0] === y[0] && xss[i][1] === y[1])) {
      return true;
    }
  }
  return false;
}

function rotate(orientation: number[][]): number[][] {
  return orientation.map(([i,j]) => [-j,i])
}

function flip(orientation: number[][]): number[][] {
  return orientation.map(([i,j]) => [-i,j])
}

// Return a new shape that is shifted so that the smallest cell is at (0,0)
// where smallest is lexigraphically smallest.
function canonicalize(shape: number[][]): number[][] {
  let minCell = [9,9];
  for (const sh of shape) {
    if (sh[0] < minCell[0] || (sh[0] == minCell[0] && sh[1] < minCell[1])) {
      minCell = sh;
    }
  }
  let shiftedShapes: number[][] = shape.map((sh) => [sh[0] - minCell[0], sh[1] - minCell[1]]);
  return shiftedShapes.sort((a,b) => a[0] * 10 + a[1] - (b[0] * 10 + b[1]));
}

for (let i=0; i<3; i++) { // COL num - i.e. x.
  for (let j=0; j<4; j++) {
    drawPentomino(pentominoes[4*i+j], 60+cellSize*5.5*i, cellSize * 3.5 * j, 4*i+j);
  }
}

const emptyBoard: number[][] = new Array(10);
for (let i = 0; i < 10; i++) {
  emptyBoard[i] = new Array(6).fill(-1);
}

function drawBoard(board: number[][], xPos: number, yPos: number) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 6; j++) {
      const cell: number = board[i][j];
      const color = cell >= 0 ? colors[cell] : '#eee';
      draw.rect(cellSize, cellSize).move(cellSize * j + xPos, cellSize * i + yPos).attr({ fill: color });
    }
  }
}

function findFirstEmptyCell(board: number[][]): number[] {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 6; j++) {
      if (board[i][j] === -1) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

let foundAnAnswer = false;
let callNum = -1;

// Take the partially filled board and the remainingPieces, and try to fill it
// by placing a piece in the first empty cell (and therefore the neighbouring
// cells) and calling itself again with the more filled up board.
// Draw the subtree according to the column number and the number of
// remaining pieces.
// Return the width of the tree.
function fillBoard(board: number[][], remainingPieces: number[], columnNum: number): number {
  let width = 0;
  callNum++;
  if (foundAnAnswer || callNum > 123) {
    return 0;  // any value will do.
  }
  drawBoard(board, 8 * cellSize * columnNum, 12 * cellSize * (12-remainingPieces.length));
  // if (remainingPieces.length === 0) {
  //   drawBoard(board, 90 * callNum);
  //   foundAnAnswer = true;
  //   return;
  // }
  const firstEmptyCell: number[] = findFirstEmptyCell(board);
  const [i, j] = firstEmptyCell;
  remainingPieces.forEach((piece) => {
    const pieceOrientations = orientations[piece];
    pieceOrientations.forEach((orientation) => {  // orientation: number[][]
      // e.g. orientation = [[0,0], [0,1], ...]
      // Check if the cells implied by the orientation are empty.
      const allEmpty = orientation.every(([ii, jj]) => {
        const x = i + ii;
        const y = j + jj;
        return x >= 0 && x < 10 && y >= 0 && y < 6 && board[x][y] === -1;
      });
      if (allEmpty) {
        let newBoard: number[][] = board.map((row) => row.slice());
        // Fill the cells with the piece ID.
        orientation.forEach(([ii, jj]) => {
          newBoard[i + ii][j + jj] = piece;
        });
        width += fillBoard(newBoard, remainingPieces.filter((x) => x !== piece), columnNum + width);
      }
    })
  });
  return Math.max(width, 1);
}

fillBoard(emptyBoard, [0,1,2,3,4,5,6,7,8,9,10,11], 0);
