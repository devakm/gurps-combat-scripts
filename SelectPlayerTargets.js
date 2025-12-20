
/*
This script macro will automatically select the current combatant if that combatant is owned by the user.
Setting 'releaseAll' below to true will release all tokens if the current combatant is not owned by the user. This will result in all owned tokens sharing their vision.

Author: CDeenen
*/
const releaseAll = true;

//If the macro is already registered, warn the user and end the macro
if (game.autoSelectCombatant) {
    ui.notifications.warn("'Autoselect Combatant' macro already registered");
    return;
}
ui.notifications.info("Registering 'Autoselect Combatant' macro");

//Register game.autoCombatant to prevent macro duplicates
game.autoSelectCombatant = true;

//On the 'updateCombat' hook, get the token of the current combatant and control it if the user owns the token, otherwise release all tokens if 'releaseAll' is set to true
Hooks.on('updateCombat', (combat) => {
    const token = canvas.tokens.get(combat.current.tokenId);
    if (token.isOwner) {
        token.control();
    }
    else if (releaseAll) {
        canvas.tokens.releaseAll() 
    }
});










//--------------------------//
var playerDropdown = "";
var userArray = Array.from(game.users);
for (let i = 0; i < userArray.length; i++) {
    playerDropdown += "<option value='" + userArray[i].id + "'>" + userArray[i].name + "</option>";
}

new Dialog({
    title: "Select Player's Targets",
    content: "<label for='players' style='font-weight:bold; width:38%; margin:4px 1%; display:inline-block;'>Select Player</label><select id='players' style='width:58%; margin:4px 1%; display:inline-block;'>" + playerDropdown + "</select>",
    buttons: {
        select: {
            label: "Select Player's Targets",
            callback: (html) => selectTargets(html)
        }
    }
}).render(true);

function selectTargets(html) {
    var playerID = html.find("#players").val();
    var selectedPlayer = game.users.get(playerID);
    if (selectedPlayer.targets.size < 1) {
        ui.notifications.info(selectedPlayer.name + " does not currently have any targets selected.");
    } else {
        canvas.tokens.releaseAll();
        canvas.tokens.placeables.forEach(t => {
            if (selectedPlayer.targets.ids.includes(t.id) === true) {
                t.control({
                    releaseOthers: false
                });
            }
        });
    }
}

game.users.current.isGM = false then get player id and send to gm

let runPlayer = game.users.current
runPlayer.data.name
runPlayer.data._id

let targets = Array.from(game.user.targets); 

let target = runPlayer.targets[0].value.data._id



let runGM = game.users.current
runGM.data.name

let GM = game.users.get("sVxF0AzuvK7ZMqXx")
GM.data._id
token.control

let GM = game.users.get("sVxF0AzuvK7ZMqXx")

// almost works
let OtF = `[/sel ${me}]`;
console.log(OtF);
await GURPS.executeOTF(OtF);	
///--------------



// Usage: /:PickMyTarget
let triggerToken = _token.data._id;
let playerId = game.users.current.data._id;
let targets = Array.from(game.user.targets);
if (targets.length < 1) {
	ui.notifications.info("You must have a target selected.");
} else {
	let tokenArg = { tokenPicked: triggerToken, playerId: playerId, playerTarget: targets[0].id };
	let macroName = 'TargetMyTarget';
console.log(`----- run macroName: ${macroName}; on triggerToken: ${triggerToken}; runPlayer: ${playerId}; target: ${targets[0].name}`);
	const macro = game.macros.getName(macroName);
	await macro.execute(tokenArg);
}


// Usage: /:TargetMyTarget 
console.log(`----- in TargetMyTarget ----`);
let GMid = "sVxF0AzuvK7ZMqXx";
let runPlayer;
let playerTarget = "x4KT5djBTVyWCqew";
let targetToken = canvas.tokens.get(playerTarget); // select the token that started this action
let playerId = 'sVxF0AzuvK7ZMqXx';
let tokenPicked = 'L9ON8D8ttYn8ykvv'; // Test with Fergus 'dV9Y2WVh5Uogenql'
console.log(`----- in TargetMyTarget: tokenPicked: ${tokenPicked} ----`);
let tokenSelect = canvas.tokens.get(tokenPicked); // select the token that started this action
tokenSelect.control();
if (game.users.current.data._id === GMid) {
	runPlayer = game.users.get(GMid); // uses id for Gamemaster
} else {
	runPlayer = game.users.get(playerId); // uses id for Gamemaster
}
let GM = game.users.get(GMid);
GM.updateTokenTargets(targetToken);


// Usage: /:PickMe
let macroName = 'SelectToken';
let triggerToken = _token.data._id;
console.log(`----- in PickMe, triggerToken: ${triggerToken} ----`);
let tokenArg = { tokenPicked: triggerToken };
console.log(`----- run macroName: ${macroName}; on triggerToken: ${triggerToken}; `);
const macro = game.macros.getName(macroName);
await macro.execute(tokenArg.tokenPicked);


// Usage: /:SelectToken -- select a token
let GMid = "sVxF0AzuvK7ZMqXx";
let tokenPicked = 'YShlinDoAv3dMXwL'; // Test with Fergus 'dV9Y2WVh5Uogenql' or Rusalka "YShlinDoAv3dMXwL"
console.log(`----- in SelectToken, tokenPicked: ${tokenPicked} ----`);
let tokenSelect = canvas.tokens.get(tokenPicked);
tokenSelect.control();




let GMid = "sVxF0AzuvK7ZMqXx";
let runPlayer;
let playerTarget = "x4KT5djBTVyWCqew";
let targetToken = canvas.tokens.get(playerTarget); // select the token that started this action
let playerId = 'sVxF0AzuvK7ZMqXx';
let tokenPicked = 'L9ON8D8ttYn8ykvv'; // Test with Fergus 'dV9Y2WVh5Uogenql'
console.log(`----- in TargetMyTarget: tokenPicked: ${tokenPicked} ----`);
let tokenSelect = canvas.tokens.get(tokenPicked); // select the token that started this action
tokenSelect.control();
if (game.users.current.data._id === GMid) {
	runPlayer = game.users.get(GMid); // uses id for Gamemaster
} else {
	runPlayer = game.users.get(playerId); // uses id for Gamemaster
}
let GM = game.users.get(GMid);
GM.updateTokenTargets(targetToken);





let GMid = "sVxF0AzuvK7ZMqXx";
let runPlayer;
let playerTarget = "x4KT5djBTVyWCqew";
let targetToken = canvas.tokens.get(playerTarget); // select the token that started this action
let playerId = 'sVxF0AzuvK7ZMqXx';
let tokenPicked = 'L9ON8D8ttYn8ykvv'; // Test with Fergus 'dV9Y2WVh5Uogenql'
console.log(`----- in TargetMyTarget: tokenPicked: ${tokenPicked} ----`);
let tokenSelect = canvas.tokens.get(tokenPicked); // select the token that started this action
tokenSelect.control();
if (game.users.current.data._id === GMid) {
	runPlayer = game.users.get(GMid); // uses id for Gamemaster
} else {
	runPlayer = game.users.get(playerId); // uses id for Gamemaster
}
let GM = game.users.get(GMid);
GM.updateTokenTargets(targetToken);




console.log(`----- in TargetMyTarget ----`);
let GMid = "sVxF0AzuvK7ZMqXx";
let runPlayer;
let playerTarget = "x4KT5djBTVyWCqew";
let targetToken = canvas.tokens.get(playerTarget); // select the token that started this action
let playerId = 'sVxF0AzuvK7ZMqXx';
let tokenPicked = 'L9ON8D8ttYn8ykvv'; // Test with Fergus 'dV9Y2WVh5Uogenql'
console.log(`----- in TargetMyTarget: tokenPicked: ${tokenPicked} ----`);
let tokenSelect = canvas.tokens.get(tokenPicked); // select the token that started this action
tokenSelect.control();
if (game.users.current.data._id === GMid) {
	runPlayer = game.users.get(GMid); // uses id for Gamemaster
} else {
	runPlayer = game.users.get(playerId); // uses id for Gamemaster
}
let GM = game.users.get(GMid);
GM.updateTokenTargets(targetToken);






// v10 //let originalTargets = game.user.targets.map(target => target.id);

let triggerPlayer = game.users.current;

let GM = game.users.get("sVxF0AzuvK7ZMqXx")

Hooks.on('updateCombat', (combat) => {
    const token = canvas.tokens.get(combat.current.tokenId);
    if (token.isOwner) {
        token.control();
    }
    else if (releaseAll) {
        canvas.tokens.releaseAll() 
    }
});