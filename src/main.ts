import {
    createEntity,
    createAttribute,
    renderEntities,
    dragEntity,
    //drawLinePoints,
    newTripleLine, renderTripleLines
} from "./problemMap.ts";
import * as PIXI from "pixi.js";
import {Viewport} from "pixi-viewport";
import * as Helper from "./helper.ts"


export let App : State = {
    PixiApp: null,
    viewport: null,
    lines: [],
    tripleLines: [],
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
    App.problemMap.Entities[0].location.x += 300;
    App.problemMap.Entities[0].location.y += 300;
    newTripleLine(App.problemMap.Entities[0].attributes[0], "left", App.problemMap.Entities[1].attributes[0], "left" )
    newTripleLine(App.problemMap.Entities[0].attributes[1], "right", App.problemMap.Entities[1].attributes[1], "right" )
}

/**
 * EntryPoint - runs on page load
 */
const main = () => {
    setupEvents()
    setupPage()
    createSampleEntities()
    renderTripleLines()
    App.PixiApp.ticker.add(_ => {
        renderEntities();


        //randomWalk();
    });
}

function lineBetween(id1:number, id2:number){

    let att1 = document.querySelector<HTMLElement>('.attribute[data-id="'+id1+'"]')
    let att2 = document.querySelector<HTMLElement>('.attribute[data-id="'+id2+'"]')

    //get screen coordinates of attribute 1
    let att1PositionX = att1.getBoundingClientRect().x;
    let att1PositionY = att1.getBoundingClientRect().y;

    //calculate the offset of attribute 1.
    let att1OffsetY = att1.offsetHeight/2*App.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
    let att1OffsetX = att1.offsetWidth*App.viewport.scale.x;

    //create a PIXI.Point that represents the connection of the doo dad
    let att1Pixi = new PIXI.Point(att1PositionX+att1OffsetX, att1PositionY+att1OffsetY);

    let att2PositionX = att2.getBoundingClientRect().x;
    let att2Positiony = att2.getBoundingClientRect().y;
    let att2OffsetY = att2.offsetHeight/2*App.viewport.scale.y;
    let att2OffsetX = att2.offsetWidth*App.viewport.scale.x;
    let att2Pixi = new PIXI.Point(att2PositionX+att2OffsetX, att2Positiony+att2OffsetY);

    // total x and y distance to be covered
    let relCoordX = att2Pixi.x - att1Pixi.x;
    let relCoordy = att2Pixi.y - att1Pixi.y;

    //Split total x distance into two 30% along line
    let legX1 = relCoordX*0.3;
    let legX2 = relCoordX*0.7;

    let startPoint = att1Pixi;
    let firstPoint = new PIXI.Point(att1Pixi.x+legX1, att1Pixi.y);
    let secondPoint = new PIXI.Point(att1Pixi.x+legX1, att1Pixi.y+relCoordy);
    let thirdPoint = att2Pixi;


    drawLinePoints(App.viewport.toWorld(startPoint), App.viewport.toWorld(firstPoint));
    drawLinePoints(App.viewport.toWorld(firstPoint), App.viewport.toWorld(secondPoint))
    drawLinePoints(App.viewport.toWorld(secondPoint), App.viewport.toWorld(thirdPoint));

}


document.addEventListener('DOMContentLoaded', main)