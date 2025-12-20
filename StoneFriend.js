/* Usage: /:StoneFriend
	Check for bonuses and then roll Reaction delay check using applied modifiers
*/

// check for modifiers and apply them beforehand
let OtF = '[/:ReactionStoneHeart]';
console.log(OtF);
await GURPS.executeOTF(OtF);	

// invoke Stone Friend Reaction 
let OtF2 = '[/:Reaction]';
console.log(OtF2);
await GURPS.executeOTF(OtF2);