/* Usage: /BlazingBow
 * copy this macro and retype it to match other spells, then reference it in an OtF like this: [/:spelltype]
 * then fill in the values below to match the type of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/

// OtF action setup:
let SpellName =`Fireball`; //  Spell type, i.e. [Sp:Burning*Touch]
let RangedAttacktype =`Vic*Shoot`; //   Attack type, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
let attack = `/:HeroicArcher ${RangedAttacktype} ${SpellName} burn`;
//console.log(attack);
//GURPS.executeOTF(attack);


spellDta = [
{'spell': 'ex', 'type': 'sformula', 'sdm': 'success'},
{'spell': 'ex', 'type': 'csformula', 'sdm': 'critHit'},
{'spell': 'ex', 'type': 'fformula', 'sdm': 'fail'},
{'spell': 'ex', 'type': 'cfformula', 'sdm': 'critFail'},
{'spell': 'Fireball', 'type': 'sformula', 'sdm': '/:SpellDamage Fireball 1 0 burn'},
{'spell': 'Fireball', 'type': 'csformula', 'sdm': '/:SpellDamage Fireball 1 +2 burn'},
{'spell': 'Fireball', 'type': 'fformula', 'sdm': '/fp -1'},
{'spell': 'Fireball', 'type': 'cfformula', 'sdm': '/hp -1d-3!'},
{'spell': 'Explosive*Fireball', 'type': 'sformula', 'sdm': '/:SpellDamage ExplosiveFireball 0.5 0 burn '},
{'spell': 'Explosive*Fireball', 'type': 'csformula', 'sdm': '/:SpellDamage ExplosiveFireball 0.5 0 burn '},
{'spell': 'Explosive*Fireball', 'type': 'fformula', 'sdm': '/fp -1'},
{'spell': 'Explosive*Fireball', 'type': 'cfformula', 'sdm': '/hp -1d-3!'},
{'spell': 'ex2', 'type': 'sformula', 'sdm': 'success'},
{'spell': 'ex2', 'type': 'sformula', 'sdm': 'success'}
];

function getSpellSet(spellDta, spell, type) {
	let spellFormula = spellDta.find(x => x.spell == spell && x.type == type).sdm;
	return spellFormula;
}

// spell outcome formulas lookup by name [Fireball] and type [sformula]
let sformulaSp = getSpellSet(spellDta, SpellName, 'sformula')+`${CostMod}`; // success animation 
let csformulaSp = getSpellSet(spellDta, SpellName, 'csformula')+`${CritCostMod}`; // critical success animation 
let fformulaSp = getSpellSet(spellDta, SpellName, 'fformula'); // failure animation 
let cformulaSp = getSpellSet(spellDta, SpellName, 'cfformula'); // critical failure animation
//getSpellSet(spellDta, 'Fireball', 'sformula');