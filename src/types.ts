//Attribute   constructor(id:number, name: string, description: string, type:string, units:string, value:string) {
import * as PIXI from "pixi.js";
import ElementWrapper from "./element-wrapper.js";
import {Graphics} from "pixi.js";
import {Viewport} from "pixi-viewport";
declare global {

    export type State = {
        lines:lineDetails[]
        tripleLines:tripleLine[]
        problemMap: ProblemMap
        PixiApp: PIXI.Application<HTMLCanvasElement>
        viewport: Viewport
    }

    export type lineDetails = {
        FirstEntity: Entity
        SecondEntity: Entity
        Graphic: Graphics
    }

    export type tripleLine = {
        Line1: Graphics
        Line2: Graphics
        Line3: Graphics
        start: PIXI.Point
        second: PIXI.Point
        third: PIXI.Point
        last: PIXI.Point
        att1: Attribute
        att1Connection: string
        att2: Attribute
        att2Connection: string
    }

    export type ProblemMap = {
        Entities: Entity[];
        Relationships: Relationship[];
        attributeCounter: IterableIterator<number>; //Used to track the total number of current attributes and assign an appropriate ID.
        entityCounter: IterableIterator<number>; //Used to track the total number of entities and assign an appropriate ID.
    }

    export type Attribute = {
        id: number;
        name: string;
        description: string;
        type: string;
        units: string;
        value: any;
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
    }
}