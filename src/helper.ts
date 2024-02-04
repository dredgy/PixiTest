/* Use this code in app.ticker if you want the entities to jiggle jiggle.
function randomWalk(problemMap:ProblemMap){
    problemMap.Entities.forEach(entity => {
        entity.location.x += (Math.random()-0.5)*4;
        entity.location.y += (Math.random()-0.5)*4;
    })
}*/
export function* indexGenerator():Generator<number>{
    let index :number = 1;
    while (true){
        yield index;
        index++;
    }
}