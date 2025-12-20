/* Usage: /BlazingBow
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/

// OtF action setup:
let SpellName =`Fireball`; //  Spell Name, i.e. [Sp:Burning*Touch]
let RangedAttackName =`Vic*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
let attack = `/:HeroicArcher ${RangedAttackName} ${SpellName} burn`;
console.log(`Heroic Archer: ${attack}`);

//check arrows
//let count = await game.macros.getName('ArrowTracker').execute();
let count = await game.macros.getName('ArrowTracker').execute();
console.log(`Arrow count: ${count}`);

let arrowRdyAnim = '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self';
await GURPS.executeOTF(arrowRdyAnim, players);
let Arrows = Number(count);
if (Arrows > 0 ) {
	GURPS.executeOTF(attack, players);
}