/* Usage: /:PiercingFangs
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

// modules/jb2a_patreon/Library/Generic/Creature/Bite_01_Regular_Green_400x400.webm
// modules/jb2a_patreon/Library/Generic/UI/IconPoison_01_Dark_Green_200x200.webm

// OtF action setup:
let AttackName ='Piercing*Fangs*Bite'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let Attack = '[M:'+AttackName+']'; // alter the OtF type used for attack
let Damage = '[D:'+AttackName+'] \\\\/r [2d tox]'; // alter the OtF type used for attack damage
let CritHit = '/rolltable CritHit'; // critical hit rolltable
let CritMiss = '/rolltable CritMiss'; // critical miss rolltable
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim Bite*Regular_Green *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3'; // success animation 
let csanim = '!/anim Bite*Regular_Green *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5'; // critical success animation 
let fanim = '!/anim Bite*Regular_Green *0.3 -0.2 +0'; // failure animation 
let cfanim = '!/anim Bite*Regular_Green *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'; // critical failure animation 
// outcome formulas:
let csformula ='/r '+Damage+' \\\\'+CritHit; // critical success formula 
let cfformula = CritMiss; // critical failure formula 
let sformula ='/r '+Damage; //success formula 

let OtF = '[/if '+Attack+' cs:{'+csanim+' \\\\'+csformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} s:{'+sanim+' \\\\'+sformula+'} f:{'+fanim+'} ]'; 
console.log(OtF);
GURPS.executeOTF(OtF);