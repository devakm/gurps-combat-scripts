/* Usage: /:MightyHolyFrenzySwung
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

console.log(`---------------------- Start MightyHolyFrenzySlash ----------------------`);

// OtF action setup:
let attackTitle ='Holy Frenzy Slash Mighty Blow'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let AttackName ='Holy*Frenzy*Swung'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let totalModPerDie = 1; // Mighty Blow bonus per die
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
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

// analyze the attack damage formula
let attackDmgDice = Number(attackDamageOtF.split(' ')[0].split('d')[0]);
let weaponDmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? Number(attackDamageOtF.split(' ')[0].split('d')[1]) : 0;
let attackDmgType = attackDamageOtF.split(' ').length > 2 ? attackDamageOtF.split(' ')[2] : attackDamageOtF.split(' ')[1];
let useKnockback = attackDmgType == 'cr' ? true : false;
let armorDivisor = attackDamageOtF.includes('(') ? attackDamageOtF.split('(')[1].split(')')[0] : 1;
console.log(`------- attackDmgDice: ${attackDmgDice}; weaponDmgBonus: ${weaponDmgBonus}; attackDmgType: ${attackDmgType}; useKnockback: ${useKnockback}; armorDivisor: ${armorDivisor}`);
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

// add bonus for Mighty Blow if used; add this in totalModPerDie initialization
let totalMod = weaponDmgBonus == 0 ? dmgMod : weaponDmgBonus;
if (totalModPerDie > 0) {
    console.log(`totalModPerDie: ${totalModPerDie}; totalMod: ${totalMod}; attackDmgDice: ${attackDmgDice}`);
    totalMod += Number(totalModPerDie*attackDmgDice);
    console.log(`updated totalMod: ${totalMod}`);
} 
let modSign = totalMod > 0 ? '+' : '';
console.log(`dmgModF: ${dmgModF}; dmgMod: ${dmgMod}; totalMod: ${totalMod}; modSign: ${modSign}`);

//final formula for damage
let dmgFinalOtF = `${attackDmgDice}d${modSign}${totalMod}${armorDivisorTxt} ${attackDmgType}`;
console.log(`dmgFinalOtF: ${dmgFinalOtF}`);

// check for follow-on damage
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

// message for attack mods
let attackModsMsg = `Damage bonus <b>${totalModPerDie} per die</b>, from Mighty Blow damage per die with <b>${attackDmgDice} dice</b> from ST, plus <b>weapon bonus ${weaponDmgBonus}</b>, resulting in <b>Total Modifiers of ${totalMod} damage</b>.<br>`;
console.log(attackModsMsg);
let attackMsg = `<p><b>${actorName}</b> is using ${attackTitle} with <b>${AttackName}</b>, a Knockback multiplier of ${kbm} and attack damage [${dmgFinalOtF}]`;// 
if (useFollowOnAttackData == true || (followOn != undefined && followOn.length > 0)) {
    attackMsg += ` with follow-up ${followOn} if the attack hits`; 
}
attackMsg += `.</p>`;// 
attackMsg += `<p><b>Calculation for Mighty Blow damage</b>: ${attackModsMsg}</p>`;//
console.log(attackMsg);
let knockbackOtF = '';
let knockbackMsg = '';
if (useKnockback === true) {
	console.log(`AttackName: ${AttackName} is a crushing attack, so add Knockback!`);    
    knockbackOtF += `['Knockback'/:AfterAttackKnockback "${AttackName}" ${kbm} "${dmgFinalOtF}" ""]`;
    knockbackMsg = `<b>${actorName}</b> used a <b>crushing attack</b>. 
    If the attack succeeded and is not dodged, then send his foes flying with ${knockbackOtF}; 
    If he rolled a critical hit, then use the Knockback link described in the Critical Hit message instead.<br>`;
} 

let extraEffort = `[+0 Mighty Blow *Cost 1FP]`;
let Attack = '[M:'+AttackName+']'; // alter the OtF type used for attack
let CritMiss = '/rolltable CritMiss'; // critical miss rolltable
let StrikeDamage = `/r [${dmgFinalOtF}]`; // strike damage OtF. If this penetrates DR, then apply SpellDamage
let CritStrikeDamage = `/:CritHitCalcMelee "${AttackName}" ${kbm} "${dmgFinalOtF}" ""`; // macro reference for CritHit using critTable

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
// Berserk HandAxe02_01_Regular_White
// MeleeAttack02_HandAxe01_02
let sanim = '!/anim MeleeAttack*HandAxe *0.6 -0.3 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'; // success animation 
let csanim = '!/anim MeleeAttack*HandAxe *0.9 -0.3 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'; // critical success animation 
let fanim = '!/anim MeleeAttack*HandAxe *0.6 -0.3 +3'; // failure animation 
let cfanim = '!/anim MeleeAttack*HandAxe *0.4 -0.3 +3 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'; // critical failure animation 
let stdReadyAnimOtF = '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'; // ready animation
// outcome formulas:
let asFormula = `${sanim} \\\\${StrikeDamage}${followOnOtF}`; // attack success formula 
let acsFormula = `${csanim} \\\\${StrikeDamage}${followOnOtF} \\\\!/wait 3000 \\\\${CritStrikeDamage}`; // attack critical success formula 
let afFormula =`${fanim} \\\\/fp +0 \\\\Your attack missed!`; // attack failure formula 
let acfFormula =`${cfanim} \\\\/fp -1 \\\\You crit failed your attack, so you drop your weapon! \\\\/status on disarmed`; // attack critical failure formula 

let attackFormulaOtF = `/r ${extraEffort} \\\\/if ${Attack} s:{${asFormula}} cs:{${acsFormula}} f:{${afFormula}} cf:{${acfFormula}}`;
console.log(attackFormulaOtF);

let attackNow = false;
if (maneuver == 'attack' || maneuver == 'allout_attack' || maneuver.startsWith('aoa')) {
    GURPS.executeOTF(attackFormulaOtF);
    attackNow = true;
} else if (maneuver == 'move_and_attack') {
    GURPS.executeOTF(attackFormulaOtF);
    attackNow = true;
} else {
    let maneuverMsg = stdReadyAnimOtF;
    maneuverMsg += `/fp +0 \\\\You cannot attack using your current maneuver. You can pick Attack, All-Out Attack, or Move and Attack.`;
    attackNow = false;
    await GURPS.executeOTF(maneuverMsg);
}

await wait(5);

// chat message
let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">${attackTitle} Attack</span>
		</strong>
	</p>`;
chatDescription += ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
        ${attackMsg}
        </span>
	</p>`;
console.log(chatDescription);
if (attackNow === true) {
    await ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });		
    await wait(1);
}
if (useKnockback === true && knockbackMsg.length > 0) {
    chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Knockback</span>
		</strong>
	</p>`;
    chatDescription += ` 
        <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
            ${knockbackMsg}
            </span>
        </p>`;
    console.log(chatDescription);
    if (attackNow === true) {
        await ChatMessage.create({
            content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
        { chatBubble: false });		
        await wait(1);
    }
}

let targetID,targetToken,targetActor,targetName,followOnMsg;
let targets = Array.from(game.user.targets); 
if (useFollowOnAttackData == true && attackNow === true) {
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

console.log(`---------------------- End MightyHolyFrenzySlash ----------------------`);