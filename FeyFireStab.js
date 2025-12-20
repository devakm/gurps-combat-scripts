/* Usage: /:FeyFireStab
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/
console.log(`---------------------- Start FeyFireStab ----------------------`);
// OtF action setup:
let AttackTitle ='FeyFire Stab'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let AttackName ='Exq*Fey*Dagger*Thrust'; //  Ranged Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let extraEffort = `+0 Regular Attack *Cost 0FP`;
let kbm = 1;
let animSet = 'FeyFireSlash';
let attackSkill = 'Knife';
let trapTagOpt = '';
let followOn = '[1d burn]'; // follow-on damage]';
let OtF = `/r [/:GenericMeleeAttack title="${AttackTitle}" attack=${AttackName} kbm=${kbm} anim=${animSet} skill=${attackSkill} trap=${trapTagOpt} fon="${followOn}" effort="${extraEffort}"]`;
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`---------------------- End FeyFireStab ----------------------`);
