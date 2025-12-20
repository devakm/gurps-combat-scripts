/* Usage: /:ShockingSmash
*/

console.log(`-----------  Start ShockingSmash -----------`);

// OtF action setup:
let SpellName ='Shocking*Touch'; //  Spell Name, i.e. [Sp:Shocking*Touch]
let AttackName ='Sharp*Dragonbone*Staff*Swung'; //  Attack Name, i.e. [M:Wizard*Swung]

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
// outcome animations: modules/jb2a_patreon/Library/Generic/Impact/Impact_04_Dark_Purple_400x400.webm

let sanim = '!/anim Quarterstaff02*Regular_Blue *0.3 -0.2 +1 \\\\!/wait 1300 \\\\!/anim Impact_04_Regular_Blue c *0.3 \\\\!/wait 1100 \\\\!/anim LightningBall_01_Regular_Blue c *0.3'; // success animation 
let csanim = '!/anim Quarterstaff02*Regular_Blue *0.3 -0.2 +1 \\\\!/wait 1300 \\\\!/anim Impact_04_Regular_Blue c *0.5 \\\\!/wait 1100 \\\\!/anim LightningBall_01_Regular_Blue c *0.4'; // critical success animation 
let fanim = '!/anim Impact_07_Regular_Blue c *0.4 @self'; // failure animation 
let cfanim = '!/anim Impact_04_Regular_Blue c *0.3 @self'; // critical failure animation 
// outcome formulas:
let csformula = StrikeDamage+' \\\\/:SpellDamage title=Shocking*Touch dice=1 adds=+3 type=burn adjust=-8 \\\\/rolltable CritHit'; // critical success formula 
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let sformula = StrikeDamage+' \\\\/:SpellDamage title=Shocking*Touch dice=1 adds=+1 type=burn adjust='+CostMod; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`-----------  End ShockingSmash -----------`);
