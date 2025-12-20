function getReadyPotionMods(stateModifiers) {
	console.log(`ACTIVE state before getReadyPotionMods: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getReadyPotionMods(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Potion Ready") == true 
	);
	return modifiers;
}

function checkReadyTaken(readyTakenList,maneuver) {
	console.log(`===== in checkReadyTaken maneuver: ${maneuver}`);
	logModBucket(readyTakenList);
	let readyTaken = Number(readyTakenList.length);
	console.log(`readyTaken count: ${readyTaken}`);
	if (maneuver == 'ready') {
		readyTaken = readyTaken-4; // if maneuver set to Ready then stop here
		console.log(`maneuver Ready, so readyTaken count penalty: ${readyTaken}`);
	}
	console.log(`===== return checkReadyTaken: ${readyTaken}`);
	return readyTaken;
}
function logModBucket(modifiers) {
	// log the modifiers for orginalActor
	console.log(`in logModBucket(): `);
	for (let mod of modifiers) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}

let ItemName ='Major Healing Potion'; //  Item Name, i.e. Healing Potion
let skFastDrawPotion = "Fast*Draw*Potion";
let useFastDrawPotion = await GURPS.findSkillSpell(_token.actor, skFastDrawPotion, true)  != undefined ? true : false;
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
let isCombatStarted = game.combat !== null && game.combat.started;
let readyTakenList = getReadyPotionMods(originalModifiers); 
let readyTaken = checkReadyTaken(readyTakenList,conditions.maneuver);