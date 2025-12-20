/* Usage: /:DeathJab
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/
console.log(`-----------  Start DeathJab -----------`);
// OtF action setup:
let SpellName ='Deathtouch'; //  Spell Name, i.e. [Sp:Deathtouch]
let AttackName ='Sharp*Dragonbone*Staff*Thrust'; //  Attack Name, i.e. [M:Wizard*Swung]

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
let StrikeDamage = '/r [D:'+AttackName+']'; // alter the OtF type used for secondary check

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations: Quarterstaff01_03_Regular_Purple
let sanim = '!/anim Quarterstaff01_03_Regular_Purple *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_04_Dark_Purple c *0.5'; // success animation 
let csanim = '!/anim Quarterstaff01_03_Regular_Purple *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_04_Dark_Purple c \\\\!/anim Flames_01_Regular_Orange c *0.8'; // critical success animation 
let fanim = '!/anim Quarterstaff01_03_Regular_Purple *0.3 -0.2 -0.1'; // failure animation 
let cfanim = '!/anim Explosion_04_Dark_Purple c *0.4 @self'; // critical failure animation 
// outcome formulas:
let csformula = StrikeDamage+' \\\\/:SpellDamage title=Deathtouch dice=1 adds=+2 type=burn adjust=-8 \\\\/rolltable CritHit'; // critical success formula 
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let sformula = StrikeDamage+' \\\\/:SpellDamage title=Deathtouch dice=1 adds=0 type=burn adjust='+CostMod; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`-----------  End DeathJab -----------`);
