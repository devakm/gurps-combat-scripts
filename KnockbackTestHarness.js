[/if [Sp:Burning*Touch] 
	cs:{/if [M:Vic*Swung+0 Modifier Bucket Applied] {/r [D:Vic*Swung] \\/:SpellDamage BurningTouch 1 +2 burn -8 \\/rolltable CritHit }} 
	cf:{/hp -1d-3! \\/rolltable CritMiss} 
	s:{/if [M:Vic*Swung+0 Modifier Bucket Applied] 
		cs:{/r [D:Vic*Swung] \\/:SpellDamage BurningTouch 1 +2 burn -8 \\/rolltable CritHit }
		s:{/r [D:Vic*Swung] \\/:SpellDamage BurningTouch 1 0 burn -2}
		cf:{/hp -1d-3 \\/rolltable CritMiss}
		f:{fail}
	} 
	f:{fail} 
]

//-----------

<div>
  <div class="prefix">
      Rolling <span class="gurpslink" data-action="eyJvcmlnIjoiMmQrNCBjdXQgIiwidHlwZSI6ImRhbWFnZSIsImZvcm11bGEiOiIyZCs0IiwiZGFtYWdldHlwZSI6ImN1dCIsImV4dGRhbWFnZXR5cGUiOiIiLCJhY2N1bXVsYXRlIjpmYWxzZX0=" data-otf="2d+4 cut ">2d+4 cut</span> damage.
    
  </div>
    <div style="font-size:smaller;margin-left:.5rem"><i class="fas fa-bullseye"></i>&nbsp;Targeting Machiavellian Eorkh Blaze Assassin (1)
    </div>
  <div class="roll-message">
  </div>
  <div class="damage-chat-message">
      <div class="gurps damage-message" data-transfer="">

        <div class="roll-message">
          <div class="collapsible-wrapper">
            <input id="collapsible-v7cdlsp2hrjru3xw" class="toggle offscreen-only" type="checkbox">
            <label for="collapsible-v7cdlsp2hrjru3xw" class="roll-result label-toggle">
              <span> 
                  <i class="fas fa-dice"></i>
                <i class="fas fa-long-arrow-alt-right" style="color:dimgray"></i>
                <span class="roll-detail">
                    <span class="roll-value">12</span> points of damage.
                  </span>
              </span>
            </label>
              <div class="gga-group collapsible-content">
                <div class="content-inner">
                  <hr>
                    <div style="text-align:start" class="aside">Rolled (6,2) + 4 = 12.</div>
                </div>
              </div>
          </div>
        </div>

      </div>
      <div>
        <button class="apply-all" style="margin-top:0.25rem">Apply All to Machiavellian Eorkh Blaze Assassin (1)</button>
      </div>
  </div>
</div>



//--------------

<div>
  <div class="prefix">
      Rolling <span class="gurpslink" data-action="eyJvcmlnIjoiMmQrNCBjdXQgIiwidHlwZSI6ImRhbWFnZSIsImZvcm11bGEiOiIyZCs0IiwiZGFtYWdldHlwZSI6ImN1dCIsImV4dGRhbWFnZXR5cGUiOiIiLCJhY2N1bXVsYXRlIjpmYWxzZX0=" data-otf="2d+4 cut ">2d+4 cut</span> damage.
    
  </div>
    <div style="font-size:smaller;margin-left:.5rem"><i class="fas fa-bullseye"></i>&nbsp;Targeting Machiavellian Eorkh Blaze Assassin (1)
    </div>
  <div class="roll-message">
  </div>
  <div class="damage-chat-message">
      <div class="gurps damage-message" data-transfer="">

        <div class="roll-message">
          <div class="collapsible-wrapper">
            <input id="collapsible-v7cdlsp2hrjru3xw" class="toggle offscreen-only" type="checkbox">
            <label for="collapsible-v7cdlsp2hrjru3xw" class="roll-result label-toggle">
              <span> 
                  <i class="fas fa-dice"></i>
                <i class="fas fa-long-arrow-alt-right" style="color:dimgray"></i>
                <span class="roll-detail">
                    <span class="roll-value">12</span> points of damage.
                  </span>
              </span>
            </label>
              <div class="gga-group collapsible-content">
                <div class="content-inner">
                  <hr>
                    <div style="text-align:start" class="aside">Rolled (6,2) + 4 = 12.</div>
                </div>
              </div>
          </div>
        </div>

      </div>
      <div>
        <button class="apply-all" style="margin-top:0.25rem">Apply All to Machiavellian Eorkh Blaze Assassin (1)</button>
      </div>
  </div>
</div>

ui.notifications.info("This is an info message");
ui.notifications.warn("This is a warning message");
ui.notifications.error("This is an error message");

// outcome animations:         
/*
modules/jb2a_patreon/Library/Generic/Impact/GroundCrackImpact_02_Regular_Orange_600x600.webm
modules/jb2a_patreon/Library/Generic/Weapon_Attacks/Melee/Maul01_Fire_Regular_Orange_800x600.webm
modules/jb2a_patreon/Library/Generic/Unarmed_Attacks/Flurry_Of_Blows/FlurryOfBlows_01_Regular_Orange_Physical01_800x600.webm
modules/jb2a_patreon/Library/Generic/Unarmed_Attacks/Unarmed_Strike/UnarmedStrike_01_Regular_Orange_Physical02_800x600.webm
modules/jb2a_patreon/Library/Generic/Impact/Impact_04_Regular_Orange_400x400.webm
!/anim Impact_04_Regular_Orange c
modules/jb2a_patreon/Library/Generic/Impact/PartSideImpactShockwave01_01_Regular_Yellow_600x600.webm
modules/jb2a_patreon/Library/Generic/Liquid/LiquidSplashSide01_Regular_Red_600x600.webm
*/

//-----
// _source.content

// Add Rule of 16 modifier
//await GURPS.executeOTF("[+0 Rule of 16 *Max:15]")

GURPS.findAdDisad(GURPS.LastActor,'Perfect*Balance') ? true : false;
["Acrobatic Stand!"/if [S:Acrobatics-6] 
s:{"You leap up to standing posture!"} 
cs:{"You leap up to standing posture in such a fluid motion that you gain [+2 on your next action]!"} 
f:{"Your Acrobatic Stand failed. You end up in the sitting posture."} 
cf:{"You fall face-down!"}
]

let targetActor = await GURPS.LastActor
let chatDescription = `<p><b>Knockback</b> calculation for this attack.</p>`;
let scatterTable = game.tables.getName('Scatter')
let rollScatter = new Roll("1d6", targetActor.getRollData());
await rollScatter.roll();
await game.dice3d.showForRoll(rollScatter); 
let rollMsg = `Scatter direction: ${targetActor.data.name} rolled ${rollScatter._formula} and got a ${rollScatter.total}`;
console.log(rollMsg);
let scatterResults = scatterTable.getResultsForRoll(rollScatter.total > 1 ? rollScatter.total : 3);
let scatterDescription = scatterResults[0].data.text;
console.log(scatterDescription);
chatDescription += `<p>${rollMsg}</p> ${scatterDescription}`;
await ChatMessage.create({
  content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
{ chatBubble: false });

//-----------------------------

let AttackName ="Hum*Swing";
let attackData = GURPS.findAttack(_token.actor, AttackName, 1, 0); 
let attackDamageOtF = attackData.damage;
console.log(`attackDamageOtF: ${attackDamageOtF};`);
let originalModifiers = await GURPS.ModifierBucket.modifierStack.modifierList;
const originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: "${actorName}";`);
let ltrData = await GURPS.lastTargetedRolls[originalActor.id];
let critMulti,critBonus;
if (ltrData.isCritSuccess == true) {
	let rollCrit = new Roll("3d6", _token.actor.getRollData());
	await rollCrit.roll();
	game.dice3d.showForRoll(rollCrit); 
	let rollMsg = `Actor rolled a CritHit: ${_token.actor.name} rolled ${rollCrit._formula} and got a ${rollCrit.total} !!!`;
	console.log(rollMsg);
	let critTable = game.tables.getName('DataCritHit')
	let critResults = await critTable.getResultsForRoll(rollCrit.total > 1 ? rollCrit.total : 11);
	console.log(`result: ${critResults[0].text}`);
	const critResultsA = critResults[0].text.split('|');
	critMulti = Number(critResultsA[0]);
	critBonus = Number(critResultsA[1]);
	console.log(`mult: ${critMulti}; bonus: ${critBonus};`);
	let critMsgTable = game.tables.getName('CritHit')
	let critMsgResults = critMsgTable.getResultsForRoll(rollCrit.total > 1 ? rollCrit.total : 11);
	await critMsgTable.toMessage(critMsgResults);
}
let d = new Date();
let ts = d.getTime()-99999999;
console.log(`ts: "${ts}";`);
let messageList = game.messages.filter(i => 
	i.data.timestamp > ts 
	&& i.data.speaker.alias == actorName  
	&& i._roll != null
	&& i._roll._formula.includes("d6[Damage]") == true 
	&& i.data.content.includes(attackDamageOtF) == true
	); 
for (let message of messageList) {
    console.log(`time: ${message.data.timestamp} > ${ts} ; damage total: ${message._roll._total}`)};
let lastMessage;
messageList.forEach(message => { lastMessage = message }); // pick the latest message
let attackDamageTotal = lastMessage._roll._total; // damage roll total for regular success
if (ltrData.isCritSuccess == true) {
	let bonusDmg = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? attackDamageOtF.split(' ')[0].split('d')[1] : 0;
	let maxDamage = Number(lastMessage._roll.dice[0].faces)*Number(lastMessage._roll.dice[0].number);
	attackDamageTotal = Number(maxDamage)+Number(bonusDmg)*Number(critMulti)+Number(critBonus);
	console.log(`Base CritHit Max Damage: ${lastMessage._roll.dice[0].number}d${lastMessage._roll.dice[0].faces} = ${maxDamage} * Crit Multiplier ${critMulti} = ${maxDamage}+${bonusDmg}*${critMulti}+${critBonus} for a grand total of ${attackDamageTotal} damage!`);
};




let actorName = GURPS.LastActor.name;
console.log(`actorName: "${actorName}";`);
let AttackName ='Vic*Swung';
let attackData = GURPS.findAttack(_token.actor, AttackName, 1, 0); 
let attackDamageOtF = attackData.damage;
console.log(`attackDamageOtF: ${attackDamageOtF};`);
let mytime = new Date();
let mytimestamp = mytime.getTime()-99999999;
console.log(`mytimestamp: "${mytimestamp}";`);
let messageList = game.messages.filter(i => 
	i.data.timestamp > mytimestamp &&
	i.data.speaker.alias == actorName && 
	i._roll != null &&
	i._roll._formula.includes("d6[Damage]") == true 
	&& i.data.content.includes(attackDamageOtF) == true
	); 
for (let message of messageList) {
    console.log(`time: ${message.data.timestamp} > ${mytimestamp} ; damage total: ${message._roll._total}`)
};

let lastMessage;
messageList.forEach(message => { lastMessage = message });
let attackDamageTotal = lastMessage._roll._total;


let rollCrit = new Roll("3d6", _token.actor.getRollData());
await rollCrit.roll();
game.dice3d.showForRoll(rollCrit)
let rollMsg = `${_token.actor.name} rolled ${rollCrit._formula} and got a ${rollCrit.total} !!!`;
console.log(rollMsg);

let critTable = game.tables.getName('DataCritHit')
let critResults = critTable.getResultsForRoll(rollCrit.total > 1 ? rollCrit.total : 11);
console.log(`result: ${critResults[0].text}`);
const critResultsA = critResults[0].text.split('|');
console.log(`mult: ${critResultsA[0]}; bonus: ${critResultsA[1]};`);
let critMsgTable = game.tables.getName('CritHit')
let critMsgResults = critMsgTable.getResultsForRoll(rollCrit.total > 1 ? rollCrit.total : 11);
critMsgTable.toMessage(critMsgResults);


// find CritHit message
const originalActor = await GURPS.LastActor
let actorName = originalActor.name;
console.log(`actorName: "${actorName}";`);
let d = new Date();
let ts = d.getTime()-99999999;
console.log(`ts: "${ts}";`);
let messageList = game.messages.filter(i => 
	i.data.timestamp > ts &&
	i.data.speaker.alias == actorName 
	&& i.data.content.includes('CritHit') == true
	); 
for (let message of messageList) {
    console.log(`time: ${message.data.timestamp} > ${ts} ; actor: ${message.data.speaker.alias}`)
	record timestamp
};
	
const rdata = _token.actor.getRollData()
console.log('rolling against PER: '+rdata.attributes.PER.value);
const roll = new Roll("3d6ms@attributes.PER.value", _token.actor.getRollData());
await roll.roll();
game.dice3d.showForRoll(roll);
console.log(roll._total);


let lastactor = GURPS.LastActor;
let ltrData = GURPS.lastTargetedRolls[lastactor.id];
console.log(`check: [${ltrData.thing}], modified target: [${ltrData.finaltarget}], roll total: [${ltrData.rtotal}], margin of success: [${ltrData.margin}], individual dice rolls: [${ltrData.rolls}], Modifier based on margin: [${ltrData.otf}], action taken [${ltrData.chatthing}] followon: [${ltrData.followon}] `);


const rdata = _token.actor.getRollData()
rdata.attributes.PER.value

let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	//target.actorId
	let ltrData = GURPS.lastTargetedRolls[targets.data._id];
console.log(`check: [${ltrData.thing}], modified target: [${ltrData.finaltarget}], roll total: [${ltrData.rtotal}], margin of success: [${ltrData.margin}], individual dice rolls: [${ltrData.rolls}], Modifier based on margin: [${ltrData.otf}], action taken [${ltrData.chatthing}] followon: [${ltrData.followon}] `);
}


let myToken = '';
let ltrData = '';
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	let targetID = target.id;;
    myToken = canvas.tokens.get(targetID);
    console.log(`targetID: ${targetID}`);
	await GURPS.SetLastActor(myToken.actor)
	let targetST = GURPS.LastActor.data.data.attributes.ST.value;
	console.log(`targetID: [${targetID}], targetST: [${targetST}]`);

}

[4]._roll._formula


//targets[0].data._id
let targets = Array.from(game.user.targets); 
let ltrData = GURPS.lastTargetedRolls[targets[0].data._id];
console.log(`check: [${ltrData.thing}], modified target: [${ltrData.finaltarget}], roll total: [${ltrData.rtotal}], margin of success: [${ltrData.margin}], individual dice rolls: [${ltrData.rolls}], Modifier based on margin: [${ltrData.otf}], action taken [${ltrData.chatthing}] followon: [${ltrData.followon}] `);


 // for each token
 for (let token of selected) {
  // select the current token
  GURPS.SetLastActor(token.actor)

  // execute the Fright Check
  await GURPS.executeOTF(`[/if ![Fright Check] [/st + stun]]`)

  // reset the modifiers 
  for (let mod of modifiers) {
   GURPS.ModifierBucket.addModifier(mod.modint, mod.desc)
  }
 }
 
let myToken = '';
let ltrData = '';
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	let targetID = target.id;;
    myToken = canvas.tokens.get(targetID);
    console.log(`targetID: ${targetID}`);
	await GURPS.SetLastActor(myToken.actor)
	let targetST = GURPS.LastActor.data.data.attributes.ST.value;
	console.log(`targetID: [${targetID}], targetST: [${targetST}]`);

	ltrData = GURPS.lastTargetedRolls[myToken];
	//console.log(`check: [${ltrData.thing}], modified target: [${ltrData.finaltarget}], roll total: [${ltrData.rtotal}], margin of success: [${ltrData.margin}], individual dice rolls: [${ltrData.rolls}], Modifier based on margin: [${ltrData.otf}], action taken [${ltrData.chatthing}] followon: [${ltrData.followon}] `);
}



game.tables.getName("Reaction").draw()
const table = game.tables.getName("table_name");
const roll = new Roll("1d20 + @abilities.dex.mod", actor.getRollData());
table.draw({roll});
draw
await game.tables.getName("Reaction").draw();


async function check() {
 // Add Rule of 14 modifier
 await GURPS.executeOTF("[+0 Rule of 14 *Max:13]")

 // save the list of modifiers (including Rule of 14)
 let modifiers = GURPS.ModifierBucket.modifierStack.modifierList

 // get a list of all selected tokens
 let selected = canvas.tokens.controlled
 
 // save the original actor
 const originalActor = GURPS.LastActor

 // for each token
 for (let token of selected) {
  // select the current token
  GURPS.SetLastActor(token.actor)

  // execute the Fright Check
  await GURPS.executeOTF(`[/if ![Fright Check] [/st + stun]]`)

  // reset the modifiers 
  for (let mod of modifiers) {
   GURPS.ModifierBucket.addModifier(mod.modint, mod.desc)
  }
 }

 // clear the modifier bucket
 GURPS.ModifierBucket.clear()
 
 //restore last actor
 GURPS.SetLastActor(originalActor)
}

check()



/* Usage: /:ReactionAnimal
	Check to see if Actor has Animal Friend advantage, 
	give bonus for Animal Friend level,
	Check to see if Actor has Power Investiture (Druidic) advantage, 
	give bonus for Power Investiture (Druidic) level,
	
*/

let OtF = '';
let OtF2 = '';

let AdvantageName ='Power*Invest*Druidic'; //  name of the advantage to boost /:Reaction check
let AdvantageCostPerLevel = 10;
let AdvantagePoints = GURPS.findAdDisad(_token.actor,AdvantageName) ? Number(GURPS.findAdDisad(_token.actor,AdvantageName).points): 0;
console.log(`AdvantageName: ${AdvantageName}; AdvantagePoints: ${AdvantagePoints} `);

let useAdvantage = false;
if (AdvantagePoints > 0) {
	useAdvantage = true;
	console.log(`useAdvantage:${useAdvantage};`);
} else console.log(`AdvantagePoints for ${AdvantageName}; is 0 `);


let Modifier = 0;
if (useAdvantage) {
	Modifier =+ AdvantagePoints/AdvantageCostPerLevel;
	console.log(`Modifier:${Modifier};`);
	OtF = '[+'+Modifier+' Power Investiture (Druidic) bonus *Max:6]';
	console.log(OtF);
	GURPS.executeOTF(OtF);	

// look for other bonuses
} else console.log(`Advantage bonus skipped.`);

let AdvantageName2 ='Animal*Friend'; //  name of the advantage to boost /:Reaction check
let AdvantageCostPerLevel2 = 5;
let AdvantagePoints2 = GURPS.findAdDisad(_token.actor,AdvantageName2) ? Number(GURPS.findAdDisad(_token.actor,AdvantageName2).points): 0;
console.log(`AdvantageName2: ${AdvantageName2}; AdvantagePoints: ${AdvantagePoints2} `);

let useAdvantage2 = false;
if (AdvantagePoints2 > 0) {
	useAdvantage2 = true;
	console.log(`useAdvantage2:${useAdvantage2};`);
} else console.log(`AdvantagePoints2 for ${AdvantageName2}; is 0 `);


let Modifier2 = 0;
if (useAdvantage2) {
	Modifier2 =+ AdvantagePoints2/AdvantageCostPerLevel2;
	console.log(`Modifier2:${Modifier2};`);
	OtF2 = '[+'+Modifier2+' Animal Friend bonus *Max:6]';
	console.log(OtF2);
	GURPS.executeOTF(OtF2);	
} else console.log(`Advantage2 bonus skipped.`);


let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Animal Reaction modifiers</span>
		</strong>
	</p>`;

if ( useAdvantage ) {
	chatDescription = chatDescription + `
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<em>
				<span style="font-size:10.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
				${OtF}
				</span>
			</em>
		</strong>
	</p>`;
}

if ( useAdvantage2 ) {
	chatDescription = chatDescription + `
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<em>
				<span style="font-size:10.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
				${OtF2}
				</span>
			</em>
		</strong>
	</p>`;
}

if ( ! useAdvantage || ! useAdvantage2) {
	chatDescription = chatDescription + ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<em>
				<span style="font-size:12.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
				No modifiers from Animal Friend or Power Investiture (Druidic).
				</span>
			</em>
		</strong>
	</p>`;
}

 ChatMessage.create({
  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });



