export function createInitialDLine(CoOrd1X:number, CoOrd1Y:number, CoOrd2X: number, CoOrd2Y:number, entity1:HTMLElement, entity2:HTMLElement) {

    //identify which side of the entity the line is connecting too.
    let entity1Orientation = CoOrd1X == entity1.left ? "left" : "right";
    let entity2Orientation = CoOrd2X == entity2.left ? "left" : "right";

    //If they are not on the same side
    if (entity1Orientation != entity2Orientation) {

        //Identify which point is odd(left)/even(right)
        let oddSlot = entity1Orientation == "left" ? entity1 : entity2;
        let evenSlot = entity1Orientation == "right" ? entity2 : entity1;

        //if the odd slot is to the left of the even slot it is a J Line otherwise its a Z Line
        if (oddSlot.getBoundingClientRect().x < evenSlot.getBoundingClientRect().x) {
            //function for J Line
            DLine = generateJLine(CoOrd1X, CoOrd1Y, CoOrd2X, CoOrd2Y, entity1, entity2);
        } else {
            //function for z Line
            DLine = generateZLine(CoOrd1X, CoOrd1Y, CoOrd2X, CoOrd2Y);
        }
    } else {
        //if they join on the same side its a C Line
        DLine = generateCLine(CoOrd1X, CoOrd1Y, CoOrd2X, CoOrd2Y, entity1, entity2)
    }
    return DLine;
}

export function generateCLine(CoOrd1X:number, CoOrd1Y:number, CoOrd2X: number, CoOrd2Y:number, entity1:HTMLElement, entity2:HTMLElement){

    //Figure out which element is the furtherest left/right
    let mostLeft = Math.min(entity1.getBoundingClientRect().left, entity2.getBoundingClientRect().left)
    let mostRight = Math.max(entity1.getBoundingClientRect().right, entity2.getBoundingClientRect().right)

    //sets the x 30 from the left or right of the coordinate as appropriate
    let keyx = coOrd1X == entity1.left ? mostLeft-30 : mostRight+30 ;

    let response = new array();
    //Construct the coordinates
    response.push([CoOrd1X, CoOrd1Y]);
    response.push([keyx, slot1Location.y]);
    response.push([keyx, slot2Location.y]);
    response.push([CoOrd2X, CoOrd2Y]);
    return response

}

export function generateZLine(CoOrd1X:number, CoOrd1Y:number, CoOrd2X: number, CoOrd2Y:number){

    //Figure out the X distance between the points
    let xSpan = CoOrd1X - CoOrd2X;
    //Set the x half way
    let keyx = CoOrd1X + (xSpan/2);

    //Set the coordinates
    let response = new array();
    //Construct the coordinates
    response.push([CoOrd1X, CoOrd1Y]);
    response.push([keyx, CoOrd1Y]);
    response.push([keyx, CoOrd2Y]);
    response.push([CoOrd2X, CoOrd2Y]);

    return response;
}

export function generateJLine(CoOrd1X:number, CoOrd1Y:number, CoOrd2X: number, CoOrd2Y:number, firstEntity:HTMLElement, secondEntity:HTMLElement) {

    //get screen coordinates of entities
    let ent2PositionY = secondEntity.getBoundingClientRect().y;

    //Set Y in the case that the second entity is entirely above the first entity
    //Take the first coordinate's y, add half the gap then add the first entities bottom bounds
    let y = ((firstEntity.getBoundingClientRect().y - secondEntity.getBoundingClientRect().bottom)/2)+secondEntity.getBoundingClientRect().bottom;

    //IF the first entity is entirely above the second entity
    if(firstEntity.getBoundingClientRect().bottom <= secondEntity.getBoundingClientRect().y) {
        //Take the second coordinate's y, add half the gap then add the second entities bottom bounds
        y = ((secondEntity.getBoundingClientRect().y - firstEntity.getBoundingClientRect().bottom)/2)+firstEntity.getBoundingClientRect().bottom;
    }

    //If the entitiy boxes overlap on the y axis, rout the line underneath the lowest line
    if(firstEntity.getBoundingClientRect().bottom >= ent2PositionY && firstEntity.getBoundingClientRect().y <= secondEntity.getBoundingClientRect().bottom) {
        //Take the highest value of either entities bottom bounds and add a buffer
        y = Math.max(secondEntity.getBoundingClientRect().bottom,firstEntity.getBoundingClientRect().bottom )+ (15*App.viewport.scale.x);
    }

    //Add buffers to each end. This buffer creates some space for hte first and fifth line segment.
    let bufferLeft = -30;
    let bufferRight = 30;

    let response = new array();
    //Construct the coordinates adding the buffer on each end
    response.push([CoOrd1X, CoOrd1Y]);
    response.push([CoOrd1X-bufferLeft, CoOrd1Y])
    response.push([CoOrd1X-bufferLeft, y])
    response.push([CoOrd2X+bufferLeft, y]);
    response.push([CoOrd2X+bufferLeft, CoOrd2Y]);
    response.push([CoOrd2X, CoOrd2Y]);

    return response
}