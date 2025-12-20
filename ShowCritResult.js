/* Usage: /:ShowCritHitResult <roll>
	This only works if you already generated a 3d6 result and pass it in as the arg <roll>
	Only useful inside other macro scripts.
*/

console.log(`args:${args[0]}`);
let roll = Number(args[0][1]);

let critMsgTable = game.tables.getName('CritHit');
let critMsgResults = critMsgTable.getResultsForRoll(roll > 2 ? roll : 11);
critMsgTable.toMessage(critMsgResults);

