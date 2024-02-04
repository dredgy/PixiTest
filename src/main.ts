import {createEntity, createAttribute, renderEntities, dragEntity} from "./problemMap.ts";
import * as PIXI from "pixi.js";
import {Viewport} from "pixi-viewport";
import * as Helper from "./helper.ts"


export let App : State = {
    PixiApp: null,
    viewport: null,
    lines: [],
    problemMap: {
        Entities: [],
        Relationships: [],
        attributeCounter: Helper.indexGenerator(),
        entityCounter: Helper.indexGenerator(),
    }
}

const setupEvents = () => {
    const body =  document.querySelector<HTMLElement>("body")
    body!.addEventListener("pointerdown", dragEntity);

    //the below code makes mouse wheel zoom work on doms
    body!.addEventListener("wheel", e => {
        if((<Element>e.target).localName != "canvas") {
            App.viewport.plugins.wheel(e)
        }
    })
}

const setupPage = () => {
    const app = new PIXI.Application<HTMLCanvasElement>({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xAAAAAA, // Set the background color
    })

    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000,
        events: app.renderer.events,
    })

    document.body.appendChild(app.view)
    app.stage.addChild(viewport)
    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate({friction: 0.8})
        .clampZoom({
            minScale: 0.25,
            maxScale: 2
        })

    App.PixiApp = app
    App.viewport = viewport
}

const createSampleEntities = () => {
    createEntity("dicks", "doubleDicks", 500, 100);
    createEntity("dicks", "doubleDicks", 100, 500);
    createAttribute(1, '4', "potato", "potatoes", "potata", "kg")
    createAttribute(1, '5', "potato", "potatoes", "potata", "kg")
    createAttribute(1, "asdf", "potato", "potatoes", "potata", "kg")
    createAttribute(2, "aaaa", "potato", "potatoes", "potata", "kg")
    createAttribute(2, '4', "potato", "potatoes", "potata", "kg")
    createAttribute(1, '4', "potato", "potatoes", "potata", "kg")
}

/**
 * EntryPoint - runs on page load
 */
const main = () => {
    setupEvents()
    setupPage()
    createSampleEntities()
    App.PixiApp.ticker.add(_ => {
        renderEntities();
        //randomWalk();
    });
}



document.addEventListener('DOMContentLoaded', main)