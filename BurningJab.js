/* Usage: /:BurningJab
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
*/

console.log(`---------------------- Start BurningJab ----------------------`);

// OtF action setup:
let AttackTitle = 'Burning Touch Jab'; 
let AttackName = 'Sharp*Dragonbone*Staff*Thrust'; 
let SpellName = 'Burning*Touch';
let extraEffort = `[+0 Regular Attack *Cost 0FP]`;
let kbm = 1;
let animSet = 'BurningJab';
let attackSkill = 'Staff';
let trapTagOpt = '';
let followOn = '';
OtF = `/r [/:GenericMeleeAttack title="${AttackTitle}" attack=${AttackName} spell=${SpellName} kbm=${kbm} anim=${animSet} skill="${attackSkill}" trap=${trapTagOpt} fon="${followOn}" effort="${extraEffort}"]`;
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`---------------------- End BurningJab ----------------------`);