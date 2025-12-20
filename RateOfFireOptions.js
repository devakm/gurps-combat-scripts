/* Usage: /:RateOfFireOtions

*/

// OtF action setup:
//let SpellName ='Burning*Touch'; //  Spell Name, i.e. [Sp:Burning*Touch]
//let AttackName ='Vic*Swung'; //  Attack Name, i.e. [R:Burning*Touch]

console.log('args[0].length '+args[0].length+' : '+args[0]);
let AttackName = args[0].length > 0 ? args[0][1] : 'Punch';
let kbm = args[0].length > 1 ? parseInt(args[0][2]) : 1; //KB multiplier BXTraps01
let animSet = args[0].length > 2 ? args[0][3] : 'BlazingStab';
attackSkill = args[0].length > 3 ? args[0][4] : 'Brawling';
trapTagOpt = args[0].length > 4 ? args[0][5] : '';

/* test harness
let AttackName ='Hum*Swung';
let kbm = 2;
let animSet = 'MaulFire';
let trapTagOpt = 'BXTraps01';

let AttackName ='Hum*Swung';
let kbm = 3;
let animSet = 'MaulFire';
let trapTagOpt = 'BXTraps01';

"Hum*Swing" 3 MaulFire BXTraps01
*/

function getRateOfFireMods(stateModifiers) {
	console.log(`ACTIVE state before getRateOfFireMods: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getRateOfFireMods(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Flying Leap") == true 
	);
	return modifiers;
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

function logModBucket(modifiers) {
	// reset the modifiers for orginalActor
	console.log(`in logModBucket(): `);
	for (let mod of modifiers) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}

// OtF action setup:
//let RangedAttackName =`Vic*Shoot`; //   Attack Name, i.e. [R:Vic*Fey*Dagger*Swung], Vic*Deathbow*Shoot
let attackName = "Auto*Rifle";
let attackTitle ='Auto Rifle, 7.62mm';
let attackRoF = GURPS.findAttack(_token.actor, attackName, 0, 1).rof;
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
GURPS.ModifierBucket.clear(update=true);
let flyingLeapModifiers = getRateOfFireMods(originalModifiers);
restoreModBucket(flyingLeapModifiers);
let attackNow = false;
let stdReadyAnimOtF = `!/anim EnergyStrandIN01_02_Regular_Yellow c *0.5 @self \\\\!/anim OutPulse_03_Circle_Fast_500 c *0.3 @self`;
let attackOtF = ``;

new Dialog({
        title: attackTitle,
        content: `
       <div style='padding: 4px;'>
        <label for="modifier">Modifier options based on delay and effort</label>
        <select id="modifier">
            <option value='[-10 Instant Flying Leap *Cost 1FP]'>[-10 Instant Flying Leap *Cost 1FP]</option>
            <option value='[-5 Flying Leap (1-Turn) *Cost 1FP]'>[-5 Flying Leap (1-Turn) *Cost 1FP]</option>
            <option value='[-4 Flying Leap (2-Turn) *Cost 1FP]'>[-4 Flying Leap (2-Turn) *Cost 1FP]</option>
            <option value='[-3 Flying Leap (3-Turn) *Cost 1FP]'>[-3 Flying Leap (3-Turn) *Cost 1FP]</option>
            <option value='[-2 Flying Leap (4-Turn) *Cost 1FP]'>[-2 Flying Leap (4-Turn) *Cost 1FP]</option>
            <option value='[-1 Flying Leap (5-Turn) *Cost 1FP]'>[-1 Flying Leap (5-Turn) *Cost 1FP]</option>
            <option value='[-6 Instant Flying Leap EX *Costs 2 FP]'>[-6 Instant Flying Leap EX *Costs 2 FP]</option>
            <option value='[-1 Flying Leap EX (1-Turn) *Costs 2 FP]'>[-1 Flying Leap EX (1-Turn) *Costs 2 FP]</option>
            <option value='[+0 Flying Leap EX (2-Turn) *Costs 2 FP]'>[+0 Flying Leap EX (2-Turn) *Costs 2 FP]</option>
        </select>
       </div>
       `,
        buttons: {
         confirm: {
          label: "Confirm",
          callback: async (html) => setModifier(
             html.find('#modifier').val()
             ),
         }
        }
       }).render(true)


async function setModifier(modifier) {
    attackOtF += `/r ${modifier} \\\\${stdReadyAnimOtF} \\\\You took a Flying Leap!`;
    attackOtF += `\\\\/:FlyingLeapExecute ${AttackName} ${kbm} ${animSet} ${attackSkill} ${trapTagOpt}`;
    console.log(attackOtF);
    await GURPS.executeOTF(attackOtF);
}
