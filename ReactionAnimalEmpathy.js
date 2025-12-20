/* Usage: /:AnimalEmpathy

	Check to see if Actor has Animal Friend advantage, give bonus for Animal Friend level,
	then roll Animal Empathy Reaction delay check using modifiers
	
Original simple concept that failed was using /ra Roll Against, but /ra succeeds on a low roll, where Reaction looks for a high roll like damage.

["Animal Empathy"/if [?AD:Animal*Empathy] {/ra AnimalEmpathy-10} {[/ooc You don't have Animal Empathy!]}]

*/

// check for modifiers and apply them beforehand
let OtF = '[/:ReactionAnimal]';
console.log(OtF);
await GURPS.executeOTF(OtF);	

// invoke Animal Empathy Reaction 
let AdvantageName ='Animal*Empathy'; //  name of the advantage to boost /:Reaction check
let useAdvantage = GURPS.findAdDisad(_token.actor,AdvantageName) ? true : false;
console.log(`checking AdvantageName: ${AdvantageName} `);
if (useAdvantage) {

	let roll = new Roll("3d6 + @gmodc", _token.actor.getRollData());
	await roll.roll();
	game.dice3d.showForRoll(roll)
	let rollMsg = `${_token.actor.name} rolled ${roll._formula} and got a ${roll.total} !!!`;
	console.log(rollMsg);

	roll.toMessage({
	rollMode: 'roll',
	speaker: ChatMessage.getSpeaker(_token.actor)
	});
	
	let reactionTable = game.tables.getName('AnimalEmpathy')
	let reactionResults = reactionTable.getResultsForRoll(roll.total > 1 ? roll.total : 1);
	reactionTable.toMessage(reactionResults);
	
} else console.log(`Actor does not have the Animal Empathy advantage.`);

