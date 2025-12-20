/* Usage: /:DrinkHealingPotionMajor
 
 * ["Use Major Healing Potion"/:DrinkHealingPotionMajor]

*/

//setup
let ItemName ='Major Healing Potion'; //  Item Name, i.e. Healing Potion
let skFastDrawPotion = "Fast*Draw*Potion";
let useFastDrawPotion = await GURPS.findSkillSpell(_token.actor, skFastDrawPotion, true)  != undefined ? true : false;
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let conditions = originalActor.system.conditions;
let maneuver = conditions.maneuver
let originalManeuver = conditions.maneuver;
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
let isCombatStarted = game.combat !== null && game.combat.started;
let sanim = '!/anim HealingAbility*Blue c *0.6';
let csanim = '!/anim HealingAbility*Blue c *0.8';
let cfanim = '!/anim LiquidSplash01_Regular_Red c *0.2 @self';// dropped healing potion
let rdyanim = '!/anim EnergyStrandIN01_02_Regular_Yellow c *0.5 @self \\\\!/anim OutPulse_03_Circle_Fast_500 c *0.3 @self'; // modules/jb2a_patreon/Library/Generic/UI/EnergyStrandIN01_02_Regular_Yellow_200x200.webm
let fanim = rdyanim;
/* if in combat use quick-draw potion
 if out of combat you take your time
 Shatter_01_Red
 ThrowFlask02_01_Regular_Blue
 LiquidSplashSide01_Regular_Red
 LiquidSplashSide01_Regular_Blue
 LiquidSplashSide01_Regular_Green
 LiquidSplash01_Regular_Red
Fast-Draw DX/Easy Defaults: None.
This skill lets you quickly draw a particular kind of gear from a belt, sheath, or hiding place. 
A successful roll readies the item as a free action – you can use it on the same turn without a Ready maneuver! 
Failure forces you to use your turn for a Ready maneuver to draw it normally. 
Critical failure means you drop it.
*/

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

async function rollMajorHealingPotion() {
    let rollMHP = new Roll("2d6", _token.actor.getRollData());
    await rollMHP.roll();
    game.dice3d.showForRoll(rollMHP); 
    let rollMsg = `Actor rolled 2d: ${_token.actor.name} rolled ${rollMHP._Action} and got a ${rollMHP._total}`;
    console.log(rollMsg);
    await rollMHP.toMessage({
        rollMode: 'roll',
        speaker: ChatMessage.getSpeaker(_token.actor)
        });
    return rollMHP._total;
}

function getReadyState(stateModifiers) {
	console.log(`ACTIVE state before getReadyState: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getReadyState(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Potion Ready") == true 
	);
	return modifiers;
}

function logModBucket(modifiers) {
	// log the modifiers for orginalActor
	console.log(`in logModBucket(): `);
	for (let mod of modifiers) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}

// do it
let isTurnTaken = false;
let RemoveItem = `[/qty -1 ${ItemName}]`;
let AddItem =`[/qty +1 ${ItemName}]`;
let HealAmount = await rollMajorHealingPotion();
let skFastDrawPotionOtF = `[Sk:${skFastDrawPotion}]`;
let ActionCmd = `/w gm ["Heal Target for ${HealAmount}"/:HealSimple heal=+${HealAmount}] \\\\${sanim} \\\\You use a ${ItemName} on target for ${HealAmount} HP.`; // what the item does
let stdReadyPotionOtF = `/r [+0 Normal Potion Ready] \\\\${rdyanim} \\\\You Ready your ${ItemName} normally. You can use it next turn. Maneuver set to Ready. \\\\/man ready `;
let fdReadyPotionOtF = `/r [+0 Fast-Draw Potion Ready] \\\\${rdyanim} \\\\Your Fast-Draw Potion succeeded for ${ItemName}! You can drink it right away!`;
let OtF = '';
let sAction = ''; 
let csAction = sAction;
let cfAction = `/r ${RemoveItem} \\\\${cfanim} \\\\Your Fast-Draw goes horribly wrong. You drop your ${ItemName} and it shatters.`; // /hp ${heal} @target ${anim} \\\\${cost}
let fAction = `/fp -0 \\\\You fail to Fast-Draw your ${ItemName}. \\\\${stdReadyPotionOtF}`; // /hp ${heal} @target ${anim} \\\\${cost}
let outOfPotions = `/fp -0 \\\\You are out of ${ItemName}.`;
let isItemReady = false;
let readyTakenList = getReadyState(originalModifiers); 
let readyTaken = readyTakenList.length;
if (readyTaken > 0) isItemReady = true;
if (isItemReady == true || isCombatStarted == false) {
        OtF = `[/if ${RemoveItem} s:{${ActionCmd}} f:{${outOfPotions}}]`; 
        await GURPS.executeOTF(OtF);
        await GURPS.ModifierBucket.clear(update=true);
        isTurnTaken = true;
} else if (isItemReady == false && isCombatStarted == true) {
    if (useFastDrawPotion == true) {
        isTurnTaken = false;
        OtF = `[/if ${skFastDrawPotionOtF} s:{${fdReadyPotionOtF}} cs:{${fdReadyPotionOtF}} f:{${fAction}} cf:{${cfAction}}]`; 
    } else {
        isTurnTaken = true;
        OtF = stdReadyPotionOtF; 
    }
    await GURPS.executeOTF(OtF);
    await wait(5);
}

readyTakenList = getReadyState(GURPS.ModifierBucket.modifierStack.modifierList); 
readyTaken = readyTakenList.length;
isItemReady = readyTaken > 0 ? isItemReady = true : isItemReady = false;
if (isItemReady == true && isCombatStarted == true && isTurnTaken == false) {
    OtF = `[/if ${RemoveItem} s:{${ActionCmd}} f:{${outOfPotions}}]`; 
    isTurnTaken == true;
    await GURPS.executeOTF(OtF);
    await GURPS.ModifierBucket.clear(update=true);
} 

/*

[!/if [/qty -1 Major Healing Potion \\!/anim HealingAbility*Blue*webm c] {/if ! [/hp +2d @target] [/qty +1 Major Healing Potion]}]

[/if [/qty -1 Major Healing Potion \\!/anim HealingAbility*Blue c]] {/if ! [/hp +2d @target] [/qty +1 Major Healing Potion]}]

/if [ST] {You break down the door!} {Umph! Too hard}

[/if [/qty -1 Major Healing Potion \\!/anim HealingAbility*Blue c] {/if ! [/hp +2d @target] [/qty +1 Major Healing Potion]}]

*/