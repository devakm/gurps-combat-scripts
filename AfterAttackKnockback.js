/* Usage: /:AfterAttackKnockback attack=<attackname> kbm=<kbmultiplier> dmg=<attackDamageOtF> fon=<followOnOtF> trap=<trap tags> spell=<spellname>
	Calculate knockback for crushing attacks and shove
	
	<attackname> attack name to use
	<kbmultiplier> knockback multiplier
	<attackDamageOtF> attack damage formula
	<spellname> spell name to use
	
*/

console.log('---------------------- Start AfterAttackKnockback ----------------------');

// OtF action setup:
let AttackName ='Crushing*Slam'; //   Attack Name, i.e. Crushing*Slam, Vic*Thrust, Vic*Fey*Dagger*Swung, Crushing*Slam
let kbm = 2; // knockback multiplier
let attackDamageOtF = '7d+7 cr'; // [6d+14 imp] or [2d+4 cr] or [2d+4 (2) cr] 
let followOnOtF = ''; //let followOnOtF = '["Weak Bladeblack HT-5"/if [HT-5]  /else [2d tox]]';
let trapTagOpt = 'BXTraps01'; // BXTraps01
let pushOtF = '';
let kbYards = 0;
let kbFeet = 0;
let kbHexes = 0; // KB Hexes = Feet/GridDistance
let kbYardsMod = 0; // KB Yards = Feet/GridDistance * 3

if (scope !== undefined) {
    console.log(scope)
    AttackName = scope.attack ? scope.attack : 'Punch';
    kbm = scope.kbm ? parseInt(scope.kbm) : 1; //KB multiplier BXTraps01
    attackDamageOtF = scope.dmg ? scope.dmg : '';
    followOnOtF = scope.fon ? scope.fon : '';
	trapTagOpt = scope.trap ? scope.trap : 'BXTraps01'; // BXTraps01
}
console.log(`AttackName: ${AttackName}; kbm: ${kbm}; attackDamageOtF: ${attackDamageOtF}; trapTagOpt: ${trapTagOpt};`);


/*
console.log('args[0].length '+args[0].length+' : '+args[0]);
let AttackName = args[0].length > 0 ? args[0][1] : 'Punch';
let kbm = args[0].length > 1 ? parseInt(args[0][2]) : 1; //KB multiplier BXTraps01
let attackDamageOtF = args[0].length > 2 ? args[0][3] : '';
let trapTagOpt = 'BXTraps01'; // BXTraps01
trapTagOpt = args[0].length > 3 ? args[0][4] : '';

/* 
let AttackName ='Natural*Attacks*Kick';
let kbm = 2;
let attackDamageOtF = '2d+4 cr';
let trapTagOpt = 'BXTraps01'; // BXTSpikeTrap01
test harness */


//attackDamageOtF = decodeURIComponent(attackDamageOtF); 

/* test harness
let AttackName ='Vic*Swung';
let kbm = 2;
let trapTagOpt = 'BXTraps01'; // BXTSpikeTrap01
let pushOtF = '';
let kbVictims = [];
//let SpellName = args[0].length > 2 ? args[0][2] : false; 
*/

console.log(`attackDamageOtF: ${attackDamageOtF}`);
// save the list of modifiers (including Rule of 14)
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
// save the original actor
let  originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: "${actorName}";`);
let attackDmgDice = 0;
let attackDmgAmount = 0;
let findDice = /\d+d/;
if (findDice.test(attackDamageOtF)) {
	attackDmgDice = attackDamageOtF.split(' ')[0].split('d')[0];
} else {
	attackDmgAmount = attackDamageOtF.split(' ')[0];
}
let attackDmgType = attackDamageOtF.split(' ').length > 2 ? attackDamageOtF.split(' ')[2] : attackDamageOtF.split(' ')[1];
let useKnockback = attackDmgType == 'cr' ? true : false;
let armorDivisor = attackDamageOtF.includes('(') ? Number(attackDamageOtF.split('(')[1].split(')')[0]) : 1;
let armorDivisorTxt = '';
if (armorDivisor > 1) armorDivisorTxt = ` (${armorDivisor})`;
console.log(`attackDamageOtF: ${attackDamageOtF}: attackDmgDice: ${attackDmgDice}; attackDmgAmount: ${attackDmgAmount};
	armorDivisor: ${armorDivisor}; attackDmgType: ${attackDmgType}`);
// uses attackDamageOtF to select the latest message._roll._total
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);
let messageList,lastMessage,attackDamageTotal;
if (attackDmgDice > 0) {
	console.log(`-- find for messages containing attackDamageOtF: ${attackDamageOtF}`);
	messageList = game.messages.filter(m => 
		m.timestamp > ts 
		&& m.speaker.alias == actorName  
		&& m.rolls.length
		&& m.rolls[0]._formula.includes("d6[Damage]") 
		&& m.content.includes(attackDamageOtF) 
	); 
	if (Array.isArray(messageList) && messageList.length) {
		for (let message of messageList) {
			console.log(`time: ${message.timestamp} > ${ts} ; damage total: ${message.rolls[0]._total}`)};
		lastMessage;
		messageList.forEach(message => { lastMessage = message }); // pick the latest message
		attackDamageTotal = lastMessage.rolls[0]._total; // damage roll total for regular success
		console.log(`used lastMessage to find attackDamageTotal: ${attackDamageTotal}`);
	}
	
} else if (attackDmgAmount > 0) {
	console.log(`-- find for messages containing attackDmgAmount: ${attackDmgAmount}`);
	messageList = game.messages.filter(i => 
		i.timestamp > ts 
		&& i.speaker.alias == actorName  
		&& i.content.includes(attackDamageOtF) == true
	); 
	if (Array.isArray(messageList) && messageList.length) {
		for (let message of messageList) {
			console.log(`time: ${message.timestamp} > ${ts} ; damage total: ${message.rolls[0]._total}`)
		};
		messageList.forEach(message => { lastMessage = message }); // pick the latest message
		attackDamageTotal = lastMessage.rolls[0]._total; // damage roll total for regular success
		console.log(`used lastMessage to find attackDamageTotal: ${attackDamageTotal}`);
	} else {
		attackDamageTotal = messageList[0].rolls[0]._total;
	}
}

function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

await wait(3);

//deprecated let scatterOtF = '[/rolltable Scatter]';
//let gridDistance = game.scenes.current.grid.distance

let targetID;
let targetToken;
let targetActor;
let targetST;
let resistKnockbackOtF = '';
// now that we found the attackDamageTotal, we need to compare it to ST of the target(s)
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	targetID = target.id;;
    targetToken = canvas.tokens.get(targetID);
    console.log(`targetID: ${targetID}`);
	await GURPS.SetLastActor(targetToken.actor);
	targetActor = await GURPS.LastActor;
	targetST = targetActor.system.attributes.ST.value;
	let AdvantageName ='Perfect*Balance'; 
	let useAdvantage = await GURPS.findAdDisad(targetActor,AdvantageName) != undefined ? true : false;
	console.log(`useadvantage: ${useAdvantage}`);
	let targetSTmod = Number(targetST)-2; // ST-2
	console.log(`target: [${targetID}]-${targetActor.name}, attackDamageTotal ${attackDamageTotal} vs targetST-2: [${targetST}-2]`);
	if ( Number(attackDamageTotal) > Number(targetST)-2 ) console.log(`targetID: [${targetID}] ${targetActor.name} suffers Knockback!`);
	// need to compare ltrData.margin vs ST but no I actually need damage totals and those are not retained! 
	// why is only to-hit roll saved but not damage output? argh!

	let kbDescription = `<p><b>Knockback</b> calculation for this attack.</p>`;
	//console.log(`<p>${title} causes ${dice} ${adds} (${armorDivisor}) ${type}.<p> `);
	kbDescription += `<p><b>${actorName}</b> does <b>${attackDamageTotal}</b> damage to <b>${targetActor.name}</b>`;
	kbDescription += `<p>${targetActor.name} has ST ${Number(targetST)} and resists with ST-2, which equals ST ${targetSTmod}.`;
	let kbDescriptionPB = "";
	console.log(`------- Formula Inputs - attackDamageTotal: ${attackDamageTotal}; kbm: ${kbm}; targetSTmod: ${targetSTmod}`);
	kbYards = Math.round((Number(attackDamageTotal)*Number(kbm))/Number(targetSTmod)); // (damage*multiplier)/(ST-2)
	kbFeet = Math.round(kbYards*3); // 3 feet per yard
	let kbFormula = `(${attackDamageTotal}x${kbm})/${targetSTmod} = ${kbYards}`;
	console.log(`kbYards: ${kbYards}; kbFormula: ${kbFormula}`);

	kbYardsMod = kbYards > 1 ? 0-Number(kbYards-1) : 0; // Resist KB Fall at -1 per yard of knockback after the first
	console.log(`kbYardsMod: ${kbYardsMod}`);
	if (useAdvantage) {
		kbYardsMod = Number(kbYardsMod)+4; //  +4 for Perfect Balance
		kbDescriptionPB = `<p><b>${targetActor.name}</b> has <b>Perfect Balance</b>, so you got +4 to avoid falling down from Knockback!</p>`;
	}
	if (Number(attackDamageTotal) > Number(targetSTmod)) { 
		kbDescription += `<p><b>Target ${targetActor.name}</b> suffers ${kbYards} yards <b>Knockback</b>.</p>`;
		kbDescription += kbDescriptionPB;
		let kbYardsModTxt = "";
		if (kbYardsMod > 0) kbYardsModTxt = `+${kbYardsMod}`;
		else if (kbYardsMod < 0) kbYardsModTxt = `${kbYardsMod}`;
		if (kbYardsMod != 0) kbDescription += `<p>To avoid falling down at ${kbYardsModTxt} modifier`;
		else kbDescription += `<p>To avoid falling down,`;
		kbDescription += `, use ["Resist KB Fall"/if [DX${kbYardsModTxt} | S:Acrobatics${kbYardsModTxt} | S:Judo${kbYardsModTxt}] f:{/man change posture \\\\/status on prone}] to avoid being knocked prone!</p>`;
		// Scatter
		let scatterTable = game.tables.getName('ScatterSilent')
		let rollScatter = new Roll("1d6", targetActor.getRollData());
		await rollScatter.roll();
		await game.dice3d.showForRoll(rollScatter); 
		let rollMsg = `Scatter direction: ${targetActor.name} rolled ${rollScatter._formula} and got a ${rollScatter.total}`;
		console.log(rollMsg);
		let scatterResults = scatterTable.getResultsForRoll(rollScatter.total > 1 ? rollScatter.total : 3);
		let scatterDescription = scatterResults[0].text;
		console.log(scatterDescription);
		kbDescription += `<p>${rollMsg}</p> ${scatterDescription}`;
		pushOtF = `/r [/:Push anim=jb2a.side_impact.part.shockwave.blue victim=${targetID} shove=${kbYards} trap=${trapTagOpt}]`; // executeOtF does not honor  encoding
		// /:Push anim=jb2a.side_impact.part.shockwave.blue victim=lhgxBseOWjwrcxtw shove=30 trap=BXTraps01

		console.log(pushOtF);
		GURPS.executeOTF(pushOtF);
	} else { 
		kbDescription += `<p><b>Target ${targetActor.name} does not suffer Knockback!</b></p>`;
	} 
	kbDescription += `<p>Calculated formula is (${attackDamageTotal}x${kbm})/${targetSTmod} = ${kbYards} hexes of Knockback.</p>`;
	console.log(kbDescription);
	let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Knockback</span>
		</strong>
	</p>`;
	chatDescription += ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
			<span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
			${kbDescription}
			</span>
	</p>`;
	ChatMessage.create({
	  content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
	{ chatBubble: false });		
	await wait(9);
};

GURPS.SetLastActor(originalActor)
// reset the modifiers for orginalActor
/*
for (let mod of originalModifiers) {
	GURPS.ModifierBucket.addModifier(mod.modint, mod.desc)
}
*/

console.log('---------------------- End AfterAttackKnockback ----------------------');