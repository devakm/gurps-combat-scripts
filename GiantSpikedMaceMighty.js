/* Usage: /:MightyGiantMaceSmash
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

console.log(`---------------------- Start MightyGiantMaceSmash ----------------------`);
// OtF action setup:
let AttackTitle ='Giant Spiked Mace Mighty Blow'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let AttackName ='Giant*Mace*Swing'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let extraEffort = `+0 Mighty Blows *Costs 0FP`;
let kbm = 1;
let animSet = 'RegMaceSmash';
let attackSkill = 'Two-Handed Axe/Mace';
let trapTagOpt = '';
let followOn = ''; // follow-on damage]';
let OtF = `/:GenericMeleeAttack title="${AttackTitle}" attack=${AttackName} kbm=${kbm} anim=${animSet} skill="${attackSkill}" trap="${trapTagOpt}" fon="${followOn}" effort="${extraEffort}"`;
console.log(OtF);
GURPS.executeOTF(OtF);
console.log(`---------------------- End MightyGiantMaceSmash ----------------------`);
