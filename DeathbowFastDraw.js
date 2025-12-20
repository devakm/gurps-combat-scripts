/* Usage: /:Deathbow
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
 
["Heroic Archer (you must use Ready on your first turn)"
	/if [S:Bow-3] 
		s:{On your second turn, you <strong>Ready</strong> your bow! Attack right away at -3. \\\\/r [-3 to hit Heroic Archer]} 
		f:{You fail to <strong>Ready</strong> your bow this turn. You can attack next turn at -3. \\\\/r [-3 to hit Heroic Archer]}
]

["Heroic Archer Fast-Draw"
/if [S:Fast*Draw*Arrow] s:{
	/if [S:Bow-3] 
		s:{You <strong>Fast-Draw</strong> to <strong>Ready</strong> your bow in no time! Attack right away at -3. \\\\/r [-3 to hit Heroic Archer Fast-Draw]} 
		f:{You fail to <strong>Ready</strong> your bow this turn. You can attack next turn at -3. \\\\/r [-3 to hit Heroic Archer]}
	} 
	f:{You fumble your Fast-Draw (Arrow) attempt. 
	\\\\/if [S:Bow-3] 
		s:{You <strong>Ready</strong> your bow. You can attack next turn at -3. \\\\/r [-3 to hit Heroic Archer]}
		f:{You fail to <strong>Ready</strong> your bow. You can attack on the turn after next at no penalty.}
	}
]
*/

// OtF action setup:
let RangedAttackName =`Vic*Deathbow*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let PreCheck = `[S:Fast*Draw*Arrow]`;
let PreCheckFailMsg = `You fumble your Fast-Draw (Arrow) attempt. You are not ready to attack.`;
let FollowOnDamage = ' \\\\/r [1d burn]';

let Accuracy = GURPS.findAttack(_token.actor, RangedAttackName, 0, 1).acc;
if (isNaN(Accuracy)||Accuracy===0) {
	GURPS.ModifierBucket.addModifier(0, 'Accuracy')
} else if (Accuracy > 0) {
	GURPS.ModifierBucket.addModifier(Accuracy, 'Accuracy')
}
let modifiers = GURPS.ModifierBucket.modifierStack.modifierList;
let ModifierOtF = '';
if (modifiers.length > 0) {	
	var firstIteration = true;
	for (let mod of modifiers) {
	if (firstIteration) {
		firstIteration = false;
	} else {
		ModifierOtF += ' \\\\'; 
	}
		ModifierOtF += `/r [${mod.mod} ${mod.desc}]`;
	}
	ModifierOtF += ' \\\\';
}
GURPS.ModifierBucket.clear(update=true);
let Attack = `[R:${RangedAttackName}]`; // alter the OtF type used for attack
let Damage = `[D:${RangedAttackName}]${FollowOnDamage}`; // alter the OtF type used for attack damage
let CritHit = `/rolltable CritHit`; // critical hit rolltable
let CritMiss = `/rolltable CritMiss`; // critical miss rolltable
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = `!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3`; // success animation 
let csanim = `!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5`; // critical success animation 
let fanim = `!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +0`; // failure animation 
let cfanim = `!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self`; // critical failure animation 
// outcome formulas:
let csformula =`/r ${Damage} \\\\${CritHit}`; // critical success formula 
let cfformula = `${CritMiss}`; // critical failure formula 
let sformula =`/r ${Damage}`; //success formula 

let OtF = `[/if ${PreCheck} s:{${ModifierOtF}/if ${Attack} cs:{${csanim} \\\\${csformula}} cf:{${cfanim} \\\\${cfformula}} s:{${sanim} \\\\${sformula}} f:{${fanim}} } f:{${PreCheckFailMsg}} ]`; 
console.log(OtF);
GURPS.executeOTF(OtF);