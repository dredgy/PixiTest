import {ProblemMap, createEntity, createAttribute, renderEntities, dragEntity} from "./problemMap.ts";

const problemMap = new ProblemMap();
createEntity(problemMap, "dicks", "doubleDicks");
createEntity(problemMap,"dicks", "doubleDicks");
createAttribute(problemMap,1, 4, "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,1, 5, "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,1, "asdf", "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,2, "aaaa", "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,2, 4, "potato", "potatoes", "potata", "kg")
createAttribute(problemMap,1, 4, "potato", "potatoes", "potata", "kg")

//the below code makes mouse wheel zoom work on doms
document.querySelector<HTMLElement>("body")!.addEventListener("wheel", function (e){
    if(e.target.localName != "canvas") {
        problemMap.viewport.plugins.wheel(e)
    }
})
document.querySelector<HTMLElement>("body")!.addEventListener("pointerdown",e => dragEntity(e, problemMap));

problemMap.app.ticker.add((delta) => {
    renderEntities(problemMap);
    //randomWalk();
});