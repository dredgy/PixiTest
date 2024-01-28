import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

const app = new PIXI.Application<HTMLCanvasElement>({
    width: 800,
    height: 600,
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
    .decelerate()

const newSquare = (x: number, y: number, color: PIXI.ColorSource) => {
    const square = new PIXI.Graphics()

    square.beginFill(color)
    square.drawRect(x, y, 50, 50)
    square.endFill()
    square.interactive = true
    viewport.addChild(square)

}


newSquare(50, 50, 0xFF0000)
newSquare(100, 100, 0x0000FF)