import {Application} from "../main.ts";
import * as PIXI from "pixi.js";
import ElementWrapper from "../element-wrapper.js";
import $ from "jquery"
import {EntityComponent} from "./View.ts";

export const getChildEntities = (parentEntity: Entity) => Application.Entities.filter(attribute => attribute.parent_entity_id == parentEntity.id)

//createEntity creates a new entity in problemMap, instantiates it in the DOM and isntantiates a
//wrappedElement (extension of PIXI.DisplayObject)
export function renderEntity(entity: Entity):void {
    const element = EntityComponent(entity)
        .appendTo('body')
        .get()[0]

    const wrappedElement = new ElementWrapper(element);

    const ProblemMapAttributeGroup =
        Application
            .ProblemMapAttributeGroups
            .find(pmag => pmag.entity_id == entity.id && pmag.problem_map_id == Application.ActiveProblemMap.id)

    Application.PixiApp.stage.addChild(wrappedElement);
    wrappedElement.position.set(ProblemMapAttributeGroup.x, ProblemMapAttributeGroup.y);
    wrappedElement.updateTarget();


    //todo: remove below when problemMap is fully removed from application
    Application.problemMap.Entities.push({
        id: entity.id,
        name: entity.title,
        description: entity.content,
        wrappedElement: wrappedElement,
        attributes: [],
        location : new PIXI.Point(ProblemMapAttributeGroup.x, ProblemMapAttributeGroup.y)
    })

}


//This currently preserves storing stuff on the problemMap variable, but will not be needed once relationship generation is sorted
export function createAttribute(entity_id:number, name:string, description: string, type:string, units:string, value:string){
    //Create new Attribute on Entity by Entity id
    const newID = Application.problemMap.attributeCounter.next().value;
    Application.problemMap.Entities = Application.problemMap.Entities.map(entity => {
        if (entity.id == entity_id)
            entity.attributes.push({id: newID, name: name, description: description, type: type, units: units, value: value, relationshipSlotAllocation: []})
        return entity
    })
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



export function editAttribute(id:number, name:string, description:string, type:string, value:string, units:string){
    let attribute = getAttributeByID(id)
    attribute.name = name;
    attribute.description = description;
    attribute.type = type;
    attribute.value = value;
    attribute.units = units;

    document.querySelector(".attributeTitle[data-id='"+id+"']")!.innerHTML = name;
    document.querySelector(".attributeValue[data-id='"+id+"']")!.innerHTML = value;

}

export function renderEntities() {
    Application.problemMap.Entities.forEach(entity => {
        entity.wrappedElement.x = Application.viewport.toScreen(entity.location).x;
        entity.wrappedElement.y = Application.viewport.toScreen(entity.location).y;
        entity.wrappedElement.scale = new PIXI.Point(Application.viewport.scale.x, Application.viewport.scale.x);
    })
}

export function getAttributeByID(id:number):Attribute{
    let att1 = null
    Application.problemMap.Entities.forEach(function(ent){
        ent.attributes.forEach(function(att){
            if(att.id == id){
                att1 = att;
            }
        })

    })
    return att1;
}

export function editContent(e:Event){
    let divToEdit = (<HTMLElement>e.target);
    divToEdit.contentEditable = "true";
}

export function stopEditContent(e:Event){

    let divToEdit = (<HTMLElement>e.target);
    divToEdit.contentEditable = "false";
}
