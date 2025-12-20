/* Usage: /:Slam <kbmultiplier>
	Calculate knockback for crushing attacks and shove
	
	<kbmultiplier> param
	
*/

// Test Harness
let targetOfTargets = Array.from(game.user.targets);
let originalToken = _token
let originalTokenId = originalToken.data._id;
let targetofTarget = targetOfTargets.filter(t => 
        	t.data._id == originalToken.data._id
); 
if (targetofTarget.length == 0) {
	game.user.targets.add(originalToken);
	targetofTarget = targetOfTargets.filter(t => 
        	t.data._id == originalToken.data._id
	); 
};

let targetofTarget = targetOfTargets.filter(t => 
	t.data.t
); 
		t.data.timestamp > ts 
		&& t.data.speaker.alias == actorName  
		&& t._roll != null
		&& t._roll._formula.includes("d6[Damage]") == true 
		&& t.data.content.includes(dmgOtF) == true

// Slam THR crush
let dmgOtF = 'THR+3 cr';
// save the original actor
const originalActor = GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: "${actorName}";`);
let d = new Date();
let ts = d.getTime()-99999999;
console.log(`ts: "${ts}";`);
let messageList = game.messages.filter(i => 
	i.data.timestamp > ts 
	&& i.data.speaker.alias == actorName  
	&& i._roll != null
	&& i._roll._formula.includes("d6[Damage]") == true 
	&& i.data.content.includes(dmgOtF) == true
	); 
for (let message of messageList) {
	console.log(`time: ${message.data.timestamp} > ${ts} ; damage total: ${message._roll._total}`)};
let lastMessage;
messageList.forEach(message => { lastMessage = message }); // pick the latest message
let attackDamageTotal = await lastMessage._roll._total; // damage roll total for regular success



// save the list of modifiers (including Rule of 14)
let originalModifiers = GURPS.ModifierBucket.modifierStack.modifierList;
let ltrData = GURPS.lastTargetedRolls[originalActor.id];
let critMulti,critBonus;
if (ltrData.isCritSuccess == true) {
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
let d = new Date();
let ts = d.getTime()-99999999;
console.log(`ts: "${ts}";`);
let messageList = game.messages.filter(i => 
	i.data.timestamp > ts 
	&& i.data.speaker.alias == actorName  
	&& i._roll != null
	&& i._roll._formula.includes("d6[Damage]") == true 
	&& i.data.content.includes(dmgOtF) == true
	); 
for (let message of messageList) {
    console.log(`time: ${message.data.timestamp} > ${ts} ; damage total: ${message._roll._total}`)};
let lastMessage;
messageList.forEach(message => { lastMessage = message }); // pick the latest message
let attackDamageTotal = lastMessage._roll._total; // damage roll total for regular success

if (ltrData.isCritSuccess == true) {
	let maxDamage = Number(lastMessage._roll.dice[0].faces)*Number(lastMessage._roll.dice[0].number);
	let dmgBonusCalc = lastMessage._roll._formula.split('[Damage]')[1].replace(/\s+/g, '');
	let dmgBonusA = dmgBonusCalc.split('+');
	let dmgBonus = dmgBonusA.reduce(function (x, y) { return Number(x)+Number(y)}, 0);
	attackDamageTotal = Number(maxDamage)+Number(dmgBonus)*Number(critMulti)+Number(critBonus);
	console.log(`Base CritHit Max Damage: ${lastMessage._roll.dice[0].number}d${lastMessage._roll.dice[0].faces} = ${maxDamage} * Crit Multiplier ${critMulti} = ${maxDamage}+${dmgBonus}*${critMulti}+${critBonus} for a grand total of ${attackDamageTotal} damage!`);
};

	console.log(chatDescription);
	ChatMessage.create({
	  content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
	{ chatBubble: false });

/*
	attackDamageTotal = Number(maxDamage)+Number(dmgBonus)*Number(critMulti)+Number(critBonus);
	console.log(`Base CritHit Max Damage: ${lastMessage._roll.dice[0].number}d${lastMessage._roll.dice[0].faces} = ${maxDamage} * Crit Multiplier ${critMulti} = ${maxDamage}+${dmgBonus}*${critMulti}+${critBonus} for a grand total of ${attackDamageTotal} damage!`);
	
	
	let dmgDice = lastMessage._roll._formula.split(' ')[0].split('d')[0] > 0 ? Number(lastMessage._roll._formula.split(' ')[0].split('d')[0]) : 1;
	
	let dmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? Number(attackDamageOtF.split(' ')[0].split('d')[1]) : 0;
let dmgDice = Number(attackDamageOtF.split(' ')[0].split('d')[0]);
if (dmgDice > 2) dmgBonus = dmgBonus+dmgDice; // Mighty Blow gives +2 dmg or +1 dmg per die, whichever is greater.
attackDamageOtF = dmgDice+'d+'+dmgBonus+' '+dmgType;

*/



// main scripts
srData = [
{'yards': 0, 'srMod': 0, 'sMod': 0},
{'yards': 1, 'srMod': 0, 'sMod': 0},
{'yards': 2, 'srMod': 0, 'sMod': 0},
{'yards': 3, 'srMod': -1, 'sMod': 1},
{'yards': 5, 'srMod': -2, 'sMod': 2},
{'yards': 7, 'srMod': -3, 'sMod': 3},
{'yards': 10, 'srMod': -4, 'sMod': 4},
{'yards': 15, 'srMod': -5, 'sMod': 5},
{'yards': 20, 'srMod': -6, 'sMod': 6},
{'yards': 30, 'srMod': -7, 'sMod': 7},
{'yards': 50, 'srMod': -8, 'sMod': 8},
{'yards': 70, 'srMod': -9, 'sMod': 9},
{'yards': 100, 'srMod': -10, 'sMod': 10},
{'yards': 150, 'srMod': -11, 'sMod': 11},
{'yards': 200, 'srMod': -12, 'sMod': 12},
{'yards': 300, 'srMod': -13, 'sMod': 13},
{'yards': 500, 'srMod': -14, 'sMod': 14},
{'yards': 700, 'srMod': -15, 'sMod': 15}
];


function slam(distanceFeetMoved) {

	let distFt = Number(distanceFeetMoved) > 0 ? Number(distanceFeetMoved): 1;
	let distYd = Math.floor(distFt/3);
	let dmgModBonus = srData.find(x => x.yards >= distYd).sMod;
	console.log(`feet: ${distFt}; yards: ${distYd}; dmgModBonus: ${dmgModBonus};`)

	// OtF action setup:
	let Attack = '[DX | S:Brawling | S:Sumo*Wrestling]'; 
	// OtF [DX | S:Brawling | S:Sumo*Wrestling] s:{/r [THR-2 cr]} f:{/Your Jump fails and you fall prone!}]
	let dmgName = 'THR'; // alter the OtF type used for attack damage
	let dmgModBase = -2;
	let dmgMod = dmgModBase+dmgModBonus;
	let dmgModTxt = dmgMod >= 0 ? '+'+dmgMod: ''+dmgMod;
	let dmgType = 'cr';
	let dmgOtF = `${dmgName}${dmgModTxt} ${dmgType}`; //[THR-2 cr]
	console.log(`Calculated dmgOtF: ${dmgOtF};`)


	let sanim = '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim GroundCrackImpact_02_Regular_Orange c *0.7  \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Impact_04_Regular_Orange c *0.5'; // success animation 
	let csanim = '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim GroundCrackImpact_02_Regular_Orange c *0.7 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c \\\\!/anim Impact_04_Regular_Orange c *0.8'; // critical success animation 
	let fanim = '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 -0.1'; // failure animation 
	let cfanim = '!/anim Impact_01_Regular_Yellow c *0.8 @self \\\\!/anim Impact_04_Regular_Orange c *0.4 @self'; // critical failure animation 
	
	// outcome formulas:
	let csformula ='/r ['+dmgOtF+']'; // critical success formula 
	let cfformula = '/rolltable CritMiss'; // critical failure formula 
	let sformula ='/r ['+dmgOtF+']'; //success formula 

	let OtF = '[/if '+Attack+' cs:{'+csanim+' \\\\'+csformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} s:{'+sanim+' \\\\'+sformula+'} f:{'+fanim+'} ]'; 
	console.log(OtF);
	GURPS.executeOTF(OtF);
	
	// save the list of modifiers (including Rule of 14)
	let originalModifiers = GURPS.ModifierBucket.modifierStack.modifierList;
	// save the original actor
	const originalActor = GURPS.LastActor;
	let actorName = originalActor.name;
	console.log(`actorName: "${actorName}";`);
	let ltrData = GURPS.lastTargetedRolls[originalActor.id];
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

}

let title = "Distance Moved";
new Dialog({
 title: title,
 content: `
<div style='padding: 4px;'>
 <label for="distanceFeetMoved">Enter Distance you moved in feet</label>
 <input id="distanceFeetMoved" type="text" />
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => slam(
      parseInt(html.find('#distanceFeetMoved').val()))
  }
 }
}).render(true)