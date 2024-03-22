//Attribute   constructor(id:number, name: string, description: string, type:string, units:string, value:string) {
import * as PIXI from "pixi.js";
import ElementWrapper from "./element-wrapper.js";
import {Graphics} from "pixi.js";
import {Viewport} from "pixi-viewport";

export enum EntityType {
    ProblemMap = 1,
    AttributeGroup = 2,
    Attribute = 3,
}



declare global {

    export type Entity = {
        id: number
        title: string
        content: string
        parent_entity_id: number | null
        type: EntityType
    }

    export type Relationship = {
        id: number,
        attribute_1_id: number,
        attribute_2_id: number,
    }

    /**
     * Defines an AttributeGroup as it relates to a problem map.
     */
    export type ProblemMapAttributeGroup = {
        id: number
        entity_id: number
        problem_map_id : number
        x: number
        y: number
    }


    export type State = {
        problemMap: ProblemMap
        PixiApp: PIXI.Application<HTMLCanvasElement>
        viewport: Viewport
        moveLine: boolean,
        moveLineTarget: OldRelationship,
        Entities: Entity[],
        ProblemMapAttributeGroups: ProblemMapAttributeGroup[]
        Relationships: Relationship[]
        ActiveProblemMap: Entity
    }


    export type ProblemMap = {
        Entities: OldEntity[];
        Relationships: OldRelationship[];
        attributeCounter: IterableIterator<number>; //Used to track the total number of current attributes and assign an appropriate ID.
        entityCounter: IterableIterator<number>; //Used to track the total number of entities and assign an appropriate ID.
        relationshipCounter: IterableIterator<number>; //Used to track the total number of relationships and assign an appropriate ID.
    }

    export type Attribute = {
        id: number;
        name: string;
        description: string;
        type: string;
        units: string;
        value: any;
        relationshipSlotAllocation: number[];
    }

//Entity constructor(problemMap:ProblemMap,id:number, name:string, description:string, wrap:ElementWrapper, x?:number, y?:number) {
    /** @deprecated */
    export type OldEntity = {
        id: number;
        name: string;
        description: string;
        attributes: Attribute[];
        location: PIXI.Point;
        wrappedElement: ElementWrapper;
    }

    /** @deprecated */
    export type OldRelationship = {
        id: number;
        name: string;
        description: string;
        nature: string;
        cause: number;
        effect: number;
        causeSlot:number;
        effectSlot:number;
        line: DLine,
        graphic: PIXI.Graphics,
        Handle: PIXI.Graphics,
    }


    export type DLine = {
        lineType: string,
        keyPoint1: PIXI.Point,
        KeyPoint2: PIXI.Point,
        bufferLeft: number,
        bufferRight: number,
        locked: boolean,
    }

}