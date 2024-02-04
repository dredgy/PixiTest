import * as PIXI from "pixi.js";
import ElementWrapper from "./element-wrapper";
import {Viewport} from "pixi-viewport";

export class Attribute {
    id: number;
    name: string;
    description: string;
    type: string;
    units: string;
    value: any;
    div: HTMLElement;
    constructor(id:number, name: string, description: string, type:string, units:string, value:string) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.units = units;
        this.value = value;
        this.id = id;
    }
}

export class Entity {
    id: number;
    name: string;
    description: string;
    attributes: Attribute[];
    location:PIXI.Point;
    wrappedElement:ElementWrapper;
    Div: HTMLElement;


    constructor(problemMap:ProblemMap,id:number, name:string, description:string, wrap:ElementWrapper) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.attributes = [];
        this.location = problemMap.viewport.center;
        this.wrappedElement = wrap;
        problemMap.app.stage.addChild(this.wrappedElement);
        this.wrappedElement.x = problemMap.viewport.toScreen(this.location).x;
        this.wrappedElement.y = problemMap.viewport.toScreen(this.location).y;



    }

    createAttribute(newID:number,name:string, description: string, type:string, units:string, value:string):void{
        this.attributes.push(new Attribute(newID, name, description, type, units, value));
    }

}

class Relationship{
    id: number;
    name: string;
    description: string;
    nature: string;
    cause: number;
    effect: number;

    constructor(){

    }
}
function* indexGenerator():Generator<number>{
    let index :number = 1;
    while (true){
        yield index;
        index++;
    }
}



//ProblemMap when isntantiated will track all entities, attributes and relationships.
//It is the primary means of creating and deleting entities, attributes and relationships
export class ProblemMap{
    Entities: Entity[];
    Relationships: Relationship[];
    attributeCounter: IterableIterator<number>; //Used to track the total number of current attributes and assign an appropriate ID.
    entityCounter: IterableIterator<number>; //Used to track the total number of entities and assign an appropriate ID.
    app:PIXI.Application<HTMLCanvasElement>;
    viewport:Viewport;
    constructor() {

        this.Entities = [];
        this.Relationships = [];
        this.attributeCounter = indexGenerator();
        this.entityCounter = indexGenerator();

        this.app = new PIXI.Application<HTMLCanvasElement>({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xAAAAAA, // Set the background color
        })

        document.body.appendChild(this.app.view)

        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1000,
            worldHeight: 1000,
            events: this.app.renderer.events,
        })

// add the viewport to the stage
        this.app.stage.addChild(this.viewport)

// activate plugins
        this.viewport
            .drag()
            .pinch()
            .wheel()
            .decelerate({friction: 0.8})
            .clampZoom({
                minScale: 0.25,
                maxScale: 2
            })

    }

}


//createEntity creates a new entity in problemMap, instantiates it in the DOM and isntantiates a
//wrappedElement (extension of PIXI.DisplayObject
export function createEntity(problemMap:ProblemMap, EntityName:string, EntityDescription:string):void{
    //create new Entity on problemMap
    const newID = problemMap.entityCounter.next().value;


    //instantiates the entityTemplate in the DOM sets IDs
    const container  = document.getElementById("body") as HTMLElement;
    const template = document.getElementById("entityTemplate") as HTMLTemplateElement;
    let clone = template.content.cloneNode(true) as HTMLElement;
    clone.querySelector<HTMLElement>("div")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".entityHeader")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".entityDescription")!.dataset.id = newID.toString();

    //populate the template with data
    clone.querySelector(".entityHeader[data-id]")!.innerHTML = EntityName;
    clone.querySelector(".entityDescription[data-id]")!.innerHTML = EntityDescription;
    container.appendChild(clone);

    //Selects the newly appended element in the DOM, wraps it and creates pushes a new Entity.
    const element = document.querySelector<HTMLElement>(".entity[data-id='"+newID+"']")
    const wrappedElement = new ElementWrapper(element);
    problemMap.Entities.push(new Entity(problemMap, newID, EntityName, EntityDescription, wrappedElement));

}

//createAttribute creates a new attribute on a particular entity object contained within problemMap by referencing
//the id of the entity object. createAttribute also instantiates the attribute in the DOM
export function createAttribute(problemMap:ProblemMap, id:number, name:string, description: string, type:string, units:string, value:string){
    //Create new Attribute on Entity by Entity id
    const newID = problemMap.attributeCounter.next().value;
    problemMap.Entities = problemMap.Entities.map(entity => {
        if (entity.id == id)
            entity.attributes.push(new Attribute(newID, name, description, type, units, value))
        return entity
    })

    //Following code creates instantiates the attributeTemplate in the DOM and renames the IDs as required
    const container = document.querySelector<HTMLElement>(".entity[data-id='"+id+"']");

    const template = document.getElementById("attributeTemplate") as HTMLTemplateElement;
    let clone = template.content.cloneNode(true) as HTMLElement;
    clone.querySelector<HTMLElement>("div")!.dataset.id = newID;
    clone.querySelector<HTMLElement>(".attributeTitle")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".attributeValue")!.dataset.id = newID.toString();
    clone.querySelector<HTMLElement>(".attributeBar")!.dataset.id = newID.toString();

    //Following code populates the template with data lol
    clone.querySelector(".attributeTitle[data-id]")!.innerHTML = name;
    clone.querySelector(".attributeValue[data-id]")!.innerHTML = value;

    //appendes template as a child of container in the DOM
    container!.appendChild(clone);
}

export function renderEntities(problemMap:ProblemMap) {
    problemMap.Entities.forEach(entity => {
        entity.wrappedElement.x = problemMap.viewport.toScreen(entity.location).x;
        entity.wrappedElement.y = problemMap.viewport.toScreen(entity.location).y;
        entity.wrappedElement.scale = new PIXI.Point(problemMap.viewport.scale.x, problemMap.viewport.scale.x);
    })
}