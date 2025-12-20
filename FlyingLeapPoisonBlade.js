/* Usage: /:FlyingLeapPoisonBlade
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
 */
let AttackName ='Vic*Thrust'; //Vic*Swung
let kbm = 1;
let animSet = 'PoisonBlade';
let attackSkill = 'Shortsword';
let trapTagOpt = 'BXTraps01';
OtF = `/r [/:FlyingLeapOptions "${AttackName}" ${kbm} ${animSet} ${attackSkill} ${trapTagOpt}]`;
console.log(OtF);
GURPS.executeOTF(OtF);


	
/*

// Club01_02_Dark_OrangePurple
// UnarmedStrike_01_Regular_Orange_Physical02

// OtF action setup:
let AttackName ='Huge*Maul*Swung'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let Attack = '[M:'+AttackName+']'; // alter the OtF type used for attack
let Damage = '[D:'+AttackName+']'; // alter the OtF type used for attack damage
let CritHit = '/rolltable CritHit'; // critical hit rolltable
let CritMiss = '/rolltable CritMiss'; // critical miss rolltable
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim Club01_02_Dark_OrangePurple -0.4 +1 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.6'; // success animation 
let csanim = '!/anim Club01_02_Dark_OrangePurple -0.4 +1 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.8'; // critical success animation 
let fanim = '!/anim Club01_02_Dark_OrangePurple -0.4 +0.5 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.2 @self'; // failure animation 
let cfanim = '!/anim Club01_02_Dark_OrangePurple -0.4 +0.5 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.3 @self'; // critical failure animation 

// outcome formulas:
let csformula ='/r '+Damage+' \\\\'+CritHit; // critical success formula 
let cfformula = CritMiss; // critical failure formula 
let sformula ='/r '+Damage; //success formula 

let OtF = '[/if '+Attack+' cs:{'+csanim+' \\\\'+csformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} s:{'+sanim+' \\\\'+sformula+'} f:{'+fanim+'} ]'; 
console.log(OtF);
GURPS.executeOTF(OtF);
*/