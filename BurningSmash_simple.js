/* Usage: /:BurningSmash
 * Copy this macro and rename it to match whatever melee spell and attack combo you want to use, 
 * then reference it in an OtF like this: ["Burning Smash" /:BurningSmash]
 * Fill in the values below to match the name of the spell, the melee attack, the animations, and (optionally) outcome formulas.
 * The example success formulas roll melee strike damage first and then use the SpellDamage macro.
*/

// OtF action setup:
// change the next two lines to match your spell and meleee attack
let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
let AttackName ='Wizard*Swung'; //  Attack Name, i.e. [R:Burning*Touch]
// change next two lines to match your critical result tables
let critHitTable = 'CritHit'; // name of the rolltable for critical hits; set to space ' ' to disable 
let critMissTable = 'CritMiss'; // name of the rolltable for critical misses; set to space ' ' to disable 

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim Quarterstaff03*Regular_Purple *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Flames_01_Regular_Orange c *0.5'; // success animation 
let csanim = '!/anim Quarterstaff03*Regular_Purple *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c \\\\!/anim Flames_01_Regular_Orange c *0.8'; // critical success animation 
let fanim = '!/anim Quarterstaff03*Regular_Purple *0.3 -0.2 -0.1'; // failure animation 
let cfanim = '!/anim Impact_01_Regular_Yellow c *0.8 @self \\\\!/anim Flames_01_Regular_Orange c *0.4 @self'; // critical failure animation 

// OtF rolls for spell and melee attack
let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[M:'+AttackName+']'; // alter the OtF type used for secondary check
let StrikeDamage = '/r [D:'+AttackName+']'; // strike damage OtF. If this penetrates DR, then apply SpellDamage
// outcome formulas:
let csformula = StrikeDamage+' \\\\/:SpellDamage title=BurningTouch dice=1 adds=+2 type=burn adjust=-8'; // critical success formula 
let cfformula ='/hp -1d-3!'; // critical failure formula 
let sformula = StrikeDamage+' \\\\/:SpellDamage title=BurningTouch dice=1 adds=0 type=burn adjust=0'; //success formula 
let fformula ='/fp -1'; // failure formula 

// add critHitTable and critMissTable to the critical success and critical failure formulas if they are not empty
if (critHitTable.length > 1) {
    csformula += ' \\\\/rolltable '+critHitTable;
}
if (critMissTable.length > 1) {
    cfformula += ' \\\\/rolltable '+critMissTable;
}
// generate OtF string
let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' {'+sanim+' \\\\'+sformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]'; 
console.log(OtF);
GURPS.executeOTF(OtF);