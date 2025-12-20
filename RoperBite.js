/* Usage: /:RoperBite

create a GURPS GCA OtF script. If originalRoperActor has the Roper*Grapple advantage, construct an OtF to execute a Grapple and if that succeeds, also execute a Bite.

*/
console.log('------in RoperBite: -----');

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

async function getAttackDamage(actor, attackName) {
    let attackData = await GURPS.findAttack(actor, attackName, 1, 0);
    if (attackData == undefined) {
        let errMsg = `${attackName} not found on actor ${actor.name}`;
        ui.notifications.error(errMsg);
        console.log(`Error: ${errMsg}`);
        return null;
    }
    console.log(`attackData: ${attackData.name}; ${attackData.level}; ${attackData.damage}; ${attackData.mode};`);
    return attackData.damage;
}


let originalRoperActor = await GURPS.LastActor;
let actorName = originalRoperActor.name;
let isGrappled = false;
let hasEffects = false;
let targetActor = null;
let targetName = '';
let targetID = '';
let targetToken = null;
let lastActor = null;
console.log(`------------ actorName: ${actorName};`);
let statusOtF = ' \\\\/:SetStatusOnTarget grapple '; // follow-on Grappled status
let AttackNamePrimary =`Roper*Grapple`; //Vic*Swung
let AttackName =`Teeth*Bite`; //Vic*Swung
let attackDamage = await getAttackDamage(originalRoperActor, AttackName);
console.log(`attackDamage: ${attackDamage}`);

let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor ${GURPS.LastActor.name}`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
console.log(`attackData: ${attackData.name}; ${attackData.skill}; ${attackData.damage}; ${attackData.mode};`);
let kbm = 1; // knockback multiplier
let attackDamageOtF = attackData.damage;

let AttackOtF = `[M:${AttackName}]`; // alter the OtF type used for  check
let StrikeDamage = `/r [${attackDamage}]`; //  strike damage OtF. If this penetrates DR, then apply SpellDamage
let CritStrikeDamage = `/:CritHitCalcMelee "${AttackName}" 1 "${attackDamage}" " "`; // macro reference for CritHitCalc
//let critTable = game.tables.getName(`DataCritHit`); // critical hit rolltable
//let CritMiss = `/rolltable CritMiss`; // critical miss rolltable

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
//  attack outcome animations:
let sanim = `!/anim Bite_01_Regular_Red *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.3`; // success animation 
let csanim = `!/anim Bite_01_Regular_Red *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.5`; // critical success animation 
let fanim = `!/anim Bite_01_Regular_Red *0.3 -0.2 +0`; // failure animation 
let cfanim = `!/anim Bite_01_Regular_Red c *0.6 @self \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.3 @self`; // critical failure animation 

//  attack outcome formulas: 
let asFormula = `${sanim} \\\\${StrikeDamage}`; // attack success formula 
let acsFormula = `${csanim} \\\\${CritStrikeDamage}`; // attack critical success formula 
let afFormula =`${fanim} \\\\/fp +0 \\\\Roper Bite missed!`; // attack failure formula 
let acfFormula =`${cfanim} \\\\/hp -1 \\\\Roper Bite crit failed, so Roper hurts itself! \\\\/:SetStatusOnTarget disarmed`; // attack critical failure formula 
console.log(`------------ Formulas asFormula: ${asFormula}; acsFormula: ${acsFormula}; afFormula: ${afFormula}; acfFormula: ${acfFormula}`);
let AttackFormulaOtF = `/if ${AttackOtF} s:{${asFormula}} cs:{${acsFormula}} f:{${afFormula}} cf:{${acfFormula}}`;
console.log(`AttackFormulaOtF: ${AttackFormulaOtF}`);
await GURPS.executeOTF(AttackFormulaOtF);
console.log('------ End RoperBite: -----');
