import $ from "jquery"
import {EntityType} from "../Types.ts";
import {yieldElements} from "../Application/Controller.ts";
import {getChildEntities} from "./Controller.ts";
import {Application} from "../main.ts";

export const ChildEntityComponents = (parentEntity:Entity) => getChildEntities(parentEntity).map(EntityComponent)

export const Attribute = (entity: Entity) : JQuery<HTMLElement> => {
   return $(`
    <div class="attribute" data-id="${entity.id}">
      <div class="attributeTitle">${entity.title}</div>
      <div class="attributeValue">${entity.content}</div>
      <div class="attributeDelete" data-id="${entity.id}">X</div>
      <div class="attributeLink" data-id="${entity.id}">@</div>
      <div class="attributeEdit" data-id="${entity.id}">E</div>
      <div class="attributeBar"><progress value="32" max="100"> 32% </progress></div>
    </div>   
   `)
}

//todo: Change the parameters here so it just takes an entity directly. See sample code in "Tirixus" repo
export const AttributeGroup = (entity: Entity) : JQuery<HTMLElement> => {
   const attributes = ChildEntityComponents(entity)

   return $(`
    <div class="entity" data-id="${entity.id}">
          <div class="entityHeader" data-id="${entity.id}">${entity.title}</div>
          <div class="entityDescription">${entity.content}</div>
          <div class="attributeContainer">
            ${yieldElements(attributes)}
          </div>
          <div class="entityToolbar">
            <div class="deleteEntity" data-id="${entity.id}">Delete Entity</div>
            <div class="createAttribute" data-id="${entity.id}">Create Attribute</div>
          </div>
    </div>
   `)
}

export const ProblemMap = (entity: Entity) : JQuery<HTMLElement> => $('')

export const EntityComponent = (entity: Entity) => {
   switch(entity.type){
      case EntityType.ProblemMap:
         return ProblemMap(entity)
      case EntityType.AttributeGroup:
         return AttributeGroup(entity)
      case EntityType.Attribute:
      default:
         return Attribute(entity)
   }
}