/* Usage: /BlazingBow
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/

// OtF action setup:
let SpellName =`Explosive*Fireball`; //  Spell Name, i.e. [Sp:Burning*Touch]
let RangedAttackName =`Vic*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
let attack = `/:HeroicArcher ${RangedAttackName} ${SpellName} burn`;
console.log(attack);
GURPS.executeOTF(attack);
