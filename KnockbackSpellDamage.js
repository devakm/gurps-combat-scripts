/* Usage: /:Knockback <attackname> <spellname> <kbmultiplier>
	Calculate knockback for crushing attacks and shove
	
	<attackname> param
	<kbmultiplier> param
	<spellname> param
	
*/

// OtF action setup:
//let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
//let AttackName ='Vic*Swung'; //  Attack Name, i.e. [R:Burning*Touch]

console.log(args[0]);
let AttackName = args[0].length > 0 ? args[0][1] : 'Punch';
let kbm = args[0].length > 1 ? args[0][2] : 1; //KB multiplier
//let SpellName = args[0].length > 2 ? args[0][2] : false; 

let SpellName = '';
if (SpellName.length > 0) {
	console.log(`Spells On`);
} else {
	console.log(`Spells Off`);
}
let Modifier = GURPS.ModifierBucket.currentSum();
GURPS.ModifierBucket.clear(update=true);
if (isNaN(Modifier)||Modifier===0) {
	Modifier = '+0';
} else if (Modifier > 0) {
	Modifier = '+'+Modifier
}
let ModifierString = Modifier+' Modifier Bucket Applied';

let attackData = GURPS.findAttack(_token.actor, AttackName, 1, 0); 
let attackDamageOtF = attackData.damage;
console.log(`attackDamageOtF: ${attackDamageOtF};`);

let PrimaryCheck = ''; // alter the OtF type used for primary check
let SpellDamage = '';
let SpellDamageCrit = '';
// subtract CostMod from spell cost, or calculate SpellDamage cost reduction with '+CostMod;
let CostMod = 0;

if (SpellName.length > 0) {	
	console.log(`Someone turned Spells back On! ${SpellName.length};`);
	let SpellSkill = Number(await GURPS.findSkillSpell(_token.actor,SpellName,0,1).level)
	if (SpellSkill > 19) {
		CostMod = -2
	} else if (SpellSkill > 14) {
		CostMod = -1
	} 
	PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
	SpellDamage = '\\\\/:SpellDamage BurningTouch 1 +2 burn -24 ';
	SpellDamageCrit = '\\\\/:SpellDamage BurningTouch 1 0 burn '+CostMod+' ';
} else {
	let defaultST = await GURPS.LastActor.data.data.attributes.ST.value;
	PrimaryCheck = '[ST'+defaultST+']'; // alter the OtF type used for primary check
}

let SecondaryCheck = '[M:'+AttackName+ModifierString+']'; // alter the OtF type used for secondary check
let StrikeDamage = '/r [D:'+AttackName+']'; // strike damage OtF. If this penetrates DR, then apply SpellDamage

// outcome animations:
let sanim = '!/anim Sword01*Fire*Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Flames_01_Regular_Orange c *0.5'; // success animation 
let csanim = '!/anim Sword01*Fire*Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c \\\\!/anim Flames_01_Regular_Orange c *0.8'; // critical success animation 
let fanim = '!/anim Sword01*Fire*Regular_Orange *0.3 -0.2 -0.1'; // failure animation 
let cfanim = '!/anim Impact_01_Regular_Yellow c *0.8 @self \\\\!/anim Flames_01_Regular_Orange c *0.4 @self'; // critical failure animation 
// outcome formulas:
let csformula = StrikeDamage+' '+SpellDamageCrit; // critical success formula 
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let sformula = StrikeDamage+' '+SpellDamage; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
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


/* standalone setup
let AttackName ="Hum*Swing";
let attackData = GURPS.findAttack(_token.actor, AttackName, 1, 0); 
let attackDamageOtF = attackData.damage;
console.log(`attackDamageOtF: ${attackDamageOtF};`);
*/
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
	let rollMsg = `Actor rolled a CritHit: ${_token.actor.name} rolled ${rollCrit._formula} and got a ${rollCrit.total} !!!`;
	console.log(rollMsg);
	let critTable = game.tables.getName('DataCritHit')
	let critResults = await critTable.getResultsForRoll(rollCrit.total > 1 ? rollCrit.total : 11);
	console.log(`result: ${critResults[0].text}`);
	const critResultsA = critResults[0].text.split('|');
	critMulti = Number(critResultsA[0]);
	critBonus = Number(critResultsA[1]);
	console.log(`mult: ${critMulti}; bonus: ${critBonus};`);
	let critMsgTable = game.tables.getName('CritHit')
	let critMsgResults = critMsgTable.getResultsForRoll(rollCrit.total > 1 ? rollCrit.total : 11);
	await critMsgTable.toMessage(critMsgResults);

}
let scatterOtF = '[/rolltable Scatter]';

// check recent messages for the damage result total
// uses attackDamageOtF to select the latest message._roll._total
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
	let bonusDmg = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? attackDamageOtF.split(' ')[0].split('d')[1] : 0;
	let maxDamage = Number(lastMessage._roll.dice[0].faces)*Number(lastMessage._roll.dice[0].number);
	attackDamageTotal = Number(maxDamage)+Number(bonusDmg)*Number(critMulti)+Number(critBonus);
	console.log(`Base CritHit Max Damage: ${lastMessage._roll.dice[0].number}d${lastMessage._roll.dice[0].faces} = ${maxDamage} * Crit Multiplier ${critMulti} = ${maxDamage}+${bonusDmg}*${critMulti}+${critBonus} for a grand total of ${attackDamageTotal} damage!`);
};

// now that we found the attackDamageTotal, we need to compare it to ST of the target(s)
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	let targetID = target.id;;
    let targetToken = canvas.tokens.get(targetID);
    console.log(`targetID: ${targetID}`);
	await GURPS.SetLastActor(targetToken.actor)
	let targetST = await GURPS.LastActor.data.data.attributes.ST.value;
	let AdvantageName ='Perfect*Balance'; 
	let useAdvantage = await GURPS.findAdDisad(GURPS.LastActor,AdvantageName) != undefined ? true : false;
	console.log(`useadvantage: ${useAdvantage}`);
	let targetSTmod = Number(targetST)-2; // ST-2
	console.log(`target: [${targetID}]-${GURPS.LastActor.name}, attackDamageTotal ${attackDamageTotal} vs targetST-2: [${targetST}-2]`);
	if ( Number(attackDamageTotal) > Number(targetST)-2 ) console.log(`targetID: [${targetID}] ${GURPS.LastActor.data.name} suffers Knockback!`);
	// need to compare ltrData.margin vs ST but no I actually need damage totals and those are not retained! 
	// why is only to-hit roll saved but not damage output? argh!

	let chatDescription = `<p><b>Knockback</b> calculation for this attack.</p>`;
	//console.log(`<p>${title} causes ${dice} ${adds} (${armorDivisor}) ${type}.<p> `);
	chatDescription += `<p><b>${actorName}</b> does <b>${attackDamageTotal}</b> damage to <b>${GURPS.LastActor.data.name}</b>`;
	chatDescription += `<p>${GURPS.LastActor.data.name} has ST ${Number(targetST)} and resists with ST-2, which equals ST ${targetSTmod}.`;
	let chatDescriptionPB = "";
	let kbHexes = Math.round((Number(attackDamageTotal)*Number(kbm))/Number(targetSTmod)); // (damage*multiplier)/(ST-2)
	let kbHexesMod = kbHexes > 1 ? 0-Number(kbHexes-1) : 0; // Resist KB Fall at -1 per yard of knockback after the first
// log this if
	if (useAdvantage) {
		kbHexesMod = Number(kbHexesMod)+4; //  +4 for Perfect Balance
		chatDescriptionPB = `<p><b>${GURPS.LastActor.data.name}</b> has <b>Perfect Balance</b>, so you got +4 to avoid falling down from Knockback!</p>`;

	}
	if (Number(attackDamageTotal) > Number(targetSTmod)) { 
		chatDescription += `<p><b>Target ${GURPS.LastActor.data.name} suffers ${kbHexes} hexes Knockback!</b></p>`;
		await GURPS.executeOTF(scatterOtF);
		chatDescription += chatDescriptionPB;
		let kbHexesModTxt = "";
		if (kbHexesMod > 0) kbHexesModTxt = `+${kbHexesMod}`;
		else if (kbHexesMod < 0) kbHexesModTxt = `${kbHexesMod}`;
		if (kbHexesMod != 0) chatDescription += `<p>To avoid falling down at ${kbHexesModTxt} modifier`;
		else chatDescription += `<p>To avoid falling down`;
		chatDescription += `, use ["Resist KB Fall"DX${kbHexesModTxt} | S:Acrobatics${kbHexesModTxt} | S:Judo${kbHexesModTxt}] to avoid being knocked prone!</p>`;

	} else { 
		chatDescription += `<p><b>Target ${GURPS.LastActor.data.name} does not suffer Knockback!</b></p>`;
	} 
	chatDescription += `<p>Calculated formula is (${attackDamageTotal}x${kbm})/${targetSTmod} = ${kbHexes} hexes of Knockback.</p>`;

	console.log(chatDescription);

	ChatMessage.create({
	  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
	{ chatBubble: false });
};
GURPS.SetLastActor(originalActor)
// reset the modifiers for orginalActor
for (let mod of originalModifiers) {
	GURPS.ModifierBucket.addModifier(mod.modint, mod.desc)
}

/*
Perfect Balance
15 points
No matter how narrow the walking surface (tightrope,
ledge, tree limb, etc.), you can always keep your footing with-
out having to make a dice roll under normal conditions. If the
surface is wet, slippery, or unstable, you get +6 on rolls to keep
your feet. In combat, you get +4 to DX and DX-based skill
rolls to stay standing or avoid being knocked down (e.g., by
knockback). Finally, you get +1 to the Acrobatics and Climb-
ing skills.

["DX, Acrobatics, or Judo"DX | S:Acrobatics | S:Judo]
["−1 per yard of knockback after the first"-1 per yard of knockback after the first]
["+4 for Perfect Balance"+4 for Perfect Balance]
*/