/* Usage: /:Knockback <attackname> <kbmultiplier> <animation> <spellname>  <trap tags>
	Calculate knockback for crushing attacks and shove
	
	<attackname> attack name to use
	<kbmultiplier> knockback multiplier
	<animation> which animation set to use
	<spellname> spell name to use
	
*/

// OtF action setup:
//let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
//let AttackName ='Vic*Swung'; //  Attack Name, i.e. [R:Burning*Touch]

console.log('args[0].length '+args[0].length+' : '+args[0]);
let AttackName = args[0].length > 0 ? args[0][1] : 'Punch';
let kbm = args[0].length > 1 ? args[0][2] : 1; //KB multiplier BXTraps01
let animSet = args[0].length > 2 ? args[0][3] : 'ClubSmash';
let trapTagOpt = 'BXTraps01'; // BXTraps01
trapTagOpt = args[0].length > 3 ? args[0][4] : '';
let pushOtF = '';
let kbVictims = [];
let kbVictimsStr;
let kbYards = 0;
let kbFeet = 0;
let kbHexes = 0; // KB Hexes = Feet/GridDistance
let kbYardsMod = 0; // KB Yards = Feet/GridDistance * 3


/* test harness
let AttackName ='Vic*Swung';
let kbm = 2;
let trapTagOpt = 'BXTraps01'; // BXTSpikeTrap01
let pushOtF = '';
let kbVictims = [];
//let SpellName = args[0].length > 2 ? args[0][2] : false; 
*/

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
spellDta = [
	{'spell': 'ex', 'type': 'sformula', 'sdm': 'success'},
	{'spell': 'ex', 'type': 'csformula', 'sdm': 'critHit'},
	{'spell': 'ex', 'type': 'fformula', 'sdm': 'fail'},
	{'spell': 'ex', 'type': 'cfformula', 'sdm': 'critFail'},
	{'spell': 'Fireball', 'type': 'sformula', 'sdm': '/:SpellDamage Fireball 1 0 burn'},
	{'spell': 'Fireball', 'type': 'csformula', 'sdm': '/:SpellDamage Fireball 1 +2 burn'},
	{'spell': 'Fireball', 'type': 'fformula', 'sdm': '/fp -1'},
	{'spell': 'Fireball', 'type': 'cfformula', 'sdm': '/hp -1d-3!'},
	{'spell': 'Explosive*Fireball', 'type': 'sformula', 'sdm': '/:SpellDamage ExplosiveFireball 0.5 0 burn '},
	{'spell': 'Explosive*Fireball', 'type': 'csformula', 'sdm': '/:SpellDamage ExplosiveFireball 0.5 0 burn '},
	{'spell': 'Explosive*Fireball', 'type': 'fformula', 'sdm': '/fp -1'},
	{'spell': 'Explosive*Fireball', 'type': 'cfformula', 'sdm': '/hp -1d-3!'},
	{'spell': 'ex2', 'type': 'sformula', 'sdm': 'success'},
	{'spell': 'ex2', 'type': 'sformula', 'sdm': 'success'}
];
	
function getSpellSet(spellDta, spell, type) {
	let spellFormula = spellDta.find(x => x.spell == spell && x.type == type).sdm;
	return spellFormula;
}

/* Outcome animations data table 
Outcomes for critical success, critical failure, regular success, and regular failure each of these settings can be tested individually as an OtF or chat command.
outcome animations:
sanim   // success animation 
csanim  // critical success animation 
fanim   // failure animation 
cfanim  // critical failure animation 
*/
animDta = [
	{'name': 'ex', 'type': 'sanim', 'anim': 'success'},
	{'name': 'ex', 'type': 'csanim', 'anim': 'critHit'},
	{'name': 'ex', 'type': 'fanim', 'anim': 'fail'},
	{'name': 'ex', 'type': 'cfanim', 'anim': 'critFail'},
	{'name': 'ex2', 'type': 'sanim', 'anim': 'success'},
	{'name': 'outPulse', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_02_Regular_Yellow c *0.5 @self \\\\!/anim OutPulse_03_Circle_Fast_500 c *0.3 @self'},
	{'name': 'inPulse', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
	{'name': 'pulse', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
	{'name': 'stars', 'type': 'rdy', 'anim': '!/anim DizzyStars*Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
	{'name': 'MaulFire', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
	{'name': 'MaulFire', 'type': 'sanim', 'anim': '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim GroundCrackImpact_02_Regular_Orange c *0.7  \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Impact_04_Regular_Orange c *0.5'},
	{'name': 'MaulFire', 'type': 'csanim', 'anim': '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim GroundCrackImpact_02_Regular_Orange c *0.7  \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Impact_04_Regular_Orange c *0.5'},
	{'name': 'MaulFire', 'type': 'fanim', 'anim': '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 -0.1'},
	{'name': 'MaulFire', 'type': 'cfanim', 'anim': '!/anim Impact_01_Regular_Yellow c *0.7 @self \\\\!/anim Impact_04_Regular_Orange c *0.5 @self'},
	{'name': 'ClubSmash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
	{'name': 'ClubSmash', 'type': 'sanim', 'anim': '!/anim Club01_02_Dark_OrangePurple -0.4 +1 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.6'},
	{'name': 'ClubSmash', 'type': 'csanim', 'anim': '!/anim Club01_02_Dark_OrangePurple -0.4 +1 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.8'},
	{'name': 'ClubSmash', 'type': 'fanim', 'anim': '!/anim Club01_02_Dark_OrangePurple -0.4 +0.5 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.2 @self'},
	{'name': 'ClubSmash', 'type': 'cfanim', 'anim': '!/anim Club01_02_Dark_OrangePurple -0.4 +0.5 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.3 @self'},
];
	
function getAnimSet(animDta, animName, typeSet) {
	let anim = animDta.find(x => x.type == typeSet && x.name == animName).anim;
	return anim;
}



let SpellName = '';
if (SpellName.length > 0) {
	console.log(`Spells On`);
} else {
	console.log(`Spells Off`);
}


// outcome animations lookup by type [tox] and label [sanim]
let sanim = ''; // success animation 
let csanim = ''; // critical success animation 
let fanim = ''; // failure animation 
let cfanim = ''; // critical failure animation
let rdyanim = ''; // ready animation

// Spellbenders
let sformulaSp; // success animation 
let csformulaSp; // critical success animation 
let fformulaSp; // failure animation 
let cfformulaSp; // critical failure animation

if (SpellName.length > 0) {
	// spell outcome formulas lookup by name [Fireball] and type [sformula]
	sformulaSp = getSpellSet(spellDta, SpellName, 'sformula')+`${CostMod}`; // success animation 
	csformulaSp = getSpellSet(spellDta, SpellName, 'csformula')+`${CritCostMod}`; // critical success animation 
	fformulaSp = getSpellSet(spellDta, SpellName, 'fformula'); // failure animation 
	cfformulaSp = getSpellSet(spellDta, SpellName, 'cfformula'); // critical failure animation
	//getSpellSet(spellDta, 'Fireball', 'sformula');	
	
	// outcome animations lookup by type [tox] and label [sanim]
	sanim = getAnimSet(animDta, SpellName, 'sanim'); // success animation 
	csanim = getAnimSet(animDta, SpellName, 'csanim'); // critical success animation 
	fanim = getAnimSet(animDta, SpellName, 'fanim'); // failure animation 
	cfanim = getAnimSet(animDta, SpellName, 'cfanim'); // critical failure animation
	rdyanim = getAnimSet(animDta, SpellName, 'rdy'); // ready animation
} else if (animSet != undefined && animSet.length > 0) {
	// outcome animations lookup by type [tox] and label [sanim]
	sanim = getAnimSet(animDta, animSet, 'sanim'); // success animation 
	csanim = getAnimSet(animDta, animSet, 'csanim'); // critical success animation 
	fanim = getAnimSet(animDta, animSet, 'fanim'); // failure animation 
	cfanim = getAnimSet(animDta, animSet, 'cfanim'); // critical failure animation
	rdyanim = getAnimSet(animDta, animSet, 'rdy'); // ready animation	
}





let Modifier = GURPS.ModifierBucket.currentSum();
GURPS.ModifierBucket.clear(update=true);
if (isNaN(Modifier)||Modifier===0) {
	Modifier = '+0';
} else if (Modifier > 0) {
	Modifier = '+'+Modifier;
}
let ModifierString = `${Modifier} Modifier Bucket Applied`;

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

if (SpellName.length > 0) {	
	console.log(`Someone turned Spells back On! ${SpellName.length}`);
	let SpellSkill = Number(await GURPS.findSkillSpell(_token.actor,SpellName,0,1).level)
	if (SpellSkill > 19) {
		CostMod = -2
	} else if (SpellSkill > 14) {
		CostMod = -1
	} 
	PrimaryCheck = `[Sp:${SpellName}]`; // alter the OtF type used for primary check
	SpellDamage = `\\\\/:SpellDamage BurningTouch 1 +2 burn -24 `;
	SpellDamageCrit = `\\\\/:SpellDamage BurningTouch 1 0 burn ${CostMod}`;
} else {
	let defaultST = await GURPS.LastActor.data.data.attributes.ST.value;
	PrimaryCheck = `[ST${defaultST}]`; // alter the OtF type used for primary check
}

let SecondaryCheck = `[M:${AttackName+ModifierString}]`; // alter the OtF type used for secondary check
//let StrikeDamage = `/r [D:${AttackName}]`; // strike damage OtF. If this penetrates DR, then apply SpellDamage
let StrikeDamage = `/r [${attackDamageOtF}]`; // strike damage OtF. If this penetrates DR, then apply SpellDamage

// outcome formulas: 
let csformula = `/r [+0 Mighty Blow KB Crit No Cost] \\\\${StrikeDamage} ${SpellDamageCrit}`; // critical success formula 
let cfformula =`/hp -1d-3! \\\\/rolltable CritMiss`; // critical failure formula 
let sformula = `/r [+0 Mighty Blow KB *Cost 2FP] \\\\${StrikeDamage} ${SpellDamage}`; //success formula 
let fformula =`/fp -1`; // failure formula 
let OtF = `Nada`;
if (SpellName.length > 0) {	
//with SpellDamage On
	OtF = `[/if ${PrimaryCheck} cs:{/if ${SecondaryCheck} {${csanim} \\\\${csformula} }} cf:{${cfanim} \\\\${cfformula}} s:{/if ${SecondaryCheck} cs:{${csanim} \\\\${csformula} } s:{${sanim} \\\\${sformula}} cf:{${cfanim} \\\\${cfformula}} f:{${fanim} \\\\${fformula}}} f:{${fanim} \\\\${fformula}} ]`;
} else {
	OtF = `[/if ${SecondaryCheck} cs:{${csanim} \\\\${csformula} } s:{${sanim} \\\\${sformula}} cf:{${cfanim} \\\\${cfformula}} f:{${fanim} \\\\${fformula}} ]`;
}
console.log(OtF);

await GURPS.executeOTF(OtF);

function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

await wait(3);

// save the list of modifiers (including Rule of 14)
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
// save the original actor
const originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: "${actorName}";`);
let ltrData = await GURPS.lastTargetedRolls[originalActor.id];
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
//deprecated let scatterOtF = '[/rolltable Scatter]';

// check recent messages for the damage result total
// uses attackDmgSearchOtF or attackDamageOtF to select the latest message._roll._total
let d = new Date();
let ts = d.getTime()-99999999;
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
if (ltrData.isCritSuccess == true) {
	let maxDamage = Number(lastMessage._roll.dice[0].faces)*Number(lastMessage._roll.dice[0].number);
	attackDamageTotal = Number(maxDamage)+Number(dmgBonus)*Number(critMulti)+Number(critBonus);
	console.log(`Base CritHit Max Damage: ${lastMessage._roll.dice[0].number}d${lastMessage._roll.dice[0].faces} = ${maxDamage} * Crit Multiplier ${critMulti} = ${maxDamage}+${dmgBonus}*${critMulti}+${critBonus} for a grand total of ${attackDamageTotal} damage!`);
};

//let gridDistance = game.scenes.current.grid.distance
let gridFeet = game.scenes.current.dimensions.distance

// now that we found the attackDamageTotal, we need to compare it to ST of the target(s)
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	let targetID = target.id;;
    let targetToken = canvas.tokens.get(targetID);
    console.log(`targetID: ${targetID}`);
	await GURPS.SetLastActor(targetToken.actor)
	let targetActor = GURPS.LastActor
	let targetST = targetActor.data.data.attributes.ST.value;
	let AdvantageName ='Perfect*Balance'; 
	let useAdvantage = await GURPS.findAdDisad(targetActor,AdvantageName) != undefined ? true : false;
	console.log(`useadvantage: ${useAdvantage}`);
	let targetSTmod = Number(targetST)-2; // ST-2
	console.log(`target: [${targetID}]-${targetActor.name}, attackDamageTotal ${attackDamageTotal} vs targetST-2: [${targetST}-2]`);
	if ( Number(attackDamageTotal) > Number(targetST)-2 ) console.log(`targetID: [${targetID}] ${targetActor.data.name} suffers Knockback!`);
	// need to compare ltrData.margin vs ST but no I actually need damage totals and those are not retained! 
	// why is only to-hit roll saved but not damage output? argh!

	let chatDescription = `<p><b>Knockback</b> calculation for this attack.</p>`;
	//console.log(`<p>${title} causes ${dice} ${adds} (${armorDivisor}) ${type}.<p> `);
	chatDescription += `<p><b>${actorName}</b> does <b>${attackDamageTotal}</b> damage to <b>${targetActor.data.name}</b>`;
	chatDescription += `<p>${targetActor.data.name} has ST ${Number(targetST)} and resists with ST-2, which equals ST ${targetSTmod}.`;
	let chatDescriptionPB = "";
	kbYards = Math.round((Number(attackDamageTotal)*Number(kbm))/Number(targetSTmod)); // (damage*multiplier)/(ST-2)
	
	kbFeet = kbYards*3;
	kbHexes = kbFeet/gridFeet; // KB Hexes = Feet/GridDistance
	console.log(`kbYards: ${kbYards}; kbFeet: ${kbFeet}; kbHexes: ${kbHexes}`);

	kbYardsMod = kbYards > 1 ? 0-Number(kbYards-1) : 0; // Resist KB Fall at -1 per yard of knockback after the first
// log this if
	if (useAdvantage) {
		kbYardsMod = Number(kbYardsMod)+4; //  +4 for Perfect Balance
		chatDescriptionPB = `<p><b>${targetActor.data.name}</b> has <b>Perfect Balance</b>, so you got +4 to avoid falling down from Knockback!</p>`;
		
	}
	if (Number(attackDamageTotal) > Number(targetSTmod)) { 
		chatDescription += `<p><b>Target ${targetActor.data.name}</b> suffers ${kbYards} yards <b>Knockback</b>, which equates to ${kbFeet} feet or <b>${kbHexes} hexes</b>.</p>`;
		chatDescription += chatDescriptionPB;
		let kbYardsModTxt = "";
		if (kbYardsMod > 0) kbYardsModTxt = `+${kbYardsMod}`;
		else if (kbYardsMod < 0) kbYardsModTxt = `${kbYardsMod}`;
		if (kbYardsMod != 0) chatDescription += `<p>To avoid falling down at ${kbYardsModTxt} modifier`;
		else chatDescription += `<p>To avoid falling down`;
		chatDescription += `, use ["Resist KB Fall"DX${kbYardsModTxt} | S:Acrobatics${kbYardsModTxt} | S:Judo${kbYardsModTxt}] to avoid being knocked prone!</p>`;
		// Scatter
		let scatterTable = game.tables.getName('ScatterSilent')
		let rollScatter = new Roll("1d6", targetActor.getRollData());
		await rollScatter.roll();
		await game.dice3d.showForRoll(rollScatter); 
		let rollMsg = `Scatter direction: ${targetActor.data.name} rolled ${rollScatter._formula} and got a ${rollScatter.total}`;
		console.log(rollMsg);
		let scatterResults = scatterTable.getResultsForRoll(rollScatter.total > 1 ? rollScatter.total : 3);
		let scatterDescription = scatterResults[0].data.text;
		console.log(scatterDescription);
		chatDescription += `<p>${rollMsg}</p> ${scatterDescription}`;
		let kbVictimObj = { tokenId: targetToken.id, kbFeet: kbFeet, trapTag: trapTagOpt };
		kbVictims.push(kbVictimObj);
	} else { 
		chatDescription += `<p><b>Target ${targetActor.data.name} does not suffer Knockback!</b></p>`;
	} 
	chatDescription += `<p>Calculated formula is (${attackDamageTotal}x${kbm})/${targetSTmod} = ${kbYards} hexes of Knockback.</p>`;
	console.log(chatDescription);
	ChatMessage.create({
	  content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
	{ chatBubble: false });		
};

GURPS.SetLastActor(originalActor)
// reset the modifiers for orginalActor
for (let mod of originalModifiers) {
	GURPS.ModifierBucket.addModifier(mod.modint, mod.desc)
}

// handle the Knockback for all victims
if (kbVictims.length > 0) {
	kbVictims.forEach(victim => {
		console.log(`victim: ${victim.tokenId} ${victim.kbFeet} ${victim.trapTag}`);
	});
	console.log(kbVictims);

	kbVictimsStr = encodeComponent(JSON.stringify(kbVictims));
	pushOtF = `/:Push jb2a.side_impact.part.shockwave.blue ${trapTagOpt} "${kbVictimsStr}"`; // executeOtF does not honor  encoding
	console.log(pushOtF);
	//await GURPS.executeOTF(pushOtF);
	// Example arguments

	const argsPush = [
	{
	animDB: 'jb2a.side_impact.part.shockwave.blue',
	trapTag: trapTagOpt,
	kbVictimsStr: kbVictimsStr,
	// Additional arguments as needed
	}
  	];
	// Execute the macro with the arguments
	game.macros.getName('Push').execute(argsPush);
}