import * as PIXI from 'pixi.js'
import {ProblemMap, createEntity, createAttribute, renderEntities} from "./problemMap.ts";


const problemMap = new ProblemMap();
createEntity(problemMap, "dicks", "doubleDicks");
createEntity(problemMap,"dicks", "doubleDicks");
createAttribute(problemMap,1, 4, "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,1, 5, "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,1, "asdf", "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,2, "aaaa", "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,2, 4, "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,1, 4, "potato", "potatoes", "potata", "kg")




function randomWalk(problemMap:ProblemMap){
    problemMap.Entities.forEach(entity => {
        entity.location.x += (Math.random()-0.5)*4;
        entity.location.y += (Math.random()-0.5)*4;
    })
}

//the below code makes mouse wheel zoom work on doms
document.querySelector<HTMLElement>("body")!.addEventListener("wheel", function (e){

    if(e.target.localName != "canvas") {
        problemMap.viewport.plugins.wheel(e)
    }
})

document.querySelector<HTMLElement>("body")!.addEventListener("pointerdown", function(e){
    e.preventDefault()
    let dragging = true;
    if(e.target!.className == "entityHeader"){

        //code to find the object
        // @ts-ignore
        let divID = problemMap.Entities.findIndex(item => item.id == e.target.dataset.id)
        let screenLocation:PIXI.Point = problemMap.viewport.toScreen(new PIXI.Point(problemMap.Entities[divID].location.x, problemMap.Entities[divID].location.y));
        let cursorLocation:PIXI.Point = new PIXI.Point(e.clientX, e.clientY);
        let offset:PIXI.Point = new PIXI.Point(cursorLocation.x-screenLocation.x, cursorLocation.y-screenLocation.y)

        document.querySelector<HTMLElement>("body")!.addEventListener("pointerup", function(){
            dragging = false;
            console.log("release");
        })
        document.querySelector<HTMLElement>("body")!.addEventListener("pointermove", function(a){
            if(dragging) {
                problemMap.Entities[divID].location = problemMap.viewport.toWorld(new PIXI.Point(a.clientX-offset.x, a.clientY-offset.y));
            }
        })
    }
})

problemMap.app.ticker.add((delta) => {
    renderEntities(problemMap);
    //randomWalk();
});