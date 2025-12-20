/* Usage: /:TongueGrappleBite

create a GURPS GCA OtF script. If originalGrickActor has the Grick*Grapple advantage, construct an OtF to execute a Grapple and if that succeeds, also execute a Bite.

*/
console.log('------in TongueGrappleBite: -----');

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

let originalGrickActor = await GURPS.LastActor;
let actorName = originalGrickActor.name;
let isGrappled = false;
let hasEffects = false;
let originalGrickActorST = originalGrickActor.data.data.attributes.ST.value;
console.log(`actorName: ${actorName}; originalGrickActorST: ${originalGrickActorST};`);
let targetHT = 0;
let targetST = 0;
let useHT = false;
let useST = false;
let crushOtF = '';
let targetActor = null;
let targetName = '';
let targetID = '';
let targetToken = null;
let lastActor = null;
/*
 create a GURPS script to implement the results of a successful Grapple Crushing attack. If you succeed on a grapple against an opponent no larger than your own SM, on your next turn, and each successive turn, roll a Quick Contest of your ST vs. your victim’s ST or HT, whichever is higher. If you win, your victim takes damage equal to your margin of victory; otherwise, no damage is inflicted.

*/
// check if the target is grappled. If the target is grappled, then the Grick can Bite and crush the target.
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
    targetID = target.id;;
    targetToken = canvas.tokens.get(targetID); 
    hasEffects = targetToken.actor.data.effects.hasOwnProperty ? true : false;
    targetActor = targetToken.actor;
    targetName = targetActor.name;
    await GURPS.SetLastActor(targetActor);
    wait(5);
    lastActor = await GURPS.LastActor;
    console.log(`lastActor: ${lastActor.name};`);
    targetHT = lastActor.data.data.attributes.HT.value
    targetST = lastActor.data.data.attributes.ST.value
    useHT = targetHT > targetST ? true : false;
    useST = targetST >= targetHT ? true : false;
    console.log(`--------- targetName: ${targetName}; targetID: ${targetID}; hasEffects: ${hasEffects}; `);
    if (hasEffects == true) {
        isGrappled = lastActor.data.effects.filter(i => i.data.label == 'GURPS.STATUSGrapple').length > 0 ? true : false ;
        if (isGrappled == true) {
            console.log(`------ targetName: ${targetName} isGrappled: ${isGrappled}; if the ${actorName} wins a Quick Contest of ST vs victim then victim takes crushing damage`);
            if (useHT == true) {
                console.log(`useHT: ${useHT}; targetHT: ${targetHT}; targetST: ${targetST};`);
                crushOtF = `/if [HT] s:{/r [/:TongueGrappleResults]}`;
            } else if (useST == true) {
                console.log(`useST: ${useST}; targetHT: ${targetHT}; targetST: ${targetST};`);
                crushOtF = `/if [ST] s:{/r [/:TongueGrappleResults]}`;
            }
            console.log(`isGrappled will trigger crushOtF: ${crushOtF} on target ${targetName}`);
        }
    }
}
console.log(`isGrappled: ${isGrappled}; hasEffects: ${hasEffects}; targetHT: ${targetHT}; targetST: ${targetST}; vs originalGrickActorST: ${originalGrickActorST}`);

await GURPS.SetLastActor(originalGrickActor);
wait(5);
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

//let originalGrickActor = await GURPS.LastActor;
//let actorName = originalGrickActor.name;
console.log(`actorName: ${actorName};`);
let followOnOtF = ' \\\\/:SetStatusOnTarget grapple '; // follow-on Grappled status
let AttackNamePrimary =`Crush*Tongue*Grapple`; //Vic*Swung
let AttackNameSecondary =`Teeth*Bite`; //Vic*Swung
let attackDamagePrimary = await getAttackDamage(originalGrickActor, AttackNamePrimary);
let attackDamageSecondary = await getAttackDamage(originalGrickActor, AttackNameSecondary);
console.log(`attackDamagePrimary: ${attackDamagePrimary}`);
console.log(`attackDamageSecondary: ${attackDamageSecondary}`);


let PrimaryCheck = `[M:${AttackNamePrimary}]`; // alter the OtF type used for primary check
let SecondaryCheck = `[M:${AttackNameSecondary}]`; // alter the OtF type used for secondary check
let StrikeDamagePrimary = `/r [${attackDamagePrimary}] ${followOnOtF} `; // primary strike damage OtF. If this penetrates DR, then apply SpellDamage
let StrikeDamageSecondary = `/r [${attackDamageSecondary}]`; // secondary strike damage OtF. If this penetrates DR, then apply SpellDamage
let CritStrikeDamagePrimary = `/:CritHitCalcMelee "${AttackNamePrimary}" 1 "${attackDamagePrimary}" "${followOnOtF} "`; // macro reference for CritHitCalc 
let CritStrikeDamageSecondary = `/:CritHitCalcMelee "${AttackNameSecondary}" 1 "${attackDamageSecondary}" " "`; // macro reference for CritHitCalc
//let critTable = game.tables.getName(`DataCritHit`); // critical hit rolltable
//let CritMiss = `/rolltable CritMiss`; // critical miss rolltable

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// Primary attack outcome animations:
let sanimp = `!/anim UnarmedStrike*Dark_Red_Physical *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact*Dark_Red c *0.3`; // success animation 
let csanimp = `!/anim UnarmedStrike*Dark_Red_Physical *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.5`; // critical success animation 
let fanimp = `!/anim UnarmedStrike*Dark_Red_Physical *0.3 -0.2 +0`; // failure animation 
let cfanimp = `!/anim UnarmedStrike*Dark_Red_Physical *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.3 @self`; // critical failure animation 
// Secondary attack outcome animations:
let sanim = `!/anim Bite_01_Regular_Red *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.3`; // success animation 
let csanim = `!/anim Bite_01_Regular_Red *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.5`; // critical success animation 
let fanim = `!/anim Bite_01_Regular_Red *0.3 -0.2 +0`; // failure animation 
let cfanim = `!/anim Bite_01_Regular_Red c *0.6 @self \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.3 @self`; // critical failure animation 

// Primary attack outcome formulas: 
let pasFormula = `${sanimp} \\\\${StrikeDamagePrimary}`; // attack success formula 
let pacsFormula = `${csanimp} \\\\${CritStrikeDamagePrimary}`; // attack critical success formula 
let pafFormula =`${fanimp} \\\\/fp +0 \\\\Grick Grapple missed!`; // attack failure formula 
let pacfFormula =`${cfanimp} \\\\/hp -1 \\\\Grick Grapple crit failed, so Grick hurta itself! \\\\/:SetStatusOnTarget disarmed`; // attack critical failure formula 
console.log(`pasFormula: ${pasFormula}; pacsFormula: ${pacsFormula}; pafFormula: ${pafFormula}; pacfFormula: ${pacfFormula}`);

// Secondary attack outcome formulas: 
let sasFormula = `${sanim} \\\\${StrikeDamageSecondary}`; // attack success formula 
let sacsFormula = `${csanim} \\\\${CritStrikeDamageSecondary}`; // attack critical success formula 
let safFormula =`${fanim} \\\\/fp +0 \\\\Grick Bite missed!`; // attack failure formula 
let sacfFormula =`${cfanim} \\\\/hp -1 \\\\Grick Bite crit failed, so Grick hurts itself! \\\\/:SetStatusOnTarget disarmed`; // attack critical failure formula 
console.log(`sasFormula: ${sasFormula}; sacsFormula: ${sacsFormula}; safFormula: ${safFormula}; sacfFormula: ${sacfFormula}`);

let secondaryAttackFormulaOtF = `/if ${SecondaryCheck} s:{${sasFormula}} cs:{${sacsFormula}} f:{${safFormula}} cf:{${sacfFormula}}`;
console.log(`secondaryAttackFormulaOtF: ${secondaryAttackFormulaOtF}`);

let critSecondaryAttackFormulaOtF = `/if ${SecondaryCheck} s:{${sasFormula}} cs:{${sacsFormula}} f:{${safFormula}} cf:{${sacfFormula}}`;
console.log(`critSecondaryAttackFormulaOtF: ${critSecondaryAttackFormulaOtF}`);

let primaryAttackFormulaOtF = `/if ${PrimaryCheck} s:{${pasFormula} \\\\${secondaryAttackFormulaOtF}} cs:{${pacsFormula} \\\\${critSecondaryAttackFormulaOtF}} f:{${pafFormula}} cf:{${pacfFormula}}`;
console.log(`primaryAttackFormulaOtF: ${primaryAttackFormulaOtF}`);

if (isGrappled == true) {
    console.log(`------ targetName: ${targetName} isGrappled: ${isGrappled}; if the Grick wins a Quick Contest of ST vs victim then victim takes crushing damage using crushOtF: ${crushOtF}, followed by Bite secondaryAttackFormulaOtF: ${secondaryAttackFormulaOtF}`);
    await GURPS.executeOTF(crushOtF);
    await GURPS.executeOTF(secondaryAttackFormulaOtF);
} else {
    await GURPS.executeOTF(primaryAttackFormulaOtF);
}
console.log('------ End TongueGrappleBite: -----');
