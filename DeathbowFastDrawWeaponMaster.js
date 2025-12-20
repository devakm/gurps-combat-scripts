/* Usage: /:Deathbow
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
 
GURPS.LastActor.data.data.additionalresources.tracker['0000'].value

*/

// Outcome animations data table 
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
/*
sanim - success animation 
csanim - critical success animation 
fanim - failure animation 
cfanim - critical failure animation 
*/

animDta = [
{'type': 'ex', 'name': 'sanim', 'anim': 'success'},
{'type': 'ex', 'name': 'csanim', 'anim': 'critHit'},
{'type': 'ex', 'name': 'fanim', 'anim': 'fail'},
{'type': 'ex', 'name': 'cfanim', 'anim': 'critFail'},
{'type': 'ex2', 'name': 'sanim', 'anim': 'success'},
{'type': 'rdy', 'name': 'outPulse', 'anim': '!/anim EnergyStrandIN01_02_Regular_Yellow c *0.5 @self \\\\!/anim OutPulse_03_Circle_Fast_500 c *0.3 @self'},
{'type': 'rdy', 'name': 'inPulse', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
{'type': 'rdy', 'name': 'pulse', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
{'type': 'rdy', 'name': 'stars', 'anim': '!/anim DizzyStars*Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
{'type': 'rdy', 'name': 'burn', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
{'type': 'burn', 'name': 'sanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.3 \\\\!/anim Flames_01_Regular_Orange c *0.4'},
{'type': 'burn', 'name': 'csanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.8 \\\\!/anim Flames_01_Regular_Orange c *0.5'},
{'type': 'burn', 'name': 'fanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 -3'},
{'type': 'burn', 'name': 'cfanim', 'anim': '!/anim Explosion*Orange c *0.6 @self \\\\!/anim Flames_01_Regular_Orange c *0.4 @self'},
{'type': 'rdy', 'name': 'tox', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
{'type': 'tox', 'name': 'sanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3'},
{'type': 'tox', 'name': 'csanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5'},
{'type': 'tox', 'name': 'fanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +0'},
{'type': 'tox', 'name': 'cfanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'}
];

function getAnimSet(animDta, typeSet, animName) {
	let anim = animDta.find(x => x.type == typeSet && x.name == animName).anim;
	return anim;
}

function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function newArrowTracker() {
	let tr = originalActor.data.data.additionalresources.tracker;
	let trackers = Object.keys(tr).map((key) => [key, tr[key]]);
	let lastTracker;
	trackers.forEach(tr => { lastTracker = tr }); // pick the latest tracker
	console.log(lastTracker);
	tr[lastTracker[0]].name = 'Arrows';
	tr[lastTracker[0]].value = 15;
	tr[lastTracker[0]].min = 0;
	tr[lastTracker[0]].max = 20;
}

function arrowsRemaining(trackers) {
	var trackersArray = Object.keys(trackers).map(val => trackers[val]);
	let arrowsTracker = trackersArray.filter(i => 
		i.name.includes("Arrows") == true
	);
	if (arrowsTracker[0] == undefined) {
		GURPS.executeOTF(noArrowsMsg, players);
		wait(2);
		let errMsg = `You must have a tracker named "Arrows" for this macro to work.`;
		ui.notifications.error(errMsg);
		console.log(`${noArrowsMsg};`);
        console.log(`Error: ${errMsg};`);
		return;
	} else { return arrowsTracker[0].value; }
}

function logModBucket(modifiers) {
	// reset the modifiers for orginalActor
	console.log(`in logModBucket(): `);
	for (let mod of modifiers) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}

function setModBucket(modifiers) {
	// reset the modifiers for orginalActor
	console.log(`ACTIVE state before set: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in setModBucket(): `);
	// dedupe
	let currentBucket = GURPS.ModifierBucket.modifierStack.modifierList;
	logModBucket(modifiers);
	let foundDuplicate = false;
	currentBucket.some(existingMod => {
	  modifiers = modifiers.filter(mod => {
		if (existingMod.desc !== mod.desc) {
		  return mod;
		} else {
		  foundDuplicate = true;
		}
	  });
	});
	for (let mod of modifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc);
	}
}

function restoreModBucket(modifiers) {
	// reset the modifiers for orginalActor
	GURPS.ModifierBucket.clear(update=true);
	console.log(`ACTIVE state before restore: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in restoreModBucket(): `);
	logModBucket(modifiers);
	for (let mod of modifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc);
	}
}

function getBowArrowMods(stateModifiers) {
	console.log(`ACTIVE state before getBowArrowMods: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getBowArrowMods(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Fast-Draw") == true 
		|| mod.desc.includes("Heroic Archer") == true
		|| mod.desc.includes("Normal") == true
	);
	return modifiers;
}

function getOtherMods(originalModifiers) {
	console.log(`ACTIVE state before getOther: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getOtherMods: `);
	logModBucket(originalModifiers);
	let modifiers = originalModifiers.filter(mod => 
		mod.desc.includes("Fast-Draw") != true 
		&& mod.desc.includes("Heroic Archer") != true
		&& mod.desc.includes("Normal") != true
	);
	return modifiers;
}

function getReadyState(bowArrowModifiers) {
	// get the modifiers used for tracking Ready state
	console.log(`in getReadyState: `);
	let readyState = bowArrowModifiers.filter(mod => mod.desc.includes("Ready") == true);
	return readyState;
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

// OtF action setup:
let RangedAttackName =`Vic*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
let advHeroicArcher = "Heroic*Archer";
let skFastDrawArrow = "Fast*Draw*Arrow";
let advWeaponMasterBow = "Weapon*Master*Bow";
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
GURPS.ModifierBucket.clear(update=true);
let RangedAttackObj = GURPS.findAttack(_token.actor, RangedAttackName, 0, 1);
let useHeroicArcher = await GURPS.findAdDisad(_token.actor, advHeroicArcher) != undefined ? true : false;
let useWeaponMasterBow = await GURPS.findAdDisad(_token.actor, advWeaponMasterBow) != undefined ? true : false;
let useFastDrawArrow = await GURPS.findSkillSpell(_token.actor, skFastDrawArrow, true)  != undefined ? true : false;
let Accuracy = RangedAttackObj.acc;
let Bulk = RangedAttackObj.bulk;
let modHeroicArcher = useWeaponMasterBow == true ? -1 : -3;
let modHeroicArcherTxt = useWeaponMasterBow == true ? " Heroic Archer with Weapon Master (Bow)" : " Heroic Archer";

console.log(`actorName: ${actorName} does maneuver: ${maneuver} with ${modHeroicArcherTxt} useHeroicArcher: ${useHeroicArcher}; useWeaponMasterBow: ${useWeaponMasterBow}; useFastDrawArrow: ${useFastDrawArrow}; 
Weapon: ${RangedAttackObj.name}: Accuracy: ${Accuracy}; Bulk: ${Bulk}; modHeroicArcher: ${modHeroicArcher};`);
let noArrowsMsg = "Your quiver is empty. You must refill your quiver to shoot!";
let Trackers = originalActor.data.data.additionalresources.tracker;
let Arrows = arrowsRemaining(Trackers);
if (Arrows == 0) {
	await GURPS.executeOTF(noArrowsMsg, players);
} else if (Arrows == undefined) {
	await originalActor.addTracker();
	await newArrowTracker();
	Trackers = originalActor.data.data.additionalresources.tracker;
	Arrows = arrowsRemaining(Trackers);
}

// outcome animations lookup by type [tox] and label [sanim]
let sanim = getAnimSet(animDta, 'tox', 'sanim'); // success animation 
let csanim = getAnimSet(animDta, 'tox', 'csanim'); // critical success animation 
let fanim = getAnimSet(animDta, 'tox', 'fanim'); // failure animation 
let cfanim = getAnimSet(animDta, 'tox', 'cfanim'); // critical failure animation
let rdyanim = getAnimSet(animDta, 'rdy', 'tox'); // ready animation

// mods, OtFs & messages
// Turn 1 - Ready Arrow
let txT1s = `You <strong>Fast-Draw</strong> your arrow in no time! You can attempt to position your bow right away.`;
let txT1f = `You fail to <strong>Fast-Draw</strong> an arrow this turn. You can position your bow next turn.`;
let txT1cs = `You <strong>Fast-Draw</strong> your arrow with such precision that you gain +3 to position your bow!`;;
let txT1cf = `You fail so badly at <strong>Fast-Draw</strong> that you scatter the contents of your quiver everywhere! Take a turn to pick up 1/4 of your the arrows that were left in your quiver and then try again.`; 

let modT1s = `/r [+0 Fast-Draw (Arrow) Ready success] \\\\${txT1s}`; // Arrow Ready flag. Skip ahead this turn.
let modT1f = `/r [+0 Fast-Draw (Arrow) failed] \\\\${txT1f}`; // failure no Ready flag, resulting in delay.
let modT1cs = `/r [+3 Fast-Draw (Arrow) Ready crit] \\\\${txT1cs}`; // Arrow Ready now at +3
let modT1cf = `/tr(Arrows) =0 \\\\${txT1cf}`; // empty quiver
// Turn 2 - Ready Bow
let txT2s = `You <strong>Ready</strong> your Bow position instantly! You can attack with it right away.`;
let txT2f = `You fail to <strong>Ready</strong> your Bow position this turn. You can attack next turn at ${modHeroicArcher}`;
let txT2cs = `You <strong>Ready</strong> your Bow position with such precision that you attack at +3 this turn!`;;
let txT2cf = `You drop your Bow! Take next turn to pick it up, then on the next turn after that you can try again.`; 

let modT2s = `/r [${modHeroicArcher} to hit Heroic Archer] \\\\/r [+0 Heroic Archer Ready] \\\\${txT2s}`;// Bow Ready flag. Skip ahead this turn.
let modT2f = `/r [${modHeroicArcher} to hit Heroic Archer] \\\\${txT2f}`; // failure no Ready flag, resulting in delay.
let modT2cs = `/r [+3 to hit Heroic Archer Ready crit] \\\\${txT2cs}`; // Bow Ready now at +3
let modT2cf = `${txT2cf}`; // qty-1 on the Bow?
// Turn 3 - Fire Bow Attack!
let skFastDrawArrowOtF = `[/if [S:${skFastDrawArrow}] s:{${modT1s}} cs:{${modT1cs}} f:{${modT1f}} cf:{${modT1cf}}]`; 
let advHeroicArcherOtF =`[/if [S:Bow${modHeroicArcher}] s:{${modT2s}} cs:{${modT2cs}} f:{${modT2f}} cf:{${modT2cf}}]`; 
let stdReadyArrowOtF = `/r [+0 Normal Ready Arrow] \\\\${rdyanim} \\\\You Ready your arrow. Maneuver set to Ready. \\\\/man ready `;
let stdReadyBowOtF = `/r [+0 Normal Ready Bow] \\\\${rdyanim} \\\\You Ready your bow position. Maneuver set to Ready. \\\\/man ready`;

console.log(`skFastDrawArrowOtF: ${skFastDrawArrowOtF};`);
console.log(`advHeroicArcherOtF: ${advHeroicArcherOtF};`);
console.log(`stdReadyArrowOtF: ${stdReadyArrowOtF};`);
console.log(`stdReadyBowOtF: ${stdReadyBowOtF};`);


let FollowOnDamage = '1d burn';
let Attack = `[R:${RangedAttackName}]`; // alter the OtF type used for attack
let Damage = `[D:${RangedAttackName}]  \\\\/r [${FollowOnDamage}]`; // alter the OtF type used for attack damage
let CritHit = ` \\\\/:RangedCritHit`; // macro reference for CritHit using critTable
//let critTable = game.tables.getName('DataCritHit'); // critical hit rolltable
let CritMiss = `/rolltable CritMiss`; // critical miss rolltable
let	trArrows = ` \\\\/tr(Arrows) -1`;

// outcome formulas:
let csformula =`/r ${Damage}${CritHit}${trArrows}`; // critical success formula 
let cfformula = `${CritMiss}${trArrows}`; // critical failure formula 
let sformula =`/r ${Damage}${trArrows}`; //success formula 
let fformula =`${trArrows}`;
let attackOtF = `[/if ${Attack} cs:{${csanim} \\\\${csformula}} cf:{${cfanim} \\\\${cfformula}} s:{${sanim} \\\\${sformula}} f:{${fanim} \\\\${fformula}}]`; 

//let attackOtF = `[/if ${Attack} s:{${Damage}${trArrows}} cs:{${Damage}${trArrows}} f:{${trArrows}} cf:{${trArrows}}]`; 

// check if we took Ready manuevers already 
let attackNow = false;
let readyTaken = 0;
let readyTakenList;
console.log(`------------ Start Initial Fixing up the Modifier Bucket ------------------`);
let bowArrowModifiersT0 = getBowArrowMods(originalModifiers);
let otherModifiers = getOtherMods(originalModifiers);
restoreModBucket(bowArrowModifiersT0);
await wait(2);
console.log(`------------ End Initial Fixing up the Modifier Bucket ------------------`);
readyTakenList = getReadyState(bowArrowModifiersT0); 
readyTaken = checkReadyTaken(readyTakenList,conditions.maneuver);
if (readyTaken == 0) { 
	let msg = 'TURN 1: Ready Turn-1 Draw and nock an arrow'; // log TURN 1
	console.log(msg);// old cmd: await GURPS.ModifierBucket.addModifier(0, msg);
	if (useFastDrawArrow == true) {
		console.log(skFastDrawArrowOtF);
		GURPS.executeOTF(skFastDrawArrowOtF); 
	} else { 
		GURPS.executeOTF(stdReadyArrowOtF, players);
		if (maneuver !== 'ready') conditions.maneuver = 'ready';
	}
	await wait(2);
} 
console.log(`------------ Start Turn 1 Fixing up the Modifier Bucket ------------------`);
setModBucket(bowArrowModifiersT0);
await wait(2);
let bowArrowModifiersT1 = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList);
console.log(`------------ End Turn 1 Fixing up the Modifier Bucket ------------------`);
readyTakenList = getReadyState(bowArrowModifiersT1); 
readyTaken = checkReadyTaken(readyTakenList,conditions.maneuver);
if (readyTaken == 1) {
	let msg = 'TURN 2: Ready Turn-2 Position loaded bow';// log TURN 2
	console.log(msg);// old cmd: await GURPS.ModifierBucket.addModifier(0, msg);
	if (useHeroicArcher == true) {
		console.log(advHeroicArcherOtF);
		GURPS.executeOTF(advHeroicArcherOtF); 
	} else { 
		GURPS.executeOTF(stdReadyBowOtF, players); 
		if (maneuver !== 'ready') conditions.maneuver = 'ready';
	}
	await wait(2);
} 
console.log(`------------ Start Turn 2 Fixing up the Modifier Bucket ------------------`);
bowArrowModifiersT2 = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList);
restoreModBucket(otherModifiers);
//await wait(1);
setModBucket(bowArrowModifiersT0);
//await wait(1);
setModBucket(bowArrowModifiersT1);
//await wait(1);
setModBucket(bowArrowModifiersT2);
//await wait(1);
console.log(`------------ End Turn 2 Fixing up the Modifier Bucket ------------------`);
await wait(2);
let bowArrowModifiersT3 = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList); 
readyTakenList = getReadyState(bowArrowModifiersT3); 
readyTaken = checkReadyTaken(readyTakenList,conditions.maneuver);
if (readyTaken >= 2) {
	attackNow = true;// TURN 3: attack with no more delays
	console.log(`TURN 3: Fire an arrow; attackNow: ${attackNow}`);	
	console.log(`------------ Start Turn 3 with Modifier Bucket already fixed up! ------------------`);
}
if (attackNow == true) {
	if (maneuver == 'aim') {
		if (useHeroicArcher == false) { // ADD OR actor took an Aim manuever first [+3 Acc]
			if (isNaN(Accuracy)||Accuracy===0) {
				GURPS.ModifierBucket.addModifier(0, 'Acc Normal Aim');
				console.log(`------------ in Turn 3 maneuver [+0 Acc Normal Aim]  ------------------`);
			} else if (Accuracy > 0) {
				GURPS.ModifierBucket.addModifier(Accuracy, 'Acc Normal Aim');
				console.log(`------------ in Turn 3 maneuver +${Accuracy} Acc Normal Aim  ------------------`);
			}
		} else if (useHeroicArcher == true) { // ADD OR actor took an Aim manuever first [+3 Acc]
			GURPS.ModifierBucket.addModifier(1, 'Acc Heroic Aim');
			console.log(`------------ in Turn 3 maneuver [+1 Acc Heroic Aim ] ------------------`);
		}
		attackNow = false;
	} else if (maneuver == 'attack' || maneuver == 'allout_attack' || maneuver.startsWith('aoa')) {
		if (useHeroicArcher == true) { // ADD OR actor took an Aim manuever first [+3 Acc]
			if (isNaN(Accuracy)||Accuracy===0) {
				GURPS.ModifierBucket.addModifier(0, 'Acc Heroic Aim')
				console.log(`------------ in Turn 3 maneuver [+0 Acc Heroic Aim]  ------------------`);
			} else if (Accuracy > 0) {
				GURPS.ModifierBucket.addModifier(Accuracy, 'Acc Heroic Aim')
				console.log(`------------ in Turn 3 maneuver [+${Accuracy} Acc Heroic Aim]  ------------------`);
			}
		}
	} else if (maneuver == 'move_and_attack') {
		if (useHeroicArcher == true) {
			GURPS.ModifierBucket.addModifier(0, 'Heroic ignore Bulk penalty')
		} else {
			if (Bulk < -2) GURPS.ModifierBucket.addModifier(Bulk, 'Normal Bulky weapon')
			else GURPS.ModifierBucket.addModifier(-2, 'Move and Attack ranged penalty')
		}
	} else {
		GURPS.executeOTF('/fp +0 \\\\You cannot attack using your current maneuver. Pick Attack, All-Out Attack, or Move and Attack!', players);
		attackNow = false;
	}
	if (attackNow == true) {
		console.log(attackOtF);
		GURPS.executeOTF(attackOtF);
	}
}
