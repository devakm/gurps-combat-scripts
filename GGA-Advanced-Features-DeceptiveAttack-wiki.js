Use this page to document and share Advanced Features of GGA such as complex macros and API details.

## Deceptive Attack Macro

Type: Script

Author: devakm

Description: Execute a Deceptive Attack if effective skill is 12 or more; otherwise, execute a regular attack. This macro illustrates advanced usage of several GGA APIs such as GURPS.ModifierBucket, GURPS.findAttack, and GURPS.executeOTF.

Note: Foundry v12+.

Details: 
GGA includes a very powerful feature called On-the-Fly formulas (OtFs), and Macros can be extremely effective when invoked using this. General OtF rules spelled out in the Guide and this wiki apply here as well. 

Deceptive Attack is only allowed if effective skill is 12 or more and you may not reduce your final effective skill below 10. The first few lines of this script include configuration options such as whether to enable a higher minimum skill or not, and if enabled, what the higher minimum should be.

For every -2 you accept to your own skill, your foe suffers a -1 penalty on his active defenses against this attack (B369-370). To help facilitate this, the script will auto-whisper the GM to apply the correct defensive penalty to the target based on how large of a Deceptive Attack penalty you chose to take. This will let you easily stack up a larger Deceptive Attack penalty in your Modifier Bucket first and be sure the GM has the correct penalty modifier available to apply before making a defense roll for your foe.

The basic use for this macro is to add an automatic Deceptive Attack if you haven't already done so yourself. It does this by using the standard GGA modifier `[-2 to hit (Deceptive Attack)]`. It looks at your current Modifier Bucket and if it sees any modifiers including "Deceptive Attack", then it will use them. If it doesn't find any, and you have skill to spare, it will add the modifier `[-2 to hit (Deceptive Attack)]` and whisper the GM with the corresponding active defense penalty.

Because it pays attention to what's already in your Modifier Bucket, you can use it to make even stronger Deceptive Attacks, as long as you don't go below minimum skill. This means you can now use the modifier bucket to stack up several `[-2 to hit (Deceptive Attack)]` before running the macro. 

Let's say you click `[-2 to hit (Deceptive Attack)]` in the modifier bucket three times, giving a total `[-6 to hit (Deceptive Attack)]`, then it will whisper GM to add `[-3 to defense (Deceptive Attack)]` when rolling a defense for your foe.

The script also supports Deceptive Attack with any melee attack mode, depending on how you reference it in chat or in an OtF using the /:Macro format. This lets you easily create several simple OtF commands to invoke different attack modes and place these in the GCS attack mode Notes field so they show up in your character sheet Melee Attacks section and in Token Action HUD Classic. For example:

- `["Shortsword Slash Deceptive Attack"/:DeceptiveAttack attack=Fine*Short*Swung]`
- `["Shortsword Slash Deceptive Attack"/:DeceptiveAttack attack="Fine Shortsword (Swung)"]` 

The * wildcard format can be used to skip spaces and other strings in the attack/mode. The quoted string version requires GGA 17.17. A future version this script will add support for Tagged Modifiers to make it work even smoother once GGA 17.17 is released.

Note that the wildcard format has to include the start and end of the name/mode, and this name/mode combo must be unique, i.e. doesn't match any other name/mode.

Alternately, you can rename the Macro to be less generic, like ShortswordDeceptiveAttack then alter the AttackName line at the start of the script to specify an attack name with spaces or wildcards. If you do this, you'll need to duplicate and rename the macro for each attack/mode you want to support, which makes it a lot more annoying to maintain, but simplifies the invocation OtF since you no longer need to pass the attack name/mode as an argument. The OtF command would then look something like: `["Shortsword Thrust Deceptive Attack"/:ShortswordDeceptiveAttack]`
 
The last option is to invoke it using standard Foundry chat macro reference `/m` format, like:  

- `["Deceptive Attack"/m DeceptiveAttack attack=Shortsword (Thrust)]`

The `/m` macro method handles spaces in the arg=value without any quotes or wildcards.

The following code is heavily commented, so it may be worth reading if you're hoping to learn more about how to script with GGA. It also includes a lot of console.log statements so you can track what it's doing by hitting F12 in your browser to examine the console after you run it.
```js
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

```