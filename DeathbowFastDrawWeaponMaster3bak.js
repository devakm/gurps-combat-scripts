/* Usage: /:Deathbow
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
 
["Heroic Archer (you must use Ready on your first turn)"
	/if [S:Bow-3] 
		s:{On your second turn, you <strong>Ready</strong> your bow! Attack right away at -3. \\\\/r [-3 to hit Heroic Archer]} 
		f:{You fail to <strong>Ready</strong> your bow this turn. You can attack next turn at -3. \\\\/r [-3 to hit Heroic Archer]}
]

["Heroic Archer Fast-Draw"
/if [S:Fast*Draw*Arrow] s:{
	/if [S:Bow-3] 
		s:{You <strong>Fast-Draw</strong> to <strong>Ready</strong> your bow in no time! Attack right away at -3. \\\\/r [-3 to hit Heroic Archer Fast-Draw]} 
		f:{You fail to <strong>Ready</strong> your bow this turn. You can attack next turn at -3. \\\\/r [-3 to hit Heroic Archer]}
	} 
	f:{You fumble your Fast-Draw (Arrow) attempt. 
	\\\\/if [S:Bow-3] 
		s:{You <strong>Ready</strong> your bow. You can attack next turn at -3. \\\\/r [-3 to hit Heroic Archer]}
		f:{You fail to <strong>Ready</strong> your bow. You can attack on the turn after next at no penalty.}
	}
]


let skillname = "Skill*name and can use * as a wildcard"
let skill = GURPS.findSkillSpell(actor, skillname) 
console.log(skill.level)

If you do not want to search spells as well, you can use:

GURPS.findSkillSpell(actor, skillname, true) 


*/



/*
["Heroic Archer Fast-Draw"
/if [S:Fast*Draw*Arrow] s:{
	/if [S:Bow-3] 
		s:{You <strong>Fast-Draw</strong> to <strong>Ready</strong> your bow in no time! Attack right away at -3. \\\\/r [-3 to hit Heroic Archer Fast-Draw]} 
		f:{You fail to <strong>Ready</strong> your bow this turn. You can attack next turn at -3. \\\\/r [-3 to hit Heroic Archer]}
	} 
	f:{You fumble your Fast-Draw (Arrow) attempt. 
	\\\\/if [S:Bow-3] 
		s:{You <strong>Ready</strong> your bow. You can attack next turn at -3. \\\\/r [-3 to hit Heroic Archer]}
		f:{You fail to <strong>Ready</strong> your bow. You can attack on the turn after next at no penalty.}
	}
] 


[/if [S:Fast*Draw*Arrow] s:{/r [+0 Fast-Draw (Arrow) Ready success] \\You <strong>Fast-Draw</strong> your arrow in no time! Position your bow right away.} cs:{/r [+3 Fast-Draw (Arrow) Ready critical success] \\You <strong>Fast-Draw</strong> your arrow with such precision that you gain +3 to position your bow!} f:{/r [+0 Fast-Draw (Arrow) failed] \\You fail to <strong>Fast-Draw</strong> an arrow. You can try again next turn.} cf:{/tr(Arrows) -20 \\You fail so badly at <strong>Fast-Draw</strong> that you scatter the contents of your quiver everywhere! Take a turn to pick up 1/4 of your the arrows that were left in your quiver and then start over.}]


*/


function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

function setModBucket(modifiers) {
	// reset the modifiers for orginalActor
	for (let mod of modifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc);
	}
}

function restoreModBucket(modifiers) {
	// reset the modifiers for orginalActor
	GURPS.ModifierBucket.clear(update=true);
	for (let mod of modifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc);
	}
}

function getBowArrowMods(originalModifiers) {
	let modifiers = originalModifiers.filter(mod => 
		mod.desc.includes("Fast-Draw") == true 
		|| mod.desc.includes("Heroic Archer") == true
		|| mod.desc.includes("Normal") == true
	);
	return modifiers;
}

function getOtherMods(originalModifiers) {
	let modifiers = originalModifiers.filter(mod => 
		mod.desc.includes("Fast-Draw") != true 
		&& mod.desc.includes("Heroic Archer") != true
		&& mod.desc.includes("Normal") != true
	);
	return modifiers;
}
	

// OtF action setup:
let RangedAttackName =`Vic*Deathbow*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let advHeroicArcher = "Heroic*Archer";
let skFastDrawArrow = "Fast*Draw*Arrow";
let advWeaponMasterBow = "Weapon*Master*Bow";
let FollowOnDamage = ' \\\\/r [1d burn]';
let Attack = `[R:${RangedAttackName}]`; // alter the OtF type used for attack
let Damage = `[D:${RangedAttackName}]${FollowOnDamage}`; // alter the OtF type used for attack damage
let CritHit = `/rolltable CritHit`; // critical hit rolltable REMOVE to replace with critTable
let critTable = game.tables.getName('DataCritHit'); // critical hit rolltable
let CritMiss = `/rolltable CritMiss`; // critical miss rolltable

let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let originalManeuver = originalActor.system.conditions.maneuver
let maneuver = originalActor.system.conditions.maneuver
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

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = `!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3`; // success animation 
let csanim = `!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5`; // critical success animation 
let fanim = `!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +0`; // failure animation 
let cfanim = `!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self`; // critical failure animation 

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

let modT2s = `/r [${modHeroicArcher} to hit Heroic Archer Ready] \\\\${txT2s}`;// Bow Ready flag. Skip ahead this turn.
let modT2f = `/r [${modHeroicArcher} to hit Heroic Archer] \\\\${txT2f}`; // failure no Ready flag, resulting in delay.
let modT2cs = `/r [+3 to hit Heroic Archer Ready crit] \\\\${txT2cs}`; // Bow Ready now at +3
let modT2cf = `${txT2cf}`; // qty-1 on the Bow?
// Turn 3 - Fire Bow Attack!
let skFastDrawArrowOtF = `[/if [S:${skFastDrawArrow}] s:{${modT1s}} cs:{${modT1cs}} f:{${modT1f}} cf:{${modT1cf}}]`; 
let advHeroicArcherOtF =`[/if [S:Bow${modHeroicArcher}] s:{${modT2s}} cs:{${modT2cs}} f:{${modT2f}} cf:{${modT2cf}} ]}]`; 
let stdReadyArrowOtF = `/r [+0 Normal Ready Arrow] \\\\/man ready \\\\You Ready your arrow. Maneuver set to Ready.`;
let stdReadyBowOtF = `/r [+0 Normal Ready Bow] \\\\/man ready \\\\You Ready your bow position. Maneuver set to Ready.`;


let FollowOnDamage = ' \\\\/r [1d burn]';
let Attack = `[R:${RangedAttackName}]`; // alter the OtF type used for attack
let Damage = `[D:${RangedAttackName}]${FollowOnDamage}`; // alter the OtF type used for attack damage
let CritHit = ` \\\\/rolltable CritHit`; // critical hit rolltable REMOVE to replace with critTable
let critTable = game.tables.getName('DataCritHit'); // critical hit rolltable
let CritMiss = `/rolltable CritMiss`; // critical miss rolltable
let	trArrows = ` \\\\/tr(Arrows`;

// outcome formulas:
let csformula =`/r ${Damage}${CritHit}${trArrows}`; // critical success formula 
let cfformula = `${CritMiss}${trArrows}`; // critical failure formula 
let sformula =`/r ${Damage}${trArrows}`; //success formula 
let fformula =`${trArrows}`;
let attackOtF = `[/if ${Attack} cs:{${csanim} \\\\${csformula}} cf:{${cfanim} \\\\${cfformula}} s:{${sanim} \\\\${sformula}} f:{${fanim} \\\\${fformula}}]`; 

//let attackOtF = `[/if ${Attack} s:{${Damage}${trArrows}} cs:{${Damage}${trArrows}} f:{${trArrows}} cf:{${trArrows}}]`; 

// check if we took Ready manuevers already 
let arrowReady = false;
let bowReady = false;
let attackNow = false;
let bowArrowModifiers = getBowArrowMods(originalModifiers);
let otherModifiers = getOtherMods(originalModifiers);
restoreModBucket(bowArrowModifiers);
let readyTakenList = bowArrowModifiers.filter(mod => mod.desc.includes("Ready") == true); 
if (readyTakenList.length == 0) { 
	let msg = 'Ready Turn-1 Draw and nock an arrow';
	console.log(msg);// old cmd: await GURPS.ModifierBucket.addModifier(0, msg);
	if (useFastDrawArrow == true) {
		GURPS.executeOTF(skFastDrawArrowOtF); 
		arrowReady = true;
	} else { GURPS.executeOTF(stdReadyArrowOtF, players); }
	await wait(2);
	bowArrowModifiers = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList);
	restoreModBucket(bowArrowModifiers);
	readyTakenList = bowArrowModifiers.filter(mod => mod.desc.includes("Ready") == true); 
} 

if (readyTakenList.length == 1) {
	let msg = 'Ready Turn-2 Position loaded bow';
	console.log(msg);// old cmd: await GURPS.ModifierBucket.addModifier(0, msg);
	if (useHeroicArcher == true) {
		GURPS.executeOTF(advHeroicArcherOtF); 
		bowReady = true;
	} else { GURPS.executeOTF(stdReadyBowOtF, players); }
	await wait(2);
	bowArrowModifiers = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList);
	restoreModBucket(bowArrowModifiers);
	readyTakenList = bowArrowModifiers.filter(mod => mod.desc.includes("Ready") == true); 
} 

if (readyTakenList.length == 2) {
	// attack with no more delays
	attackNow = true;
	console.log('Fire an arrow; attackNow: ${attackNow}');	
	/*
	originalManeuver
	\\\\/man ready
	GURPS.executeOTF(attackOtF);
	*/
}

if (attackNow == true) {
	bowArrowModifiers = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList);
	restoreModBucket(bowArrowModifiers);
	setModBucket(otherModifiers);

	if (maneuver == 'attack' || maneuver == 'allout_attack' || maneuver.startsWith('aoa')) {
		if (useHeroicArcher == true) {
			if (isNaN(Accuracy)||Accuracy===0) {
				GURPS.ModifierBucket.addModifier(0, 'Accuracy')
			} else if (Accuracy > 0) {
				GURPS.ModifierBucket.addModifier(Accuracy, 'Accuracy')
			}
		}
	} else if (maneuver == 'move_and_attack') {
		if (useHeroicArcher == true) {
			GURPS.ModifierBucket.addModifier(0, 'Heroic Archer ignore Bulk penalty')
		} else {
			if (Bulk < -2) GURPS.ModifierBucket.addModifier(Bulk, 'Bulky weapon penalty')
			else GURPS.ModifierBucket.addModifier(-2, 'Move and Attack penalty')
		}
	} else {
		GURPS.executeOTF('/"You cannot attack using your current maneuver. Pick Attack, All-Out Attack, or Move and Attack!"', players);
		attackNow = false;
	}
	if (attackNow == true) {
		console.log(attackOtF);
		GURPS.executeOTF(attackOtF);
	}
}

/*
for (let mod of modifiers) {
	GURPS.ModifierBucket.addModifier(mod.modint, mod.desc)
}
let ModifierOtF = '';
if (modifiers.length > 0) {	
	var firstIteration = true;
	for (let mod of modifiers) {
	if (firstIteration) {
		firstIteration = false;
	} else {
		ModifierOtF += ' \\\\'; 
	}
		ModifierOtF += `/r [${mod.mod} ${mod.desc}]`;
	}
	ModifierOtF += ' \\\\';
}

let modifiers = GURPS.ModifierBucket.modifierStack.modifierList;
let ModifierOtF = '';
if (modifiers.length > 0) {	
	var firstIteration = true;
	for (let mod of modifiers) {
	if (firstIteration) {
		firstIteration = false;
	} else {
		ModifierOtF += ' \\\\'; 
	}
		ModifierOtF += `/r [${mod.mod} ${mod.desc}]`;
	}
	ModifierOtF += ' \\\\';
}
GURPS.ModifierBucket.clear(update=true);

*/

	









