/* Usage: /:AnimalFriend
	Check for bonuses and then roll Reaction delay check using applied modifiers
*/

// check for modifiers and apply them beforehand
let OtF = '[/:ReactionAnimal]';
console.log(OtF);
await GURPS.executeOTF(OtF);	

// invoke Animal Friend Reaction 
let OtF2 = '[/:Reaction]';
console.log(OtF2);
await GURPS.executeOTF(OtF2);	
