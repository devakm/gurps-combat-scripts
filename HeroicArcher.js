/* Usage: /:HeroicArcher attack=<attack> spell=<spell> type=<type> anim=<anim>
  Attack - name of the attack
  Spell  - name of the spell
  Type   - Spell Damage type (cr, pi, burn, tox etc...)
  Anim   - Animation set to use

 Examples:
 Vic*Shoot Fireball burn
 Vic*Shoot Explosive*Fireball burn
 Vic*Shoot Concussion cr
 
Outcome animations data table 
Outcomes for critical success, critical failure, regular success, and regular failure each of these settings can be tested individually as an OtF or chat command.
outcome animations:
sanim - success animation 
csanim - critical success animation 
fanim - failure animation 
cfanim - critical failure animation 
*/

console.log('---------------------- Start HeroicArcher ----------------------');

let AttackName = 'Bow*Shoot';
let SpellName = 'NoSpell:1d';
let type = 'dmg';
let animSet = 'FeyFire';
let AttackTitle = 'Heroic Archer'; 

if (scope !== undefined) {
    console.log(scope)
    AttackName = scope.attack ? scope.attack : AttackName;
    SpellName = scope.spell ? scope.spell : SpellName; 
    type = scope.type ? scope.type : type;
    animSet = scope.anim ? scope.anim : anim;
}

let haMsg =`AttackName: ${AttackName}; SpellName: ${SpellName}; type: ${type};`;
console.log(haMsg);

let useSpells = true;
if (SpellName.startsWith('NoSpell') == true) useSpells = false;
let SpellData;
let SpellSkill =0 ;
let CostMod = 0;
let CritCostMod = 0;
let AttackSpell = '';
let FollowOnDamage = '';

if (useSpells == true) {
	// subract CostMod from spell cost, or calculate SpellDamage cost reduction with ${CostMod;
	SpellData = GURPS.findSkillSpell(_token.actor,SpellName,0,1);

	SpellSkill = Number(SpellData.level);
	CostMod = 0
	if (SpellSkill > 19) {
		CostMod = -2
	} else if (SpellSkill > 14) {
		CostMod = -1
	} 
	CritCostMod = Number(CostMod-8)
	AttackSpell = `[Sp:${SpellName}]`; // alter the OtF type used for primary check
} else if (SpellName.split(':')[1].length > 0) {
	FollowOnDamage = SpellName.split(':')[1]+' '+type;
} else {
	// do nothing
}

/*
Outcome animations data table 
Outcomes for critical success, critical failure, regular success, and regular failure 
sanim - success animation 
csanim - critical success animation 
fanim - failure animation 
cfanim - critical failure animation 
*/
spellDta = [
{'spell': 'ex', 'type': 'sformula', 'sdm': 'success'},
{'spell': 'ex', 'type': 'csformula', 'sdm': 'critHit'},
{'spell': 'ex', 'type': 'fformula', 'sdm': 'fail'},
{'spell': 'ex', 'type': 'cfformula', 'sdm': 'critFail'},
{'spell': 'PoisonArrow', 'type': 'sformula', 'sdm': 'success'},
{'spell': 'PoisonArrow', 'type': 'csformula', 'sdm': 'critHit'},
{'spell': 'PoisonArrow', 'type': 'fformula', 'sdm': 'fail'},
{'spell': 'PoisonArrow', 'type': 'cfformula', 'sdm': 'critFail'},
{'spell': 'Fireball', 'type': 'sformula', 'sdm': '/:SpellDamage title=Fireball dice=1 adds=0 type=burn crit=false adjust='},
{'spell': 'Fireball', 'type': 'csformula', 'sdm': '/:SpellDamage title=Fireball dice=1 adds=2 type=burn crit=true adjust='},
{'spell': 'Fireball', 'type': 'fformula', 'sdm': '/fp -1'},
{'spell': 'Fireball', 'type': 'cfformula', 'sdm': '/hp -1d-3!'},
{'spell': 'Explosive*Fireball', 'type': 'sformula', 'sdm': '/:SpellDamage title=ExplosiveFireball dice=0.5 adds=0 type=burn crit=false adjust='},
{'spell': 'Explosive*Fireball', 'type': 'csformula', 'sdm': '/:SpellDamage title=ExplosiveFireball dice=0.5 adds=0 type=burn crit=true adjust='},
{'spell': 'Explosive*Fireball', 'type': 'fformula', 'sdm': '/fp -1'},
{'spell': 'Explosive*Fireball', 'type': 'cfformula', 'sdm': '/hp -1d-3!'},
{'spell': 'ex2', 'type': 'sformula', 'sdm': 'success'},
{'spell': 'ex2', 'type': 'sformula', 'sdm': 'success'}
];

function getSpellSet(spellDta, spell, type) {
	let spellFormula = spellDta.find(x => x.spell == spell && x.type == type).sdm;
	return spellFormula;
}

/* Outcome animations data table 
Outcomes for critical success, critical failure, regular success, and regular failure each of these settings can be tested individually as an OtF or chat command.
outcome animations:
sanim   // success animation 
csanim  // critical success animation 
fanim   // failure animation 
cfanim  // critical failure animation 
*/

animDta = [
{'name': 'ex', 'type': 'sanim', 'anim': 'success'},
{'name': 'ex', 'type': 'csanim', 'anim': 'critHit'},
{'name': 'ex', 'type': 'fanim', 'anim': 'fail'},
{'name': 'ex', 'type': 'cfanim', 'anim': 'critFail'},
{'name': 'ex2', 'type': 'sanim', 'anim': 'success'},
{'name': 'outPulse', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_02_Regular_Yellow c *0.5 @self \\\\!/anim OutPulse_03_Circle_Fast_500 c *0.3 @self'},
{'name': 'inPulse', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
{'name': 'pulse', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
{'name': 'stars', 'type': 'rdy', 'anim': '!/anim DizzyStars*Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
{'name': 'Explosive*Fireball', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
{'name': 'Explosive*Fireball', 'type': 'sanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.3 \\\\!/anim Flames_01_Regular_Orange c *0.4'},
{'name': 'Explosive*Fireball', 'type': 'csanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.8 \\\\!/anim Flames_01_Regular_Orange c *0.5'},
{'name': 'Explosive*Fireball', 'type': 'fanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 -3'},
{'name': 'Explosive*Fireball', 'type': 'cfanim', 'anim': '!/anim Explosion*Orange c *0.6 @self \\\\!/anim Flames_01_Regular_Orange c *0.4 @self'},
{'name': 'Fireball', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
{'name': 'Fireball', 'type': 'sanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.3 \\\\!/anim Flames_01_Regular_Orange c *0.4'},
{'name': 'Fireball', 'type': 'csanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.8 \\\\!/anim Flames_01_Regular_Orange c *0.5'},
{'name': 'Fireball', 'type': 'fanim', 'anim': '!/anim FireBolt*Regular_Orange*15ft -0.2 -3'},
{'name': 'Fireball', 'type': 'cfanim', 'anim': '!/anim Explosion*Orange c *0.6 @self \\\\!/anim Flames_01_Regular_Orange c *0.4 @self'},
{'name': 'FeyFire', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
{'name': 'FeyFire', 'type': 'sanim', 'anim': '!/anim Bolt*Regular_Green_Poison *0.4 -0.2 +1 \\\\!/wait 500 \\\\!/anim Explosion*Green c *0.3 \\\\!/anim Flames_01_Regular_Green c *0.4'},
{'name': 'FeyFire', 'type': 'csanim', 'anim': '!/anim Bolt*Regular_Green_Poison *0.6 -0.2 +1 \\\\!/wait 500 \\\\!/anim Explosion*Green c *0.3 \\\\!/anim Flames_01_Regular_Green c *0.6'},
{'name': 'FeyFire', 'type': 'fanim', 'anim': '!/anim Bolt*Regular_Green_Poison *0.3 -0.2 +0'},
{'name': 'FeyFire', 'type': 'cfanim', 'anim': '!/anim Bolt*Regular_Green_Poison *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.3 @self'},
{'name': 'PoisonArrow', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
{'name': 'PoisonArrow', 'type': 'sanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3'},
{'name': 'PoisonArrow', 'type': 'csanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5'},
{'name': 'PoisonArrow', 'type': 'fanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +0'},
{'name': 'PoisonArrow', 'type': 'cfanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'}
];

function getAnimSet(animDta, animName, typeSet) {
	let anim = animDta.find(x => x.type == typeSet && x.name == animName).anim;
	return anim;
}

function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

function getAimMods(stateModifiers) {
	console.log(`ACTIVE state before getBowArrowMods: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getBowArrowMods(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Acc Normal Aim") == true 
		|| mod.desc.includes("Acc Heroic Aim") == true
		|| mod.desc.startsWith("Acc") == true
	);
	return modifiers;
}

function removeAimBonusOnMove() {
	let aimModsList = getAimMods(GURPS.ModifierBucket.modifierStack.modifierList); 
	console.log(`in removeAimBonusOnMove(): `);

	logModBucket(aimModsList);
	for (let mod of aimModsList) {
		let offset = 0;
		if (mod.modint > 0) {
			offset = Number(offset-mod.modint);
		}
		console.log(`mod.modint: ${mod.modint}; offset: ${offset};`);
		GURPS.ModifierBucket.addModifier(offset, mod.desc);
	}
}


function logModBucket(modifiers) {
	// log the modifiers for orginalActor
	console.log(`in logModBucket(): `);
	for (let mod of modifiers) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}

function setModBucket(modifiers) {
	// reset the modifiers for orginalActor
	console.log(`ACTIVE state before set: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in setModBucket(): `);
	// dedupe
	let currentBucket = GURPS.ModifierBucket.modifierStack.modifierList;
	logModBucket(modifiers);
	let foundDuplicate = false;
	currentBucket.some(existingMod => {
	  modifiers = modifiers.filter(mod => {
		if (existingMod.desc !== mod.desc) {
		  return mod;
		} else {
		  foundDuplicate = true;
		}
	  });
	});
	for (let mod of modifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc);
	}
}

function restoreModBucket(modifiers) {
	// reset the modifiers for orginalActor // restoreModBucket(bowArrowModifiersT0);
	GURPS.ModifierBucket.clear(update=true);
	console.log(`ACTIVE state before restore: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in restoreModBucket(): `);
	logModBucket(modifiers);
	for (let mod of modifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc);
	}
}

function getBowArrowMods(stateModifiers) {
	console.log(`ACTIVE state before getBowArrowMods: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getBowArrowMods(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Fast-Draw") == true 
		|| mod.desc.includes(AttackTitle) == true
		|| mod.desc.includes("Normal") == true
	);
	return modifiers;
}

function getOtherMods(originalModifiers) {
	console.log(`ACTIVE state before getOther: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getOtherMods: `);
	logModBucket(originalModifiers);
	let modifiers = originalModifiers.filter(mod => 
		mod.desc.includes("Fast-Draw") != true 
		&& mod.desc.includes(AttackTitle) != true
		&& mod.desc.includes("Normal") != true
	);
	return modifiers;
}

function getReadyState(bowArrowModifiers) {
	// get the modifiers used for tracking Ready state
	console.log(`in getReadyState: `);
	let readyState = bowArrowModifiers.filter(mod => mod.desc.includes("Ready") == true);
	return readyState;
}

function checkReadyTaken(readyTakenList,maneuver) {
	console.log(`===== in checkReadyTaken maneuver: ${maneuver}`);
	logModBucket(readyTakenList);
	let readyTaken = Number(readyTakenList.length);
	console.log(`readyTaken count: ${readyTaken}`);
	if (maneuver == 'ready') {
		readyTaken = readyTaken-4; // if maneuver set to Ready then stop here
		console.log(`maneuver Ready, so readyTaken count penalty: ${readyTaken}`);
	}
	console.log(`===== return checkReadyTaken: ${readyTaken}`);
	return readyTaken;
}

// OtF action setup:
//let AttackName =`Vic*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
let advHeroicArcher = "Heroic*Archer";
let skFastDrawArrow = "Fast*Draw*Arrow";
let advWeaponMasterBow = "Weapon*Master*Bow";
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
GURPS.ModifierBucket.clear(update=true);
let RangedAttackObj = await GURPS.findAttack(_token.actor, AttackName, 0, 1);
let useHeroicArcher = await GURPS.findAdDisad(_token.actor, advHeroicArcher) != undefined ? true : false;
let useWeaponMasterBow = await GURPS.findAdDisad(_token.actor, advWeaponMasterBow) != undefined ? true : false;
let useFastDrawArrow = await GURPS.findSkillSpell(_token.actor, skFastDrawArrow, true)  != undefined ? true : false;
let useFollowOnAttackData = RangedAttackObj.notes.includes('followOn:') ? true : false;
let followOnSave = false;
let Accuracy = RangedAttackObj.acc;
let Bulk = RangedAttackObj.bulk;
let weaponDamage = RangedAttackObj.damage;
let modHeroicArcher = useWeaponMasterBow == true ? -1 : -3;
let modHeroicArcherTxt = useWeaponMasterBow == true ? ` ${AttackTitle} with Weapon Master (Bow)` : ` ${AttackTitle}`;
console.log(`actorName: ${actorName} does maneuver: ${maneuver} with ${modHeroicArcherTxt} useHeroicArcher: ${useHeroicArcher}; useWeaponMasterBow: ${useWeaponMasterBow}; useFastDrawArrow: ${useFastDrawArrow}; 
Weapon: ${RangedAttackObj.name}: Accuracy: ${Accuracy}; Bulk: ${Bulk}; modHeroicArcher: ${modHeroicArcher}; weaponDamage: ${weaponDamage};`);

// check for follow-on damage
console.log(`useFollowOnAttackData: ${useFollowOnAttackData}`);
if (useFollowOnAttackData == true) {
    followOn = RangedAttackObj.notes.split('followOn:')[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    console.log(`----- get followOn from RangedAttackObj notes; followOn: ${followOn}`);
    // check if followOn has a save (i.e., is complex)
    if (followOn.includes('/if [') == true) {
        followOnSave = true;
        console.log(`----- followOn has a save; followOnSave: ${followOnSave}`);
    }
} else {
    console.log(`----- followOn not found in RangedAttackObj notes`);
}
console.log(`-------- followOnSave: ${followOnSave};`);   
if (followOn != undefined && followOn.length > 1) followOnOtF = followOn;

// message for attack 
let attackMsg = `<p><b>${actorName}</b> is using ${AttackTitle} with <b>${AttackName}</b> and attack damage [${weaponDamage}]`;// 
if (useFollowOnAttackData == true || (followOn != undefined && followOn.length > 0)) {
    attackMsg += ` with follow-up ${followOn} if the attack hits`; 
}
let followUp = '';
let simpleFollowUpOtF = '';
if (useFollowOnAttackData == true && followOnSave == false) {
    console.log(`AttackName: ${AttackName} has plain follow-on damage!`);
    followUp = followOnOtF == '' ? '' : followOnOtF;
    simpleFollowUpOtF = ` \\\\/:RollDamage dmg="${followOnOtF}"`;
} else if (useFollowOnAttackData == true && followOnSave == true) {
	console.log(`AttackName: ${AttackName} has plain follow-on damage!`);
}
let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">${AttackTitle}</span>
		</strong>
	</p>`;
chatDescription += ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
        ${attackMsg}
        </span>
	</p>`;
console.log(chatDescription);

// outcome animations lookup by type [tox] and label [sanim]
let sanim = ''; // success animation 
let csanim = ''; // critical success animation 
let fanim = ''; // failure animation 
let cfanim = ''; // critical failure animation
let rdyanim = ''; // ready animation

// Spellbenders
let sformulaSp; // success animation 
let csformulaSp; // critical success animation 
let fformulaSp; // failure animation 
let cfformulaSp; // critical failure animation

if (useSpells == true) {
	// spell outcome formulas lookup by name [Fireball] and type [sformula]
	sformulaSp = getSpellSet(spellDta, SpellName, 'sformula')+`${CostMod}`; // success animation 
	csformulaSp = getSpellSet(spellDta, SpellName, 'csformula')+`${CritCostMod}`; // critical success animation 
	fformulaSp = getSpellSet(spellDta, SpellName, 'fformula'); // failure animation 
	cfformulaSp = getSpellSet(spellDta, SpellName, 'cfformula'); // critical failure animation
	//getSpellSet(spellDta, 'Fireball', 'sformula');	
	
	// outcome animations lookup by type [tox] and label [sanim]
	sanim = getAnimSet(animDta, SpellName, 'sanim'); // success animation 
	csanim = getAnimSet(animDta, SpellName, 'csanim'); // critical success animation 
	fanim = getAnimSet(animDta, SpellName, 'fanim'); // failure animation 
	cfanim = getAnimSet(animDta, SpellName, 'cfanim'); // critical failure animation
	rdyanim = getAnimSet(animDta, SpellName, 'rdy'); // ready animation
} else if (animSet != undefined && animSet.length > 0) {
	// outcome animations lookup by type [tox] and label [sanim]
	sanim = getAnimSet(animDta, animSet, 'sanim'); // success animation 
	csanim = getAnimSet(animDta, animSet, 'csanim'); // critical success animation 
	fanim = getAnimSet(animDta, animSet, 'fanim'); // failure animation 
	cfanim = getAnimSet(animDta, animSet, 'cfanim'); // critical failure animation
	rdyanim = getAnimSet(animDta, animSet, 'rdy'); // ready animation	
}

// mods, OtFs & messages
// Turn 1 - Ready Arrow
let txT1s = `You <strong>Fast-Draw</strong> your arrow in no time! You can attempt to position your bow right away.`;
let txT1f = `You fail to <strong>Fast-Draw</strong> an arrow this turn. You can position your bow next turn.`;
let txT1cs = `You <strong>Fast-Draw</strong> your arrow with such precision that you gain +3 to position your bow!`;;
let txT1cf = `You fail so badly at <strong>Fast-Draw</strong> that you scatter the contents of your quiver everywhere! Take a turn to pick up 1/4 of your the arrows that were left in your quiver and then try again.`; 

let modT1s = `/r [+0 Fast-Draw (Arrow) Ready success] \\\\${txT1s}`; // Arrow Ready flag. Skip ahead this turn.
let modT1f = `/r [+0 Fast-Draw (Arrow) failed] \\\\${txT1f}`; // failure no Ready flag, resulting in delay.
let modT1cs = `/r [+3 Fast-Draw (Arrow) Ready crit] \\\\${txT1cs}`; // Arrow Ready now at +3
let modT1cf = `/tr(Arrows) =0 \\\\${txT1cf}`; // empty quiver
// Turn 2 - Ready Bow
let txT2s = `You <strong>Ready</strong> your Bow position instantly! You can attack with it right away.`;
let txT2f = `You fail to <strong>Ready</strong> your Bow position this turn. You can attack next turn at ${modHeroicArcher}`;
let txT2cs = `You <strong>Ready</strong> your Bow position with such precision that you attack at +3 this turn!`;;
let txT2cf = `You drop your Bow! Take next turn to pick it up, then on the next turn after that you can try again.`; 

let modT2s = `/r [${modHeroicArcher} to hit ${AttackTitle}] \\\\/r [+0 ${AttackTitle} Ready] \\\\${txT2s}`;// Bow Ready flag. Skip ahead this turn.
let modT2f = `/r [${modHeroicArcher} to hit ${AttackTitle}] \\\\${txT2f}`; // failure no Ready flag, resulting in delay.
let modT2cs = `/r [+3 to hit ${AttackTitle} Ready crit] \\\\${txT2cs}`; // Bow Ready now at +3
let modT2cf = `${txT2cf}`; // qty-1 on the Bow?
// Turn 3 - Fire Bow Attack!
let skFastDrawArrowOtF = `[/if [Sk:${skFastDrawArrow}] s:{${modT1s}} cs:{${modT1cs}} f:{${modT1f}} cf:{${modT1cf}}]`; 
let advHeroicArcherOtF =`[/if [Sk:Bow ${modHeroicArcher}] s:{${modT2s}} cs:{${modT2cs}} f:{${modT2f}} cf:{${modT2cf}}]`; 
let stdReadyArrowOtF = `/r [+0 Normal Ready Arrow] \\\\${rdyanim} \\\\You Ready your arrow. Maneuver set to Ready. \\\\/man ready `;
let stdReadyBowOtF = `/r [+0 Normal Ready Bow] \\\\${rdyanim} \\\\You Ready your bow position. Maneuver set to Ready. \\\\/man ready`;
let stdReadyAnimOtF = rdyanim;
console.log(`skFastDrawArrowOtF: ${skFastDrawArrowOtF};`);
console.log(`advHeroicArcherOtF: ${advHeroicArcherOtF};`);
console.log(`stdReadyArrowOtF: ${stdReadyArrowOtF};`);
console.log(`stdReadyBowOtF: ${stdReadyBowOtF};`);
console.log(`stdReadyAnimOtF: ${stdReadyAnimOtF};`);
await GURPS.executeOTF(stdReadyAnimOtF); 


let Attack = `[R:${AttackName}]`; // alter the OtF type used for attack
//let Damage = `/:RollDamage dmg="[D:${AttackName}]"${FollowOnDamage}`; // alter the OtF type used for attack damage
let Damage = `/:RollDamage dmg="[${weaponDamage}]"`; // alter the OtF type used for attack damage
// TODO: add simple followUp check to see if we can roll it now or not; check whether the followUp has a save or not
if (useFollowOnAttackData == true && followOnSave == false) {
	Damage = `/:RollFollowUpDamage dmg="[${weaponDamage}]" fon="[${FollowOnDamage}]"`; // simple follow-on damage
}
console.log(`Attack: ${Attack}; Damage: ${Damage};`);
//let CritHit = ` \\\\/:RangedCritHit`; // macro reference for CritHit using critTable
let CritDamage = `/:CritHitCalcRanged attack=${AttackName} dmg="${weaponDamage}" fon="${FollowOnDamage}" \\\\${csanim}`; // macro reference for CritHit using critTable
console.log(`CritDamage: ${CritDamage}`);
//let critTable = game.tables.getName('DataCritHit'); // critical hit rolltable
let CritMiss = `/rolltable CritMiss`; // critical miss rolltable
let	trArrows = ` \\\\/tr(Arrows) -1`;

// outcome formulas:
let csformula =`${CritDamage}${trArrows}`; // critical success formula 
let cfformula = `${CritMiss}${trArrows}`; // critical failure formula 
let sformula =`${Damage}${trArrows}`; //success formula 
let fformula =`${trArrows}`;
let attackOtF = `[/if ${Attack} cs:{${csanim} \\\\${csformula}} cf:{${cfanim} \\\\${cfformula}} s:{${sanim} \\\\${sformula}} f:{${fanim} \\\\${fformula}}]`; 
let attackSpellOtF = `[/if ${AttackSpell} s:{${sformulaSp}} cs:{${csformulaSp}} cf:{${cfformulaSp}} f:{${fformulaSp}}]`;

//let attackOtF = `[/if ${Attack} s:{${Damage}${trArrows}} cs:{${Damage}${trArrows}} f:{${trArrows}} cf:{${trArrows}}]`; 

// check if we took Ready maneuvers already 
let attackNow = false;
let readyTaken = 0;
let readyTakenList;
console.log(`------------ Start Initial Fixing up the Modifier Bucket ------------------`);
let bowArrowModifiersT0 = getBowArrowMods(originalModifiers);
let otherModifiers = getOtherMods(originalModifiers);
restoreModBucket(bowArrowModifiersT0);
await wait(1);
console.log(`------------ End Initial Fixing up the Modifier Bucket ------------------`);
readyTakenList = getReadyState(bowArrowModifiersT0); 
readyTaken = checkReadyTaken(readyTakenList,conditions.maneuver);

if (maneuver == 'aim') {
	let aimMsg = stdReadyAnimOtF;
	if (useHeroicArcher == false) { // ADD OR actor took an Aim maneuver first [+3 Acc]
		if (isNaN(Accuracy)||Accuracy===0) {
			GURPS.ModifierBucket.addModifier(0, 'Acc Normal Aim');
			aimMsg += `\\\\You took the Aim maneuver this turn. Ranged Weapon Accuracy is being added to your Modifier Bucket: [+0 Acc Normal Aim]`;
			console.log(`------------ in Turn 3 maneuver [+0 Acc Normal Aim]  ------------------`);
		} else if (Accuracy > 0) {
			GURPS.ModifierBucket.addModifier(Accuracy, 'Acc Normal Aim');
			aimMsg += `\\\\You took the Aim maneuver this turn. Ranged Weapon Accuracy is being added to your Modifier Bucket: [+${Accuracy} Acc Normal Aim]`;
			console.log(`------------ in Turn 3 maneuver +${Accuracy} Acc Normal Aim  ------------------`);
		}
	} else if (useHeroicArcher == true) { // ADD OR actor took an Aim maneuver first [+3 Acc]
		GURPS.ModifierBucket.addModifier(1, 'Acc Heroic Aim');
		aimMsg += `\\\\You took the Aim maneuver this turn. Because you have ${AttackTitle}, this is counted as an additional Aim, so your Modifier Bucket now has: [+1 Acc Heroic Aim]`;
		console.log(`------------ in Turn 3 maneuver [+1 Acc Heroic Aim ] ------------------`);
	}
	await GURPS.executeOTF(aimMsg);
} else {
	if (readyTaken == 0) { 
		let msg = 'TURN 1: Ready Turn-1 Draw and nock an arrow'; // log TURN 1
		console.log(msg);// old cmd: await GURPS.ModifierBucket.addModifier(0, msg);
		if (useFastDrawArrow == true) {
			console.log(skFastDrawArrowOtF);
			await GURPS.executeOTF(skFastDrawArrowOtF); 
		} else { 
			await GURPS.executeOTF(stdReadyArrowOtF);
			if (maneuver !== 'ready') conditions.maneuver = 'ready';
		}
		await wait(2);
	} 
	console.log(`------------ Start Turn 1 Fixing up the Modifier Bucket ------------------`);
	setModBucket(bowArrowModifiersT0);
	await wait(1);
	let bowArrowModifiersT1 = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`------------ End Turn 1 Fixing up the Modifier Bucket ------------------`);
	readyTakenList = getReadyState(bowArrowModifiersT1); 
	readyTaken = checkReadyTaken(readyTakenList,conditions.maneuver);
	if (readyTaken == 1) {
		let msg = 'TURN 2: Ready Turn-2 Position loaded bow';// log TURN 2
		console.log(msg);// old cmd: await GURPS.ModifierBucket.addModifier(0, msg);
		if (useHeroicArcher == true) {
			console.log(advHeroicArcherOtF);
			await GURPS.executeOTF(advHeroicArcherOtF); 
		} else { 
			await GURPS.executeOTF(stdReadyBowOtF); 
			if (maneuver !== 'ready') conditions.maneuver = 'ready';
		}
		await wait(2);
	} 
	console.log(`------------ Start Turn 2 Fixing up the Modifier Bucket ------------------`);
	bowArrowModifiersT2 = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList);
	restoreModBucket(otherModifiers);
	//await wait(1);
	setModBucket(bowArrowModifiersT0);
	//await wait(1);
	setModBucket(bowArrowModifiersT1);
	//await wait(1);
	setModBucket(bowArrowModifiersT2);
	//await wait(1);
	console.log(`------------ End Turn 2 Fixing up the Modifier Bucket ------------------`);
	await wait(1);
	let bowArrowModifiersT3 = getBowArrowMods(GURPS.ModifierBucket.modifierStack.modifierList); 
	readyTakenList = getReadyState(bowArrowModifiersT3); 
	readyTaken = checkReadyTaken(readyTakenList,conditions.maneuver);
	if (readyTaken >= 2) {
		attackNow = true;// TURN 3: attack with no more delays
		console.log(`TURN 3: Fire an arrow; attackNow: ${attackNow}`);	
		console.log(`------------ Start Turn 3 with Modifier Bucket already fixed up! ------------------`);
	}
	if (attackNow == true) {
		if (maneuver == 'aim') {
			let aimMsg = stdReadyAnimOtF;
			if (useHeroicArcher == false) { // ADD OR actor took an Aim maneuver first [+3 Acc]
				if (isNaN(Accuracy)||Accuracy===0) {
					GURPS.ModifierBucket.addModifier(0, 'Acc Normal Aim');
					aimMsg += `\\\\You took the Aim maneuver this turn. Ranged Weapon Accuracy is being added to your Modifier Bucket: [+0 Acc Normal Aim]`;
					console.log(`------------ in Turn 3 maneuver [+0 Acc Normal Aim]  ------------------`);
				} else if (Accuracy > 0) {
					GURPS.ModifierBucket.addModifier(Accuracy, 'Acc Normal Aim');
					aimMsg += `\\\\You took the Aim maneuver this turn. Ranged Weapon Accuracy is being added to your Modifier Bucket: [+${Accuracy} Acc Normal Aim]`;
					console.log(`------------ in Turn 3 maneuver +${Accuracy} Acc Normal Aim  ------------------`);
				}
			} else if (useHeroicArcher == true) { // ADD OR actor took an Aim maneuver first [+3 Acc]
				GURPS.ModifierBucket.addModifier(1, 'Acc Heroic Aim');
				aimMsg += `\\\\You took the Aim maneuver this turn. Because you have ${AttackTitle}, this is counted as an additional Aim, so your Modifier Bucket now has: [+1 Acc Heroic Aim]`;
				console.log(`------------ in Turn 3 maneuver [+1 Acc Heroic Aim ] ------------------`);
			}
			attackNow = false;
			await GURPS.executeOTF(aimMsg);
		} else if (maneuver == 'attack' || maneuver == 'allout_attack' || maneuver.startsWith('aoa')) {
			let attackMsg = stdReadyAnimOtF;
			if (useHeroicArcher == true) { // ADD OR actor took an Aim maneuver first [+3 Acc]
				if (isNaN(Accuracy)||Accuracy===0) {
					GURPS.ModifierBucket.addModifier(0, 'Acc Heroic Aim')
					attackMsg += `\\\\You took the Attack maneuver this turn. ${AttackTitle} lets you Aim your weapon this turn and Attack right away. Ranged Weapon Accuracy is added to your Modifier Bucket: [+0 Acc Heroic Aim]`;
					console.log(`------------ in Turn 3 maneuver [+0 Acc Heroic Aim]  ------------------`);
				} else if (Accuracy > 0) {
					GURPS.ModifierBucket.addModifier(Accuracy, 'Acc Heroic Aim')
					attackMsg += `\\\\You took the Attack maneuver this turn. ${AttackTitle} lets you Aim your weapon this turn and Attack right away. Ranged Weapon Accuracy is added to your Modifier Bucket: [+${Accuracy} Acc Heroic Aim]`;
					console.log(`------------ in Turn 3 maneuver [+${Accuracy} Acc Heroic Aim]  ------------------`);
				}
			}
			await GURPS.executeOTF(attackMsg);
		} else if (maneuver == 'move_and_attack') {
			let moveattackMsg = stdReadyAnimOtF;
			if (useHeroicArcher == true) {
				GURPS.ModifierBucket.addModifier(0, 'Heroic ignore Bulk penalty');
				moveattackMsg += `\\\\You took the Move and Attack maneuver this turn. ${AttackTitle} lets you ignore the Bulk penalty for Move and Attack with a ranged weapon, but Ranged Weapon Accuracy is also ignored. [+0 Heroic ignore Bulk penalty]`;
			} else {
				if (Bulk < -2) {
					GURPS.ModifierBucket.addModifier(Bulk, 'Normal Bulky weapon');
					removeAimBonusOnMove();
					moveattackMsg += `\\\\You took the Move and Attack maneuver this turn using a Ranged Weapon, resulting in a weapon Bulk penalty: [${Bulk} Normal Bulky weapon]. If you previously took an Aim maneuver, you lose that bonus.`;
				} else {
					GURPS.ModifierBucket.addModifier(-2, 'Move and Attack ranged penalty');
					removeAimBonusOnMove();
					moveattackMsg += `\\\\You took the Move and Attack maneuver this turn using a Ranged Weapon, resulting in a weapon Bulk default penalty: [-2 Move and Attack ranged penalty]. If you previously took an Aim maneuver, you lose that bonus.`;
				}
			}
			await GURPS.executeOTF(moveattackMsg);
		} else {
			let maneuverMsg = stdReadyAnimOtF;
			maneuverMsg += `/fp +0 \\\\You cannot attack using your current maneuver. You can pick Attack, All-Out Attack, or Move and Attack -- or Aim to improve you chances on an attack maneuver next turn.`;
			attackNow = false;
			await GURPS.executeOTF(maneuverMsg);
		}

		if (attackNow == true) {
			allAttackModifiersOtF = GURPS.ModifierBucket.modifierStack.modifierList;
			await GURPS.ModifierBucket.clear(update=true);
			if (useSpells == true) {
				console.log(attackSpellOtF);
				await GURPS.executeOTF(attackSpellOtF);
			}
			setModBucket(allAttackModifiersOtF);
			console.log(attackOtF);
			await GURPS.executeOTF(attackOtF);

			await ChatMessage.create({
				content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
			{ chatBubble: false });		
			
		}
	}	
}

console.log(`------------ End HeroicArcher ------------------`);