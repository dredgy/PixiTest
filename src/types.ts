//Attribute   constructor(id:number, name: string, description: string, type:string, units:string, value:string) {
import * as PIXI from "pixi.js";
import ElementWrapper from "./element-wrapper.js";
import {Graphics} from "pixi.js";
import {Viewport} from "pixi-viewport";
declare global {

    export type State = {
        problemMap: ProblemMap
        PixiApp: PIXI.Application<HTMLCanvasElement>
        viewport: Viewport
        moveLine: boolean,
        moveLineTarget: Relationship,
    }


    export type ProblemMap = {
        Entities: Entity[];
        Relationships: Relationship[];
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
    export type Entity = {
        id: number;
        name: string;
        description: string;
        attributes: Attribute[];
        location: PIXI.Point;
        wrappedElement: ElementWrapper;
    }

    export type Relationship = {
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