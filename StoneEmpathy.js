/* Usage: /:StoneEmpathy

	Check to see if Actor has Stone Friend advantage, give bonus for Stone Friend level,
	then roll Stone Empathy Reaction delay check using modifiers
	
Original simple concept that failed was using /ra Roll Against, but /ra succeeds on a low roll, where Reaction looks for a high roll like damage.

["Stone Empathy"/if [?AD:Stone*Empathy] {/ra StoneEmpathy-10} {[/ooc You don't have Stone Empathy!]}]

*/

// check for modifiers and apply them beforehand
let OtF = '[/:ReactionStoneHeart]';
console.log(OtF);
await GURPS.executeOTF(OtF);	

// invoke Stone Empathy Reaction 
let advantages = ['Stone*Empathy', 'Heart*Stone']; // names of the advantages to boost /:Reaction check
let useAdvantage = advantages.some(adv => GURPS.findAdDisad(_token.actor, adv));
console.log(`Checking advantages: ${advantages.join(', ')} `);

if (useAdvantage) {
	let roll = new Roll("3d6 + @gmodc", _token.actor.getRollData());
	await roll.roll();
	game.dice3d.showForRoll(roll);
	let rollMsg = `${_token.actor.name} rolled ${roll._formula} and got a ${roll.total} !!!`;
	console.log(rollMsg);

	roll.toMessage({
		rollMode: 'roll',
		speaker: ChatMessage.getSpeaker(_token.actor)
	});

	let reactionTable = game.tables.getName('StoneEmpathy');
	let reactionResults = reactionTable.getResultsForRoll(roll.total > 1 ? roll.total : 1);
	reactionTable.toMessage(reactionResults);

} else {
	console.log(`Actor does not have the Stone Empathy or Heart of Stone advantage.`);
}