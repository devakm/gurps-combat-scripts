/* Usage: /:BurningSmash
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/
// modules/jb2a_patreon/Library/Generic/Creature/Bite_01_Regular_Green_400x400.webm
// OtF action setup:
let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
let AttackName ='Piercing*Fangs'; //  Ranged Attack Name, i.e. [R:Burning*Touch]
let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[M:'+AttackName+']'; // alter the OtF type used for secondary check

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim Quarterstaff01*Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Orange c *0.5'; // success animation 
let csanim = '!/anim Quarterstaff01*Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c \\\\!/anim Flames_01_Regular_Orange c *0.8'; // critical success animation 
let fanim = '!/anim Quarterstaff01*Regular_Orange *0.3 -0.2 -0.1'; // failure animation 
let cfanim = '!/anim Impact_01_Regular_Yellow c *0.8 @self \\\\!/anim Flames_01_Regular_Orange c *0.4 @self'; // critical failure animation 
// outcome formulas:
let csformula ='/:SpellDamage BurningTouch 1 +2 burn -8'; // critical success formula 
let cfformula ='/hp -1d-3!'; // critical failure formula 
let sformula ='/:SpellDamage BurningTouch 1 0 burn 0'; //success formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
GURPS.executeOTF(OtF);
