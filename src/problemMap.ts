import * as PIXI from "pixi.js";
import * as EntityController from './Entities/Controller.ts'
import {Application} from "./main.ts";
import '@pixi/math-extras';
import {createRelationship, getRandomInt, renderRelationships} from "./Relationships/Controller.ts";



//Todo: Holy fuck, change to JQuery.
export function clickUI (e:PointerEvent) {
    switch ((<Element>e.target)!.className) {
        case "entityHeader": {
            e.preventDefault()
            let dragging = true;
            //code to find the object
            let divID = Application.problemMap.Entities.findIndex(item => item.id.toString() == (<HTMLElement>e.target).dataset.id)
            let screenLocation: PIXI.Point = Application.viewport.toScreen(new PIXI.Point(Application.problemMap.Entities[divID].location.x, Application.problemMap.Entities[divID].location.y));
            let cursorLocation: PIXI.Point = new PIXI.Point(e.clientX, e.clientY);
            let offset: PIXI.Point = new PIXI.Point(cursorLocation.x - screenLocation.x, cursorLocation.y - screenLocation.y)

            document.querySelector<HTMLElement>("body")!.addEventListener("pointerup", function () {
                dragging = false;
            })
            document.querySelector<HTMLElement>("body")!.addEventListener("pointermove", function (a) {
                if (dragging) {
                    Application.problemMap.Entities[divID].location = Application.viewport.toWorld(new PIXI.Point(a.clientX - offset.x, a.clientY - offset.y));
                    renderRelationships()
                }
            })
            break;
        }
        case "newEntityButton":{

            break;
        }
        case "deleteEntity":{
            EntityController.deleteEntity((<HTMLElement>e.target).dataset.id as unknown as number)
            break;
        }
        case "createAttribute":{

            EntityController.createAttribute((<HTMLElement>e.target).dataset.id as unknown as number, '4', "potato", "potatoes", "potata", "kg")
            break;
        }
        case "attributeDelete":{
            EntityController.deleteAttribute((<HTMLElement>e.target).dataset.id as unknown as number);
            break;
        }

        case "attributeEdit":{
            generateEditAttributePrompt(parseInt((<HTMLElement>e.target).dataset.id))
            break;
        }
        case "cancelPrompt":{
            let prompt:HTMLDialogElement = document.querySelector(".prompt");
            prompt.close()
            break;
        }
        case "confirmPrompt":{
            let confirmPrompt:HTMLDialogElement = document.querySelector(".confirmPrompt");
            if(confirmPrompt.dataset.function == "relationshipPromptSubmitted"){
                relationshipPromptSubmitted();
            }
            if(confirmPrompt.dataset.function == "editAttributePromptSubmitted"){
                editAttributeSubmitted()
            }

            break;
        }

        case "attributeLink":{

            e.preventDefault()
            let dragging = true;
            let initialLocation: PIXI.Point = Application.viewport.toWorld(new PIXI.Point(e.clientX, e.clientY));
            let line = new PIXI.Graphics;

            let att1:HTMLElement = (<HTMLElement>e.target)



            //This code was designed to make josh cry.
            const releaseLine = (f:PointerEvent) => {
                dragging = false;
                line.clear();
                let att2 :HTMLElement = (<HTMLElement>f.target)
                let att3 =att2.parentElement;

                let att2ysector = att3.offsetHeight / 4;
                let mouseY = f.clientY - att3.getBoundingClientRect().top;
                let mouseX = f.clientX - att3.getBoundingClientRect().left
                let slotY = Math.round(mouseY/att2ysector/Application.viewport.scale.y);
                let slotX = mouseX/Application.viewport.scale.x;
                if(slotY == 0) {
                    slotY = 1;
                }
                let slot = slotX < att3.offsetWidth/2 ? slotY * 2-1 : slotY *2 ;



                //newTripleLine(getAttributeByID((<number><unknown>att1.dataset.id)), "right", getAttributeByID((<number><unknown>att2.dataset.id)), "right" )
                generateRelationshipPrompt( parseInt(att1.dataset.id), parseInt(att2.dataset.id), getRandomInt(6), slot)

                document.querySelectorAll<HTMLElement>(".attribute").forEach(e => e.style.background = "initial")
                document.querySelector<HTMLElement>("body").removeEventListener("pointerup", releaseLine)
                renderRelationships()
            }

          document.querySelector<HTMLElement>("body")!.addEventListener("pointerup", releaseLine);

            document.querySelector<HTMLElement>("body")!.addEventListener("pointermove", function (a) {
                if (dragging) {
                    let cursor:PIXI.Point = Application.viewport.toWorld(new PIXI.Point(a.clientX, a.clientY));
                    line.clear();
                    line.lineStyle(2, 0x999999);
                    line.moveTo(initialLocation.x, initialLocation.y);
                    line.lineTo(cursor.x, cursor.y)
                    Application.viewport.addChild(line);
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



export function lineMove(e){
    if(Application.moveLine){

        Application.viewport.pause = true
        if(Application.moveLineTarget.line.lineType == "C" || Application.moveLineTarget.line.lineType == "Z"){
            Application.moveLineTarget.line.keyPoint1.x = Application.viewport.toWorld(e.clientX, 0).x;
            Application.moveLineTarget.line.KeyPoint2.x = Application.viewport.toWorld(e.clientX, 0).x ;

        }
        else{
            Application.moveLineTarget.line.keyPoint1.y = Application.viewport.toWorld(0, e.clientY).y;
            Application.moveLineTarget.line.KeyPoint2.y = Application.viewport.toWorld(0, e.clientY).y;
        }
        renderRelationships();
    }
}

export function showPrompt(title:string, content:HTMLElement, confirmationFunction:string){
    let prompt:HTMLDialogElement = document.querySelector(".prompt");
    let promptHeader = document.querySelector(".promptHeader");
    let confirmPrompt:HTMLElement =  document.querySelector(".confirmPrompt");
    let promptContent = prompt.querySelector(".promptContent");
    confirmPrompt.dataset.function = confirmationFunction;
    promptContent.replaceChildren(content)
    promptHeader.innerHTML=title;
    prompt.showModal();
}

export function generateRelationshipPrompt( id1:number, id2:number, causeSlot:number, effectSlot:number) {
    const template = document.getElementById("relationshipPrompt") as HTMLTemplateElement;
    let clone = template.content.cloneNode(true) as HTMLElement;
    clone.querySelector<HTMLInputElement>("#relCause").value = id1.toString();
    clone.querySelector<HTMLInputElement>("#relEffect").value = id2.toString();
    clone.querySelector<HTMLInputElement>("#relCauseSlot").value = causeSlot.toString();
    clone.querySelector<HTMLInputElement>("#relEffectSlot").value = effectSlot.toString();
    showPrompt("Create Relationship", clone, "relationshipPromptSubmitted")
}

export function generateEditAttributePrompt( id1:number) {
    const template = document.getElementById("editAttributePrompt") as HTMLTemplateElement;
    let clone = template.content.cloneNode(true) as HTMLElement;
    let attribute = EntityController.getAttributeByID(id1);
    clone.querySelector<HTMLInputElement>("#attName").value = attribute.name;
    clone.querySelector<HTMLInputElement>("#attDescription").value = attribute.description;
    clone.querySelector<HTMLInputElement>("#attType").value = attribute.type;
    clone.querySelector<HTMLInputElement>("#attUnits").value = attribute.units;
    clone.querySelector<HTMLInputElement>("#attValue").value = attribute.value;
    clone.querySelector<HTMLElement>("#attributeForm").dataset.id = id1.toString();
    showPrompt("Edit: "+id1, clone, "editAttributePromptSubmitted")
}

export function editAttributeSubmitted(){
    const attributeFom:HTMLElement = document.querySelector("#attributeForm")
    // Access the form values
    const name = (document.getElementById('attName') as HTMLInputElement).value;
    const description = (document.getElementById('attDescription') as HTMLTextAreaElement).value;
    const type = (document.getElementById('attType') as HTMLInputElement).value;
    const units = (document.getElementById('attUnits') as HTMLInputElement).value;
    const value = (document.getElementById('attValue') as HTMLInputElement).value;
    let id = parseInt(attributeFom.dataset.id);
    EntityController.editAttribute(id, name, description, type, value, units);
    document.querySelector<HTMLDialogElement>(".prompt").close();
    console.log(Application.problemMap);
}

export function relationshipPromptSubmitted(){

        // Access the form values
        const name = (document.getElementById('relName') as HTMLInputElement).value;
        const description = (document.getElementById('relDescription') as HTMLTextAreaElement).value;
        const nature = (document.getElementById('relNature') as HTMLInputElement).value;
        const cause = parseInt((document.getElementById('relCause') as HTMLInputElement).value, 10);
        const effect = parseInt((document.getElementById('relEffect') as HTMLInputElement).value, 10);
        const causeSlot = parseInt((document.getElementById('relCauseSlot') as HTMLInputElement).value, 10);
        const effectSlot = parseInt((document.getElementById('relEffectSlot') as HTMLInputElement).value, 10);

        console.log( name, description, nature, cause, effect, causeSlot, effectSlot);
        createRelationship(name,description,nature,cause,effect,causeSlot,effectSlot)
        document.querySelector<HTMLDialogElement>(".prompt").close();
        renderRelationships();
}


export function generateEditEntityPrompt( id1:number) {
    const template = document.getElementById("editEntityPrompt") as HTMLTemplateElement;
    let clone = template.content.cloneNode(true) as HTMLElement;
    let attribute = EntityController.getAttributeByID(id1);
    clone.querySelector<HTMLInputElement>("#attName").value = attribute.name;
    clone.querySelector<HTMLInputElement>("#attDescription").value = attribute.description;
    clone.querySelector<HTMLInputElement>("#attType").value = attribute.type;
    clone.querySelector<HTMLInputElement>("#attUnits").value = attribute.units;
    clone.querySelector<HTMLInputElement>("#attValue").value = attribute.value;
    clone.querySelector<HTMLElement>("#attributeForm").dataset.id = id1.toString();
    showPrompt("Edit: "+id1, clone, "editAttributePromptSubmitted")
}

export function editEntitySubmitted(){
    const attributeFom:HTMLElement = document.querySelector("#attributeForm")
    // Access the form values
    const name = (document.getElementById('attName') as HTMLInputElement).value;
    const description = (document.getElementById('attDescription') as HTMLTextAreaElement).value;
    const type = (document.getElementById('attType') as HTMLInputElement).value;
    const units = (document.getElementById('attUnits') as HTMLInputElement).value;
    const value = (document.getElementById('attValue') as HTMLInputElement).value;
    let id = parseInt(attributeFom.dataset.id);
    EntityController.editAttribute(id, name, description, type, value, units);
    document.querySelector<HTMLDialogElement>(".prompt").close();
}

