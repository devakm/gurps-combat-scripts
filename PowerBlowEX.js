/* Usage: /:FlyingLeap <attackname> <kbmultiplier> <animation> <spellname>  <trap tags>
	Calculate knockback for crushing attacks and shove
	
	<attackname> attack name to use
	<kbmultiplier> knockback multiplier
	<animation> which animation set to use
	<spellname> spell name to use
	
    Use Modifiers to adjust the knockback distance.
    Power Blow, Flying Attack, and Extra Effort can be used to increase knockback distance.
    Power Blow
    [-10 Instant Power Blow *Cost 1FP]
    [-5 Power Blow (1-Turn) *Cost 1FP]
    [-4 Power Blow (2-Turn) *Cost 1FP]
    [-3 Power Blow (3-Turn) *Cost 1FP]
    [-2 Power Blow (4-Turn) *Cost 1FP]
    [-1 Power Blow (5-Turn) *Cost 1FP]
    [-6 Instant Power Blow EX *Costs 2 FP]
    [-1 Power Blow EX *Costs 2 FP] 
    Extra Effort reduces the normal turn 1 penalty from -10 to -6, -1 after 1 turn, and no penalty after 2 turns.
    [-6 Instant Power Blow EX *Costs 2 FP]
    or with a 1-Turn delay:
    [-1 Power Blow EX (1-Turn) *Costs 2 FP]
    or with a 2-Turn delay:
    [+0 Power Blow EX (2-Turn) *Costs 2 FP]
    Flying Attack
    [-5 to hit Flying Attack *Max:9]
    Flying Attack Ground Strike (+4 for targeting the ground)
    [-1 to hit Flying Attack *Max:13]
    Extra Effort (Heroic Charge)
    [-1 Heroic Flying Attack *Cost 1FP]
    Extra Effort (Heroic Charge) with Ground Strike (+4 for targeting the ground)
    [+3 Heroic Flying Attack *Cost 1FP]
    Flying Leap
    [-10 Instant Flying Leap *Cost 1FP]
    [-5 Flying Leap (1-Turn) *Cost 1FP]
    [-4 Flying Leap (2-Turn) *Cost 1FP]
    [-3 Flying Leap (3-Turn) *Cost 1FP]
    [-2 Flying Leap (4-Turn) *Cost 1FP]
    [-1 Flying Leap (5-Turn) *Cost 1FP]
    Extra Effort (Heroic Charge) reduces the normal turn 1 penalty from -10 to -6, -1 after 1 turn, and no penalty after 2 turns.
    [-6 Instant Flying Leap EX *Costs 2 FP]
    or with a 1-Turn delay:
    [-1 Flying Leap EX (1-Turn) *Costs 2 FP]
    or with a 2-Turn delay:
    [+0 Flying Leap EX (2-Turn) *Costs 2 FP]
    Then
    ["Flying Leap"/if [S:Flying*Leap] /else [/ooc Sorry I can’t do that!]]
*/

// OtF action setup:
//let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
//let AttackName ='Vic*Swung'; //  Attack Name, i.e. [R:Burning*Touch]

console.log('args[0].length '+args[0].length+' : '+args[0]);
let AttackName = args[0].length > 0 ? args[0][1] : 'Punch';
let kbm = args[0].length > 1 ? parseInt(args[0][2]) : 1; //KB multiplier BXTraps01
let animSet = args[0].length > 2 ? args[0][3] : 'ClubSmash';
let trapTagOpt = 'BXTraps01'; // BXTraps01
trapTagOpt = args[0].length > 3 ? args[0][4] : '';
/* test harness
let AttackName ='Vic*Swung';
let kbm = 2;
let trapTagOpt = 'BXTraps01'; // BXTSpikeTrap01
//let SpellName = args[0].length > 2 ? args[0][2] : false; 
*/

function getFlyingLeapMods(stateModifiers) {
	console.log(`ACTIVE state before getFlyingLeapMods: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getFlyingLeapMods(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Flying Leap") == true 
	);
	return modifiers;
}

// OtF action setup:
//let RangedAttackName =`Vic*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
let skFlyingLeap = "Flying*Leap";
let useFlyingLeap = await GURPS.findSkillSpell(_token.actor, skFlyingLeap, true)  != undefined ? true : false;
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
GURPS.ModifierBucket.clear(update=true);
let flyingLeapModifiers = getFlyingLeapMods(originalModifiers);
restoreModBucket(flyingLeapModifiers);
let attackNow = false;

let flyingLeapMsg ='';
if (useFlyingLeap == true) {
    moveattackMsg += `\\\\You take a Flying Leap!`;
} else {
    moveattackMsg += `\\\\You have no skill for Flying Leap!`;;
}  
await GURPS.executeOTF(moveattackMsg);


if (maneuver == 'move_and_attack') {
    let moveattackMsg = stdReadyAnimOtF;
    if (useFlyingLeap == true) {
        GURPS.ModifierBucket.addModifier(-10, 'Heroic ignore Bulk penalty');
        moveattackMsg += `\\\\You took the Move and Attack maneuver this turn. Heroic Archer lets you ignore the Bulk penalty for Move and Attack with a ranged weapon, but Ranged Weapon Accuracy is also ignored. [+0 Heroic ignore Bulk penalty]`;
    } else {
        moveattackMsg += `\\\\You took the Move and Attack maneuver this turn using a Ranged Weapon, resulting in a weapon Bulk default penalty: [-2 Move and Attack ranged penalty]. If you previously took an Aim maneuver, you lose that bonus.`;
    }  
    await GURPS.executeOTF(moveattackMsg);
} else {
    let maneuverMsg = stdReadyAnimOtF;
    maneuverMsg += `/fp +0 \\\\You cannot attack using your current maneuver. You must pick Move and Attack to use Flying Leap.`;
    attackNow = false;
    await GURPS.executeOTF(maneuverMsg);
}


let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor ${GURPS.LastActor.name}`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 

let attackDamageOtF = attackData.damage;
let attackDmgSearchOtF = attackData.damage;

console.log(`attackDamageOtF: ${attackDamageOtF}`);
let dmgType = attackDamageOtF.split(' ')[1];
console.log(`Check dmgType: ${dmgType}`);

if (dmgType == 'cr') {
	console.log(`AttackName: ${AttackName} is a crushing attack, so continue!`);
} else {
	let errMsg = `${AttackName} is not a crushing attack!`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
}
let dmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? Number(attackDamageOtF.split(' ')[0].split('d')[1]) : 0;
let dmgDice = Number(attackDamageOtF.split(' ')[0].split('d')[0]);
if (dmgDice > 2) dmgBonus = dmgBonus+dmgDice; // Mighty Blow gives +2 dmg or +1 dmg per die, whichever is greater.
attackDamageOtF = `${dmgDice}d+${dmgBonus} ${dmgType}`;

let PrimaryCheck = ''; // alter the OtF type used for primary check
let SpellDamage = '';
let SpellDamageCrit = '';
// subtract CostMod from spell cost, or calculate SpellDamage cost reduction with +CostMod
let CostMod = 0;

let SecondaryCheck = `[M:${AttackName+ModifierString}]`; // alter the OtF type used for secondary check
let StrikeDamage = `/r [${attackDamageOtF}]`; // strike damage OtF. If this penetrates DR, then apply SpellDamage

let chatDescription = `<p><b>Flying Leap</b> calculation for this attack.</p>`;

await GURPS.executeOTF(OtF);

function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}
await wait(3);

chatDescription += `<p>Calculated formula is (${attackDamageTotal}x${kbm})/${targetSTmod} = ${kbYards} hexes of Knockback.</p>`;
console.log(chatDescription);
ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
{ chatBubble: false });		
await wait(9);

