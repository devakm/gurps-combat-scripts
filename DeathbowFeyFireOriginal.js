/* Usage: /:Deathbow
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
 
 * ["Deathbow"/if [R:Vic*Deathbow*Shoot] {!/anim Arrow*Regular_Green_Cold*webm *0.3 -0.2 +1 \\/r [D:Vic*Deathbow*Shoot] \\/r [1d tox]}]
  *  modules/jb2a_patreon/Library/Generic/UI/IconPoison_01_Dark_Green_200x200.webm
*/

// OtF action setup:
let RangedAttackName ='Vic*Deathbow*Shoot'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]

let BaseModifier = GURPS.ModifierBucket.currentSum();
GURPS.ModifierBucket.clear(update=true);
let Accuracy = GURPS.findAttack(_token.actor, RangedAttackName, 0, 1).acc;
let Modifier = Number(BaseModifier)+Number(Accuracy);
if (isNaN(Modifier)||Modifier===0) {
	Modifier = '+0';
} else if (Modifier > 0) {
	Modifier = '+'+Modifier
}
let ModifierString = Modifier+' Modifier Bucket Applied';

let Attack = '[R:'+RangedAttackName+ModifierString+']'; // alter the OtF type used for attack
let Damage = '[D:'+RangedAttackName+'] \\\\/r [1d burn]'; // alter the OtF type used for attack damage
let CritHit = '/rolltable CritHit'; // critical hit rolltable
let CritMiss = '/rolltable CritMiss'; // critical miss rolltable
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3'; // success animation 
let csanim = '!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5'; // critical success animation 
let fanim = '!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +0'; // failure animation 
let cfanim = '!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'; // critical failure animation 
// outcome formulas:
let csformula ='/r '+Damage+' \\\\'+CritHit; // critical success formula 
let cfformula = CritMiss; // critical failure formula 
let sformula ='/r '+Damage; //success formula 

let OtF = '[/if '+Attack+' cs:{'+csanim+' \\\\'+csformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} s:{'+sanim+' \\\\'+sformula+'} f:{'+fanim+'} ]'; 
console.log(OtF);
GURPS.executeOTF(OtF);