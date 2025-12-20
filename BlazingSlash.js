/* Usage: /:BlazingSlash
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/

// OtF action setup:
let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
let AttackName ='Vic*Swung'; //  Attack Name, i.e. [R:Burning*Touch]

let Modifier = GURPS.ModifierBucket.currentSum();
GURPS.ModifierBucket.clear(update=true);
if (isNaN(Modifier)||Modifier===0) {
	Modifier = '+0';
} else if (Modifier > 0) {
	Modifier = '+'+Modifier
}
let ModifierString = Modifier+' Modifier Bucket Applied';

// subract CostMod from spell cost, or calculate SpellDamage cost reduction with '+CostMod;
let SpellSkill = Number(GURPS.findSkillSpell(_token.actor,SpellName,0,1).level)
let CostMod = 0
if (SpellSkill > 19) {
	CostMod = -2
} else if (SpellSkill > 14) {
	CostMod = -1
} 

let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[M:'+AttackName+ModifierString+']'; // alter the OtF type used for secondary check
let StrikeDamage = '/r [D:'+AttackName+']'; // strike damage OtF. If this penetrates DR, then apply SpellDamage

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim Sword01*Fire*Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Flames_01_Regular_Orange c *0.5'; // success animation 
let csanim = '!/anim Sword01*Fire*Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c \\\\!/anim Flames_01_Regular_Orange c *0.8'; // critical success animation 
let fanim = '!/anim Sword01*Fire*Regular_Orange *0.3 -0.2 -0.1'; // failure animation 
let cfanim = '!/anim Impact_01_Regular_Yellow c *0.8 @self \\\\!/anim Flames_01_Regular_Orange c *0.4 @self'; // critical failure animation 
// outcome formulas:
let csformula = StrikeDamage+' \\\\/:SpellDamage BurningTouch 1 +2 burn -8 \\\\/rolltable CritHit'; // critical success formula 
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let sformula = StrikeDamage+' \\\\/:SpellDamage BurningTouch 1 0 burn '+CostMod; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
GURPS.executeOTF(OtF);
