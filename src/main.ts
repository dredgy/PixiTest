import {
    createEntity,
    createAttribute,
    renderEntities,
    clickUI,
    editContent,

    newTripleLine, renderTripleLines, stopEditContent
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
    },
}

const setupEvents = () => {
    const body =  document.querySelector<HTMLElement>("body")
    body!.addEventListener("pointerdown", clickUI);

    //the below code makes mouse wheel zoom work on doms
    body!.addEventListener("wheel", e => {
        if((<Element>e.target).localName != "canvas") {
            App.viewport.plugins.wheel(e)
        }
    })

    body!.addEventListener("dblclick", editContent);
    body!.addEventListener("focusout", stopEditContent);

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
    createEntity("Operations Team Workload", "The operations team’s workload fluctuates, delays to this work result in regulatory breaches and upset customers", 0, 0);
    createEntity("Regulatory Position", "The overall profile of the organization from a regulatory perspective.", 0, 500);
    createEntity("Organizational Culture", "The culture within the operations team.", 500, 0);
    createAttribute(1, 'Tasks per person per day', "potato", "potatoes", "potata", "300 tasks")
    createAttribute(1, 'Avg minutes per task', "potato", "potatoes", "potata", "5 minutes")
    createAttribute(1, "Available staff", "potato", "potatoes", "potata", "25 staff")
    createAttribute(1, "Task overdue", "potato", "potatoes", "potata", "89 tasks are overdue")
    createAttribute(2, 'Reportable Breaches', "potato", "potatoes", "potata", "10 instances")
    createAttribute(2, 'Major Reportable Breaches', "potato", "potatoes", "potata", "1")
    createAttribute(2, 'Regulatory Risk', "potato", "potatoes", "potata", "Moderate")
    createAttribute(3, 'Burnout Risk', "potato", "potatoes", "potata", "High (est 3 staff per week")
    createAttribute(3, 'Discontentment', "potato", "potatoes", "potata", "High")
    createAttribute(3, 'Motivation', "potato", "potatoes", "potata", "Low")
    createAttribute(3, 'Affinity with leadership', "potato", "potatoes", "potata", "Moderate")

    newTripleLine(App.problemMap.Entities[0].attributes[0], "left", App.problemMap.Entities[0].attributes[2], "left" )
    newTripleLine(App.problemMap.Entities[0].attributes[0], "right", App.problemMap.Entities[2].attributes[0], "right" )
    newTripleLine(App.problemMap.Entities[0].attributes[3], "right", App.problemMap.Entities[2].attributes[0], "left" )

    App.problemMap.Entities[0].location.x += 500;
    App.problemMap.Entities[1].location.y += 500;
    App.problemMap.Entities[2].location.x += 500;
    App.problemMap.Entities[2].location.y += 500;


}

/**
 * EntryPoint - runs on page load
 */
const main = () => {
    setupEvents()
    setupPage()
    createSampleEntities()

    console.log(App)

    renderTripleLines()
    let k = 0;
    App.PixiApp.ticker.add(n => {
        renderEntities();
        k++;
        if(k == 2){
            renderTripleLines()
        }
    });
}



document.addEventListener('DOMContentLoaded', main)