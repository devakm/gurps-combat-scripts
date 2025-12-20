/* Usage: /:ThriceHookSwung
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

console.log(`---------------------- Start ThriceHookSwung ----------------------`);

// OtF action setup:
let AttackTitle ='Thrice Hook Swung'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let AttackName ='Thrice*Swung*Hook'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
//let totalModPerDie = 1; // total modifier per die // add bonus for Mighty Blow if any
let extraEffort = `[+0 regular attack *Cost 0FP]`;
let kbm = 1;
let animSet = 'HalberdHookSwung';
let attackSkill = 'Two-Handed Axe/Mace';
let trapTagOpt = '';
let followOn = ''; // follow-on damage]';
OtF = `/r [/:GenericMeleeAttack title="${AttackTitle}" attack=${AttackName} kbm=${kbm} anim=${animSet} skill="${attackSkill}" trap=${trapTagOpt} fon="${followOn}" effort="${extraEffort}"]`;
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`---------------------- End ThriceHookSwung ----------------------`);