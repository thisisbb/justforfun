import * as PIXI from 'pixi.js';

//Create the renderer
const [width, height] = [window.innerWidth, window.innerHeight];

const renderer = PIXI.autoDetectRenderer(
  width
  , height
  , {antialias: false, transparent: false, resolution: 1});

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
const stage = new PIXI.Container();

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

