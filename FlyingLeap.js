/* Usage: /:FlyingLeapExecute <attackname> <kbmultiplier> <animation> <spellname>  <trap tags>
	Calculate knockback for crushing attacks and shove
	
	<attackname> attack name to use
	<kbmultiplier> knockback multiplier
	<animation> which animation set to use
	<spellname> spell name to use
	
    Use Modifiers to adjust the knockback distance.
    Flying Leap can be used with Extra Effort (Heroic Charge) to increase damage and knockback distance.
    Flying Attack
    [-5 to hit Flying Attack *Max:9]
    Flying Attack Ground Strike (+4 for targeting the ground)
    [-1 to hit Flying Attack *Max:13]
    Extra Effort (Heroic Charge)
    [-1 Heroic Flying Attack *Cost 1FP]
    Extra Effort (Heroic Charge) with Ground Strike (+4 for targeting the ground)
    [+3 Heroic Flying Attack *Cost 1FP]
    Flying Leap
    [-10 Instant Flying Leap *Cost 1FP]
    [-5 Flying Leap (1-Turn) *Cost 1FP]
    [-4 Flying Leap (2-Turn) *Cost 1FP]
    [-3 Flying Leap (3-Turn) *Cost 1FP]
    [-2 Flying Leap (4-Turn) *Cost 1FP]
    [-1 Flying Leap (5-Turn) *Cost 1FP]
    Extra Effort (Heroic Charge) reduces the normal turn 1 penalty from -10 to -6, -1 after 1 turn, and no penalty after 2 turns.
    [-6 Instant Flying Leap EX *Costs 2 FP]
    or with a 1-Turn delay:
    [-1 Flying Leap EX (1-Turn) *Costs 2 FP]
    or with a 2-Turn delay:
    [+0 Flying Leap EX (2-Turn) *Costs 2 FP]
    Then
    ["Flying Leap"/if [S:Flying*Leap] /else [/ooc Sorry I can’t do that!]]
*/

// OtF action setup:
// OtF action setup:
//let MeleeAttackName =`Vic*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
//let kbm = 1; //KB multiplier BXTraps01
//let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
//let AttackName ='Vic*Swung'; //  Attack Name, i.e. [R:Burning*Touch]
/* let AttackName ='Kick*Kick';
let kbm = 2;
let attackSkill = 'Brawling';
let animSet  = 'ClubSmash';

let AttackName ='Vic*Thrust';
let attackSkill = 'Broadsword';
let animSet  = 'BlazingStab';
let kbm = 1;

let AttackName ='Natural*Attacks*Kick';
let attackSkill = 'Karate';
let animSet  = 'BlazingStab';
*/

let AttackName ='Vic*Thrust';
let attackSkill = 'Shortsword';
let animSet  = 'PoisonBlade';
let kbm = 2;
let trapTagOpt = 'BXTraps01'; // BXTraps01
let skFlyingLeap = "Flying*Leap";
let flyingLeapTitle ='Flying Leap';
let isFlyingLunge = false;
let flyingLeapMsg = '';
let dmgCalcMsg = '';
let followOn = ''; // follow-on damage
let stdReadyAnimOtF = `!/anim EnergyStrandIN01_02_Regular_Yellow c *0.5 @self \\\\!/anim OutPulse_03_Circle_Fast_500 c *0.3 @self`;
console.log(`----- In FlyingLeapExecute with DEFAULT values: AttackName: ${AttackName}; kbm: ${kbm}; animSet: ${animSet}; attackSkill: ${attackSkill}; trapTagOpt: ${trapTagOpt};`);

if (args != undefined) {
    console.log('args[0].length '+args[0].length+' : '+args[0]);
    AttackName = args[0].length > 0 ? args[0][1] : 'Punch';
    kbm = args[0].length > 1 ? parseInt(args[0][2]) : 1; //KB multiplier BXTraps01
    animSet = args[0].length > 2 ? args[0][3] : 'ClubSmash';
    attackSkill = args[0].length > 3 ? args[0][4] : 'Brawling';
    trapTagOpt = args[0].length > 4 ? args[0][5] : '';
    followOn = args[0].length > 5 ? args[0][6] : ''; // follow-on damage
}
/* test script by commenting out args */

console.log(`----- In FlyingLeapExecute after parsing arg[0] values: AttackName: ${AttackName}; kbm: ${kbm}; animSet: ${animSet}; attackSkill: ${attackSkill}; trapTagOpt: ${trapTagOpt}; followOn: ${followOn};`);
/* 
test harness
let AttackName ='Vic*Swung';
let kbm = 2;
let trapTagOpt = 'BXTraps01'; // BXTSpikeTrap01
//let SpellName = args[0].length > 2 ? args[0][2] : false; 
*/

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

function getFlyingLeapMods(stateModifiers) {
	console.log(`ACTIVE state before getFlyingLeapMods: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getFlyingLeapMods(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Flying Leap") == true 
	);
	return modifiers;
}

function restoreModBucket(modifiers) {
	// reset the modifiers for orginalActor // restoreModBucket(flyingLeapModList);
	GURPS.ModifierBucket.clear(update=true);
	console.log(`ACTIVE state before restore: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in restoreModBucket(): `);
	logModBucket(modifiers);
	for (let mod of modifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc);
	}
}

function logModBucket(modifiers) {
	// reset the modifiers for orginalActor
	console.log(`in logModBucket(): `);
	for (let mod of modifiers) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}
/* Outcome animations data table 
Outcomes for critical success, critical failure, regular success, and regular failure each of these settings can be tested individually as an OtF or chat command.
outcome animations:
sanim   // success animation 
csanim  // critical success animation 
fanim   // failure animation 
cfanim  // critical failure animation 

BlazingStab animations (animDta)
let sanim = '!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.3'; // success animation 
let csanim = '!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.5'; // critical success animation 
let fanim = '!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +0'; // failure animation 
let cfanim = '!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.3 @self'; // critical failure animation 

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
	{'name': 'BlazingStab', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
	{'name': 'BlazingStab', 'type': 'sanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +1 \\\\!/wait 1500  \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Impact_04_Regular_Orange c *0.5'},
	{'name': 'BlazingStab', 'type': 'csanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Impact_04_Regular_Orange c *0.5'},
	{'name': 'BlazingStab', 'type': 'fanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +0'},
	{'name': 'BlazingStab', 'type': 'cfanim', 'anim': '!/anim Impact_01_Regular_Yellow c *0.7 @self \\\\!/anim Impact_04_Regular_Orange c *0.5 @self'},
	{'name': 'ClubSmash', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
	{'name': 'ClubSmash', 'type': 'sanim', 'anim': '!/anim Club01_02_Dark_OrangePurple -0.4 +1 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.6'},
	{'name': 'ClubSmash', 'type': 'csanim', 'anim': '!/anim Club01_02_Dark_OrangePurple -0.4 +1 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.8'},
	{'name': 'ClubSmash', 'type': 'fanim', 'anim': '!/anim Club01_02_Dark_OrangePurple -0.4 +0.5 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.2 @self'},
	{'name': 'ClubSmash', 'type': 'cfanim', 'anim': '!/anim Club01_02_Dark_OrangePurple -0.4 +0.5 \\\\!/wait 1000 \\\\!/anim UnarmedStrike_01_Regular_Orange_Physical02 c *0.3 @self'},
    {'name': 'SwordStab', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self'},
	{'name': 'SwordStab', 'type': 'sanim', 'anim': '!/anim Sword01_04_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9'},
	{'name': 'SwordStab', 'type': 'csanim', 'anim': '!/anim Sword01_04_Regular_Orange *0.5 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9'},
	{'name': 'SwordStab', 'type': 'fanim', 'anim': '!/anim Sword01_04_Regular_Orange *0.3 -0.1 +0.2 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 @self'},
	{'name': 'SwordStab', 'type': 'cfanim', 'anim': '!/anim Sword01_04_Regular_Orange *0.2 -0.2 -1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 @self'},
    {'name': 'MaulFire', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
	{'name': 'MaulFire', 'type': 'sanim', 'anim': '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim GroundCrackImpact_02_Regular_Orange c *0.7  \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Impact_04_Regular_Orange c *0.5'},
	{'name': 'MaulFire', 'type': 'csanim', 'anim': '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim GroundCrackImpact_02_Regular_Orange c *0.7  \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Impact_04_Regular_Orange c *0.5'},
	{'name': 'MaulFire', 'type': 'fanim', 'anim': '!/anim Maul*Fire_Regular_Orange *0.3 -0.2 -0.1'},
	{'name': 'MaulFire', 'type': 'cfanim', 'anim': '!/anim Impact_01_Regular_Yellow c *0.7 @self \\\\!/anim Impact_04_Regular_Orange c *0.5 @self'},
    {'name': 'PoisonBlade', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
	{'name': 'PoisonBlade', 'type': 'sanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7  \\\\!/anim IconPoison_01_Dark_Green c *0.3'},
	{'name': 'PoisonBlade', 'type': 'csanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9  \\\\!/anim IconPoison_01_Dark_Green c *0.5'},
	{'name': 'PoisonBlade', 'type': 'fanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +0'},
	{'name': 'PoisonBlade', 'type': 'cfanim', 'anim': '!/anim Dagger*Fire_Regular_Green *0.4 -0.2 -0.5 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 @self  \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'},
    {'name': 'UnarmedStrike', 'type': 'rdy', 'anim': '!/anim EnergyStrandIN01_01_Regular_Yellow c *0.5 @self \\\\!/anim InPulse_03_Circle_Normal_500 c *0.3 @self'},
	{'name': 'UnarmedStrike', 'type': 'sanim', 'anim': '!/anim UnarmedStrike*Orange *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9'},
	{'name': 'UnarmedStrike', 'type': 'csanim', 'anim': '!/anim UnarmedStrike*Orange *0.8 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9'},
	{'name': 'UnarmedStrike', 'type': 'fanim', 'anim': '!/anim UnarmedStrikeNoHit_01_Regular_Yellow *0.6 -0.2 +0'},
	{'name': 'UnarmedStrike', 'type': 'cfanim', 'anim': '!/anim UnarmedStrikeNoHit_01_Regular_Yellow *0.8 -0.2 +0 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 @self '},
];
// outcome animations lookup by type [tox] and label [sanim]
function getAnimSet(animDta, animName, typeSet) {
	let anim = animDta.find(x => x.type == typeSet && x.name == animName).anim;
	return anim;
}
let sanim = ''; // success animation 
let csanim = ''; // critical success animation 
let fanim = ''; // failure animation 
let cfanim = ''; // critical failure animation
let rdyanim = ''; // ready animation
sanim = getAnimSet(animDta, animSet, 'sanim');
csanim = getAnimSet(animDta, animSet, 'csanim');
fanim = getAnimSet(animDta, animSet, 'fanim');
cfanim = getAnimSet(animDta, animSet, 'cfanim');
rdyanim = getAnimSet(animDta, animSet, 'rdy');

let dmgTable = [
    { ST: 100, Thrust: '11d', Swing: '13d' },
    { ST: 95, Thrust: '10d+2', Swing: '12d+2' },
    { ST: 90, Thrust: '10d', Swing: '12d' },
    { ST: 85, Thrust: '9d+2', Swing: '11d+2' },
    { ST: 80, Thrust: '9d', Swing: '11d' },
    { ST: 75, Thrust: '8d+2', Swing: '10d+2' },
    { ST: 70, Thrust: '8d', Swing: '10d' },
    { ST: 65, Thrust: '7d+1', Swing: '9d+2' },
    { ST: 60, Thrust: '7d-1', Swing: '9d' },
    { ST: 55, Thrust: '6d', Swing: '8d+1' },
    { ST: 50, Thrust: '5d+2', Swing: '8d-1' },
    { ST: 45, Thrust: '5d', Swing: '7d+1' },
    { ST: 40, Thrust: '4d+1', Swing: '7d-1' },
    { ST: 39, Thrust: '4d+1', Swing: '7d-1' },
    { ST: 38, Thrust: '4d', Swing: '6d+2' },
    { ST: 37, Thrust: '4d', Swing: '6d+2' },
    { ST: 36, Thrust: '4d-1', Swing: '6d+1' },
    { ST: 35, Thrust: '4d-1', Swing: '6d+1' },
    { ST: 34, Thrust: '3d+2', Swing: '6d' },
    { ST: 33, Thrust: '3d+2', Swing: '6d' },
    { ST: 32, Thrust: '3d+1', Swing: '6d-1' },
    { ST: 31, Thrust: '3d+1', Swing: '6d-1' },
    { ST: 30, Thrust: '3d', Swing: '5d+2' },
    { ST: 29, Thrust: '3d', Swing: '5d+2' },
    { ST: 28, Thrust: '3d-1', Swing: '5d+1' },
    { ST: 27, Thrust: '3d-1', Swing: '5d+1' },
    { ST: 26, Thrust: '2d+2', Swing: '5d' },
    { ST: 25, Thrust: '2d+2', Swing: '5d-1' },
    { ST: 24, Thrust: '2d+1', Swing: '4d+2' },
    { ST: 23, Thrust: '2d+1', Swing: '4d+1' },
    { ST: 22, Thrust: '2d', Swing: '4d' },
    { ST: 21, Thrust: '2d', Swing: '4d-1' },
    { ST: 20, Thrust: '2d-1', Swing: '3d+2' },
    { ST: 19, Thrust: '2d-1', Swing: '3d+1' },
    { ST: 18, Thrust: '1d+2', Swing: '3d' },
    { ST: 17, Thrust: '1d+2', Swing: '3d-1' },
    { ST: 16, Thrust: '1d+1', Swing: '2d+2' },
    { ST: 15, Thrust: '1d+1', Swing: '2d+1' },
    { ST: 14, Thrust: '1d', Swing: '2d' },
    { ST: 13, Thrust: '1d', Swing: '2d-1' },
    { ST: 12, Thrust: '1d-1', Swing: '1d+2' },
    { ST: 11, Thrust: '1d-1', Swing: '1d+1' },
    { ST: 10, Thrust: '1d-2', Swing: '1d' },
    { ST: 9, Thrust: '1d-2', Swing: '1d-1' },
    { ST: 8, Thrust: '1d-3', Swing: '1d-2' },
    { ST: 7, Thrust: '1d-3', Swing: '1d-2' },
    { ST: 6, Thrust: '1d-4', Swing: '1d-3' },
    { ST: 5, Thrust: '1d-4', Swing: '1d-3' },
    { ST: 4, Thrust: '1d-5', Swing: '1d-4' },
    { ST: 3, Thrust: '1d-5', Swing: '1d-4' },
    { ST: 2, Thrust: '1d-6', Swing: '1d-5' },
    { ST: 1, Thrust: '1d-6', Swing: '1d-5' }
];

function getDmg(dmgTable, totalST, dmgMode) {
    console.log(`getDmg: totalST: ${totalST}; dmgMode: ${dmgMode}`);
	let dmgObj = dmgTable.find(x => x.ST <= totalST);
    let dmg = dmgMode == 'Thrust' || dmgMode == 'Punch' || dmgMode == 'Kick' || dmgMode == 'Slam' || dmgMode == 'Shield Bash' ? dmgObj.Thrust : dmgObj.Swing;
	return dmg;
}
let actorDmgTest = getDmg(dmgTable, 60, 'Swung');

// check for Flying Leap skill
let useFlyingLeap = await GURPS.findSkillSpell(_token.actor, skFlyingLeap, true)  != undefined ? true : false;
let originalActor = await GURPS.LastActor;
let defaultST = await originalActor.data.data.attributes.ST.value;
let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor ${GURPS.LastActor.name}`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
console.log(`attackData: ${attackData.name}; ${attackData.skill}; ${attackData.damage}; ${attackData.mode};`);
let weaponDmgBonusTxt = '';
let weaponDmgBonus = 0;
if (attackData != undefined && attackData.notes.includes('to hit and damage') == true) {
    weaponDmgBonusTxt = attackData.notes.split('to hit and damage')[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    if (weaponDmgBonusTxt.includes('-') == true) {
        weaponDmgBonus = -Number(weaponDmgBonusTxt.split('-')[1]);
    } else if (weaponDmgBonusTxt.includes('+') == true) {
        weaponDmgBonus = Number(weaponDmgBonusTxt.split('+')[1]); // split(/[+-]/)[1]
    } 
}
let attackDamageOtF = attackData.damage;
console.log(`weaponDmgBonusTxt: ${weaponDmgBonusTxt}; weaponDmgBonus: ${weaponDmgBonus};`);
console.log(`attackDamageOtF: ${attackDamageOtF}`);
let dmgType = attackDamageOtF.split(' ')[1];
let dmgDice = Number(attackDamageOtF.split(' ')[0].split('d')[0]);
let dmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? Number(attackDamageOtF.split(' ')[0].split('d')[1]) : 0;
let dmgMode = attackData.mode;
console.log(`---- about to check followOn with dmgType: ${dmgType}; dmgDice: ${dmgDice}; dmgBonus: ${dmgBonus}; dmgMode: ${dmgMode}; followOn: ${attackData.notes.split('followOn:')[1]}`);
let followOnSave = false;
let fdmgDice,fdmgType,fdmgBonus,followOnRegex,followOnMatch,followOnDmg;
let useFollowOnAttackData = attackData.notes.includes('followOn:') ? true : false;
console.log(`useFollowOnAttackData: ${useFollowOnAttackData}`);
if (useFollowOnAttackData == true) {
    followOn = attackData.notes.split('followOn:')[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    console.log(`----- get followOn from attackData notes; followOn: ${followOn}`);
    if (followOn.includes('/if [') == true) {
        followOnSave = true;
        console.log(`----- followOnSave: ${followOnSave}`); 
        followOnRegex = /\/else\s*\[([^\]]+)\]/;
        followOnMatch = followOn.match(followOnRegex);
        if (followOnMatch) {
            followOnDmg = followOnMatch[1];
            console.log(`Extracted follow-on damage: ${followOnDmg}`);
            fdmgDice = Number(followOnDmg.split(' ')[0].split('d')[0]);
            fdmgType = followOnDmg.split(' ')[1];
            fdmgBonus = Number(followOnDmg.split(' ')[0].split('d')[1].split('+')[1]) > -5 ? Number(followOnDmg.split(' ')[0].split('d')[1].split('+')[1]) : 0;
        }
    } else {
        fdmgDice = Number(followOn.split(' ')[0].split('d')[0]);
        fdmgType = followOn.split(' ')[1];
        fdmgBonus = Number(followOn.split(' ')[0].split('d')[1].split('+')[1]) > -5 ? Number(followOn.split(' ')[0].split('d')[1].split('+')[1]) : 0;
    }
} else {
    console.log(`----- followOn not found in attackData notes`);
}
console.log(`-------- followOnSave: ${followOnSave}; fdmgDice: ${fdmgDice}; fdmgType: ${fdmgType}; fdmgBonus: ${fdmgBonus};`);   

console.log(`----------------- Usng Attack ${attackData.name}: Check dmgMode: ${dmgMode}; dmgType: ${dmgType}`);
// Striking ST bonus for damage calculation
let useStriking = await GURPS.findAdDisad(_token.actor, 'Striking') != undefined ? true : false;
let striking = 0;
let strikingST = 0;
let strikingMsg = '';
if (useStriking == true) {
    striking = GURPS.findAdDisad(_token.actor, 'Striking');
    strikingST = striking.name.split(' ST ')[1];
    strikingMsg = ` plus Striking ${strikingST} ST`;
    console.log(strikingMsg);
}
let actorST = strikingST > 0 ? Number(defaultST)+Number(strikingST) : Number(defaultST);
let totalST = actorST*3;
console.log(`After Striking check, actorST: ${actorST}; totalST: ${totalST};`);
// get the damage for the actor's ST (totalST) and dmgType
let actorDmg = getDmg(dmgTable, totalST, dmgMode); // get the damage for the actor's ST and dmgType
console.log(`actorDmg: ${actorDmg};`);
let totalSTMsg = `A successful <b>Flying Leap</b> triples actor <b>ST ${defaultST}${strikingMsg} to ${totalST}</b> for this attack. `; //attackSkill defaultST
let dmgModF = '';
let dmgMod = 0;
// analyze the attack damage formula
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
let actorDice = Number(actorDmg.split('d')[0]);
let actorMod = actorDmg.split(/[+-]/) != undefined ? Number(actorDmg.split('d')[1]) : 0;
console.log(`actorDmg: ${actorDmg}; actorDice: ${actorDice}; actorMod: ${actorMod}`);

// combine the actor's damage with the attack's damage to build the OtF damage formula
let totalModSimple = actorMod+dmgMod;
let modSign = totalModSimple > 0 ? '+' : '';
console.log(`dmgModF: ${dmgModF}; dmgMod: ${dmgMod}; totalModSimple: ${totalModSimple}; modSign: ${modSign}`);

let attackSkillObj = {};
let rslAttackSkill = '';
// get rsl for attack skill
let useAttackSkill = await GURPS.findSkillSpell(_token.actor, attackSkill, true)  != undefined ? true : false;
if (useAttackSkill == true) {
    attackSkillObj = GURPS.findSkillSpell(_token.actor, attackSkill, true);
    rslAttackSkill = attackSkillObj.relativelevel;
}
console.log(`rslAttackSkill: ${rslAttackSkill};`);

// advantages that give bonus damage per die
let advantageObj = {};
let advantageMod = 0;
let advantageName = '';
let advantageBonus = 0;

/* GURPS 4e advantages that give bonus damage per die
    * Weapon Master: gives +1 or +2 dmg per die with a weapon you know well.
      Add +1 per die to basic thrust or swing damage if you know the relevant weapon skill at DX+1. 
      Add +2 per die if you know that skill at DX+2 or better!
    * Unarmed Master: gives +1 dmg per die for Punch and Kick
    * Seven Secret Kicks: gives +1 dmg per die for Kick, cumulative with Unarmed Master
    * rsl-0: means any relative skill level 
    * rsl+0: means attribute or higher relative skill level, i.e. DX+0, IQ+0, etc.
*/

//let useHeroicArcher = await GURPS.findAdDisad(_token.actor, advHeroicArcher) != undefined ? true : false;
/*
    for (let advantage of advantageBonusData) {
        let hasAdvantage = await GURPS.findAdDisad(_token.actor, advantage.advantageName) != undefined ? true : false;
        if (hasAdvantage == true) {
            advantage.useMe = true;
            advantageObj = GURPS.findAdDisad(_token.actor, advantage.advantageName);}
            if (advantageObj.
    }
*/
let bonusPerDie = 0;
let advantageBonusData = [
    { advantageName: 'Weapon Master', attackMode: 'Thrust', rsl: 'DX+2', bonusPerDie: 2, useMe: false },
    { advantageName: 'Weapon Master', attackMode: 'Thrust', rsl: 'DX+1', bonusPerDie: 1, useMe: false },
    { advantageName: 'Weapon Master', attackMode: 'Swing|Swung', rsl: 'DX+2', bonusPerDie: 2, useMe: false },
    { advantageName: 'Weapon Master', attackMode: 'Swing|Swung', rsl: 'DX+1', bonusPerDie: 1, useMe: false },
    { advantageName: 'Unarmed Master', attackMode: 'Punch', rsl: 'DX-0', bonusPerDie: 1, useMe: false },
    { advantageName: 'Unarmed Master', attackMode: 'Kick', rsl: 'DX-0', bonusPerDie: 1, useMe: false },
    { advantageName: 'Seven Secret Kicks', attackMode: 'Kick', rsl: 'DX-0', bonusPerDie: 1, useMe: false }
];
let hasAdvantage = false;
let activeAdvantagesList = [];
async function updateAdvantageBonusData(advantageBonusData, dmgMode) {
    advantageBonusData = advantageBonusData.filter(async advantage => {
        hasAdvantage = await GURPS.findAdDisad(_token.actor, advantage.advantageName) != undefined;
        console.log(`hasAdvantage: ${hasAdvantage}; advantage.attackMode: ${advantage.attackMode}; dmgMode: ${dmgMode}; advantage.useMe: ${advantage.useMe}; advantage.advantageName: ${advantage.advantageName};`);
        advantage.useMe = hasAdvantage ? true : false;
        return hasAdvantage && advantage.attackMode === dmgMode;
    });
}

let advantageBonusDataResults = await updateAdvantageBonusData(advantageBonusData, dmgMode);
console.log(`advantageBonusDataResults: ${advantageBonusDataResults};`);

let rslAttackSkillNum = rslAttackSkill.includes('-') == true ? -Number(rslAttackSkill.split('-')[1]) : Number(rslAttackSkill.split('+')[1]);
console.log(`rslAttackSkillNum: ${rslAttackSkillNum};`);
// find the highest bonus for a given advantage and attack mode
function findHighestBonus(advantageBonusData, advantageName, attackMode) {
    let filteredData = advantageBonusData.filter(advantage => 
        advantage.advantageName === advantageName 
        && advantage.attackMode.includes(attackMode)
        && advantage.useMe == true
        && (advantage.rsl.includes('-0') || 
        (advantage.rsl.includes('+') && rslAttackSkillNum >= Number(advantage.rsl.split('+')[1])))
    );
    if (filteredData.length === 0) return null;
    return filteredData.reduce((max, advantage) => 
        advantage.bonusPerDie > max.bonusPerDie ? advantage : max
    );
}

let highestBonus = findHighestBonus(advantageBonusData, 'Weapon Master', dmgMode);
console.log(`Highest Bonus: ${highestBonus ? highestBonus.bonusPerDie : 'None'}`);

/*
function getAdvantageBonusData(advantageBonusData, dmgMode) {
    let dmgBonus = advantageBonusData.find(a => a.attackMode.includes(dmgMode) == true 
    && (a.rsl.includes('-0') == true || (
        (a.rsl.includes('+') == true 
        && rslAttackSkillNum == Number(a.rsl.split('+')[1]) )
        || (a.rsl.includes('+') == true
        && rslAttackSkillNum > Number(a.rsl.split('+')[1]) )
        )
    )).bonusPerDie;
    console.log(`dmgBonus: ${dmgBonus};`);
    return dmgBonus;
}
*/

let dmgAdvBonusObj;
function getAdvantageBonusData(advantageBonusData, advantageName, dmgMode) {
    dmgAdvBonusObj = advantageBonusData.find(advantage => 
        advantage.attackMode.includes(dmgMode) 
        && advantage.advantageName == advantageName 
        && advantage.attackMode.includes(dmgMode)
        && (advantage.rsl.includes('-0') || 
        (advantage.rsl.includes('+') && rslAttackSkillNum >= Number(advantage.rsl.split('+')[1]))));
    if (dmgAdvBonusObj === undefined || dmgAdvBonusObj.length === 0) return null;
    console.log(`dmgAdvBonusObj match: ${dmgAdvBonusObj.advantageName}; bonusPerDie: ${dmgAdvBonusObj.bonusPerDie};`);
    return filteredData.reduce((max, advantage) => 
        advantage.bonusPerDie > max.bonusPerDie ? advantage : max
    );
}

let advantageBonusDmgPerDie = 0;
advantageBonusDmgPerDie += getAdvantageBonusData(advantageBonusData, dmgMode); 
console.log(`advantageBonusDmgPerDie: ${advantageBonusDmgPerDie};`);

async function listActiveAdvantages(advantageBonusData, dmgMode) {
    let activeAdvantages = advantageBonusData.filter(advantage => 
        advantage.useMe == true
        && advantage.attackMode === dmgMode
        && (advantage.rsl.includes('-0') || 
        (advantage.rsl.includes('+') && rslAttackSkillNum >= Number(advantage.rsl.split('+')[1])))
    );
    console.log(`activeAdvantages: ${activeAdvantages};`);
    return activeAdvantages;
}
let activeAdvantageMods = 0;
let advantageTableHTML = '<table><tr><th>Advantage Name</th><th>Bonus Per Die</th></tr>';
activeAdvantagesList = await listActiveAdvantages(advantageBonusData, dmgMode);
/* activeAdvantagesList = activeAdvantagesList.reduce((max, advantage) => {
    if (advantage.advantageName === max.advantageName) {
        return advantage.bonusPerDie > max.bonusPerDie ? advantage : max;
    }
    return max;
}); */
let maxAdvantages = {};
activeAdvantagesList.forEach(advantage => {
    if (!maxAdvantages[advantage.advantageName] || advantage.bonusPerDie > maxAdvantages[advantage.advantageName].bonusPerDie) {
        maxAdvantages[advantage.advantageName] = advantage;
    }
});
activeAdvantagesList = Object.values(maxAdvantages);
console.log(`--------------- activeAdvantagesList: ${activeAdvantagesList};`);
if (Array.isArray(activeAdvantagesList)) {
    activeAdvantagesList.forEach(advantage => {
        activeAdvantageMods += advantage.bonusPerDie;
        if (advantage.advantageName == 'Weapon Master' || advantage.advantageName == 'Unarmed Master' || advantage.advantageName == 'Seven Secret Kicks') {
            advantageTableHTML += `<tr><td>${advantage.advantageName}</td><td>${advantage.bonusPerDie} (using ${attackSkill})</td></tr>`;
        } else {
            advantageTableHTML += `<tr><td>${advantage.advantageName}</td><td>${advantage.bonusPerDie}</td></tr>`;
        }
    }) 
} else {
    activeAdvantageMods += activeAdvantagesList.bonusPerDie;
    if (activeAdvantagesList.advantageName == 'Weapon Master' || activeAdvantagesList.advantageName == 'Unarmed Master' || activeAdvantagesList.advantageName == 'Seven Secret Kicks') {
        advantageTableHTML += `<tr><td>${activeAdvantagesList.advantageName}</td><td>${activeAdvantagesList.bonusPerDie} (using ${attackSkill})</td></tr>`;
    } else {
        advantageTableHTML += `<tr><td>${activeAdvantagesList.advantageName}</td><td>${activeAdvantagesList.bonusPerDie}</td></tr>`;
    }
}


advantageBonusDmgPerDie += (advantageBonusDmgPerDie === null || advantageBonusDmgPerDie < 1 ) && activeAdvantageMods != null && activeAdvantageMods > 0 ? activeAdvantageMods : 0;

advantageTableHTML += `<tr><td>Total</td><td>${advantageBonusDmgPerDie}</td></tr>`;
advantageTableHTML += '</table>';
console.log(advantageTableHTML);

let skillObj = {}; 
let skillMod = 0;
let rslSkill = '';
let skillName = '';
let adjustedskillMod = 0;

    /* GURPS 4e skills that give bonus damage per die
    * Boxing: if you know Boxing at DX+1 gives +1 per die to your damage with punches, 
        or +2 per die if you know Boxing at DX+2 or better. 
    * Sumo Wrestling: If you know this skill at DX+1 level, add +1 per die to your damage with slams or shoves, 
        or +2 per die if you know Sumo Wrestling at DX+2 or better.
    * Karate: If you know Karate at DX level, add +1 per die to basic thrust damage with Karate attacks.
        Add +2 per die if you know Karate at DX+1 or better!
    * Judo: gives +1 per die to your damage with throws and locks,
            or +2 per die if you know Judo at DX+2 or better.
    * Brawling:  If you know Brawling at DX+2 level or better, add +1 per die to basic thrust 
            damage when you calculate damage with any of these attacks: 
            Punch, Kick, Slam, Trample, or natural attacks (Bite, Claw, Horn, Head Butt)
    * Wrestling: does not help with flying leap attacks
            gives +1 per die to your damage with holds and throws,
            or +2 per die if you know Wrestling at DX+2 or better.
    * Throwing Art: If you know Throwing Art at DX level, add +1 to your ST to figure throwing distance, and +1 per die
            of damage with thrown weapons. These bonuses increase to +2 if you know Throwing Art at DX+1 or better.
            If you have Weapon Master (p. 54), use the higher of the damage bonus for this skill and that advantage.
    */

// check skills and advantages that give per-die bonus damage, subtrack bonus from attack damage, then recalculate bonus using the adjusted dice
// skills that give bonus damage per die based on skillname, base attribute, attack mode, and relative skill level (rsl)
let skillBonusData = [
    { skillName: 'Weapon*Master', baseAttribute: 'DX', attackMode: 'Thrust', rsl: 'DX+2', bonusPerDie: 2, useMe: false },
    { skillName: 'Weapon*Master', baseAttribute: 'DX', attackMode: 'Thrust', rsl: 'DX+1', bonusPerDie: 1, useMe: false },
    { skillName: 'Weapon*Master', baseAttribute: 'DX', attackMode: 'Swing|Swung', rsl: 'DX+2', bonusPerDie: 2, useMe: false },
    { skillName: 'Weapon*Master', baseAttribute: 'DX', attackMode: 'Swing|Swung', rsl: 'DX+1', bonusPerDie: 1, useMe: false },
    { skillName: 'Boxing', baseAttribute: 'DX', attackMode: 'Punch', rsl: 'DX+2', bonusPerDie: 2, useMe: false },
    { skillName: 'Boxing', baseAttribute: 'DX', attackMode: 'Punch', rsl: 'DX+1', bonusPerDie: 1, useMe: false },
    { skillName: 'Sumo*Wrestling', baseAttribute: 'DX', attackMode: 'Slam', rsl: 'DX+2', bonusPerDie: 2, useMe: false },
    { skillName: 'Sumo*Wrestling', baseAttribute: 'DX', attackMode: 'Slam', rsl: 'DX+1', bonusPerDie: 1, useMe: false },
    { skillName: 'Karate', baseAttribute: 'DX', attackMode: 'Thrust', rsl: 'DX+1', bonusPerDie: 2, useMe: false },
    { skillName: 'Karate', baseAttribute: 'DX', attackMode: 'Thrust', rsl: 'DX+0', bonusPerDie: 1, useMe: false },
    { skillName: 'Judo', baseAttribute: 'DX', attackMode: 'Throw', rsl: 'DX+2', bonusPerDie: 2, useMe: false },
    { skillName: 'Judo', baseAttribute: 'DX', attackMode: 'Throw', rsl: 'DX+1', bonusPerDie: 1, useMe: false },
    { skillName: 'Brawling', baseAttribute: 'DX', attackMode: 'Punch', rsl: 'DX+2', bonusPerDie: 1, useMe: false },
    { skillName: 'Brawling', baseAttribute: 'DX', attackMode: 'Kick', rsl: 'DX+2', bonusPerDie: 1, useMe: false },
    { skillName: 'Brawling', baseAttribute: 'DX', attackMode: 'Slam', rsl: 'DX+2', bonusPerDie: 1, useMe: false },
    { skillName: 'Brawling', baseAttribute: 'DX', attackMode: 'Trample', rsl: 'DX+2', bonusPerDie: 1, useMe: false },
    { skillName: 'Brawling', baseAttribute: 'DX', attackMode: 'Bite', rsl: 'DX+2', bonusPerDie: 1, useMe: false },
    { skillName: 'Brawling', baseAttribute: 'DX', attackMode: 'Claw', rsl: 'DX+2', bonusPerDie: 1, useMe: false },
    { skillName: 'Brawling', baseAttribute: 'DX', attackMode: 'Horn', rsl: 'DX+2', bonusPerDie: 1, useMe: false },
    { skillName: 'Brawling', baseAttribute: 'DX', attackMode: 'Head Butt', rsl: 'DX+2', bonusPerDie: 1, useMe: false },
    { skillName: 'Throwing*Art', baseAttribute: 'DX', attackMode: 'Throw', rsl: 'DX+1', bonusPerDie: 2, useMe: false },
    { skillName: 'Throwing*Art', baseAttribute: 'DX', attackMode: 'Throw', rsl: 'DX+0', bonusPerDie: 1, useMe: false },
];

let hasSkill = false;
let skillBonusDataObj;
async function updateSkillBonusData(skillBonusData, dmgMode) {
    skillBonusDataObj = skillBonusData.filter(async skill => {
        hasSkill = await GURPS.findSkillSpell(_token.actor, skill.skillName, true) != undefined ? true : false;
        console.log(`hasSkill: ${hasSkill}; skill.attackMode: ${skill.attackMode}; dmgMode: ${dmgMode}; skill.useMe: ${skill.useMe}; skill.skillName: ${skill.skillName};`);
        skill.useMe = hasSkill ? true : false;
        return hasSkill && skill.attackMode === dmgMode;
    });
}

let skillBonusDataResults = await updateSkillBonusData(skillBonusData, dmgMode);
console.log(`skillBonusDataResults: ${skillBonusDataResults};`);

async function listActiveSkills(skillBonusData, dmgMode) {
    let activeSkills = skillBonusData.filter(skill => 
        skill.useMe == true
        && skill.attackMode === dmgMode
        && (skill.rsl.includes('-0') 
        || (skill.rsl.includes('+') 
        && rslAttackSkillNum >= Number(skill.rsl.split('+')[1])))
    );
    if (activeSkills.length === 0) return null;
    console.log(`activeSkills: ${activeSkills};`);
    return activeSkills.reduce((max, skill) => 
        activeSkills.bonusPerDie > max.bonusPerDie ? skill : max
    );
}

function filterActiveSkills(skillBonusData) {
    return skillBonusData.filter(skill => skill.useMe && skill.attackMode === dmgMode && (skill.rsl.includes('-0') || (skill.rsl.includes('+') && rslAttackSkillNum >= Number(skill.rsl.split('+')[1]))))
}
wait(1);
let activeSkills = filterActiveSkills(skillBonusData);
console.log(`Active Skills: ${JSON.stringify(activeSkills)}`);
wait(1);

let dmgSkillBonusObj;
function getSkillBonusData(skillBonusData, attackSkill, dmgMode) {
    console.log(`in getSkillBonusData: attackSkill: ${attackSkill}; dmgMode: ${dmgMode}`);
    dmgSkillBonusObj = skillBonusData.find(skill => 
        skill.attackMode.includes(dmgMode) == true 
        && skill.useMe == true
        && (skill.skillName == attackSkill || skill.skillName == 'Weapon*Master')
        && (
        skill.rsl.includes('-0') == true 
        || ((skill.rsl.includes('-') == true && rslAttackSkillNum == -Number(skill.rsl.split('-')[1]) )
        || (skill.rsl.includes('+') == true && rslAttackSkillNum >= Number(skill.rsl.split('+')[1]) ))
        )
    );
    if (dmgSkillBonusObj === undefined || dmgSkillBonusObj.length === 0) return null;
    console.log(`getSkillBonusData match: ${dmgSkillBonusObj.skillName}; bonusPerDie: ${dmgSkillBonusObj.bonusPerDie};`);
    if (Array.isArray(dmgSkillBonusObj) == true) {
        return dmgSkillBonusObj.reduce((max, skill) => 
            skill.bonusPerDie > max.bonusPerDie ? skill : max
        );
    } else {
        return dmgSkillBonusObj.bonusPerDie;
    };
};

let attackSkillBonusDmgPerDie = getSkillBonusData(skillBonusData, attackSkill, dmgMode); 
console.log(`attackSkillBonusDmgPerDie: ${attackSkillBonusDmgPerDie};`);

let activeSkillsList = [];
let skillTableHTML = '<table><tr><th>Skill Name</th><th>Bonus Per Die</th></tr>';
activeSkillsList = await listActiveSkills(skillBonusData, dmgMode);
if (activeSkillsList === null) {
    console.log(`--------- skillTableHTML No active skills found for ${dmgMode}`);
    skillTableHTML += `<tr><td>No Skills Active</td><td>0</td></tr>`;    
} else if (Array.isArray(activeSkillsList)) {
    console.log(`--- skillTableHTML Array.isArray(activeSkillsList) Active Skills: ${activeSkillsList}`);
    activeSkillsList.forEach(skill => {
        if (skill.skillName != 'Weapon*Master') {
            skillTableHTML += `<tr><td>${skill.skillName}</td><td>${skill.bonusPerDie}</td></tr>`;
        }
    });
} else if (activeSkillsList.hasOwnProperty('skillName')) {
    console.log(`--- skillTableHTML activeSkillsList.hasOwnProperty('skillName') Active Skill: ${activeSkillsList.skillName}; Active Bonus Per Die: ${activeSkillsList.bonusPerDie}`);
    skillTableHTML += `<tr><td>${activeSkillsList.skillName}</td><td>${activeSkillsList.bonusPerDie}</td></tr>`; 
} else if (attackSkillBonusDmgPerDie != null && attackSkillBonusDmgPerDie > 0) {
    console.log(`--- skillTableHTML attackSkillBonusDmgPerDie: ${attackSkillBonusDmgPerDie}`);
    skillTableHTML += `<tr><td>${skillName}</td><td>${attackSkillBonusDmgPerDie}</td></tr>`; 
}
skillTableHTML += `<tr><td>Total</td><td>${attackSkillBonusDmgPerDie}</td></tr>`;
skillTableHTML += '</table>';
console.log(skillTableHTML);

async function getSkillMod(skillName) {
    let hasSkill = await GURPS.findSkillSpell(_token.actor, skillName, true)  != undefined ? true : false;
    if (hasSkill == true) {
        skillObj = GURPS.findSkillSpell(_token.actor, skillName, true);
        rslSkill = skillObj.relativelevel;
        console.log(`rslSkill: ${rslSkill};`);
        if (rslSkill.includes('-') == true) {
            skillMod = -Number(rslSkill.split('-')[1]);
            console.log(`${skillObj.name} skillMod from rslSkill: ${skillMod};`);
        } else if (rslSkill.includes('+') == true) {
            skillMod = Number(rslSkill.split('+')[1]); // split(/[+-]/)[1]
            console.log(`${skillObj.name} skillMod from rslSkill: ${skillMod};`);
        } 
        return skillMod;
    } else {
        console.log(`Error: ${skillName} not found on actor ${GURPS.LastActor.name}`);
        return 0;
    }
}

let skills = [`${attackSkill}`,'Boxing', 'Sumo*Wrestling', 'Karate', 'Judo', 'Brawling'];
let skillMods = 0;

for (let skill of skills) {
    skillMods += await getSkillMod(skill);
    console.log(`Skill: ${skill}, Modifier: ${skillMods}`);
}
// calculate the total modifier per die AKM
advantageBonus += advantageBonusDmgPerDie != null && advantageBonusDmgPerDie > 0 && (advantageBonus === null || advantageBonus < advantageBonusDmgPerDie ) ? advantageBonusDmgPerDie : 0;

totalModPerDie = Number(attackSkillBonusDmgPerDie)+Number(advantageBonus);
console.log(`----------------- Per Die Damage -- totalModPerDie: ${totalModPerDie} from attackSkillBonusDmgPerDie: ${attackSkillBonusDmgPerDie}, advantageBonus: ${advantageBonus}, and dmgBonus: ${dmgBonus}`);
let totalMod = (totalModPerDie*actorDice)+weaponDmgBonus;
advantageName = (advantageName === null || advantageName.length < 1) && activeAdvantagesList.length > 0 ? activeAdvantagesList[0].advantageName : advantageName;
advantageMod = (advantageMod === null || advantageMod < 1) && activeAdvantagesList.length > 0 ? activeAdvantagesList[0].bonusPerDie : advantageMod;
let attackModsMsg = `Damage bonus <b>${totalModPerDie} per die</b>, from attack skill damage per die ${attackSkillBonusDmgPerDie} and advantage ${advantageName} ${advantageBonus}, with <b>${actorDice} dice</b> from ST, plus <b>weapon bonus ${weaponDmgBonus}</b>, resulting in <b>Total Modifiers of ${totalMod} damage</b>.<br>`;
//akm advantageBonusDmgPerDie
let dmgFinalOtF = `${actorDice}d${modSign}${totalMod}${armorDivisorTxt} ${attackDmgType}`;
console.log(`dmgFinalOtF: ${dmgFinalOtF}`);
// get jump distance in feet
let flJumpDistanceFeet = Number(originalActor.data.data.basicmove.value*3)-3; // Flying Leap jump distance in feet
let stdJumpDistanceFeet = Number(originalActor.data.data.basicmove.value*2)-3; // standard jump distance in feet
let flJumpDistanceYards = flJumpDistanceFeet/3;
let stdJumpDistanceYards = stdJumpDistanceFeet/3;
// gather additional details about the actor and the attack
let actorName = originalActor.name;
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
// make sure the actor has the skill for Flying Leap, has taken the required maneuver, and has the skill ready (i.e., taken the modifier based on preparation time before the Leap)
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
GURPS.ModifierBucket.clear(update=true);
let flyingLeapModList = getFlyingLeapMods(originalModifiers);
restoreModBucket(flyingLeapModList);
let isLeapReady = false;
let attackNow = false;
let readyTaken = flyingLeapModList.length;
if (readyTaken > 0) isLeapReady = true;
if (useFlyingLeap == true && isLeapReady == true && maneuver == 'move_and_attack') {
    flyingLeapMsg += `<b>${actorName}</b> has the skill for <b>${flyingLeapTitle}</b> and it is ready.<br> `;
    flyingLeapMsg += `<br><b>${actorName}</b> is attempting a ${flyingLeapTitle} with <b>${AttackName}</b> using <b>${attackSkill}</b>, a Knockback multiplier of ${kbm} and attack damage [${attackDamageOtF}]`;// 
    if (useFollowOnAttackData == true || (followOn != undefined && followOn.length > 0)) {
        flyingLeapMsg += ` with follow-up ${followOn} if the attack hits`; 
    }
    flyingLeapMsg += `.<br>`;// 
    flyingLeapMsg += `<br>If <b>${actorName}</b> succeeds at ${flyingLeapTitle}, they can jump up to <b>${flJumpDistanceYards} hexes</b> (${flJumpDistanceFeet} feet) and strike with <b>ST ${totalST}</b>, resulting in [${dmgFinalOtF}] damage.<br>`;// 
    flyingLeapMsg += `<br>On a successful ${flyingLeapTitle}, the attack is at -2 penalty to hit. On a failed ${flyingLeapTitle}, do a regular Jump and attack with no extra damage.<br>`;
    flyingLeapMsg += `<br><b>Calculation</b>: ${totalSTMsg}<br>${attackModsMsg}.<br>`;
    console.log(flyingLeapMsg);
    attackNow = true;
} else {
    flyingLeapMsg += `<br>To use <b>${flyingLeapTitle}</b>, <b>${actorName}</b> must have the <b>skill (${useFlyingLeap}), 
    it must be ready (${isLeapReady}), and ${actorName} must take the <b>Move and Attack</b> maneuver (${maneuver.includes('move_and_attack')}).<br>`;
    attackNow = false;
}  

let OtF = ``;
// ready anim and Knockback
let flyingLeapOtF = ``;
let rdyFlyingLeapOtF = `${stdReadyAnimOtF}`;
// find the target(s) of the Leap
let targetID;
let targetToken;
let targetActor;
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	targetID = target.id;;
    targetToken = canvas.tokens.get(targetID);
    console.log(`targetID: ${targetID}`);
    targetActor = targetToken.actor;
}
let flJumpOtF = `/r [/:Jump jb2a.side_impact.part.shockwave.blue ${targetID} ${flJumpDistanceFeet} ${trapTagOpt}] \\\\!/wait 2000 `;
let stdJumpOtF = `/r [/:Jump jb2a.side_impact.part.shockwave.blue ${targetID} ${stdJumpDistanceFeet} ${trapTagOpt}] \\\\!/wait 2000 `;
let PrimaryCheck = `[S:${skFlyingLeap}]`; // alter the OtF type used for primary check
let SpellDamage = '';
let SpellDamageCrit = '';
// subtract CostMod from spell cost, or calculate SpellDamage cost reduction with +CostMod
let CostMod = 0;

// if Flying Leap succeeds, then attack gets -2 to hit and triple strength for damage and knockback
let SecondaryCheck = `[M:${AttackName}]`; // alter the OtF type used for secondary check
let flfSecondaryCheck = `[S:Jumping | DX]`; // Flying Leap Failed OtF for secondary check; use Jumping skill or DX at -5 penalty; ["Jumping"/if [S:Jumping | DX] /else [/Your Jump fails and you fall prone!]]
let jcsSecondaryCheck = `[M:${AttackName}]`; // on a crit Flying Leap success, you suffer no penalty on the attack check
let followOnOtF = '';
if (
    (useFollowOnAttackData == true 
    || (followOn != undefined && followOn.length > 0))
    && followOnSave == false
) {   
    followOnOtF = ` \\\\/r ${followOn} `; // follow-on attack OtF
    //let followOnAttack = followOnAttackData.find(attack => attack.attackName == AttackName);
}
/*let followOnOtFx = 	encodeURIComponent(followOnOtF);
let dmgFinalOtFx = encodeURIComponent(`[${dmgFinalOtF}]`);
let attackDamageOtFx = encodeURIComponent(`[${attackDamageOtF}]`);
*/
let knockbackOtF, flfKnockbackOtF, knockbackMsg = '';
if (useKnockback === true) {
	console.log(`AttackName: ${AttackName} is a crushing attack, so add Knockback!`);    
    knockbackOtF += `['Knockback'/:AfterAttackKnockback "${AttackName}" ${kbm} "${dmgFinalOtF}" "${trapTagOpt}"]`;
    flfKnockbackOtF += `['Normal Knockback'/:AfterAttackKnockback "${AttackName}" ${kbm} "${attackDamageOtF}" "${trapTagOpt}"]`;
    knockbackMsg = `<b>${actorName}</b> used a <b>crushing attack</b>. 
    If <b>${flyingLeapTitle}</b> succeeded and he hits his target and is not dodged, then send his foes flying with ${knockbackOtF}; 
    if <b>${flyingLeapTitle}</b> failed and he used Jump instead, then use ${flfKnockbackOtF}.
    If he rolled a critical hit, then use the Knockback link described in the Critical Hit message instead.<br>`;
} 
/* expander
    <details>
        <summary>Annoying parse error</summary>
        ${knockbackOtF}
    </details>
*/
let StrikeDamage = `/r [${dmgFinalOtF}]${followOnOtF}`; // strike damage OtF. If this penetrates DR, then apply SpellDamage
let flfStrikeDamage = `/r [${attackDamageOtF}]${followOnOtF}`; // if Flying Leap fails, then you still can jump but strike gets no ST bonus; use the original attack damage instead
let SpellName = ''; // spell name for spell damage (stub for future use)
let CritStrikeDamage = `/:CritHitCalcMelee "${AttackName}" ${kbm} "${dmgFinalOtF}" "${followOnOtF} "`; // macro reference for CritHit using critTable
let flfCritStrikeDamage = `/:CritHitCalcMelee "${AttackName}" ${kbm} "${attackDamageOtF}" "${followOnOtF} "`; // macro reference for CritHit using critTable
//let critTable = game.tables.getName('DataCritHit'); // critical hit rolltable
//let CritMiss = `/rolltable CritMiss`; // critical miss rolltable

// Flying Leap outcome formulas
let flsFormula = `/r [-2 to hit after Flying Leap success] \\\\Your ${flyingLeapTitle} succeeded. Your attack is at -2 penalty.`; // Flying Leap success formula 
let flcsFormula = `/r [+0 to hit after Flying Leap crit success]\\\\Your ${flyingLeapTitle} was flawless! You feel energized and your attack suffers no penalty.`; // Flying Leap critical success formula
let flfFormula =`/r [-5 to Jump after Flying Leap failure] \\\\Your ${flyingLeapTitle} failed. You Jump at -5 and do normal ST attack damage.`; // Flying Leap failure formula 
let flcfFormula =`/fp -1 \\\\Something went horribly wrong. You crit failed ${flyingLeapTitle}, so you fall down! Maneuver set to Change Posture and status set to prone. \\\\/man change posture \\\\/status on prone`; // Flying Leap critical failure formula
// attack outcome formulas: 
let flfasFormula = `${sanim} \\\\${flfStrikeDamage} ${SpellDamage}`; // FLF attack success formula 
let flfacsFormula = `${csanim} \\\\${flfCritStrikeDamage}${followOnOtF} ${SpellDamageCrit}`; // FLF attack success formula 
let jfFormula =`${cfanim} \\\\Your Jump fails and you fall prone! \\\\/man change posture \\\\/status on prone`; // Jump failure formula
let jcfFormula =`${cfanim} \\\\Your Jump fails in the worst way possible! You fall prone and drop your weapon! \\\\/man change posture \\\\/status on prone \\\\/status on disarmed`; // Jump crit failure formula
let asFormula = `${sanim} \\\\${StrikeDamage}${followOnOtF} ${SpellDamage}`; // attack success formula 
let acsFormula = `${csanim} \\\\${CritStrikeDamage}${followOnOtF} ${SpellDamageCrit}`; // attack critical success formula 
let afFormula =`${fanim} \\\\/fp +0 \\\\Your attack missed!`; // attack failure formula 
let acfFormula =`${cfanim} \\\\/fp -1 \\\\You crit failed your attack, so you drop your weapon! \\\\/status on disarmed`; // attack critical failure formula 
let attackFormulaOtF = `/if ${SecondaryCheck} s:{${asFormula}} cs:{${acsFormula}} f:{${afFormula}} cf:{${acfFormula}}`;
let flfAttackFormulaOtF = `/if ${SecondaryCheck} s:{${flfasFormula}} cs:{${flfacsFormula}} f:{${afFormula}} cf:{${acfFormula}}`;
let flfJumpFormulaOtF = `/if ${flfSecondaryCheck} s:{${flfAttackFormulaOtF}} cs:{${flfAttackFormulaOtF}} f:{${jfFormula}} cf:{${jcfFormula}}`;
// build Flying Leap attack OtF
flyingLeapOtF = `/r [/if ${PrimaryCheck} s:{${flsFormula} \\\\${flJumpOtF} \\\\${attackFormulaOtF}} cs:{${flcsFormula} \\\\${flJumpOtF} \\\\${attackFormulaOtF}} f:{${flfFormula} \\\\${stdJumpOtF} \\\\${flfJumpFormulaOtF}} cf:{${flcfFormula}}]`;
// execute Flying Leap attack
if (attackNow == true) {	
    console.log(flyingLeapOtF);
    await GURPS.executeOTF(flyingLeapOtF);
} 
await wait(5);
console.log(flyingLeapMsg);
let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">${flyingLeapTitle} Attack</span>
		</strong>
	</p>`;
chatDescription += ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
        ${flyingLeapMsg}
        ${advantageTableHTML}
        ${skillTableHTML}
        </span>
	</p>`;
console.log(chatDescription);
await ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });		
await wait(1);
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
    await ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });		
    await wait(1);
}

// end of Flying Leap attack
