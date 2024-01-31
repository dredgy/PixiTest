import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import ElementWrapper from './element-wrapper.js';

const app = new PIXI.Application<HTMLCanvasElement>({
    width: window.innerWidth,
    height: window.innerHeight,
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
    .decelerate({friction: 0.8})

const newSquare = (x: number, y: number, color: PIXI.ColorSource):PIXI.Graphics => {
    const square = new PIXI.Graphics()
    square.beginFill(color)
    square.drawRect(x, y, 50, 50)
    square.endFill()
    square.interactive = true
    viewport.addChild(square)
    return square;
}

let box2 =newSquare(50, 50, 0xFF0000)
let box = newSquare(100, 100, 0x0000FF)

const element = document.getElementById('my-element');
const wrappedElement = new ElementWrapper(element);
app.stage.addChild(wrappedElement);

const element2 = document.getElementById('my-element1');
const wrappedElement2 = new ElementWrapper(element2);
app.stage.addChild(wrappedElement2);

app.ticker.add((delta) => {
    if(box.x < 1500){
        box.x += 1}
    else {
        box.x = 1;
    }

    let t = viewport.toScreen(new PIXI.Point(box.x, box.y))
    wrappedElement.x = t.x;
    wrappedElement.y = t.y;

    let p = viewport.toWorld(new PIXI.Point(wrappedElement2.x, wrappedElement2.y))
    //box2.x=p.x;
    //box2.y=p.y;

    //wrappedElement2.x += 1;
});



class Attribute {
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

class Entity {
    id: number;
    name: string;
    description: string;
    attributes: Attribute[];
    Div: HTMLElement;

    constructor(id:number, name:string, description:string) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.attributes = [];
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


//ProblemMap when isntantiated will track all entities, attributes and relationships.
//It is the primary means of creating and deleting entities, attributes and relationships
class ProblemMap{
    Entities: Entity[];
    Relationships: Relationship[];
    attributeCounter: number = 0; //Used to track the total numbnner of current attributes and assign an appropriate ID.

    constructor() {
        console.log("Problem Map Created");
        this.Entities = [];
        this.Relationships = [];
    }

    createEntity(EntityName:string, EntityDescription:string): void {
        this.Entities.push(new Entity(this.Entities.length+1, EntityName, EntityDescription));
        console.log(this.Entities)

        //Following code creates instantiates the entityTemplate in the DOM and renames the IDs as required
        const container  = document.getElementById("body") as HTMLElement;
        const template = document.getElementById("entityTemplate") as HTMLTemplateElement;
        let clone = template.content.cloneNode(true) as HTMLElement;
        clone.querySelector("div")!.id = "entity"+this.Entities.length;
        clone.querySelector(".entityHeader")!.id = "entityHeader"+this.Entities.length;
        clone.querySelector(".entityDescription")!.id = "entityDescription"+this.Entities.length;
        clone.querySelector("#templateAttributeContainer")!.id = "AttributeContainer"+this.Entities.length;

        //Following code populates the template with data lol
        clone.querySelector("#entityHeader"+this.Entities.length)!.innerHTML = EntityName;
        clone.querySelector("#entityDescription"+this.Entities.length)!.innerHTML = EntityDescription;

        container.appendChild(clone);
    }

    createAttribute(entityID:number, name:string, description: string, type:string, units:string, value:string): void {
        this.attributeCounter++; //Increment to track assigned IDs
        this.Entities[entityID].createAttribute(this.attributeCounter, name, description, type, units, value);


        //Following code creates instantiates the entityTemplate in the DOM and renames the IDs as required
        const container  = document.getElementById("entity"+entityID) as HTMLElement;
        const template = document.getElementById("attributeTemplate") as HTMLElement;
        let clone = template.content.cloneNode(true) as HTMLElement;
        clone.querySelector("div")!.id = "attribute"+this.attributeCounter;
        clone.querySelector("#templateAttributeTitle")!.id = "attributeTitle"+this.attributeCounter;
        clone.querySelector("#templateAttributeValue")!.id = "attributeValue"+this.attributeCounter;
        clone.querySelector("#templateAttributeProgress")!.id = "attributeProgress"+this.attributeCounter;

        //Following code populates the template with data lol
        clone.querySelector("#attributeTitle"+this.attributeCounter)!.innerHTML = name;
        clone.querySelector("#attributeValue"+this.attributeCounter)!.innerHTML = value;

        container.appendChild(clone);
    }
}

const problemMap = new ProblemMap();
problemMap.createEntity("dicks", "doubleDicks");
problemMap.createEntity("dicks2", "doubleDicks2");
problemMap.createEntity("dicks3", "doubleDicks3");
problemMap.createEntity("dicks3", "doubleDicks3");
problemMap.createAttribute(1, "Steve", "steves balls", "Hairy", "follicles", "12");
problemMap.createAttribute(2, "Steve", "steves balls", "Hairy", "follicles", "12");
problemMap.createAttribute(2, "Steve", "steves balls", "Hairy", "follicles", "12");
problemMap.createAttribute(2, "Steve", "steves balls", "Hairy", "follicles", "12");
problemMap.createAttribute(2, "Steve", "steves balls", "Hairy", "follicles", "12");
problemMap.createAttribute(3, "Steve", "steves balls", "Hairy", "follicles", "12");

/*
const container = document.getElementById("container");
const template = document.getElementById("template");

function clickHandler(event) {
    event.target.append(" — Clicked this div");
}

const firstClone = template.content.cloneNode(true);
firstClone.addEventListener("click", clickHandler);
container.appendChild(firstClone);
*/