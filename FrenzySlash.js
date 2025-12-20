/* Usage: /:HolyFrenzySlash
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

console.log(`---------------------- Start HolyFrenzySlash ----------------------`);

// OtF action setup:
let AttackTitle ='Holy Frenzy Slash'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let AttackName ='Holy*Frenzy*Swung'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let extraEffort = `[+0 Regular Attack]`;
let kbm = 1;
let animSet = 'FrenzySlash';
let attackSkill = 'Axe/Mace';
let trapTagOpt = '';
let followOn = ''; // follow-on damage]';
OtF = `/r [/:GenericMeleeAttack title="${AttackTitle}" attack=${AttackName} kbm=${kbm} anim=${animSet} skill="${attackSkill}" trap=${trapTagOpt} fon="${followOn}" effort="${extraEffort}"]`;
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`---------------------- End HolyFrenzySlash ----------------------`);