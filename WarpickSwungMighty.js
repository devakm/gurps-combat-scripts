/* Usage: /:WarpickMightySmash
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

console.log(`---------------------- Start WarpickMightySmash ----------------------`);
// OtF action setup:
let AttackTitle ='Warpick Smash Mighty Blow'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let AttackName ='Warpick*Swung'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let extraEffort = `[+0 Mighty Blow *Cost 1FP]`;
let kbm = 1;
let animSet = 'WarpickSmash';
let attackSkill = 'Axe/Mace';
let trapTagOpt = '';
let followOn = ''; // follow-on damage]';
OtF = `/r [/:GenericMeleeAttack title="${AttackTitle}" attack=${AttackName} kbm=${kbm} anim=${animSet} skill=${attackSkill} trap=${trapTagOpt} fon="${followOn}" effort="${extraEffort}"]`;
console.log(OtF);
GURPS.executeOTF(OtF);
console.log(`---------------------- End WarpickMightySmash ----------------------`);