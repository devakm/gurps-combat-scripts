/* Usage: /:fireball
 * copy this macro and rename it to match whatever missile spell you want to cast, 
 * then reference it in an OtF like this: [/:spellname]
 * Fill in the values below to match the name of the spell, the ranged attack, the animations, and (optionally) outcome formulas.
 * The example success formulas use the SpellDamage macro
*/

// OtF action setup:
// change the next two lines to match your spell
let SpellName ='Fireball'; //  Spell Name, i.e. [Sp:Fireball]
let RangedAttackName ='Fireball'; //  Ranged Attack Name, i.e. [R:Fireball]
// change next two lines to match your critical result tables
let critHitTable = 'CritHit'; // name of the rolltable for critical hits; set to space ' ' to disable 
let critMissTable = 'CritMiss'; // name of the rolltable for critical misses; set to space ' ' to disable 

// Outcomes animations for critical success, critical failure, regular success, and regular failure
// each of these can be tested individually as a chat command. Requires JB2A.
// outcome animations:
let sanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6'; // success animation 
let csanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim FireballExplosion*Orange c *0.2'; // critical success animation 
let fanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 -3'; // failure animation 
let cfanim = '!/anim FireballExplosion*Orange c *0.1 @self'; // critical failure animation 

// Outcome formulas for critical success, critical failure, regular success, and regular failure
// outcome formulas:
let csformula ='/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-4'; // critical success formula 
let cfformula ='/hp -1d-3!'; // critical failure formula 
let sformula ='/:SpellDamage title=Fireball dice=1 adds=0 type=burn adjust=0'; //success formula 
let fformula ='/fp -1'; // failure formula 

if (critHitTable.length > 1) {
    csformula += ' \\\\/rolltable '+critHitTable;
}
if (critMissTable.length > 1) {
    cfformula += ' \\\\/rolltable '+critMissTable;
}
// OtF rolls for spell and ranged attack
let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[R:'+RangedAttackName+']'; // alter the OtF type used for secondary check

// generate OtF string
let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' {'+sanim+' \\\\'+sformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]'; 
console.log(OtF);
GURPS.executeOTF(OtF);