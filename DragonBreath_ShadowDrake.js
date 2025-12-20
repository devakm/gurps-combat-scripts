/* Usage: /:IceCloud
make a HT roll, at -1 per 2 HP
suffered, or be physically stunned.
*/

// OtF action setup: 
let SpellName ='Ice*Cloud'; //  Spell Name, i.e. [Sp:Explosive*Lightning]
let RangedAttackName ='Ice*Sphere'; //  Ranged Attack Name, i.e. [R:Explosive*Lightning]

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
// modules/jb2a_patreon/Library/Generic/Fire/FireJet_01_Blue_15ft_600x200.webm
// modules/jb2a_patreon/Library/Generic/Ice/IceSpikesRadialBurst_01_Regular_Blue_1000x1000.webm
// modules/jb2a_patreon/Library/3rd_Level/Sleet_Storm/SleetStorm_01_Blue_800x800.webm
let sanim = '!/anim FireJet*Blue*15ft -0.2 +0.7 \\\\!/wait 1000 \\\\!/anim SleetStorm*Blue c *0.5'; // success animation 
let csanim = '!/anim FireJet*Blue*15ft -0.2 +0.7 \\\\!/wait 1000 \\\\!/anim SleetStorm*Blue c *0.8'; // critical success animation 
let fanim = '!/anim FireJet*Blue*15ft -0.2 -3'; // failure animation 
let cfanim = '!/anim SleetStorm*Blue c *0.5 @self'; // critical failure animation 

// outcome formulas:
let csformula ='/:SpellDamage IceCloud 0.5 +1 burn -8 \\\\/rolltable CritHit'; // critical success formula 
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let sformula ='/:SpellDamage IceCloud 0.5 burn 0'; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
GURPS.executeOTF(OtF);
