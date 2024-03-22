import {clickUI, lineMove} from "./problemMap.ts";
import {renderEntities, renderEntity} from "./Entities/Controller.ts"
import *  as EntityModel from "./Entities/Model.ts"
import * as PIXI from "pixi.js";
import {Viewport} from "pixi-viewport";
import * as Helper from "./helper.ts"
import {EntityType} from "./Types.ts";
import {createRelationship, renderRelationships} from "./Relationships/Controller.ts";


export let Application : State = {
    PixiApp: null,
    viewport: null,
    moveLine: false,
    moveLineTarget: null,
    ActiveProblemMap: null,
    Entities: [],
    Relationships: [],
    ProblemMapAttributeGroups: [],
    //todo: stop using problemMap
    problemMap: {
        Entities: [],
        Relationships: [],
        attributeCounter: Helper.indexGenerator(),
        entityCounter: Helper.indexGenerator(),
        relationshipCounter: Helper.indexGenerator(),
    },
}

const setupEvents = () => {
    const body =  document.querySelector<HTMLElement>("body")
    body!.addEventListener("pointerdown", clickUI);

    //the below code makes mouse wheel zoom work on doms
    body!.addEventListener("wheel", e => {
        if((<Element>e.target).localName != "canvas") {
            Application.viewport.plugins.wheel(e)
        }
    })

    body!.addEventListener("pointermove", lineMove);
}

const setupPage = () => {
    const app = new PIXI.Application<HTMLCanvasElement>({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xDDDDDD, // Set the background color
        resizeTo: window
    })

    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000,
        events: app.renderer.events,
        disableOnContextMenu: true,
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

    Application.PixiApp = app
    Application.viewport = viewport
}

const createSampleEntities = () => {
    Application.Entities = EntityModel.getDummyEntities()
    Application.Relationships = EntityModel.getDummyRelationships()
    Application.ProblemMapAttributeGroups = EntityModel.getDummyCoordinates()
    Application.ActiveProblemMap = Application.Entities.filter(entity => entity.type == EntityType.ProblemMap).at(0)

    Application
        .Entities
        .filter(entity => entity.type == EntityType.AttributeGroup)
        .forEach(renderEntity)

    createRelationship("first", "the first relationship", "cause", 6, 10, 7, 8);
}

/**
 * EntryPoint - runs on page load
 */
const main = () => {
    setupEvents()
    setupPage()
    createSampleEntities()
    renderRelationships();


    let k = 0;
    Application.PixiApp.ticker.add(n => {
        renderEntities();
        k++
        if(k==5) {
            renderRelationships();
        }
    });
}



document.addEventListener('DOMContentLoaded', main)