/* Usage: /:DeceptiveAttack attack=<AttackName>
For example: ["Rapier Attack"/:DeceptiveAttack attack=Rapier*Thrust]
*/
console.log('---------------------- Start DeceptiveAttack ----------------------');

// OtF action setup:
let AttackName ='Rapier*Thrust'; //   Attack Name, i.e. [M:Rapier*Thrust]
let useHigherMinimumSkill = false; // optional user preference whether to use higher minimum skill level to choose Deceptive Attack or regular attack; change to false to use skip this check
let higherMinimumSkill = 16; // higher value minimum effective skill level to choose Deceptive Attack or regular attack

// check for argument defining the attack name
if (scope !== undefined) {
    console.log(scope)
    AttackName = scope.attack ? scope.attack : 'Rapier*Thrust';
}

let modifierList = GURPS.ModifierBucket.modifierStack.modifierList;
//Deceptive Attack setup [-2 to hit (Deceptive Attack)]
let daPenalty = -2;
let daDescription = 'to hit (Deceptive Attack)';
let daModsList = {}; // get the Deceptive Attack modifiers from ModifierBucket
let daModsSum = 0;

// modifier bucket functions
function getDAMods(modifierList) {
	console.log(`in getDAMods(): `);
	logModBucket(modifierList);
	let modifiers = modifierList.filter(mod => 
		mod.desc.includes("Deceptive Attack") == true 
		|| mod.desc.includes("deceptive attack") == true
	);
	return modifiers;
}

function logModBucket(modifierList) {
	// log the modifiers
	console.log(`in logModBucket(): `);
	for (let mod of modifierList) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}

function getSumOfModint(modList) {
    return modList.reduce((sum, mod) => sum + mod.modint, 0);
}

// check if Deceptive Attack is already in ModifierBucket
async function doDeceptiveAttack(daPenalty, daDescription) {
    daModsList = getDAMods(modifierList); // get the Deceptive Attack modifiers from ModifierBucket
    daModsSum = getSumOfModint(daModsList);
    console.log(`daModsSum: ${daModsSum}`);
    if (daModsSum < 0) {
        // Deceptive Attack is already in ModifierBucket, so use it
    } else {
        // Deceptive Attack is not in ModifierBucket, so add it
        GURPS.ModifierBucket.addModifier(daPenalty, daDescription); // add the Deceptive Attack penalty to ModifierBucket
        daModsSum = daPenalty;
    }
    let activeDefensePenalty = daModsSum < 0 ? daModsSum/2 : 0;
    let daOtF = `/w gm Add penalty to defender if attack succeeds: [${activeDefensePenalty} to defense (Deceptive Attack)]`;
    await GURPS.executeOTF(daOtF);
}

let totalModifier = GURPS.ModifierBucket.currentSum();
console.log(`totalModifier: ${totalModifier}`);
// find the attack data for the attack name
let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor.`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
// get the skill level for the attack
let AttackSkill = attackData.level;
let ModifiedSkill = Number(AttackSkill)+Number(totalModifier);
console.log(`AttackSkill: ${AttackSkill}; totalModifier: ${totalModifier}; ModifiedSkill: ${ModifiedSkill}`);


// check minimum skill level for Deceptive Attack
if (useHigherMinimumSkill === true && ModifiedSkill >= higherMinimumSkill) {
	// safe to do Deceptive Attack at higher minimum skill level
    console.log(`safe to do Deceptive Attack: [${daPenalty} ${daDescription}] at standard minimum skill level`);
    console.log(`useHigherMinimumSkill: ${useHigherMinimumSkill}; higherMinimumSkill: ${higherMinimumSkill}`);
    doDeceptiveAttack(daPenalty, daDescription);
} else if (useHigherMinimumSkill === false && ModifiedSkill >= 12) {
    // standard minimum skill level for Deceptive Attack
    console.log(`safe to do Deceptive Attack: [${daPenalty} ${daDescription}] at standard minimum skill level`);
    doDeceptiveAttack(daPenalty, daDescription);
} else if (ModifiedSkill < 12) {
    let errMsg = `Deceptive Attack not allowed. Your effective skill must be 12 or better after all other modifiers to your attack roll.`;
    ui.notifications.error(errMsg);
    console.log(`Error: ${errMsg}`);
    console.log(`do normal attack`);
} else {
	// do normal attack
    console.log(`do normal attack`);
} 

let Attack = `[M:${AttackName}]`; // alter the OtF type used for attack
let CritMiss = '/rolltable CritMiss'; // critical miss rolltable
let StrikeDamage = `/r [D:${AttackName}]`; // strike damage OtF. 
let CritStrikeDamage = `/r [D:${AttackName}] \\\\/rolltable CritHit`; // macro reference for CritHit using critTable
console.log(`Attack: ${Attack}; StrikeDamage: ${StrikeDamage}; CritStrikeDamage: ${CritStrikeDamage};`);

// Outcomes for critical success, critical failure, regular success, and regular failure
// outcome formulas:
let asFormula = `${StrikeDamage}`; // attack success formula 
let acsFormula = `${CritStrikeDamage}`; // attack critical success formula 
let afFormula =`Your attack missed!`; // attack failure formula 
let acfFormula =`You crit failed your attack, so you drop your weapon! \\\\/status on disarmed \\\\/fp -1`; // attack critical failure formula 

// complex OtF format needs patch to GURPS.executeOTF; swap the statements after patch is available
//let attackFormulaOtF = `/if ${Attack} s:{${asFormula}} cs:{${acsFormula}} f:{${afFormula}} cf:{${acfFormula}}`;
// simple OtF format
let attackFormulaOtF = `/if ${Attack} ${asFormula} ${afFormula}`;
console.log(attackFormulaOtF);
GURPS.executeOTF(attackFormulaOtF);

console.log(`---------------------- End DeceptiveAttack ----------------------`);
