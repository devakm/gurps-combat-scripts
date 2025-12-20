/* Usage: /BlazingBow
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/

// OtF action setup:
let SpellName ='Fireball'; //  Spell Name, i.e. [Sp:Burning*Touch]
let RangedAttackName ='Vic*Shoot'; //  Attack Name, i.e. [R:Burning*Touch]

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

// subract CostMod from spell cost, or calculate SpellDamage cost reduction with '+CostMod;
let SpellSkill = Number(GURPS.findSkillSpell(_token.actor,SpellName,0,1).level)
let CostMod = 0
if (SpellSkill > 19) {
	CostMod = -2
} else if (SpellSkill > 14) {
	CostMod = -1
} 

let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[R:'+RangedAttackName+ModifierString+']'; // alter the OtF type used for secondary check
let StrikeDamage = '/r [D:'+RangedAttackName+']'; // strike damage OtF. If this penetrates DR, then apply SpellDamage

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.3'; // success animation 
let csanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.8'; // critical success animation 
let fanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 -3'; // failure animation 
let cfanim = '!/anim Explosion*Orange c *0.6 @self'; // critical failure animation 
// outcome formulas:
let csformula = StrikeDamage+' \\\\/:SpellDamage ExplosiveFireball 0.5 0 burn -8'; // critical success formula 
let cfformula ='/hp -1d-3!'; // critical failure formula 
let sformula = StrikeDamage+' \\\\/:SpellDamage ExplosiveFireball 0.5 0 burn 0'; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
GURPS.executeOTF(OtF);
