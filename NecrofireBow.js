/* Usage: /:NecrofireBow
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/

// OtF action setup:
let SpellName ='Fireball'; //  Spell Name, i.e. [Sp:Burning*Touch]
let AttackName ='Vic*Shoot'; //  Attack Name, i.e. [R:Burning*Touch]
let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[R:'+AttackName+']'; // alter the OtF type used for secondary check
let StrikeDamage = '/r [D:'+AttackName+']'; // strike damage OtF. If this penetrates DR, then apply SpellDamage

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim FireBolt*Regular_Green*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Green c *0.3'; // success animation 
let csanim = '!/anim FireBolt*Regular_Green*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Green c *0.6'; // critical success animation 
let fanim = '!/anim FireBolt*Regular_Green*15ft -0.2 -3'; // failure animation 
let cfanim = '!/anim Explosion*Green c *0.6 @self'; // critical failure animation 
// outcome formulas:
let csformula = StrikeDamage+' \\\\/:SpellDamage BurningTouch 1 +2 burn -8'; // critical success formula 
let cfformula ='/hp -1d-3!'; // critical failure formula 
let sformula = StrikeDamage+' \\\\/:SpellDamage BurningTouch 1 0 burn 0'; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
GURPS.executeOTF(OtF);
