/* Usage: /:Deathbow
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

console.log('---------------------- Start Deathbow ----------------------');
// OtF action setup:
let SpellName =`NoSpell:1d`; //  Spell Name, i.e. [Sp:Burning*Touch]
let RangedAttackName =`Vic*Deathbow*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
// main
let attack = `/:HeroicArcher attack=${RangedAttackName} spell=${SpellName} type=burn anim=FeyFire`;
console.log(`Deathbow Heroic Archer: ${attack}`);

//check arrows
//let count = await game.macros.getName('ArrowTracker').execute();
let count = await game.macros.getName('ArrowTracker').execute();
console.log(`Arrow count: ${count}`);

let arrowRdyAnim = '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self';
await GURPS.executeOTF(arrowRdyAnim);
let Arrows = Number(count);
if (Arrows > 0 ) {
	GURPS.executeOTF(attack);
} else {
  ui.notifications.warn(`Out of arrows!`);
} 

console.log('---------------------- End Deathbow ----------------------');



