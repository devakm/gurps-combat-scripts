/* Usage: /:RoperGrapple

create a GURPS GCA OtF script. If originalRoperActor has the Roper*Grapple advantage, construct an OtF to execute a Grapple and if that succeeds, also execute a Bite.

*/
console.log('------in RoperGrapple: -----');

async function wait(x) {
    console.log(`wait(x): ${x}`);
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

async function resistGrappleResults() {
    let macroGrapple = game.macros.getName("ResistGrappleResults");
    if (macroGrapple) {
        await macroGrapple.execute();
    } else {
        console.log(`Macro ResistGrappleResults not found.`);
    }
};

let originalRoperActor = await GURPS.LastActor;
let actorName = originalRoperActor.name;
let isGrappled = false;
let hasEffects = false;
let originalRoperActorST = originalRoperActor.data.data.attributes.ST.value;
console.log(`actorName: ${actorName}; originalRoperActorST: ${originalRoperActorST};`);
let targetHT = 0;
let targetST = 0;
let useHT = false;
let useST = false;
let crushOtF = `/if [ST] s:{${actorName} Grapple check succeeded.} f:{${actorName} Grapple check failed.}`; // `/if [ST] s:{/r [/:RoperGrappleResults]}`
let targetActor = null;
let targetName = '';
let targetID = '';
let targetToken = null;
let lastActor = null;
/*
 create a GURPS script to implement the results of a successful Grapple Crushing attack. If you succeed on a grapple against an opponent no larger than your own SM, on your next turn, and each successive turn, roll a Quick Contest of your ST vs. your victim’s ST or HT, whichever is higher. If you win, your victim takes damage equal to your margin of victory; otherwise, no damage is inflicted.

*/
//let originalRoperActor = await GURPS.LastActor;
//let actorName = originalRoperActor.name;
console.log(`actorName: ${actorName};`);
let statusOtF = ' \\\\/:SetStatusOnTarget grapple '; // follow-on Grappled status
let AttackName =`Roper*Grapple`; //Vic*Swung
let attackDamage = await getAttackDamage(originalRoperActor, AttackName);
console.log(`attackDamage: ${attackDamage}`);

let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor ${GURPS.LastActor.name}`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
console.log(`attackData: ${attackData.name}; ${attackData.damage}; ${attackData.mode};`);
let kbm = 1; // knockback multiplier
let attackDamageOtF = attackData.damage;

let followOnOtF = ''; // follow-on damage formula  
let followOnSave = false;
let fdmgDice,fdmgType,fdmgBonus,followOn,followOnRegex,followOnMatch,followOnDmg;
let useFollowOnAttackData = attackData.notes.includes('followOn:') ? true : false;
console.log(`useFollowOnAttackData: ${useFollowOnAttackData}`);
if (useFollowOnAttackData == true) {
    followOn = '/r '+attackData.notes.split('followOn:')[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    console.log(`----- get followOn from attackData notes; followOn: ${followOn}`);
} else {
    console.log(`----- followOn not found in attackData notes`);
}
console.log(`-------- followOnSave: ${followOnSave}; fdmgDice: ${fdmgDice}; fdmgType: ${fdmgType}; fdmgBonus: ${fdmgBonus};`);   
if (followOn != undefined && followOn.length > 1) followOnOtF = followOn;

let resistCrushDmgOtF = ''; // /r [ST | HT]
let resistCrushDmgUsing = ''; // ST or HT
let resistGrabOtF = '/r [ST]'; // /r [ST]
// check if the target is grappled. If the target is grappled, then the Roper can Bite and crush the target.
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
    targetID = target.id;;
    targetToken = canvas.tokens.get(targetID); 
    hasEffects = targetToken.actor.data.effects.hasOwnProperty ? true : false;
    targetActor = targetToken.actor;
    targetName = targetActor.name;
    await GURPS.SetLastActor(targetActor);
    await wait(1);
    lastActor = await GURPS.LastActor;
    await wait(1);
    console.log(`lastActor: ${lastActor.name};`);
    targetHT = lastActor.data.data.attributes.HT.value
    targetST = lastActor.data.data.attributes.ST.value
    useHT = targetHT > targetST ? true : false;
    useST = targetST >= targetHT ? true : false;
    console.log(`--------- RoperGrapple targetName: ${targetName}; targetID: ${targetID}; hasEffects: ${hasEffects}; `);
    if (hasEffects == true) {
        isGrappled = lastActor.data.effects.filter(i => i.data.label == 'GURPS.STATUSGrapple').length > 0 ? true : false ;
        if (isGrappled == true) {
            console.log(`isGrappled is true, so check followOnOtF, resistCrushDmgOtF, and resistGrabOtF on target ${targetName}`);
            if (useFollowOnAttackData == true && followOnOtF.length > 1) {
                // Sap Strength
                await GURPS.executeOTF(followOnOtF);
                console.log(`followOnOtF: ${followOnOtF};`);
                await wait(1);
            }
            console.log(`------ targetName: ${targetName} isGrappled: ${isGrappled}; if the ${actorName} wins a Quick Contest of ST vs victim then victim takes crushing damage`);

            if (useHT == true) {
                console.log(`useHT: ${useHT}; targetHT: ${targetHT}; targetST: ${targetST};`);
                resistCrushDmgUsing = 'HT';
            } else if (useST == true) {
                console.log(`useST: ${useST}; targetHT: ${targetHT}; targetST: ${targetST};`);
                resistCrushDmgUsing = 'ST';
            }
            resistCrushDmgOtF = `/if [${resistCrushDmgUsing}] s:{You succeed on ${resistCrushDmgUsing} check. You might get out of this yet.} f:{You fail to resist using ${resistCrushDmgUsing}. Bad stuff happens.}`;
            console.log(`resistCrushDmgOtF: ${resistCrushDmgOtF};`);
            await GURPS.executeOTF(resistCrushDmgOtF);
            await wait(1);
            // last, resistGrab; if the target is grappled, then the Roper can Grab and Go to Bite the target.
            // we only need to check the target's ST to resist the Grab and Go
            
            resistGrabOtF = `/r [+4 vs Grab and Go] \\\\/if [ST] s:{You succeed on ST+4 check to resist Grab and Go. You might get out of this yet.} f:{You fail to resist Grab and Go using ST+4. Bad stuff happens.}`;
            console.log(`resistGrabOtF: ${resistGrabOtF};`);
            await GURPS.executeOTF(resistGrabOtF);
            await wait(1);
            
        }
    }
}
console.log(`isGrappled: ${isGrappled}; hasEffects: ${hasEffects}; targetHT: ${targetHT}; targetST: ${targetST}; vs originalRoperActorST: ${originalRoperActorST}`);

await GURPS.SetLastActor(originalRoperActor);
await wait(1);

let AttackOtF = `[M:${AttackName}]`; // alter the OtF type used for  check
let StrikeDamage = `/r [${attackDamage}] ${statusOtF}`; //  strike damage OtF. If this penetrates DR, then apply SpellDamage
let CritStrikeDamage = `/:CritHitCalcMelee "${AttackName}" 1 "${attackDamage}" " " ${statusOtF}`; // macro reference for CritHitCalc 
//let critTable = game.tables.getName(`DataCritHit`); // critical hit rolltable
//let CritMiss = `/rolltable CritMiss`; // critical miss rolltable

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
//  attack outcome animations:
let sanim = `!/anim UnarmedStrike*Dark_Red_Physical *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact*Dark_Red c *0.3`; // success animation 
let csanim = `!/anim UnarmedStrike*Dark_Red_Physical *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.5`; // critical success animation 
let fanim = `!/anim UnarmedStrike*Dark_Red_Physical *0.3 -0.2 +0`; // failure animation 
let cfanim = `!/anim UnarmedStrike*Dark_Red_Physical *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconDrop_01_Regular_Red c *0.3 @self`; // critical failure animation 

//  attack outcome formulas: 
let asFormula = `${sanim} \\\\${StrikeDamage}`; // attack success formula 
let acsFormula = `${csanim} \\\\${CritStrikeDamage}`; // attack critical success formula 
let afFormula =`${fanim} \\\\/fp +0 \\\\Roper Grapple missed!`; // attack failure formula 
let acfFormula =`${cfanim} \\\\/hp -1 \\\\Roper Grapple crit failed, so Roper hurta itself! \\\\/:SetStatusOnTarget disarmed`; // attack critical failure formula 
console.log(`asFormula: ${asFormula}; acsFormula: ${acsFormula}; afFormula: ${afFormula}; acfFormula: ${acfFormula}`);
let AttackFormulaOtF = `/if ${AttackOtF} s:{${asFormula}} cs:{${acsFormula}} f:{${afFormula}} cf:{${acfFormula}}`;
console.log(`AttackFormulaOtF: ${AttackFormulaOtF}`);

if (isGrappled == true) {
    console.log(`------ targetName: ${targetName} isGrappled: ${isGrappled}; if the Roper wins a Quick Contest of ST vs victim then victim takes crushing damage using crushOtF: ${crushOtF}, followed by Bite`);
    await GURPS.executeOTF(crushOtF);
    await wait(2);
    await resistGrappleResults();
} else {
    console.log(`------ Do the Grapple attack targetName: ${targetName} isGrappled: ${isGrappled}; if the Roper has not yet grappled the victim, then the Roper can Grapple the target using AttackFormulaOtF: ${AttackFormulaOtF}`);
    await GURPS.executeOTF(AttackFormulaOtF);
    await wait(2);
    await resistGrappleResults();
}
console.log('------ End RoperGrapple: -----');
