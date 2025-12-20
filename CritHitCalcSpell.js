/* Usage: /:CritHitCalcSpell attack=<attackname> dmg=<attackDamageOtF> fon=<followOnOtF> kbm=<kbmultiplier> 
    Calculate critical hit attacks total and return the damage total
	-- <animation> <spellname>  <trap tags>

	<attackname> attack name to use
    <attackDamageOtF> /:CritHitCalcSpellMelee '[${dmgFinalOtF}]' '${followOnOtF}'
    <followOnOtF> /:CritHitCalcSpellMelee '[${attackDamageOtF}]' '${followOnOtF}'
	<kbmultiplier> knockback multiplier
	<animation> which animation set to use
	<spellname> spell name to use
	
*/

console.log(`---------------------- Start CritHitCalcSpell ----------------------`);

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

// OtF action setup:
let title = 'Fireball';
let dice = 4;
let adds = 1;
let type = 'burn';

if (scope !== undefined) {
  console.log(scope)
  title = scope.title ? scope.title : 'Fireball';
  dice = scope.dice ? parseFloat(scope.dice) : 1;
  adds = scope.adds ? parseInt(scope.adds) : 0;
  type = scope.type ? scope.type : 'dmg';
  console.log(`title:${title}; dice:${dice}; adds:${adds}; type:${type};`);
}

let attackDmgDice = dice;
let attackDmgBonus = adds;
let attackDmgType = type;
let originalActor = await GURPS.LastActor;
let originalModifiers = GURPS.ModifierBucket.modifiers;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);

// it's a critHit! Save the result and show the CritHit message
let rollCrit = new Roll("3d6", _token.actor.getRollData());
await rollCrit.roll();
game.dice3d.showForRoll(rollCrit); 
let rollMsg = `Actor rolled a CritHit: ${_token.actor.name} rolled ${rollCrit._formula} and got a ${rollCrit._total} !!!`;
console.log(rollMsg);
let critTable = game.tables.getName('DataCritHit')
let critResults = await critTable.getResultsForRoll(rollCrit._total > 1 ? rollCrit._total : 11);
console.log(`result: ${critResults[0].text}`);
let critResultsA = critResults[0].text.split('|');
let critMulti = Number(critResultsA[0]);
let critBonus = Number(critResultsA[1]);
console.log(`mult: ${critMulti}; bonus: ${critBonus};`);
let critMsgTable = game.tables.getName('CritHit')
let critMsgResults = critMsgTable.getResultsForRoll(rollCrit._total > 1 ? rollCrit._total : 11);
await critMsgTable.toMessage(critMsgResults);

let modSign = '+';
if (attackDmgBonus < 0) {
    modSign = '';
} else {
    modSign = '+';
} 

let dmgTotalOtF ='';
let maxDamage = 6*dice; // maximum damage for dice
let attackDamageTotal = (Number(maxDamage)+Number(attackDmgBonus))*Number(critMulti)+Number(critBonus);
let dmgFinalOtF = `${attackDmgDice}d${modSign}${attackDmgBonus} ${attackDmgType}`;
let dmgFormulaMsg = `Original damage formula was [${dmgFinalOtF}], resulting in Base CritHit Max Damage of ${dice}d6 = ${maxDamage} * Crit Multiplier ${critMulti}, from (${maxDamage}${modSign}${attackDmgBonus})*${critMulti}+${critBonus} for a grand total of <b>${attackDamageTotal} damage</b>!`
console.log(dmgFormulaMsg);
let dmgTotalFormula = `${attackDamageTotal} ${attackDmgType}`;
dmgTotalOtF = `[${dmgTotalFormula}]`;
console.log(`dmgTotalOtF: ${dmgTotalOtF}`);
GURPS.executeOTF(`/r ${dmgTotalOtF}`); 

//let gridDistance = game.scenes.current.grid.distance
let gridFeet = game.scenes.current.dimensions.distance
let targetID,targetToken,targetActor,targetName,critHitMsg,chatDescription;
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	targetID = target.id;
    targetToken = canvas.tokens.get(targetID);
    targetActor = targetToken.actor;
    targetName = targetActor.name;
    console.log(`targetID: ${targetID}`);
	critHitMsg = `<p><b>CritHit</b> calculation for this attack:</p>`;
	//console.log(`<p>${title} causes ${dice} ${adds} (${armorDivisor}) ${type}.<p> `);
	critHitMsg += `<p><b>${actorName}</b> does <b>${attackDamageTotal}</b> damage to <b>${targetName}</b></p>`;
	critHitMsg += `<p>${dmgFormulaMsg}</p>`;
	console.log(critHitMsg);
    chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Critical Hit</span>
		</strong>
	</p>`;
    chatDescription += ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
            ${critHitMsg}
            </span>
    </p>`;
    console.log(chatDescription);
    await ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });		
    await wait(1);
};

//console.log(`attackDamageTotal: ${attackDamageTotal};`);

console.log(`---------------------- End CritHitCalcSpell ----------------------`);