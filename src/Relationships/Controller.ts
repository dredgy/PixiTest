import * as PIXI from "pixi.js";
import {LINE_CAP, LINE_JOIN} from "pixi.js";
import {Application} from "../main.ts";

function isOdd(num) { return num % 2;}

function getOldRelationShipById(id: number) {
    let relationship = null;
    Application.problemMap.Relationships.forEach(function (rel) {
        if (rel.id == id) {
            relationship = rel;
        }
    })
    return relationship
}

export function createInitialDLine(id1: number, slot1: number, buffer1: number, id2: number, slot2: number, buffer2: number, rel: OldRelationship) {

    //Get DOM Elements for attributes
    let firstAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id1 + '"]')
    let secondAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id2 + '"]')

    //Calculate left/rightedness of each attribute
    let firstAttributeDirection = isOdd(slot1) ? -15 : 15;
    let secondAttributeDirection = isOdd(slot2) ? -15 : 15;

    //calculate the offset of attribute 1.
    let att1OffsetY = firstAttribute.offsetHeight / 4 * (Math.round(slot1 / 2)) * Application.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
    let att1OffsetX = firstAttributeDirection == 15 ? firstAttribute.offsetWidth * Application.viewport.scale.x : 0;

    //calculate the offset of attribute 2.
    let att2OffsetY = secondAttribute.offsetHeight / 4 * (Math.round(slot2 / 2)) * Application.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
    let att2OffsetX = secondAttributeDirection == 15 ? secondAttribute.offsetWidth * Application.viewport.scale.x : 0;

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

export function generateCLine(slot1Location: PIXI.Point, slot2Location: PIXI.Point, slot1: number, slot2: number, id1: number, id2: number) {

    let firstAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id1 + '"]')
    let secondAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id2 + '"]')

    let mostLeft = Math.min(firstAttribute.getBoundingClientRect().left, secondAttribute.getBoundingClientRect().left)
    let mostRight = Math.max(firstAttribute.getBoundingClientRect().right, secondAttribute.getBoundingClientRect().right)

    //let distance = slot1Location.x <= slot2Location.x? -30 : slot2Location.x-slot1Location.x - 30;
    let keyx = isOdd(slot1) ? mostLeft - (30 * Application.viewport.scale.x) : mostRight + (30 * Application.viewport.scale.x);

    let KeyPoint1 = Application.viewport.toWorld(new PIXI.Point(keyx, slot1Location.y));
    let KeyPoint2 = Application.viewport.toWorld(new PIXI.Point(keyx, slot2Location.y));
    let CLine: DLine = {
        lineType: "C",
        keyPoint1: KeyPoint1,
        KeyPoint2: KeyPoint2,
        bufferLeft: isOdd(slot1) ? -30 : 0,
        bufferRight: isOdd(slot1) ? 30 : 0,
        locked: false,

    }
    return CLine;
}

export function generateZLine(slot1Location: PIXI.Point, slot2Location: PIXI.Point, slot1: number, slot2: number) {

    let xSpan = slot1Location.x - slot2Location.x;
    let keyx = slot2Location.x + (xSpan / 2);
    let KeyPoint1 = Application.viewport.toWorld(new PIXI.Point(keyx, slot1Location.y));
    let KeyPoint2 = Application.viewport.toWorld(new PIXI.Point(keyx, slot2Location.y));
    let ZLine: DLine = {
        lineType: "Z",
        keyPoint1: KeyPoint1,
        KeyPoint2: KeyPoint2,
        bufferLeft: 0,
        bufferRight: 0,
        locked: false,

    }
    return ZLine;
}

export function generateJLine(slot1Location: PIXI.Point, slot2Location: PIXI.Point, id1: number, id2: number) {
    let firstAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id1 + '"]')
    let secondAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + id2 + '"]')

    let firstEntity: HTMLElement = firstAttribute.parentElement.parentElement;
    let secondEntity: HTMLElement = secondAttribute.parentElement.parentElement;


    //get screen coordinates of entities
    let ent1PositionY = firstEntity.getBoundingClientRect().bottom;
    let ent2PositionY = secondEntity.getBoundingClientRect().y;

    let xSpan = slot2Location.x - slot1Location.x;
    let ySpan = slot1Location.y - slot2Location.y;
    //let middle = slot2Location.y + (ySpan/2);

    let y = (slot2Location.y + ((firstEntity.getBoundingClientRect().y - secondEntity.getBoundingClientRect().bottom) / 2) + secondEntity.getBoundingClientRect().bottom - slot2Location.y);


    if (firstEntity.getBoundingClientRect().bottom <= secondEntity.getBoundingClientRect().y) {
        y = (slot1Location.y + ((secondEntity.getBoundingClientRect().y - firstEntity.getBoundingClientRect().bottom) / 2) + firstEntity.getBoundingClientRect().bottom - slot1Location.y);
    }
    if (firstEntity.getBoundingClientRect().bottom >= ent2PositionY && firstEntity.getBoundingClientRect().y <= secondEntity.getBoundingClientRect().bottom) {
        y = Math.max(secondEntity.getBoundingClientRect().bottom, firstEntity.getBoundingClientRect().bottom) + (15 * Application.viewport.scale.x);
    }


    let bufferLeft = -30 * Application.viewport.scale.x;
    let bufferRight = 30 * Application.viewport.scale.x;
    //let KeyPoint1 = App.viewport.toWorld(new PIXI.Point(slot1Location.x+bufferLeft, slot1Location.y+middle+potato));
    let KeyPoint1 = Application.viewport.toWorld(new PIXI.Point(slot1Location.x + bufferLeft, y));
    let KeyPoint2 = Application.viewport.toWorld(new PIXI.Point(slot2Location.x + bufferRight, y));
    let JLine: DLine = {
        lineType: "J",
        keyPoint1: KeyPoint1,
        KeyPoint2: KeyPoint2,
        bufferLeft: bufferLeft,
        bufferRight: bufferRight,
        locked: false,

    }
    return JLine;
}

export function createRelationship(name: string, desc: string, nature: string, id1: number, id2: number, causeSlot: number, effectSlot: number) {
    let DLine = createInitialDLine(id1, causeSlot, 0, id2, effectSlot, 0, null);
    Application.problemMap.Relationships.push({
        id: Application.problemMap.relationshipCounter.next().value,
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

export function renderRelationships() {
    const lineStyleOptions = {
        width: 10,
        color: 0xCE91FF,
        cap: LINE_CAP.SQUARE,
        join: LINE_JOIN.ROUND
    }


    Application.problemMap.Relationships.forEach(rel => {

        if (Application.moveLine == false) {
            rel.line = createInitialDLine(rel.cause, rel.causeSlot, 0, rel.effect, rel.effectSlot, 0, rel)
        }
        //Get DOM Elements for attributes
        let firstAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + rel.cause + '"]')
        let secondAttribute = document.querySelector<HTMLElement>('.attribute[data-id="' + rel.effect + '"]')

        //Calculate left/rightedness of each attribute
        let firstAttributeDirection = isOdd(rel.causeSlot) ? -15 : 15;
        let secondAttributeDirection = isOdd(rel.effectSlot) ? -15 : 15;

        //calculate the offset of attribute 1.
        let att1OffsetY = firstAttribute.offsetHeight / 4 * (Math.round(rel.causeSlot / 2)) * Application.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
        let att1OffsetX = firstAttributeDirection == 15 ? firstAttribute.offsetWidth * Application.viewport.scale.x : 0;
        //calculate the offset of attribute 2.
        let att2OffsetY = secondAttribute.offsetHeight / 4 * (Math.round(rel.effectSlot / 2)) * Application.viewport.scale.y; //scaling by viewport is required as css transform doesn't change the actual offsets
        let att2OffsetX = secondAttributeDirection == 15 ? secondAttribute.offsetWidth * Application.viewport.scale.x : 0;

        let slot1Location = new PIXI.Point(firstAttribute.getBoundingClientRect().x + att1OffsetX, firstAttribute.getBoundingClientRect().y + att1OffsetY)
        let slot2Location = new PIXI.Point(secondAttribute.getBoundingClientRect().x + att2OffsetX, secondAttribute.getBoundingClientRect().y + att2OffsetY)
        let slot1LocationWorld = Application.viewport.toWorld(slot1Location);
        let slot2LocationWorld = Application.viewport.toWorld(slot2Location);

        rel.graphic.clear();

        rel.graphic.lineStyle(lineStyleOptions);
        if (rel.line.lineType == "C") {
            rel.graphic.moveTo(slot1LocationWorld.x, slot1LocationWorld.y)
            rel.graphic.lineTo(rel.line.keyPoint1.x, rel.line.keyPoint1.y);
            //breakLine(rel.graphic, rel.line.keyPoint1.x, rel.line.keyPoint1.y, rel.line.KeyPoint2.x, rel.line.KeyPoint2.y, rel.id)
            //detectIntersections(new PIXI.Point(rel.line.keyPoint1.x, rel.line.keyPoint1.y), new PIXI.Point(rel.line.KeyPoint2.x, rel.line.KeyPoint2.y), rel.id)
            rel.graphic.lineTo(rel.line.KeyPoint2.x, rel.line.KeyPoint2.y);
            rel.graphic.lineTo(slot2LocationWorld.x, slot2LocationWorld.y)
        }
        if (rel.line.lineType == "J") {
            rel.graphic.moveTo(slot1LocationWorld.x, slot1LocationWorld.y)
            rel.graphic.lineTo(rel.line.keyPoint1.x, slot1LocationWorld.y);
            rel.graphic.lineTo(rel.line.keyPoint1.x, rel.line.keyPoint1.y);
            rel.graphic.lineTo(rel.line.KeyPoint2.x, rel.line.KeyPoint2.y);
            rel.graphic.lineTo(rel.line.KeyPoint2.x, slot2LocationWorld.y);
            rel.graphic.lineTo(slot2LocationWorld.x, slot2LocationWorld.y)
        }
        if (rel.line.lineType == "Z") {
            rel.graphic.moveTo(slot1LocationWorld.x, slot1LocationWorld.y)
            rel.graphic.lineTo(rel.line.keyPoint1.x, rel.line.keyPoint1.y);
            rel.graphic.lineTo(rel.line.KeyPoint2.x, rel.line.KeyPoint2.y);
            rel.graphic.lineTo(slot2LocationWorld.x, slot2LocationWorld.y)
        }

        Application.viewport.addChild(rel.graphic);


        rel.Handle.clear();
        rel.Handle.beginFill(0xffff55)

        //create horizontal line
        rel.Handle.drawRect(rel.line.keyPoint1.x - 5, rel.line.KeyPoint2.y - 5, (rel.line.KeyPoint2.x - rel.line.keyPoint1.x + 5), 20);

        //create vertical line
        rel.Handle.drawRect(rel.line.keyPoint1.x - 5, rel.line.keyPoint1.y - 5, 20, (rel.line.KeyPoint2.y - rel.line.keyPoint1.y));

        //create other vertical lines
        rel.Handle.drawRect(rel.line.KeyPoint2.x - 5, rel.line.KeyPoint2.y - 5, 20, (rel.line.keyPoint1.y - rel.line.KeyPoint2.y));

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

        Application.viewport.addChild(rel.Handle);
    })
}

function lineClicked(e: Event) {
    let id: number = parseInt(this.name)
    let rel = getOldRelationShipById(id);
    rel.line.locked = true;
    Application.moveLine = true;
    Application.moveLineTarget = rel;

}

function lineUnlock(e: Event) {
    e.preventDefault();
    let id: number = parseInt(this.name)
    let rel = getOldRelationShipById(id);
    rel.line.locked = false;
}

export function lineRelease(e: Event) {
    Application.viewport.pause = false;
    let id: number = parseInt(this.name)
    let rel = getOldRelationShipById(id);
    //rel.line.locked = true;
    Application.moveLine = false;
    Application.moveLineTarget = null;

    //showPrompt("lol", document.querySelector(".deleteEntity"), "getRandomInt")
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function breakLine(graphic: PIXI.Graphics, currentX: number, currentY: number, targetX: number, targetY: number, id: number) {
    let l = detectIntersections(new PIXI.Point(currentX, currentY), new PIXI.Point(targetX, targetY), id)
    if (l == null) {
        graphic.lineTo(targetX, targetY)
    } else {
        attemptLine(graphic, currentX, currentY, targetX, targetY, id)
    }
}

export function attemptLine(graphics: PIXI.Graphics, currentX: number, currentY: number, targetX: number, targetY: number, id: number) {

    let l = detectIntersections(new PIXI.Point(currentX, currentY), new PIXI.Point(targetX, targetY), id)
    //console.log(l)
    if (l != null) {
        graphics.lineTo(l[0].x, l[0].y - 20)
        graphics.moveTo(l[0].x, l[0].y + 20)
        attemptLine(graphics, currentX, l[0].y + 40, targetX, targetY, id)
        l = null;
    } else {
        console.log(l + " and ", new PIXI.Point(currentX, currentY), new PIXI.Point(targetX, targetY))
        graphics.lineTo(targetX, targetY)
    }
}

export function detectIntersections(point1: PIXI.Point, point2: PIXI.Point, id: number) {
    let result: PIXI.Point[] = [];
    for (let rel1 of Application.problemMap.Relationships) {
        if (rel1.id != id) {
            console.log("IDs ", rel1.id, " ", id)
            result.push(intersects(point1.x, point1.y, point2.x, point2.y, rel1.line.keyPoint1.x, rel1.line.keyPoint1.y, rel1.line.KeyPoint2.x, rel1.line.KeyPoint2.y))
            console.log(result)

        } else {
            console.log("notYo")
        }
    }
    console.log(result)
    return result;
}

function intersects(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return null; // Lines are parallel, no intersection
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        if (0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) {
            // Calculate intersection point
            var x = a + lambda * (c - a);
            var y = b + lambda * (d - b);
            return new PIXI.Point(x, y); // Return the intersection point's coordinates
        } else {
            return null; // No intersection within the segments
        }
    }
}