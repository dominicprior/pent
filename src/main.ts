import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { sq } from './utils.ts'
import { cube } from './jsutils.js'
import { SVG } from '@svgdotjs/svg.js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more.!!
    </p>
  </div>
`
let n: number = 4
console.log(sq(10)*n)
console.log(cube(10)*n)
setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
let draw = SVG().addTo('body').size(300, 300)
draw.rect(100, 100).attr({ fill: '#f06' })
