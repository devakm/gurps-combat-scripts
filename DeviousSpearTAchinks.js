/* Usage: /:DeviousSpearChinks
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

// modules/jb2a_patreon/Library/Generic/UI/IconPoison_01_Dark_Green_200x200.webm

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}
console.log(`---------------------- Start DeviousSpearChinks ----------------------`);

// OtF action setup:
let AttackName ='Devious*Spear*Chinks'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor ${GURPS.LastActor.name}`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
console.log(`attackData: ${attackData.name}; ${attackData.skill}; ${attackData.damage}; ${attackData.mode};`);
let kbm = 1; // knockback multiplier
let attackDamageOtF = attackData.damage;
let followOnOtF = ''; // follow-on damage formula  
let followOnSave = false;
let fdmgDice,fdmgType,fdmgBonus,followOn,followOnRegex,followOnMatch,followOnDmg;
let useFollowOnAttackData = attackData.notes.includes('followOn:') ? true : false;
console.log(`useFollowOnAttackData: ${useFollowOnAttackData}`);
if (useFollowOnAttackData == true) {
    followOn = attackData.notes.split('followOn:')[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    console.log(`----- get followOn from attackData notes; followOn: ${followOn}`);
} else {
    console.log(`----- followOn not found in attackData notes`);
}
console.log(`-------- followOnSave: ${followOnSave}; fdmgDice: ${fdmgDice}; fdmgType: ${fdmgType}; fdmgBonus: ${fdmgBonus};`);   
if (followOn != undefined && followOn.length > 1) followOnOtF = followOn;

let Attack = '[M:'+AttackName+']'; // alter the OtF type used for attack
let CritMiss = '/rolltable CritMiss'; // critical miss rolltable
let StrikeDamage = `/r [${attackDamageOtF}]`; // strike damage OtF. If this penetrates DR, then apply SpellDamage
let CritStrikeDamage = `/:CritHitCalcMelee attack="${AttackName}" kbm=${kbm} dmg="${attackDamageOtF}"`; // macro reference for CritHit using critTable

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim Spear01_03_Regular_Yellow *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim IconPoison_01_Dark_Green c *0.3'; // success animation 
let csanim = '!/anim Spear01_03_Regular_Yellow *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5'; // critical success animation 
let fanim = '!/anim Spear01_03_Regular_Yellow *0.6 -0.1 +0.9'; // failure animation 
let cfanim = '!/anim Spear01_03_Regular_Yellow *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'; // critical failure animation 
// outcome formulas:
let asFormula = `${sanim} \\\\${StrikeDamage}`; // attack success formula 
let acsFormula = `${csanim} \\\\${CritStrikeDamage}`; // attack critical success formula 
let afFormula =`${fanim} \\\\/fp +0 \\\\Your attack missed!`; // attack failure formula 
let acfFormula =`${cfanim} \\\\/fp -1 \\\\You crit failed your attack, so you drop your weapon! \\\\/status on disarmed`; // attack critical failure formula 

let attackFormulaOtF = `/if ${Attack} s:{${asFormula}} cs:{${acsFormula}} f:{${afFormula}} cf:{${acfFormula}}`;

console.log(attackFormulaOtF);
GURPS.executeOTF(attackFormulaOtF);
await wait(5);

let targetID,targetToken,targetActor,targetName,followOnMsg,chatDescription;
let targets = Array.from(game.user.targets); 
if (useFollowOnAttackData == true) {
    for(let target of targets){ 
        targetID = target.id;;
        targetToken = await canvas.tokens.get(targetID);
        targetActor = targetToken.actor;
        targetName = targetActor.name;
        console.log(`targetID: ${targetID}`);
        followOnMsg = `<p><b>Follow-Up</b> for this attack:</p>`;
        //console.log(`<p>${title} causes ${dice} ${adds} (${armorDivisor}) ${type}.<p> `);
        followOnMsg += `<p><b>${actorName}</b> used an attack that includes Follow-Up damage. If <b>${targetName}</b> fails to Dodge, Block, or Parry the attack, and the attack penetrated <b>${targetName}'s</b> armor, then <b>${targetName}</b> may suffer additional damage from the Follow-Up.</p>`;
        followOnMsg += `<p>Use ${followOnOtF}</p>`;
        console.log(followOnMsg);
        chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <strong>
                <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Follow-Up Damage</span>
            </strong>
        </p>`;
        chatDescription += ` 
        <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
                <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
                ${followOnMsg}
                </span>
        </p>`;
        console.log(chatDescription);
        await ChatMessage.create({
            content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
        { chatBubble: false });		
        await wait(5);
    };
}

console.log(`---------------------- End DeviousSpearChinks ----------------------`);