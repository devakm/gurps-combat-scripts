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
let kbm = args[0].length > 1 ? parseInt(args[0][2]) : 1; //KB multiplier BXTraps01
let attackDamageTotal = args[0].length > 2 ? parseInt(args[0][3]) : '10';
let trapTagOpt = 'BXTraps01'; // BXTraps01
trapTagOpt = args[0].length > 3 ? args[0][4] : '';
let pushOtF = '';
let kbYards = 0;
let kbFeet = 0;
let kbHexes = 0; // KB Hexes = Feet/GridDistance
let kbYardsMod = 0; // KB Yards = Feet/GridDistance * 3


// save the original actor
const originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: "${actorName}";`);
//let gridDistance = game.scenes.current.grid.distance
let gridFeet = game.scenes.current.dimensions.distance

let targetID;
let targetToken;
let targetActor;
let targetST;
// now that we found the attackDamageTotal, we need to compare it to ST of the target(s)
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	targetID = target.id;;
    targetToken = canvas.tokens.get(targetID);
    console.log(`targetID: ${targetID}`);
	await GURPS.SetLastActor(targetToken.actor);
	targetActor = await GURPS.LastActor;
	targetST = targetActor.data.data.attributes.ST.value;
	let AdvantageName ='Perfect*Balance'; 
	let useAdvantage = await GURPS.findAdDisad(targetActor,AdvantageName) != undefined ? true : false;
	console.log(`useadvantage: ${useAdvantage}`);
	let targetSTmod = Number(targetST)-2; // ST-2
	console.log(`target: [${targetID}]-${targetActor.data.name}, attackDamageTotal ${attackDamageTotal} vs targetST-2: [${targetST}-2]`);
	if ( Number(attackDamageTotal) > Number(targetST)-2 ) console.log(`targetID: [${targetID}] ${targetActor.data.name} suffers Knockback!`);
    else console.log(`targetID: [${targetID}] ${targetActor.data.name} does not suffer Knockback!`);
	let chatDescription = `<p><b>Knockback</b> calculation for this attack.</p>`;
	chatDescription += `<p><b>${actorName}</b> does <b>${attackDamageTotal}</b> damage to <b>${targetActor.data.name}</b>`;
	chatDescription += `<p>${targetActor.data.name} has ST ${Number(targetST)} and resists with ST-2, which equals ST ${targetSTmod}.`;
	let chatDescriptionPB = "";
	kbYards = Math.round((Number(attackDamageTotal)*Number(kbm))/Number(targetSTmod)); // (damage*multiplier)/(ST-2)
	kbFeet = kbYards*3;
	kbHexes = kbFeet/gridFeet; // KB Hexes = Feet/GridDistance
	console.log(`kbYards: ${kbYards}; kbFeet: ${kbFeet}; kbHexes: ${kbHexes}`);

	kbYardsMod = kbYards > 1 ? 0-Number(kbYards-1) : 0; // Resist KB Fall at -1 per yard of knockback after the first
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
		pushOtF = `/r [/:Push jb2a.side_impact.part.shockwave.blue ${targetID} ${kbFeet} ${trapTagOpt}]`; // executeOtF does not honor  encoding
		console.log(pushOtF);
		GURPS.executeOTF(pushOtF);
		/*
		const argsPush = [
		{
		'animDB': 'jb2a.side_impact.part.shockwave.blue',
		'targetID': targetID, 
		'shove': kbFeet,
		'trapTag': trapTagOpt,
		}
		];
		// Execute the Push macro with the arguments
		game.macros.getName('Push').execute(argsPush);
		*/
	} else { 
		chatDescription += `<p><b>Target ${targetActor.data.name} does not suffer Knockback!</b></p>`;
	} 
	chatDescription += `<p>Calculated formula is (${attackDamageTotal}x${kbm})/${targetSTmod} = ${kbYards} hexes of Knockback.</p>`;
	console.log(chatDescription);
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
