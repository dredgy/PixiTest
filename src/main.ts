import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import ElementWrapper from './element-wrapper.js';

const app = new PIXI.Application<HTMLCanvasElement>({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xAAAAAA, // Set the background color
})

document.body.appendChild(app.view)

const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,
    events: app.renderer.events
})

// add the viewport to the stage
app.stage.addChild(viewport)

// activate plugins
viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate({friction: 0.8})

const newSquare = (x: number, y: number, color: PIXI.ColorSource):PIXI.Graphics => {
    const square = new PIXI.Graphics()
    square.beginFill(color)
    square.drawRect(x, y, 50, 50)
    square.endFill()
    square.interactive = true
    viewport.addChild(square)
    return square;
}

newSquare(50, 50, 0xFF0000)
let box = newSquare(100, 100, 0x0000FF)

const element = document.getElementById('my-element');
const wrappedElement = new ElementWrapper(element);
app.stage.addChild(wrappedElement);

app.ticker.add((delta) => {
    if(box.x < 1500){
        box.x += 1}
    else {
        box.x = 1;
    }

    let t = viewport.toScreen(new PIXI.Point(box.x, box.y))
    wrappedElement.x = t.x;
    wrappedElement.y = t.y;
});