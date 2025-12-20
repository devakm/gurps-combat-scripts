/* Usage: /:StatusDistraction
*/
console.log('---------------------- Start StatusStealth ----------------------');

// OtF action setup: 
let statusName ='Stealth'; //   status name, i.e. [M:Stealth]
let statusId ='stealth'; //   status name, i.e. [M:Stealth]
let statusDescription = 'to defense (Deceptive Attack)'; // Text description of the status

//let statusId ='stealth'; 
let hasStealth = _token.actor.statuses.some(e => e === statusId);



// check for argument defining the status name
//let scope = {}; // Define the scope variable
if (scope !== undefined) {
    console.log(scope)
    statusName = scope.status ? scope.status : 'Stealth';
    statusId = scope.id ? scope.id : 'stealth';
    statusDescription = scope.description ? scope.description : 'Deceptive Attack';
    statusPenalty = scope.penalty ? scope.penalty : -2;
    statusTag = scope.tag ? scope.tag : '#defense';
    statusClear = scope.clear ? scope.clear : false;
}
console.log(`statusName: ${statusName}; statusId: ${statusId}; statusDescription: ${statusDescription}; statusPenalty: ${statusPenalty}; statusTag: ${statusTag}; statusClear: ${statusClear}`);

let tokens = canvas.tokens.controlled

// If any tokens are selected ...
if (tokens && tokens.length > 0) {
    let allTokens = canvas.tokens.controlled;

    tokens.forEach(token => {

        const detectionModes = token.document.detectionModes;
        
        detectionModes.forEach(mode => {
            if (mode.id === "feelTremor") 
                mode.enabled = !mode.enabled;
        });
        
        token.document.update({
            "detectionModes": detectionModes
        });

    });

} else {
    console.log("No tokens selected");
    ui.notifications.warn("No tokens selected");
}


console.log(`---------------------- End StatusStealth ----------------------`);
