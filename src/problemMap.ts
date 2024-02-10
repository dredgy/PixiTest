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
            entity.attributes.push({id: newID, name: name, description: description, type: type, units: units, value: value, relationshipSlotAllocation: []})
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


function isOdd(num) { return num % 2;}


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

function getRelationshipById(id:number){
    let relationship = null;
    App.problemMap.Relationships.forEach(function(rel){
        if(rel.id == id){
            relationship = rel;
        }
    })
    return relationship
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
                    renderRelationships()
                }
            })
            break;
        }
        case "newEntityButton":{
            createEntity("lol", "lol");
            break;
        }
        case "deleteEntity":{

            deleteEntity((<HTMLElement>e.target).dataset.id as unknown as number)
            break;
        }
        case "createAttribute":{

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
                //newTripleLine(getAttributeByID((<number><unknown>att1.dataset.id)), "right", getAttributeByID((<number><unknown>att2.dataset.id)), "right" )
                createRelationship("lol", "lol", "lol", parseInt(att1.dataset.id), parseInt(att2.dataset.id), 1, 1)
                document.querySelectorAll<HTMLElement>(".attribute").forEach(e => e.style.background = "initial")
                document.querySelector<HTMLElement>("body").removeEventListener("pointerup", releaseLine)
                renderRelationships()
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

    let divToEdit = (<HTMLElement>e.target);
    divToEdit.contentEditable = "false";
}

export function createInitialDLine(id1: number, slot1:number, buffer1:number, id2: number, slot2: number, buffer2:number,  rel:Relationship) {

    //Get DOM Elements for attributes
    let firstAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id1 + '"]')
    let secondAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id2 + '"]')

    //Calculate left/rightedness of each attribute
    let firstAttributeDirection = isOdd(slot1) ? -15 : 15;
    let secondAttributeDirection = isOdd(slot2) ? -15 : 15;

    //calculate the offset of attribute 1.
    let att1OffsetY = firstAttribute.offsetHeight / 4 * (Math.round(slot1 / 2)) * App.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
    let att1OffsetX = firstAttributeDirection == 15 ? firstAttribute.offsetWidth * App.viewport.scale.x : 0;

    //calculate the offset of attribute 2.
    let att2OffsetY = secondAttribute.offsetHeight / 4 * (Math.round(slot2 / 2)) * App.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
    let att2OffsetX = secondAttributeDirection == 15 ? secondAttribute.offsetWidth * App.viewport.scale.x : 0;

    let slot1Location = new PIXI.Point(firstAttribute.getBoundingClientRect().x + att1OffsetX, firstAttribute.getBoundingClientRect().y + att1OffsetY)
    let slot2Location = new PIXI.Point(secondAttribute.getBoundingClientRect().x + att2OffsetX, secondAttribute.getBoundingClientRect().y + att2OffsetY)

    let DLine = null;

    if (isOdd(slot1) != isOdd(slot2)) {
        let oddSlot = isOdd(slot1) ? firstAttribute : secondAttribute;
        let evenSlot = isOdd(slot1) ? secondAttribute : firstAttribute;


        if (oddSlot.getBoundingClientRect().x < evenSlot.getBoundingClientRect().x) {
            //function for J Line
            DLine = generateJLine(slot1Location, slot2Location, id1, id2);
        } else {
            //function for z Line
            DLine = generateZLine(slot1Location, slot2Location, slot1, slot2);
        }
    } else {
        //function for C line
        DLine = generateCLine(slot1Location, slot2Location, slot1, slot2, id1, id2)
    }


    if (rel) {
        if (rel.line.locked) {
            if (rel.line.lineType == "C" || rel.line.lineType == "Z") {
                DLine.keyPoint1.x = rel.line.keyPoint1.x
                DLine.KeyPoint2.x = rel.line.KeyPoint2.x
            } else {
                DLine.keyPoint1.y = rel.line.keyPoint1.y
                DLine.KeyPoint2.y = rel.line.KeyPoint2.y
            }
            DLine.locked = true;
        }

    }
    return DLine;
}

export function generateCLine(slot1Location:PIXI.Point, slot2Location:PIXI.Point, slot1:number, slot2:number, id1:number, id2:number){

    let firstAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id1 + '"]')
    let secondAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id2 + '"]')

    let mostLeft = Math.min(firstAttribute.getBoundingClientRect().left, secondAttribute.getBoundingClientRect().left)
    let mostRight = Math.max(firstAttribute.getBoundingClientRect().right, secondAttribute.getBoundingClientRect().right)

    //let distance = slot1Location.x <= slot2Location.x? -30 : slot2Location.x-slot1Location.x - 30;
    let keyx = isOdd(slot1)? mostLeft-(30*App.viewport.scale.x) : mostRight+(30*App.viewport.scale.x) ;

    let KeyPoint1 = App.viewport.toWorld(new PIXI.Point(keyx, slot1Location.y));
    let KeyPoint2 = App.viewport.toWorld(new PIXI.Point(keyx, slot2Location.y));
    let CLine:DLine = {
        lineType: "C",
        keyPoint1: KeyPoint1,
        KeyPoint2: KeyPoint2,
        bufferLeft: isOdd(slot1)? -30 : 0,
        bufferRight: isOdd(slot1)? 30 : 0,
        locked: false,

    }
   return CLine;
}

export function generateZLine(slot1Location:PIXI.Point, slot2Location:PIXI.Point, slot1:number, slot2:number){

    let xSpan = slot1Location.x - slot2Location.x;
    let keyx = slot2Location.x + (xSpan/2);
    let KeyPoint1 = App.viewport.toWorld(new PIXI.Point(keyx, slot1Location.y));
    let KeyPoint2 = App.viewport.toWorld(new PIXI.Point(keyx, slot2Location.y));
    let ZLine:DLine = {
        lineType: "Z",
        keyPoint1: KeyPoint1,
        KeyPoint2: KeyPoint2,
        bufferLeft: 0,
        bufferRight: 0,
        locked: false,

    }
    return ZLine;
}

export function generateJLine(slot1Location:PIXI.Point, slot2Location:PIXI.Point, id1:number, id2:number) {
    let firstAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id1 + '"]')
    let secondAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id2 + '"]')

    let firstEntity :HTMLElement = firstAttribute.parentElement.parentElement;
    let secondEntity :HTMLElement = secondAttribute.parentElement.parentElement;


    //get screen coordinates of entities
    let ent1PositionY = firstEntity.getBoundingClientRect().bottom;
    let ent2PositionY = secondEntity.getBoundingClientRect().y;

    let xSpan = slot2Location.x - slot1Location.x;
    let ySpan = slot1Location.y - slot2Location.y;
    //let middle = slot2Location.y + (ySpan/2);

    let y = (slot2Location.y+((firstEntity.getBoundingClientRect().y - secondEntity.getBoundingClientRect().bottom)/2)+secondEntity.getBoundingClientRect().bottom - slot2Location.y);

    if(firstEntity.getBoundingClientRect().bottom <= secondEntity.getBoundingClientRect().y) {
        y = (slot1Location.y+((secondEntity.getBoundingClientRect().y - firstEntity.getBoundingClientRect().bottom)/2)+firstEntity.getBoundingClientRect().bottom - slot1Location.y);
    }
    if(firstEntity.getBoundingClientRect().bottom >= ent2PositionY && firstEntity.getBoundingClientRect().y <= secondEntity.getBoundingClientRect().bottom) {
        y = Math.max(secondEntity.getBoundingClientRect().bottom,firstEntity.getBoundingClientRect().bottom )+ (15*App.viewport.scale.x);
    }


    let bufferLeft = -30*App.viewport.scale.x;
    let bufferRight = 30*App.viewport.scale.x;
    //let KeyPoint1 = App.viewport.toWorld(new PIXI.Point(slot1Location.x+bufferLeft, slot1Location.y+middle+potato));
    let KeyPoint1 = App.viewport.toWorld(new PIXI.Point(slot1Location.x+bufferLeft, y));
    let KeyPoint2 = App.viewport.toWorld(new PIXI.Point(slot2Location.x+bufferRight, y));
    let JLine:DLine = {
        lineType: "J",
        keyPoint1: KeyPoint1,
        KeyPoint2: KeyPoint2,
        bufferLeft: bufferLeft,
        bufferRight: bufferRight,
        locked: false,

    }
    return JLine;
}

export function createRelationship(name:string, desc:string, nature:string, id1:number, id2:number, causeSlot:number, effectSlot:number ){
    let DLine = createInitialDLine(id1, causeSlot, 0, id2, effectSlot, 0, null);
    App.problemMap.Relationships.push({
        id: App.problemMap.relationshipCounter.next().value,
        name: name,
        description: desc,
        nature: nature,
        cause: id1,
        effect: id2,
        causeSlot: causeSlot,
        effectSlot: effectSlot,
        line: DLine,
        graphic: new PIXI.Graphics(),
        Handle: new PIXI.Graphics(),
    })
}

export function renderRelationships(){
    const lineStyleOptions = {
        width: 10,
        color:0xCE91FF,
        cap: LINE_CAP.ROUND
    }

    App.problemMap.Relationships.forEach(rel => {

        if(App.moveLine == false) {
            rel.line = createInitialDLine(rel.cause, rel.causeSlot, 0, rel.effect, rel.effectSlot, 0, rel)
        }
        //Get DOM Elements for attributes
        let firstAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + rel.cause + '"]')
        let secondAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + rel.effect+ '"]')

        //Calculate left/rightedness of each attribute
        let firstAttributeDirection = isOdd(rel.causeSlot) ? -15 : 15;
        let secondAttributeDirection = isOdd(rel.effectSlot) ? -15 : 15;

        //calculate the offset of attribute 1.
        let att1OffsetY = firstAttribute.offsetHeight / 4 * (Math.round(rel.causeSlot/2)) * App.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
        let att1OffsetX = firstAttributeDirection == 15 ? firstAttribute.offsetWidth * App.viewport.scale.x : 0;
        //calculate the offset of attribute 2.
        let att2OffsetY = secondAttribute.offsetHeight / 4 * (Math.round(rel.effectSlot/2)) * App.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
        let att2OffsetX = secondAttributeDirection == 15 ? secondAttribute.offsetWidth * App.viewport.scale.x : 0;

        let slot1Location = new PIXI.Point(firstAttribute.getBoundingClientRect().x + att1OffsetX, firstAttribute.getBoundingClientRect().y + att1OffsetY)
        let slot2Location = new PIXI.Point(secondAttribute.getBoundingClientRect().x + att2OffsetX, secondAttribute.getBoundingClientRect().y + att2OffsetY)
        let slot1LocationWorld = App.viewport.toWorld(slot1Location);
        let slot2LocationWorld = App.viewport.toWorld(slot2Location);

        rel.graphic.clear();

        rel.graphic.lineStyle(lineStyleOptions);
        if(rel.line.lineType == "C" ) {
            rel.graphic.moveTo(slot1LocationWorld.x, slot1LocationWorld.y)
            rel.graphic.lineTo(rel.line.keyPoint1.x, rel.line.keyPoint1.y);
            rel.graphic.lineTo(rel.line.KeyPoint2.x, rel.line.KeyPoint2.y);
            rel.graphic.lineTo(slot2LocationWorld.x, slot2LocationWorld.y)
        }
        if(rel.line.lineType == "J"){
            rel.graphic.moveTo(slot1LocationWorld.x, slot1LocationWorld.y)
            rel.graphic.lineTo(rel.line.keyPoint1.x ,slot1LocationWorld.y);
            rel.graphic.lineTo(rel.line.keyPoint1.x, rel.line.keyPoint1.y);
            rel.graphic.lineTo(rel.line.KeyPoint2.x, rel.line.KeyPoint2.y);
            rel.graphic.lineTo(rel.line.KeyPoint2.x,slot2LocationWorld.y);
            rel.graphic.lineTo(slot2LocationWorld.x, slot2LocationWorld.y)
        }
        if(rel.line.lineType == "Z"){
            rel.graphic.moveTo(slot1LocationWorld.x, slot1LocationWorld.y)
            rel.graphic.lineTo(rel.line.keyPoint1.x, rel.line.keyPoint1.y);
            rel.graphic.lineTo(rel.line.KeyPoint2.x, rel.line.KeyPoint2.y);
            rel.graphic.lineTo(slot2LocationWorld.x, slot2LocationWorld.y)
        }

        App.viewport.addChild(rel.graphic);


        rel.Handle.clear();
        rel.Handle.beginFill(0xffff55)

        //create horizontal line
        rel.Handle.drawRect(rel.line.keyPoint1.x-5, rel.line.KeyPoint2.y-5, (rel.line.KeyPoint2.x - rel.line.keyPoint1.x +5), 20);

        //create vertical line
        rel.Handle.drawRect(rel.line.keyPoint1.x-5, rel.line.keyPoint1.y-5, 20 , (rel.line.KeyPoint2.y-rel.line.keyPoint1.y));

        //create other vertical lines
        rel.Handle.drawRect(rel.line.KeyPoint2.x-5, rel.line.KeyPoint2.y-5, 20 , (rel.line.keyPoint1.y-rel.line.KeyPoint2.y));

        rel.Handle.endFill();
        rel.Handle.alpha = 0;
        rel.Handle.eventMode = 'static';
        rel.Handle.on("pointerdown", lineClicked);
        rel.Handle.on("pointercancel", lineRelease);
        rel.Handle.on("rightclick", lineUnlock);
        rel.Handle.on("pointerup", lineRelease);
        rel.Handle.cursor = 'pointer';
        rel.Handle.name = rel.id.toString();
        rel.Handle.interactiveChildren = false

        App.viewport.addChild(rel.Handle);
    })
}

function lineClicked(e:Event){
    let id:number = parseInt(this.name)
    let rel = getRelationshipById(id);
    rel.line.locked = true;
    App.moveLine = true;
    App.moveLineTarget = rel;

}

function lineUnlock(e:Event){
    e.preventDefault();
    let id:number = parseInt(this.name)
    let rel = getRelationshipById(id);
    rel.line.locked = false;


}

export function lineRelease(e:Event){
    App.viewport.pause = false;
    let id:number = parseInt(this.name)
    let rel = getRelationshipById(id);
    //rel.line.locked = true;
    App.moveLine = false;
    App.moveLineTarget = null;

}

export function lineMove(e){
    if(App.moveLine){
        App.viewport.pause = true
        if(App.moveLineTarget.line.lineType == "C" || App.moveLineTarget.line.lineType == "Z"){
            App.moveLineTarget.line.keyPoint1.x = App.viewport.toWorld(e.clientX, 0).x;
            App.moveLineTarget.line.KeyPoint2.x = App.viewport.toWorld(e.clientX, 0).x ;

        }
        else{
            App.moveLineTarget.line.keyPoint1.y = App.viewport.toWorld(0, e.clientY).y;
            App.moveLineTarget.line.KeyPoint2.y = App.viewport.toWorld(0, e.clientY).y;
        }
    }
}