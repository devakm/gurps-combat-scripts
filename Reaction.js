/* Usage: /:Reaction
*/

const roll = new Roll("3d6 + @gmodc", _token.actor.getRollData());
await roll.roll();
game.dice3d.showForRoll(roll)
let rollMsg = `${_token.actor.name} rolled ${roll._formula} and got a ${roll.total} !!!`;
console.log(rollMsg);

roll.toMessage({
rollMode: 'roll',
speaker: ChatMessage.getSpeaker(_token.actor)
});

const reactionTable = game.tables.getName('Reaction')
const reactionResults = reactionTable.getResultsForRoll(
	roll.total > 21 ? 21
	: roll.total > 1 ? roll.total 
	: 1 );
reactionTable.toMessage(reactionResults);