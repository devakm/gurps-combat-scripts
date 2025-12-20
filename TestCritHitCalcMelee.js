/* Usage: /:CritHitCalcMelee <attackname> <attackDamageOtF> <followOnOtF> <kbmultiplier> <animation> <spellname>  <trap tags>
	Calculate critical hit attacks total and return the damage total
	
	<attackname> attack name to use
    <attackDamageOtF> /:CritHitCalcMelee '[${dmgFinalOtF}]' '${followOnOtF}'
    <followOnOtF> /:CritHitCalcMelee '[${attackDamageOtF}]' '${followOnOtF}'
	<kbmultiplier> knockback multiplier
	<animation> which animation set to use
	<spellname> spell name to use
	
*/

// OtF action setup:
//let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
//let AttackName ='Vic*Swung'; //  Attack Name, i.e. [R:Burning*Touch]
/*
console.log('args[0].length '+args[0].length+' : '+args[0]);
let AttackName = args[0].length > 0 ? args[0][1] : 'Punch';
let attackDamageOtF = args[0].length > 1 ? args[0][2] : '[1d cr]';
let followOnOtF
let kbm = args[0].length > 1 ? args[0][2] : 1; //KB multiplier BXTraps01
let animSet = args[0].length > 2 ? args[0][3] : 'ClubSmash';
let trapTagOpt = 'BXTraps01'; // BXTraps01
trapTagOpt = args[0].length > 3 ? args[0][4] : '';
kbm = parseInt(kbm);
let pushOtF = '';
let kbYards = 0;
let kbFeet = 0;
let kbHexes = 0; // KB Hexes = Feet/GridDistance
let kbYardsMod = 0; // KB Yards = Feet/GridDistance * 3
*/

/* test harness
let AttackName ='Vic*Thrust'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let kbm = 2;
let trapTagOpt = 'BXTraps01'; // BXTSpikeTrap01
let pushOtF = '';
let kbVictims = [];
//let SpellName = args[0].length > 2 ? args[0][2] : false; 
*/

console.log(`---------------------- Start CritHitCalc ----------------------`);

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

let AttackName ='Holy*Frenzy*Swung'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let kbm = 2; // knockback multiplier
let attackDamageOtF = '3d+8 cut'; // [6d+14 imp] or [2d+4 cr] or [2d+4 (2) cr] 
let followOnOtF = ''; //let followOnOtF = '["Weak Bladeblack HT-5"/if [HT-5]  /else [2d tox]]';
/*
if (args != undefined) {
    console.log(`args[0].length ${args[0].length} : ${+args[0]}`);
    AttackName = args[0].length > 0 ? args[0][1] : 'Punch';
    kbm = args[0].length > 1 ? parseInt(args[0][2]) : 1; //KB multiplier BXTraps01
    attackDamageOtF = args[0].length > 2 ? args[0][3] : '';
    followOnOtF = args[0].length > 3 ? args[0][4] : '';
}
*/

let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor ${GURPS.LastActor.name}`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
attackDamageOtF = attackDamageOtF.length > 1 ? attackDamageOtF : attackData.damage;
followOnOtF = followOnOtF.length > 1 ? followOnOtF : attackData.notes.includes('followOn:') ? attackData.notes.split('followOn:')[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '') : '';
console.log(`attackData: ${attackData.name}; attackData.level: ${attackData.level}; attackData.damage: ${attackData.damage}; attackData.mode: ${attackData.mode};`);

let originalActor = await GURPS.LastActor;
let originalModifiers = GURPS.ModifierBucket.modifiers;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
console.log(`attackDamageOtF: ${attackDamageOtF}`);

attackDamageOtF = attackDamageOtF.replace(/[\[\]]/g, '');
let attackDmgDice = attackDamageOtF.split(' ')[0].split('d')[0];
console.log(`attackDmgDice: ${attackDmgDice};`);
let attackDmgMode = attackData.mode;
let followOn = '';
let followOnSave = false;
let fdmgDice,fdmgType,fdmgBonus,followOnRegex,followOnMatch,followOnDmg;
if (attackData.notes.includes('followOn:')) {
    //followOn = attackData.notes.split('followOn:')[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    followOn = followOnOtF;
    if (followOn.includes('/if [') == true) {
        followOnSave = true;
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
}
let attackDmgBonus = 0;
let dmgFinalOtF = attackDamageOtF;
let dmgMod = 0;
let modSign = '+';
// analyze the attack damage formula
let attackDmgType = attackDamageOtF.split(' ').length > 2 ? attackDamageOtF.split(' ')[2] : attackDamageOtF.split(' ')[1];
let useKnockback = attackDmgType == 'cr' ? true : false;
console.log(`attackDmgDice: ${attackDmgDice}; attackDmgBonus: ${attackDmgBonus}; attackDmgMode: ${attackDmgMode}; attackDmgType ${attackDmgType}`);
let armorDivisor = attackDamageOtF.includes('(') ? attackDamageOtF.split('(')[1].split(')')[0] : 1;
let armorDivisorTxt = '';
if (armorDivisor > 1) armorDivisorTxt = ` (${armorDivisor})`;
if (attackDamageOtF.includes('(')) {
    // attack has armor divisor, so use it in the split
    attackDmgBonus = attackDamageOtF.split('d') && attackDamageOtF.split('d')[1].split('(')[0] != undefined ? attackDamageOtF.split('d')[1].split('(')[0] : 0;
} else {
    // else split without armor divisor
    attackDmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] != undefined ? attackDamageOtF.split(' ')[0].split('d')[1] : 0;
}
if (attackDmgBonus.includes('-') == true) {
	dmgMod = -Number(attackDmgBonus.split('-')[1]);
    modSign = '';
} else if (attackDmgBonus.includes('+') == true) {
	dmgMod = Number(attackDmgBonus.split('+')[1]); // split(/[+-]/)[1]
    modSign = '+';
} 
attackDamageOtF = `${attackDmgDice}d${modSign}${dmgMod}${armorDivisorTxt} ${attackDmgType}`;
console.log(`attackDamageOtF: ${attackDamageOtF}: attackDmgDice: ${attackDmgDice}d ; modSign: ${modSign}; dmgMod: ${dmgMod}; armorDivisor: ${armorDivisor}; attackDmgType: ${attackDmgType}`);
await wait(3);
// find the last targeted roll data for the originalActor and check if it's a critHit
let ltrData = await GURPS.lastTargetedRolls[_token.actor.id];
let critMulti,critBonus;
if (ltrData.isCritSuccess == true) {
	// it's a critHit! Save the result and show the CritHit message
	let rollCrit = new Roll("3d6", _token.actor.getRollData());
	await rollCrit.roll();
	game.dice3d.showForRoll(rollCrit); 
	let rollMsg = `Actor rolled a CritHit: ${_token.actor.name} rolled ${rollCrit._formula} and got a ${rollCrit._total} !!!`;
	console.log(rollMsg);
	let critTable = game.tables.getName('DataCritHit')
	let critResults = await critTable.getResultsForRoll(rollCrit._total > 1 ? rollCrit._total : 11);
	console.log(`result: ${critResults[0].data.text}`);
	const critResultsA = critResults[0].data.text.split('|');
	critMulti = Number(critResultsA[0]);
	critBonus = Number(critResultsA[1]);
	console.log(`mult: ${critMulti}; bonus: ${critBonus};`);
	let critMsgTable = game.tables.getName('CritHit')
	let critMsgResults = critMsgTable.getResultsForRoll(rollCrit._total > 1 ? rollCrit._total : 11);
	await critMsgTable.toMessage(critMsgResults);
}
// check recent messages for the damage result total
// uses attackDmgSearchOtF or attackDamageOtF to select the latest message._roll._total
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);
let messageList = game.messages.filter(i => 
	i.data.timestamp > ts 
	&& i.data.speaker.alias == actorName  
	&& i._roll != null
	&& i._roll._formula.includes("d6[Damage]") == true 
	&& i.data.content.includes(attackDamageOtF) == true
	); 
for (let message of messageList) {
    console.log(`time: ${message.data.timestamp} > ${ts} ; damage total: ${message._roll._total}`)};
let lastMessage;
messageList.forEach(message => { lastMessage = message }); // pick the latest message
let attackDamageTotal = lastMessage._roll._total; // damage roll total for regular success
let maxDamage,maxFonDmg,maxFonDmgTotal = 0;
let dmgTotalOtF,dmgFormulaMsg,followOnMsg,dmgTotalFormula = '';
if (ltrData.isCritSuccess == true) {
	maxDamage = Number(lastMessage._roll.dice[0].faces)*Number(lastMessage._roll.dice[0].number);
	attackDamageTotal = (Number(maxDamage)+Number(attackDmgBonus))*Number(critMulti)+Number(critBonus);
    dmgFinalOtF = `${attackDmgDice}d${modSign}${dmgMod}${armorDivisorTxt} ${attackDmgType}`;
    dmgFormulaMsg = `Original damage formula was [${dmgFinalOtF}], resulting in Base CritHit Max Damage of ${lastMessage._roll.dice[0].number}d${lastMessage._roll.dice[0].faces} = ${maxDamage} * Crit Multiplier ${critMulti}, from (${maxDamage}${attackDmgBonus})*${critMulti}+${critBonus} for a grand total of <b>${attackDamageTotal} damage</b>!`
    console.log(dmgFormulaMsg);
    let followOnOtF;
    if (followOn.length > 0) {
        maxFonDmg = 6*Number(fdmgDice);
        maxFonDmgTotal = (Number(maxFonDmg)+Number(fdmgBonus))*Number(critMulti)+Number(critBonus);
        dmgFormulaMsg += ` <br><b>Follow-on</b> damage is ${followOn} for a total of <b>${maxFonDmgTotal} damage</b>!`;
        if (followOnSave === false) {
            followOnOtF = ` \\\\/r [${maxFonDmgTotal} ${fdmgType}]`; 
        } else {
            followOnOtF = ``;
        }
    } 
    //followOnOtF = followOnSave === true ? ` \\\\/r [${maxFonDmgTotal} ${fdmgType}]` : '';
    dmgTotalFormula = `${attackDamageTotal}${armorDivisorTxt} ${attackDmgType}`;
    dmgTotalOtF = `[${dmgTotalFormula}]${followOnOtF}`;
    console.log(`dmgTotalOtF: ${dmgTotalOtF}`);
	GURPS.executeOTF(`/r ${dmgTotalOtF}`); 
};

let dmgTotalFormulaX = encodeURIComponent(dmgTotalFormula);
let knockbackOtF, flfKnockbackOtF,knockbackMsg = '';
if (useKnockback === true) {
	console.log(`AttackName: ${AttackName} is a crushing attack, so add Knockback!`);    
    knockbackOtF = `['Knockback'/:AfterAttackKnockback "${AttackName}" ${kbm} "${dmgTotalFormula}" "${trapTagOpt}"]`;
    knockbackMsg += `<br>You used a crushing attack. If you hit your target and are not dodged, then send your foes flying with ${knockbackOtF} <br>`;
    console.log(`knockbackOtF: ${knockbackOtF}`);   
} 

//let gridDistance = game.scenes.current.grid.distance
let gridFeet = game.scenes.current.dimensions.distance
let targetID,targetToken,targetActor,targetName,critHitMsg,chatDescription;
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	targetID = target.id;;
    targetToken = canvas.tokens.get(targetID);
    targetActor = targetToken.data.actorData;
    targetName = targetActor.name;
    console.log(`targetID: ${targetID}`);
	critHitMsg = `<p><b>CritHit</b> calculation for this attack:</p>`;
	//console.log(`<p>${title} causes ${dice} ${adds} (${armorDivisor}) ${type}.<p> `);
	critHitMsg += `<p><b>${actorName}</b> does <b>${attackDamageTotal}</b> damage to <b>${targetName}</b></p>`;
	critHitMsg += `<p>${dmgFormulaMsg}</p>`;
	console.log(critHitMsg);
    chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Critical Hit</span>
		</strong>
	</p>`;
    chatDescription += ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
            ${critHitMsg}
            ${knockbackMsg}
            </span>
    </p>`;
    console.log(chatDescription);
    await ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });		
    await wait(1);
};

//console.log(`attackDamageTotal: ${attackDamageTotal};`);

console.log(`---------------------- End CritHitCalc ----------------------`);