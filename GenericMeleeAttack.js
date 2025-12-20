/* Usage: /:GenericMeleeAttack
 * copy this macro and rename it to match other attacks, then reference it in an OtF like this: [/:attackname]
 * then fill in the values below to match the name of the attack, the animations, and outcomes.
*/

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

console.log(`---------------------- Start GenericMeleeAttack ----------------------`);

// OtF action setup:
let AttackTitle ='Vicious Mighty Blow'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let AttackName ='Punch'; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung]
let SpellName ='NoSpell:1d'; //  Spell Name, i.e. [Sp:Burning*Touch]
let totalModPerDie = 0; // total modifier per die // add bonus for Mighty Blow if any
let extraEffort =  `[+0 Regular Attack *Cost 0FP]`; // `[+0 Mighty Blow *Cost 1FP]`;
let kbm = 1; // knockback multiplier
let followOnOtF = ''; //let followOnOtF = '["Weak Bladeblack HT-5"/if [HT-5]  /else [2d tox]]';
let followType = ''; // attack type, i.e. cut, imp, cr, tox, burn, etc.
let animSet = 'Punch';
let useDeceptiveAttack = false; // optional user preference whether to use Deceptive Attack or regular attack; change to false to use skip this check

try {
    console.log(scope)
    AttackTitle = scope.title ? scope.title : AttackTitle;
    AttackName = scope.attack ? scope.attack : AttackName;
    SpellName = scope.spell ? scope.spell : SpellName;
    extraEffort = scope.effort ? scope.effort : extraEffort;
    kbm = scope.kbm ? parseInt(scope.kbm) : kbm; //KB multiplier BXTraps01
    followOnOtF = scope.fon ? scope.fon : followOnOtF;
    followType = scope.type ? scope.type : followType;
    animSet = scope.anim ? scope.anim : animSet;
} catch (error) {
    console.error('Error accessing scope:', error);
}
console.log(`AttackTitle: ${AttackTitle}; AttackName: ${AttackName}; SpellName: ${SpellName}; kbm: ${kbm}; followOnOtF: ${followOnOtF}; extraEffort: ${extraEffort};`);

let useMightyBlow = false;
if (extraEffort.includes('Mighty Blow') == true) {
    totalModPerDie = 1;
    useMightyBlow = true;
}

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
} else if (SpellName != undefined && SpellName.includes(':') && SpellName.split(':')[1].length > 0) {
	FollowOnDamage = SpellName.split(':')[1]+' '+followType;
} else {
	// do nothing
}


/* Outcome animations data table 
Outcomes for critical success, critical failure, regular success, and regular failure each of these settings can be tested individually as an OtF or chat command.
outcome animations:
sanim   // success animation 
csanim  // critical success animation 
fanim   // failure animation 
cfanim  // critical failure animation 

can we use something like 
const myContent = await renderTemplate("modules/gurps-instant-defaults/templates/generator.html");

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
    {'name': 'HalberdSpearThrust', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
    {'name': 'HalberdSpearThrust', 'type': 'sanim', 'anim': '!/anim Glaive01_03_Regular_White *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'HalberdSpearThrust', 'type': 'csanim', 'anim': '!/anim Glaive01_03_Regular_White *0.6 -0.2 +1  \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'HalberdSpearThrust', 'type': 'fanim', 'anim': '!/anim Glaive01_03_Regular_White *0.6 -0.2 +1'},
    {'name': 'HalberdSpearThrust', 'type': 'cfanim', 'anim': '!/anim Glaive01_03_Regular_White *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'},
    {'name': 'HalberdHookSwung', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
    {'name': 'HalberdHookSwung', 'type': 'sanim', 'anim': '!/anim Warhammer*Regular_Orange *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'HalberdHookSwung', 'type': 'csanim', 'anim': '!/anim Warhammer*Regular_Orange *1.1 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'HalberdHookSwung', 'type': 'fanim', 'anim': '!/anim Warhammer*Regular_Orange *0.8 -0.2 +1'},
    {'name': 'HalberdHookSwung', 'type': 'cfanim', 'anim': '!/anim Warhammer*Regular_Orange *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'},
    {'name': 'HalberdHammerSmash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
    {'name': 'HalberdHammerSmash', 'type': 'sanim', 'anim': '!/anim Warhammer01_05_Regular_White *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'HalberdHammerSmash', 'type': 'csanim', 'anim': '!/anim Warhammer01_05_Regular_White *1.1 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'HalberdHammerSmash', 'type': 'fanim', 'anim': '!/anim Warhammer01_05_Regular_White *0.8 -0.2 +1'},
    {'name': 'HalberdHammerSmash', 'type': 'cfanim', 'anim': '!/anim Warhammer01_05_Regular_White *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'},
    {'name': 'HalberdAxeSlash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'HalberdAxeSlash', 'type': 'sanim', 'anim': '!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'HalberdAxeSlash', 'type': 'csanim', 'anim': '!/anim GreatAxe01_01_Regular_White *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'HalberdAxeSlash', 'type': 'fanim', 'anim': '!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1'},
    {'name': 'HalberdAxeSlash', 'type': 'cfanim', 'anim': '!/anim GreatAxe01_01_Regular_White *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'},
    {'name': 'FeyFireSlash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'FeyFireSlash', 'type': 'sanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.3'},
    {'name': 'FeyFireSlash', 'type': 'csanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.5'},
    {'name': 'FeyFireSlash', 'type': 'fanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +0'},
    {'name': 'FeyFireSlash', 'type': 'cfanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.3 @self'},
    {'name': 'WarpickSmash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'WarpickSmash', 'type': 'sanim', 'anim': '!/anim Warhammer*Regular_Orange *0.6 -0.3 +1.4 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7'},
    {'name': 'WarpickSmash', 'type': 'csanim', 'anim': '!/anim Warhammer*Regular_Orange *0.8 -0.3 +1.4 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9'},
    {'name': 'WarpickSmash', 'type': 'fanim', 'anim': '!/anim Warhammer*Regular_Orange *0.6 -0.1 +0.9'},
    {'name': 'WarpickSmash', 'type': 'cfanim', 'anim': '!/anim Warhammer*Regular_Orange *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'},
    {'name': 'FlamingMaceSmash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'FlamingMaceSmash', 'type': 'sanim', 'anim': '!/anim Mace*Fire_Regular_Yellow *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'FlamingMaceSmash', 'type': 'csanim', 'anim': '!/anim Mace*Fire_Regular_Yellow *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.6'},
    {'name': 'FlamingMaceSmash', 'type': 'fanim', 'anim': '!/anim Mace*Fire_Regular_Yellow *0.4 -0.4 +1'},
    {'name': 'FlamingMaceSmash', 'type': 'cfanim', 'anim': '!/anim Mace*Fire_Regular_Yellow *0.4 -0.4 +1 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'},
    {'name': 'HolyMaceSmash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'HolyMaceSmash', 'type': 'sanim', 'anim': '!/anim Mace*Regular_White *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim Flames_01_Regular_Orange c *0.5'},
    {'name': 'HolyMaceSmash', 'type': 'csanim', 'anim': '!/anim Mace*Regular_White *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim Flames_01_Regular_Orange c *0.9'},
    {'name': 'HolyMaceSmash', 'type': 'fanim', 'anim': '!/anim Mace*Regular_White *0.4 -0.4 +1'},
    {'name': 'HolyMaceSmash', 'type': 'cfanim', 'anim': '!/anim Mace*Regular_White *0.4 -0.4 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Orange c *0.3 @self'},
    {'name': 'WarhammerSmash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'WarhammerSmash', 'type': 'sanim', 'anim': '!/anim Warhammer*Regular_White *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'WarhammerSmash', 'type': 'csanim', 'anim': '!/anim Warhammer*Regular_White *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.6'},
    {'name': 'WarhammerSmash', 'type': 'fanim', 'anim': '!/anim Warhammer*Regular_White *0.4 -0.4 +1'},
    {'name': 'WarhammerSmash', 'type': 'cfanim', 'anim': '!/anim Warhammer*Regular_White *0.4 -0.4 +1 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'},
    {'name': 'IceSwordSlash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'IceSwordSlash', 'type': 'sanim', 'anim': '!/anim Warhammer*Regular_White *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'IceSwordSlash', 'type': 'csanim', 'anim': '!/anim Warhammer*Regular_White *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.6'},
    {'name': 'IceSwordSlash', 'type': 'fanim', 'anim': '!/anim Warhammer*Regular_White *0.4 -0.4 +1'},
    {'name': 'IceSwordSlash', 'type': 'cfanim', 'anim': '!/anim Warhammer*Regular_White *0.4 -0.4 +1 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'},
    {'name': 'PoisonBlade', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'PoisonBlade', 'type': 'sanim', 'anim': '!/anim Sword01_05_Regular_Blue *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_02_Regular_Green c *0.5 \\\\!/anim IconPoison_01_Dark_Green c *0.3'},
    {'name': 'PoisonBlade', 'type': 'csanim', 'anim': '!/anim Sword01_05_Regular_Blue *0.4 -0.4 +3 \\\\!/wait 1500 \\\\!/anim Impact_02_Regular_Green c *0.7 \\\\!/anim IconPoison_01_Dark_Green c *0.5'},
    {'name': 'PoisonBlade', 'type': 'fanim', 'anim': '!/anim Sword01_05_Regular_Blue *0.4 -0.4 +1'},
    {'name': 'PoisonBlade', 'type': 'cfanim', 'anim': '!/anim Sword01_05_Regular_Blue *0.4 -0.4 +1 \\\\!/wait 1500 \\\\!/anim Impact_02_Regular_Green c *0.5 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'},
    {'name': 'RegMaceSmash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'RegMaceSmash', 'type': 'sanim', 'anim': '!/anim Mace01_05_Regular_Orange *0.6 -0.4 +2 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'RegMaceSmash', 'type': 'csanim', 'anim': '!/anim Mace01_05_Regular_Orange *0.6 -0.4 +2 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.6'},
    {'name': 'RegMaceSmash', 'type': 'fanim', 'anim': '!/anim Mace01_05_Regular_Orange *0.6 -0.4 +1.2'},
    {'name': 'RegMaceSmash', 'type': 'cfanim', 'anim': '!/anim Mace01_05_Regular_Orange *0.6 -0.6 +0.5 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'},
    {'name': 'FrenzySlash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
    {'name': 'FrenzySlash', 'type': 'sanim', 'anim': '!/anim MeleeAttack*HandAxe *0.6 -0.3 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'FrenzySlash', 'type': 'csanim', 'anim': '!/anim MeleeAttack*HandAxe *0.9 -0.3 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3'},
    {'name': 'FrenzySlash', 'type': 'fanim', 'anim': '!/anim MeleeAttack*HandAxe *0.6 -0.3 +3'},
    {'name': 'FrenzySlash', 'type': 'cfanim', 'anim': '!/anim MeleeAttack*HandAxe *0.4 -0.3 +3 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self'}
];

function getAnimSet(animDta, animName, typeSet) {
    let anim = animDta.find(x => x.type == typeSet && x.name == animName).anim;
    return anim;
}
       
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

// use Deceptive Attack?
let deceptiveAttackOtF = `/:DeceptiveAttack attack=${AttackName}`; 
if (useDeceptiveAttack == true) {
    console.log(`deceptiveAttackOtF: ${deceptiveAttackOtF}`);
    await GURPS.executeOTF(deceptiveAttackOtF);
}
// gather details for the attack
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0) ? await GURPS.findAttack(_token.actor, AttackName, 1, 0) : await GURPS.findAttack(_token.actor, AttackName, 0, 1) ; // find melee or ranged attack data
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor ${GURPS.LastActor.name}`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
console.log(`attackData: ${attackData.name}; ${attackData.skill}; ${attackData.damage}; ${attackData.mode};`);
let attackDamageOtF = attackData.damage;
let followOnSave = false;
let fdmgDice,fdmgType,fdmgBonus,followOn,followOnRegex,followOnMatch,followOnDmg;

// analyze the attack damage formula
let attackDmgDice = Number(attackDamageOtF.split(' ')[0].split('d')[0]);
let weaponDmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? Number(attackDamageOtF.split(' ')[0].split('d')[1]) : 0;
let attackDmgType = attackDamageOtF.split(' ').length > 2 ? attackDamageOtF.split(' ')[2] : attackDamageOtF.split(' ')[1];
let useKnockback = attackDmgType == 'cr' ? true : false;
let armorDivisor = attackDamageOtF.includes('(') ? attackDamageOtF.split('(')[1].split(')')[0] : 1;
let armorDivisorTxt = '';
if (armorDivisor > 1) armorDivisorTxt = ` (${armorDivisor})`;
if (attackDamageOtF.includes('(')) {
    // attack has armor divisor, so use it in the split
    dmgModF = attackDamageOtF.split('d') && attackDamageOtF.split('d')[1].split('(')[0] != undefined ? attackDamageOtF.split('d')[1].split('(')[0] : '';
} else {
    // else split without armor divisor
    dmgModF = attackDamageOtF.split(' ')[0].split('d')[1] != undefined ? attackDamageOtF.split(' ')[0].split('d')[1] : 0;
}
if (dmgModF.includes('-') == true) {
	dmgMod = -Number(dmgModF.split('-')[1]);
} else if (dmgModF.includes('+') == true) {
	dmgMod = Number(dmgModF.split('+')[1]); // split(/[+-]/)[1]
} 
console.log(`Check dmgModF: ${dmgModF}; dmgMod: ${dmgMod}; armorDivisor: ${armorDivisor}; attackDmgType ${attackDmgType}`);

// add bonus for Mighty Blow if used; add this in totalModPerDie initialization
let totalMod = dmgMod > 0 ? dmgMod : weaponDmgBonus;
if (totalModPerDie > 0 && useMightyBlow == true) {
    console.log(`AttackName: ${AttackName} has Mighty Blow bonus damage! totalModPerDie: ${totalModPerDie}; weaponDmgBonus: ${weaponDmgBonus}; attackDmgDice: ${attackDmgDice}`); 
    if (attackDmgDice > 1) {
        if (dmgMod > 0) {
            totalMod = (totalModPerDie*attackDmgDice)+dmgMod;
        } else {
            totalMod = (totalModPerDie*attackDmgDice)+weaponDmgBonus;
        }
    } else {
        // Mighty Blow defaults to +2 or +1 per die, whichever is greater
        if (dmgMod > 0) {
            totalMod = dmgMod+2;
        } else {
            totalMod = weaponDmgBonus+2; 
        }
    }
}
let modSign = totalMod > 0 ? '+' : '';
console.log(`dmgModF: ${dmgModF}; dmgMod: ${dmgMod}; totalMod: ${totalMod}; modSign: ${modSign}`);

//final formula for damage
let dmgFinalOtF = `${attackDmgDice}d${modSign}${totalMod}${armorDivisorTxt} ${attackDmgType}`;
console.log(`dmgFinalOtF: ${dmgFinalOtF}`);



// check for follow-on damage
let useFollowOnAttackData = attackData.notes.includes('followOn:') ? true : false;
console.log(`useFollowOnAttackData: ${useFollowOnAttackData}`);
if (useFollowOnAttackData == true) {
    followOn = attackData.notes.split('followOn:')[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    console.log(`----- get followOn from attackData notes; followOn: ${followOn}`);
    // check if followOn has a save (i.e., is complex)
    if (followOn.includes('/if [') == true) {
        followOnSave = true;
        console.log(`----- followOn has a save; followOnSave: ${followOnSave}`);
    }
} else {
    console.log(`----- followOn not found in attackData notes`);
}
console.log(`-------- followOnSave: ${followOnSave}; fdmgDice: ${fdmgDice}; fdmgType: ${fdmgType}; fdmgBonus: ${fdmgBonus};`);   
if (followOn != undefined && followOn.length > 1) followOnOtF = followOn;

// extra effort for Mighty Blow?
// message for attack mods
let attackModsMsg = ``;

// if (totalModPerDie > 0 && useMightyBlow == true) {

if (totalModPerDie > 0 && useMightyBlow == true ) {
    if (attackDmgDice < 2) {
        console.log(`AttackName: ${AttackName} has less than 2 dice, so use default +2 dmg!`);
        extraEffort = `[+0 to damage Mighty Blow +2 dmg *Cost 1FP]`;
        attackModsMsg = `Damage bonus <b>+2 from Mighty Blow</b> with <b>${attackDmgDice} dice</b> from ST, plus <b>weapon bonus ${weaponDmgBonus}</b>, resulting in <b>Total Modifiers of ${totalMod} damage</b>.<br>`;
    } else {
        console.log(`AttackName: ${AttackName} does NOT have less than 2 dice damage from ST, so use +1 per die bonus damage!`);
        extraEffort = `[+0 Mighty Blow bonus ${totalModPerDie} per die *Cost 1FP]`;
        attackModsMsg = `Damage bonus <b>${totalModPerDie} per die</b>, from Mighty Blow damage per die with <b>${attackDmgDice} dice</b> from ST, plus <b>weapon bonus ${weaponDmgBonus}</b>, resulting in <b>Total Modifiers of ${totalMod} damage</b>.<br>`;
    }
} else {
    extraEffort = `[+0 Regular Attack]`;
    attackModsMsg = `<b>Weapon bonus damage ${weaponDmgBonus}</b> results in <b>Total Modifiers of ${totalMod} damage</b>.<br>`;
}
console.log(`extraEffort: ${extraEffort}; attackModsMsg: ${attackModsMsg}`); // message for attack mods
// message for attack including Mighty Blow if used
let attackMsg = `<p><b>${actorName}</b> is using ${AttackTitle} with <b>${AttackName}</b>, a Knockback multiplier of ${kbm} and attack damage [${dmgFinalOtF}]`;// 
if (useFollowOnAttackData == true || (followOn != undefined && followOn.length > 0)) {
    attackMsg += ` with follow-up ${followOn} if the attack hits`; 
}
attackMsg += `.</p>`;// 
if (totalModPerDie > 0 && useMightyBlow == true) {
    attackMsg += `<p><b>Calculation for Mighty Blow damage</b>: ${attackModsMsg}</p>`;// 
} else {
    attackMsg += `<p><b>Calculation for damage</b>: ${attackModsMsg}</p>`;//
}
console.log(attackMsg);
let knockbackOtF = '';
let knockbackMsg = '';
if (useKnockback === true) {
	console.log(`AttackName: ${AttackName} is a crushing attack, so add Knockback!`);    
    knockbackOtF += `['Knockback'/:AfterAttackKnockback attack="${AttackName}" kbm=${kbm} dmg="${dmgFinalOtF}"]`;
    knockbackMsg = `<b>${actorName}</b> used a <b>crushing attack</b>. 
    If the attack succeeded and is not dodged, then send his foes flying with ${knockbackOtF}; 
    If he rolled a critical hit, then use the Knockback link described in the Critical Hit message instead.<br>`;
} 

let followUp = '';
let simpleFollowUpOtF = '';
if (useFollowOnAttackData == true && followOnSave == false) {
    console.log(`AttackName: ${AttackName} has plain follow-on damage!`);
    followUp = followOnOtF == '' ? '' : followOnOtF;
    simpleFollowUpOtF = ` \\\\/:RollDamage dmg="${followOnOtF}"`;
}
let Attack = '[M:'+AttackName+']'; // alter the OtF type used for attack
let CritMiss = '/rolltable CritMiss'; // critical miss rolltable
//let StrikeDamage = `/r [${dmgFinalOtF}]`; // strike damage OtF. If this penetrates DR, then apply SpellDamage
let StrikeDamage = `/:RollDamage dmg="[${dmgFinalOtF}]${simpleFollowUpOtF}`; // strike damage OtF. If this penetrates DR, then apply SpellDamage
// /:RollDamage dmg="[2d cut]"
let CritStrikeDamage = `/:RollDamage dmg="[${dmgFinalOtF}]${simpleFollowUpOtF} \\\\/:CritHitCalcMelee attack=${AttackName} kbm=${kbm} dmg="${dmgFinalOtF}" fon="${followUp}"`; // macro reference for CritHit using critTable
console.log(`Attack: ${Attack}; StrikeDamage: ${StrikeDamage}; CritStrikeDamage: ${CritStrikeDamage}; followUp: ${followUp};`);
// /:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut fon=1d burn

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome formulas:
let asFormula = `${StrikeDamage} \\\\${sanim}`; // attack success formula 
let acsFormula = `${CritStrikeDamage} \\\\${csanim}`; // attack critical success formula 
let afFormula =`Your attack missed! \\\\${fanim}`; // attack failure formula 
let acfFormula =`You crit failed your attack, so you drop your weapon! \\\\${cfanim} \\\\/status on disarmed \\\\/fp -1`; // attack critical failure formula 

let attackFormulaOtF = `/if ${Attack} s:{${asFormula}} cs:{${acsFormula}} f:{${afFormula}} cf:{${acfFormula}}`;
console.log(attackFormulaOtF);

// clickAttack
let extraOtF = `/r ${extraEffort} \\\\${rdyanim}`;
let clickAttackOtF = `["${AttackTitle}"${attackFormulaOtF}]`;
let clickAttackMsg = `
    <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">
            Melee Attack:<br /> ${clickAttackOtF}</span>
		</strong>
	</p>`;
console.log(`extraOtF: ${extraOtF}; clickAttackOtF: ${clickAttackOtF}; clickAttackMsg: ${clickAttackMsg}`);


let attackNow = false;
if (maneuver == 'move_and_attack' || maneuver == 'attack' || maneuver == 'allout_attack' || maneuver.startsWith('aoa')) {
    //special modier for Mighty Blow
    if (useMightyBlow == true) {
        GURPS.executeOTF(extraOtF);
    }
    attackNow = true;
    console.log(`attackFormulaOtF: ${attackFormulaOtF}`);
    await GURPS.executeOTF(attackFormulaOtF);
    /*
    await ChatMessage.create({
        content: clickAttackMsg, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });		
    */
} else {
    let maneuverMsg = rdyanim;
    maneuverMsg += `/fp +0 \\\\You cannot attack using your current maneuver. You can pick Attack, All-Out Attack, or Move and Attack.`;
    attackNow = false;
    await GURPS.executeOTF(maneuverMsg);
}

await wait(5);

// chat message
let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">${AttackTitle} Attack</span>
		</strong>
	</p>`;
chatDescription += ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
        ${attackMsg}
        </span>
	</p>`;
console.log(chatDescription);
if (attackNow === true) {
    await ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });		
    await wait(1);
}
if (useKnockback === true && knockbackMsg.length > 0) {
    chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Knockback</span>
		</strong>
	</p>`;
    chatDescription += ` 
        <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
            ${knockbackMsg}
            </span>
        </p>`;
    console.log(chatDescription);
    if (attackNow === true) {
        await ChatMessage.create({
            content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
        { chatBubble: false });		
        await wait(1);
    }
}

let targetID,targetToken,targetActor,targetName,followOnMsg;
let targets = Array.from(game.user.targets); 
if (useFollowOnAttackData == true && attackNow === true) {
    for(let target of targets){ 
        targetID = target.id;;
        targetToken = await canvas.tokens.get(targetID);
        targetActor = targetToken.actor;
        targetName = targetActor.name;
        console.log(`targetID: ${targetID}`);
        followOnMsg = `<p><b>Follow-Up</b> for this attack:</p>`;
        //console.log(`<p>${title} causes ${dice} ${adds} (${armorDivisor}) ${type}.<p> `);
        followOnMsg += `<p><b>${actorName}</b> used an attack that includes Follow-Up damage.</p>
        <p>If <b>${targetName}</b> fails to Dodge, Block, or Parry the attack, and the attack penetrated <b>${targetName}'s</b> armor, then <b>${targetName}</b> may suffer additional damage from the Follow-Up.</p>`;
        followOnMsg += `<p>Use ${followOn}</p>`;
        console.log(followOnMsg);
        chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <strong>
                <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Follow-Up Damage</span>
            </strong>
        </p>`;
        chatDescription += ` 
        <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
                <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
                ${followOnMsg}
                </span>
        </p>`;
        console.log(chatDescription);
        await ChatMessage.create({
            content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
        { chatBubble: false });		
        await wait(5);
    };
}

console.log(`---------------------- End GenericMeleeAttack ----------------------`);