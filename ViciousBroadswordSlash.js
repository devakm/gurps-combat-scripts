/* Usage: /:BroadswordSlash
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

console.log(`---------------------- Start BroadswordSlash ----------------------`);
// OtF action setup:
let AttackTitle ='Vicious Broadsword Slash Mighty Blow'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let AttackName ='Vicious*Broadsword*Swung'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let extraEffort = `+0 Regular Attack *Cost 0FP`;
let kbm = 1;
let animSet = 'PoisonBlade';
let attackSkill = 'Broadsword';
let trapTagOpt = '';
let followOn = ''; // follow-on damage]';
let OtF = `/r [/:GenericMeleeAttack title="${AttackTitle}" attack=${AttackName} kbm=${kbm} anim=${animSet} skill=${attackSkill} trap=${trapTagOpt} fon="${followOn}" effort="${extraEffort}"]`;
console.log(OtF);
GURPS.executeOTF(OtF);
console.log(`---------------------- End BroadswordSlash ----------------------`);