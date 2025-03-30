import { cube } from './jsutils.js'
import { SVG } from '@svgdotjs/svg.js'
let n: number = 4
console.log(cube(10)*n)
let draw = SVG().addTo('body').size(300, 800)
// draw.rect(100, 100).attr({ fill: '#f09' })
const cellSize = 8;

const colors = [
  '#e6194B', '#ffe119', '#4363d8', '#f58231', '#911eb4', 
  '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', 
  '#9A6324', '#fffac8', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075',
]

// Define the twelve pentominoes as 1D arrays
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

for (let i=0; i<3; i++) { // COL num - i.e. x.
  for (let j=0; j<4; j++) {
    drawPentomino(pentominoes[4*i+j], cellSize*5.5*i, cellSize * 3.5 * j, 4*i+j);
  }
}
