/* Usage: /:AxeTrap
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
 * 
 * 
 * let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
 * 
*/

// OtF action setup:
// outcome animations:
let anim = '!/anim MeleeAttack02_BattleAxe01_02 *1.2 -0.2 +1 \\\\!/wait 700 \\\\!/anim GenericSlash01_01_Regular_Orange *1.2 -0.2 +1 \\\\!/wait 700 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 600 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9'; //  animation 
GURPS.executeOTF(anim);
