const YAML = require('yaml');
const fs = require('fs');


const file = fs.readFileSync('./statemachine.yaml','utf8');

const statemachine = YAML.parse(file);
let currentState = 'Start';

function getNextRoute(response) {
    const cur = statemachine.filter( x => { return x.ID === currentState });
    if (cur.length === 0) { 
        throw `No routes found for ${currentState}`;
    } 
    if (cur.length > 1) { 
        throw `Multiple Routes with same ID ${currentState}`;
    }
    const nextId = (cur[0].Transitions.filter(x => { return x.ID === response}));
    if (nextId.length === 0) { 
        throw `No options found for: ${response}`;
    } 
    if (nextId.length > 1) { 
        throw `Multiple Routes with same ID ${response}`;
    }

    return nextId[0].To;
}

function findLoops(state, visited){ 
    statemachine.forEach(s => {
        visited.push(s);
        s.Transitions.forEach(t => { 
            if (visited.filter(v => v.ID === t.To).length !== 0){ 
                throw `Loop detected at Question ${s.ID} Option: ${t.ID}`;
            }
        });
    });
}

findLoops(currentState,[]);
console.log(getNextRoute('O1'));