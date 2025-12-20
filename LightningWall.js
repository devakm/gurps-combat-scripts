/* Usage: /:ExplosiveLightning
make a HT roll, at -1 per 2 HP
suffered, or be physically stunned.
*/

// OtF action setup:
let SpellName ='Explosive*Lightning'; //  Spell Name, i.e. [Sp:Explosive*Lightning]
let RangedAttackName ='Explosive*Lightning'; //  Ranged Attack Name, i.e. [R:Explosive*Lightning]

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

let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[R:'+RangedAttackName+ModifierString+']'; // alter the OtF type used for secondary check

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim ChainLightning*Regular_Blue*15ft*Secondary -0.2 +0.7 \\\\!/wait 1000 \\\\!/anim LightningBall*Regular_Blue c *0.8'; // success animation 
let csanim = '!/anim ChainLightning*Regular_Blue*15ft*Secondary -0.2 +0.7 \\\\!/wait 1000 \\\\!/anim LightningBall*Regular_Blue c *1.5'; // critical success animation 
let fanim = '!/anim ChainLightning*Regular_Blue*15ft*Secondary -0.2 -3'; // failure animation 
let cfanim = '!/anim LightningBall*Regular_Blue c *1.5 @self'; // critical failure animation 
// outcome formulas:
let csformula ='/:SpellDamage ExplosiveLightning 0.5 +1 burn -8 \\\\/rolltable CritHit'; // critical success formula 
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let sformula ='/:SpellDamage ExplosiveLightning 0.5 -0.5 burn 0'; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
GURPS.executeOTF(OtF);
