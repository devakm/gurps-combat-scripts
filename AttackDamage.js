/* Usage: /:AttackDamage <attackName>
CommonService macro to get the attack damage OtF formula for attackName, 
then parse the OtF to get the damage dice, bonus, armor divisor (if any), and damage type. 
Return these values for use in the FlyingLeapCrushingSlam.js script.
*/
console.log(`---------- in AttackDamage ---------`);

let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor ${GURPS.LastActor.name}`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
console.log(`attackData: ${attackData.name}; ${attackData.skill}; ${attackData.damage}; ${attackData.mode};`);
let weaponDmgBonusTxt = '';
let weaponDmgBonus = 0;
if (attackData != undefined && attackData.notes.includes('to hit and damage') == true) {
    weaponDmgBonusTxt = attackData.notes.split('to hit and damage')[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    if (weaponDmgBonusTxt.includes('-') == true) {
        weaponDmgBonus = -Number(weaponDmgBonusTxt.split('-')[1]);
    } else if (weaponDmgBonusTxt.includes('+') == true) {
        weaponDmgBonus = Number(weaponDmgBonusTxt.split('+')[1]); // split(/[+-]/)[1]
    } 
}
let attackDamageOtF = attackData.damage;
console.log(`weaponDmgBonusTxt: ${weaponDmgBonusTxt}; weaponDmgBonus: ${weaponDmgBonus};`);
console.log(`attackDamageOtF: ${attackDamageOtF}`);
let dmgType = attackDamageOtF.split(' ')[1];
let dmgDice = Number(attackDamageOtF.split(' ')[0].split('d')[0]);
let dmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? Number(attackDamageOtF.split(' ')[0].split('d')[1]) : 0;
let dmgMode = attackData.mode;
console.log(`---- about to check followOn with dmgType: ${dmgType}; dmgDice: ${dmgDice}; dmgBonus: ${dmgBonus}; dmgMode: ${dmgMode}; followOn: ${attackData.notes.split('followOn:')[1]}`);
let followOnSave = false;
let fdmgDice,fdmgType,fdmgBonus,followOnRegex,followOnMatch,followOnDmg;
let useFollowOnAttackData = attackData.notes.includes('followOn:') ? true : false;
console.log(`useFollowOnAttackData: ${useFollowOnAttackData}`);
if (useFollowOnAttackData == true) {
    followOn = attackData.notes.split('followOn:')[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    console.log(`----- get followOn from attackData notes; followOn: ${followOn}`);
    if (followOn.includes('/if [') == true) {
        followOnSave = true;
        console.log(`----- followOnSave: ${followOnSave}`); 
        followOnRegex = /\/else\s*\[([^\]]+)\]/;
        followOnMatch = followOn.match(followOnRegex);
        if (followOnMatch) {
            followOnDmg = followOnMatch[1];
            console.log(`Extracted follow-on damage: ${followOnDmg}`);
            fdmgDice = Number(followOnDmg.split(' ')[0].split('d')[0]);
            fdmgType = followOnDmg.split(' ')[1];
            fdmgBonus = Number(followOnDmg.split(' ')[0].split('d')[1].split('+')[1]) > -5 ? Number(followOnDmg.split(' ')[0].split('d')[1].split('+')[1]) : 0;
        }
    } else {
        fdmgDice = Number(followOn.split(' ')[0].split('d')[0]);
        fdmgType = followOn.split(' ')[1];
        fdmgBonus = Number(followOn.split(' ')[0].split('d')[1].split('+')[1]) > -5 ? Number(followOn.split(' ')[0].split('d')[1].split('+')[1]) : 0;
    }
} else {
    console.log(`----- followOn not found in attackData notes`);
}
console.log(`-------- followOnSave: ${followOnSave}; fdmgDice: ${fdmgDice}; fdmgType: ${fdmgType}; fdmgBonus: ${fdmgBonus};`);   

console.log(`----------------- Usng Attack ${attackData.name}: Check dmgMode: ${dmgMode}; dmgType: ${dmgType}`);
// Striking ST bonus for damage calculation
let useStriking = await GURPS.findAdDisad(_token.actor, 'Striking') != undefined ? true : false;
let striking = 0;
let strikingST = 0;
let strikingMsg = '';
if (useStriking == true) {
    striking = GURPS.findAdDisad(_token.actor, 'Striking');
    strikingST = striking.name.split(' ST ')[1];
    strikingMsg = ` plus Striking ${strikingST} ST`;
    console.log(strikingMsg);
}
let actorST = strikingST > 0 ? Number(defaultST)+Number(strikingST) : Number(defaultST);
let totalST = actorST*3;
console.log(`After Striking check, actorST: ${actorST}; totalST: ${totalST};`);
// get the damage for the actor's ST (totalST) and dmgType
let actorDmg = getDmg(dmgTable, totalST, dmgMode); // get the damage for the actor's ST and dmgType
console.log(`actorDmg: ${actorDmg};`);
let totalSTMsg = `A successful <b>Flying Leap</b> triples actor <b>ST ${defaultST}${strikingMsg} to ${totalST}</b> for this attack. `; //attackSkill defaultST
let dmgModF = '';
let dmgMod = 0;
// analyze the attack damage formula
let attackDmgType = attackDamageOtF.split(' ').length > 2 ? attackDamageOtF.split(' ')[2] : attackDamageOtF.split(' ')[1];
let useKnockback = attackDmgType == 'cr' ? true : false;
let armorDivisor = attackDamageOtF.includes('(') ? attackDamageOtF.split('(')[1].split(')')[0] : 1;
let armorDivisorTxt = '';
if (armorDivisor > 1) armorDivisorTxt = ` (${armorDivisor})`;
if (attackDamageOtF.includes('(')) {
    // attack has armor divisor, so use it in the split
    dmgModF = attackDamageOtF.split('d') && attackDamageOtF.split('d')[1].split('(')[0] != undefined ? attackDamageOtF.split('d')[1].split('(')[0] : '';
} else {
    // else split without armor divisor
    dmgModF = attackDamageOtF.split(' ')[0].split('d')[1] != undefined ? attackDamageOtF.split(' ')[0].split('d')[1] : 0;
}
if (dmgModF.includes('-') == true) {
	dmgMod = -Number(dmgModF.split('-')[1]);
} else if (dmgModF.includes('+') == true) {
	dmgMod = Number(dmgModF.split('+')[1]); // split(/[+-]/)[1]
} 
console.log(`Check dmgModF: ${dmgModF}; dmgMod: ${dmgMod}; armorDivisor: ${armorDivisor}; attackDmgType ${attackDmgType}`);
let actorDice = Number(actorDmg.split('d')[0]);
let actorMod = actorDmg.split(/[+-]/) != undefined ? Number(actorDmg.split('d')[1]) : 0;
console.log(`actorDmg: ${actorDmg}; actorDice: ${actorDice}; actorMod: ${actorMod}`);

// combine the actor's damage with the attack's damage to build the OtF damage formula
let totalModSimple = actorMod+dmgMod;
let modSign = totalModSimple > 0 ? '+' : '';
console.log(`dmgModF: ${dmgModF}; dmgMod: ${dmgMod}; totalModSimple: ${totalModSimple}; modSign: ${modSign}`);
