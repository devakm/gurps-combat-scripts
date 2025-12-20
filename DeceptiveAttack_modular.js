/* Usage: /:DeceptiveAttack attack=<AttackName>
For example: ["Rapier Attack"/:DeceptiveAttack attack=Rapier*Thrust]
*/
console.log('---------------------- Start DeceptiveAttack ----------------------');

// OtF action setup: 
let AttackName ='Thrice*Swung'; //   Attack Name, i.e. [M:Rapier*Thrust]
let useHigherMinimumSkill = true; // optional user preference whether to use higher minimum skill level to choose Deceptive Attack or regular attack; change to false to use skip this check
let higherMinimumSkill = 16; // higher value minimum effective skill level to choose Deceptive Attack or regular attack

// check for argument defining the attack name

if (scope !== undefined) {
    console.log(scope)
    AttackName = scope.attack ? scope.attack : 'Rapier*Thrust';
}

let modifierList = GURPS.ModifierBucket.modifierStack.modifierList;
//Deceptive Attack setup [-2 to hit (Deceptive Attack)]
let daPenalty = -2;
let daDescription = 'to hit (Deceptive Attack)';
let daModsList = {}; // get the Deceptive Attack modifiers from ModifierBucket
let daModsSum = 0;
let effect = {};

// modifier bucket functions
function getDAMods(modifierList) {
	console.log(`in getDAMods(): `);
	logModBucket(modifierList);
	let modifiers = modifierList.filter(mod => 
		mod.desc.includes("Deceptive Attack") == true 
		|| mod.desc.includes("deceptive attack") == true
	);
	return modifiers;
}

function logModBucket(modifierList) {
	// log the modifiers
	console.log(`in logModBucket(): `);
	for (let mod of modifierList) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}

function getSumOfModint(modList) {
    return modList.reduce((sum, mod) => sum + mod.modint, 0);
}

function setActiveEffect(activeDefensePenalty, effectName) {
    // create a new effect
    effect = {
        icon: `systems/gurps/icons/statuses/BAD${activeDefensePenalty}.webp`,
        id: 'distraction',
        label: 'Distraction',
        changes: [
            {
            key: 'system.conditions.target.modifiers',
            value: `${activeDefensePenalty} ${effectName} #defense`,
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            },
        ],
        duration: {
            // If a non-zero duration, show the icon on the token.
            rounds: 1,
        },
    }

    let targetID;
    let targetToken;
    // toggle the effect for all targeted tokens
    let targets = Array.from(game.user.targets); 
    for(let target of targets){ 
        targetID = target.id;;
        targetToken = canvas.tokens.get(targetID);
        const existing = targetToken.actor.effects.contents.filter(e => e.name === effect.label)
        if (existing && existing.length) {
            console.log("★ delete effects")
            existing.forEach(async e => targetToken.actor.deleteEmbeddedDocuments('ActiveEffect', [e.id]))
        } else { 
            console.log("✪ create effects")
            targetToken.actor.createEmbeddedDocuments('ActiveEffect', [effect])
            console.log(`targetID: ${targetID}; modifier: ${activeDefensePenalty} ${effectName}; targetToken.actor.ActiveEffect: ${targetToken.actor.effects.contents}`);  
        }
    }
    doChat(activeDefensePenalty, daDescription, effect);
}

let activeDefensePenalty = 0;
// check if Deceptive Attack is already in ModifierBucket
async function doDeceptiveAttack(daPenalty, daDescription) {
    daModsList = getDAMods(modifierList); // get the Deceptive Attack modifiers from ModifierBucket
    daModsSum = getSumOfModint(daModsList);
    activeDefensePenalty = daModsSum < 0 ? daModsSum/2 : 0;

    console.log(`------------- attack penalty daModsSum: ${daModsSum}; activeDefensePenalty: ${activeDefensePenalty}`);
    if (daModsSum < 0) {
        // Deceptive Attack is already in ModifierBucket, so use it
    } else {
        // Deceptive Attack is not in ModifierBucket, so add it
        GURPS.ModifierBucket.addModifier(daPenalty, daDescription); // add the Deceptive Attack penalty to ModifierBucket
        daModsSum = daPenalty;
    }

    setActiveEffect(activeDefensePenalty, 'to defense (Deceptive Attack)');

    let daOtF = `/w gm Add penalty to defender if attack succeeds: [${activeDefensePenalty} to defense (Deceptive Attack)]`;
    await GURPS.executeOTF(daOtF);
    // add defender tagged modifier for Deceptive Attack
}

// usage: /:StatusDistraction effect=Distraction id=distraction description=Deceptive Attack penalty=-2 tag=#defense</span>;

async function doChat(activeDefensePenalty, daDescription, effect) {
    let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US"> Deceptive Attack: <br>
            ["Toggle Distraction"/:StatusDistraction effect=${effect.label} id=${effect.id} description="${daDescription}" penalty=${activeDefensePenalty} tag=#defense]
            </span>
		</strong>
	</p>`;
    console.log(chatDescription);
    sendDelayedMessage(chatDescription, 5000); // send a delayed message after 5 seconds
}

async function sendDelayedMessage(message, delay) {
    setTimeout(() => {
      ChatMessage.create({
        content: message, speaker: ChatMessage.getSpeaker(_token.actor)}, 
        { chatBubble: false });	
    }, delay);
}
  
let totalModifier = GURPS.ModifierBucket.currentSum();
console.log(`totalModifier: ${totalModifier}`);
// find the attack data for the attack name
let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0); 
if (attackData == undefined) {
	let errMsg = `${AttackName} not found on actor.`;
	ui.notifications.error(errMsg);
	console.log(`Error: ${errMsg}`);
} 
// get the skill level for the attack
let AttackSkill = attackData.level;
let ModifiedSkill = Number(AttackSkill)+Number(totalModifier);
console.log(`AttackSkill: ${AttackSkill}; totalModifier: ${totalModifier}; ModifiedSkill: ${ModifiedSkill}`);

let daModSum = getSumOfModint(getDAMods(modifierList));
let daModSkill = Number(AttackSkill)+Number(daModSum);
console.log(`Deceptive Attack Modifier picked in advance: ${daModSum}; useHigherMinimumSkill: ${useHigherMinimumSkill}; higherMinimumSkill: ${higherMinimumSkill}`);

// check minimum skill level for Deceptive Attack
// Deceptive Attack not allowed if your effective skill is not 12 or better after all other modifiers to your attack roll; 
// You cannot lower your effective skill to less than 10 using a Deceptive Attack.
if (useHigherMinimumSkill === true && ModifiedSkill >= higherMinimumSkill) {
	// safe to do Deceptive Attack at higher minimum skill level
    console.log(`safe to do Deceptive Attack: [${daPenalty} ${daDescription}] at standard minimum skill level`);
    console.log(`useHigherMinimumSkill: ${useHigherMinimumSkill}; higherMinimumSkill: ${higherMinimumSkill}`);
    doDeceptiveAttack(daPenalty, daDescription);
} else if (useHigherMinimumSkill === false && ModifiedSkill >= 12 && daModSum >= -2) {
    // standard minimum skill level for Deceptive Attack; Deceptive Attack modifier is already in ModifierBucket
    console.log(`safe to do Deceptive Attack: [${daPenalty} ${daDescription}] at standard minimum skill level`);
    doDeceptiveAttack(daPenalty, daDescription);
} else if (ModifiedSkill < 10) {
    let errMsg = `Deceptive Attack not allowed. Your effective skill must be 12 or better after all other modifiers to your attack roll.`;
    ui.notifications.error(errMsg);
    console.log(`Error: ${errMsg}`);
    console.log(`do normal attack`);
} else {
	// do normal attack
    console.log(`do normal attack`);
} 

console.log(`---------------------- End DeceptiveAttack ----------------------`);
