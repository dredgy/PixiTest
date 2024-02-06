import * as PIXI from "pixi.js";
import {Graphics, LINE_CAP, Point} from "pixi.js";
import ElementWrapper from "./element-wrapper.js";
import {App} from "./main.ts";


//createEntity creates a new entity in problemMap, instantiates it in the DOM and isntantiates a
//wrappedElement (extension of PIXI.DisplayObject)
export function createEntity(EntityName:string, EntityDescription:string, x? :number, y?: number):void{
    //create new Entity on problemMap
    const newID = App.problemMap.entityCounter.next().value;

    //instantiates the entityTemplate in the DOM sets IDs
    const container  = document.getElementById("body") as HTMLElement;
    const template = document.getElementById("entityTemplate") as HTMLTemplateElement;
    let clone = template.content.cloneNode(true) as HTMLElement;
    clone.querySelector<HTMLElement>("div")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".entityHeader")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".entityDescription")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".deleteEntity")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".attributeContainer")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".createAttribute")!.dataset.id = newID.toString();
    //populate the template with data
    clone.querySelector(".entityHeader[data-id]")!.innerHTML = EntityName;
    clone.querySelector(".entityDescription[data-id]")!.innerHTML = EntityDescription;
    container.appendChild(clone);

    //Selects the newly appended element in the DOM, wraps it and creates pushes a new Entity.
    const element = document.querySelector<HTMLElement>(".entity[data-id='"+newID+"']")
    const wrappedElement = new ElementWrapper(element);
    App.problemMap.Entities.push({
        id: newID,
        name: EntityName,
        description: EntityDescription,
        wrappedElement: wrappedElement,
        attributes: [],
        location : App.viewport.center
    })
    App.PixiApp.stage.addChild(wrappedElement);

}

export function deleteEntity(entity_id:number){
    let container  = document.querySelector(".entity[data-id='"+entity_id+"']") as HTMLElement;
    container.replaceChildren();
    container.remove();
}

export function deleteAttribute(attribute_id:number){
    let container  = document.querySelector(".attribute[data-id='"+attribute_id+"']") as HTMLElement;
    container.replaceChildren();
    container.remove();
}


//createAttribute creates a new attribute on a particular entity object contained within problemMap by referencing
//the id of the entity object. createAttribute also instantiates the attribute in the DOM
export function createAttribute(entity_id:number, name:string, description: string, type:string, units:string, value:string){
    //Create new Attribute on Entity by Entity id
    const newID = App.problemMap.attributeCounter.next().value;
    App.problemMap.Entities = App.problemMap.Entities.map(entity => {
        if (entity.id == entity_id)
            entity.attributes.push({id: newID, name: name, description: description, type: type, units: units, value: value})
        return entity
    })

    //Following code creates instantiates the attributeTemplate in the DOM and renames the IDs as required
    const container = document.querySelector<HTMLElement>(".attributeContainer[data-id='"+entity_id+"']");

    const template = document.getElementById("attributeTemplate") as HTMLTemplateElement;
    let clone = template.content.cloneNode(true) as HTMLElement;
    clone.querySelector<HTMLElement>("div")!.dataset.id = newID;
    clone.querySelector<HTMLElement>(".attributeTitle")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".attributeValue")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".attributeBar")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".attributeDelete")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".attributeLink")!.dataset.id = newID.toString();

    //Following code populates the template with data lol
    clone.querySelector(".attributeTitle[data-id]")!.innerHTML = name;
    clone.querySelector(".attributeValue[data-id]")!.innerHTML = value;

    //appendes template as a child of container in the DOM
    container!.appendChild(clone);
}

export function renderEntities() {
    App.problemMap.Entities.forEach(entity => {
        entity.wrappedElement.x = App.viewport.toScreen(entity.location).x;
        entity.wrappedElement.y = App.viewport.toScreen(entity.location).y;
        entity.wrappedElement.scale = new PIXI.Point(App.viewport.scale.x, App.viewport.scale.x);
    })
}

export function drawLine(problemMap: ProblemMap, FirstEntity : Entity, SecondEntity : Entity) {
    const startPoint = {x: FirstEntity.location.x, y: FirstEntity.location.y};
    const endPoint = {x: SecondEntity.location.x, y: SecondEntity.location.y};

    const line = App.lines.length
        ? App.lines[0].Graphic.clear()
        : new PIXI.Graphics();

    // Draw the path
    line.lineStyle(2, 0x000000); // Line color and thickness
    line.moveTo(startPoint.x, startPoint.y); // Move to the starting point
    line.lineTo(endPoint.x, endPoint.y);   // Draw a line to the ending point
    line.quadraticCurveTo(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    App.viewport.addChild(line)

    App.lines[0] = {
        FirstEntity: FirstEntity,
        SecondEntity: SecondEntity,
        Graphic: line
    }
}

export function newTripleLine(att1:Attribute, att1Conn:string, att2:Attribute, att2Conn:string){

    const push1:tripleLine = {
        Line1: new Graphics(),
        Line2: new Graphics(),
        Line3: new Graphics(),
        start: new Point(),
        second: new Point(),
        third: new Point(),
        last: new Point(),
        att1: att1,
        att2: att2,
        att1Connection:att1Conn,
        att2Connection:att2Conn
    }
    App.tripleLines.push(push1)
}

export function renderTripleLines() {

    //update points
    App.tripleLines.forEach(function(tl) {
        let att1 = document.querySelector<HTMLElement>('.attribute[data-id="' + tl.att1.id + '"]')
        let att2 = document.querySelector<HTMLElement>('.attribute[data-id="' + tl.att2.id + '"]')

        //get screen coordinates of attribute 1
        let att1PositionX = att1.getBoundingClientRect().x;
        let att1PositionY = att1.getBoundingClientRect().y;

        //calculate the offset of attribute 1.
        let att1OffsetY = att1.offsetHeight / 2 * App.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
        let att1OffsetX = tl.att1Connection == "right" ? att1.offsetWidth * App.viewport.scale.x : 0;

        //create a PIXI.Point that represents the connection of the doo dad
        let att1Pixi = new PIXI.Point(att1PositionX + att1OffsetX, att1PositionY + att1OffsetY);

        let att2PositionX = att2.getBoundingClientRect().x;
        let att2Positiony = att2.getBoundingClientRect().y;
        let att2OffsetY = att2.offsetHeight / 2 * App.viewport.scale.y;
        let att2OffsetX = tl.att2Connection == "right" ? att2.offsetWidth * App.viewport.scale.x : 0;
        let att2Pixi = new PIXI.Point(att2PositionX + att2OffsetX, att2Positiony + att2OffsetY);

        // total x and y distance to be covered
        let relCoordX = att2Pixi.x - att1Pixi.x;
        let relCoordy = att2Pixi.y - att1Pixi.y;

        let legX1 = relCoordX * 0.3;
        //Split total x distance into two 30% along line
        if(tl.att2Connection == tl.att1Connection){
            legX1 = tl.att1Connection == "right" ? 50 : -50;
        }

        tl.start = App.viewport.toWorld(att1Pixi);
        tl.second = App.viewport.toWorld(new PIXI.Point(att1Pixi.x+legX1, att1Pixi.y));
        tl.third = App.viewport.toWorld(new PIXI.Point(att1Pixi.x+legX1, att1Pixi.y+relCoordy));
        tl.last = App.viewport.toWorld(att2Pixi);
    })


    //clear and render lines from points
    App.tripleLines.forEach(function(tl){
        tl.Line1.clear();
        tl.Line2.clear();
        tl.Line3.clear();

        const lineStyleOptions = {
            width: 10,
            color:0xCE91FF,
            cap: LINE_CAP.ROUND
        }

        tl.Line1.lineStyle(lineStyleOptions);
        tl.Line1.moveTo(tl.start.x, tl.start.y);
        tl.Line1.lineTo(tl.second.x, tl.second.y);


        tl.Line2.lineStyle(lineStyleOptions);
        tl.Line2.moveTo(tl.second.x, tl.second.y);
        tl.Line2.lineTo(tl.third.x, tl.third.y);


        tl.Line3.lineStyle(lineStyleOptions);
        tl.Line3.moveTo(tl.third.x, tl.third.y);
        tl.Line3.lineTo(tl.last.x, tl.last.y);

        App.viewport.addChild(tl.Line1);
        App.viewport.addChild(tl.Line2);
        App.viewport.addChild(tl.Line3);
    })
}

function getAttributeByID(id:number):Attribute{
    let att1 = null
    App.problemMap.Entities.forEach(function(ent){
        ent.attributes.forEach(function(att){
            if(att.id == id){
                att1 = att;
            }

        })

    })
    return att1;
}


export function clickUI (e:PointerEvent) {
    switch ((<Element>e.target)!.className) {
        case "entityHeader": {
            e.preventDefault()
            let dragging = true;
            //code to find the object
            let divID = App.problemMap.Entities.findIndex(item => item.id.toString() == (<HTMLElement>e.target).dataset.id)
            let screenLocation: PIXI.Point = App.viewport.toScreen(new PIXI.Point(App.problemMap.Entities[divID].location.x, App.problemMap.Entities[divID].location.y));
            let cursorLocation: PIXI.Point = new PIXI.Point(e.clientX, e.clientY);
            let offset: PIXI.Point = new PIXI.Point(cursorLocation.x - screenLocation.x, cursorLocation.y - screenLocation.y)

            document.querySelector<HTMLElement>("body")!.addEventListener("pointerup", function () {
                dragging = false;
            })
            document.querySelector<HTMLElement>("body")!.addEventListener("pointermove", function (a) {
                if (dragging) {
                    App.problemMap.Entities[divID].location = App.viewport.toWorld(new PIXI.Point(a.clientX - offset.x, a.clientY - offset.y));
                    renderTripleLines()
                }
            })
            break;
        }
        case "newEntityButton":{
            createEntity("lol", "lol");
            break;
        }
        case "deleteEntity":{
            console.log("Delete " + (<HTMLElement>e.target).dataset.id);
            deleteEntity((<HTMLElement>e.target).dataset.id as unknown as number)
            break;
        }
        case "createAttribute":{
            console.log("Create entity in " +(<HTMLElement>e.target).dataset.id)
            createAttribute((<HTMLElement>e.target).dataset.id as unknown as number, '4', "potato", "potatoes", "potata", "kg")
            break;
        }
        case "attributeDelete":{
            deleteAttribute((<HTMLElement>e.target).dataset.id as unknown as number);
            break;
        }

        case "attributeLink":{

            e.preventDefault()
            let dragging = true;
            let initialLocation: PIXI.Point = App.viewport.toWorld(new PIXI.Point(e.clientX, e.clientY));
            let line = new PIXI.Graphics;
            let att1:HTMLElement = (<HTMLElement>e.target)

            //This code was designed to make josh cry.
            const releaseLine = (f:Event) => {
                dragging = false;
                line.clear();
                let att2 :HTMLElement = (<HTMLElement>f.target)
                newTripleLine(getAttributeByID((<number><unknown>att1.dataset.id)), "right", getAttributeByID((<number><unknown>att2.dataset.id)), "right" )
                console.log(releaseLine);
                document.querySelectorAll<HTMLElement>(".attribute").forEach(e => e.style.background = "initial")
                document.querySelector<HTMLElement>("body").removeEventListener("pointerup", releaseLine)
                renderTripleLines()
            }

          document.querySelector<HTMLElement>("body")!.addEventListener("pointerup", releaseLine);

            document.querySelector<HTMLElement>("body")!.addEventListener("pointermove", function (a) {
                if (dragging) {
                    let cursor:PIXI.Point = App.viewport.toWorld(new PIXI.Point(a.clientX, a.clientY));
                    line.clear();
                    line.lineStyle(2, 0x999999);
                    line.moveTo(initialLocation.x, initialLocation.y);
                    line.lineTo(cursor.x, cursor.y)
                    App.viewport.addChild(line);
                    let hover = (<HTMLElement>a.target);
                    let hoverAttribute:HTMLElement = document.querySelector(`.attribute[data-id="${hover.dataset.id}"]`)
                    if(hover.className.includes("attribute")) {
                        document.querySelectorAll<HTMLElement>(".attribute").forEach(e => e.style.background = "initial")
                        hoverAttribute.style.background = "linear-gradient(to bottom, rgba(201, 229, 255, 1), rgba(143, 201, 255, 1) )";
                    }
                }
            })
            break;
        }
    }
}

export function editContent(e:Event){
    let divToEdit = (<HTMLElement>e.target);
    divToEdit.contentEditable = "true";
}

export function stopEditContent(e:Event){
    console.log("scream")
    let divToEdit = (<HTMLElement>e.target);
    divToEdit.contentEditable = "false";
}