// Usage: /:MajorHealing

async function majorHealing(energy, source) {
	let SpellTitle ='Major Healing'; //  Spell Name, i.e. [Sp:Fireball]
	let SpellName ='Major*Healing'; //  Spell Name, i.e. [Sp:Fireball]

	let sanim = '!/anim HealingAbility*Blue c *0.6';
	let csanim = '!/anim HealingAbility*Blue c *0.8';
	let cfanim = '!/anim IconDrop_01_Regular_Red c *0.3 @self';// modules/jb2a_patreon/Library/Generic/UI/IconDrop_01_Regular_Red_200x200.webm
	let fanim = '!/anim HealingAbility*Red c *0.4 @self';

	// subract CostMod from spell cost for high skill levels
	let SpellSkill = Number(GURPS.findSkillSpell(_token.actor,SpellName,0,1).level)
	let CostMod = 0
	if (SpellSkill > 29) {
		CostMod = -4
	} else if (SpellSkill > 24) {
		CostMod = -3
	} else if (SpellSkill > 19) {
		CostMod = -2
	} else if (SpellSkill > 14) {
		CostMod = -1
	}

	/* B424, High HP Healing
	High HP and Healing
The healing rates given for natural recovery, first aid, magical healing spells, the Regeneration advantage, etc. assume someone with human-scale Hit Points; that is, with fewer than 20 HP. 
Those with more HP heal in proportion to their HP score. 
Multiply HP healed by 2 at 20-29 HP, by 3 at 30-39 HP, by 4 at 40-49 HP, and so on, with each full 10 HP adding 1 to the multiple.
	2 at 20-29 HP
	3 at 30-39 HP
	4 at 40-49 HP
	*/
	let originalActor = await GURPS.LastActor;
	let actorName = originalActor.name;
	console.log(`actorName: ${actorName};`);
	let targetID,targetToken,targetActor,targetName,followOnMsg,chatDescription;
	let targets = Array.from(game.user.targets); 
	if (targets.length === 0) {
		ui.notifications.warn(`You must target a token to use this ability.`);
		return;
	}
	let target = targets[0];
	targetID = target.id;
	targetToken = await canvas.tokens.get(targetID);
	targetActor = targetToken.actor;
	targetName = targetActor.name;
	console.log(`targetID: ${targetID}: targetToken: ${targetToken}: targetActor: ${targetActor}: targetName: ${targetName}`);
	await GURPS.SetLastActor(targetToken.actor);
	targetActor = await GURPS.LastActor;
	targetST = targetActor.system.attributes.ST.value;
	targetMaxHP = targetActor.system.HP.max
	let hpMaxMult = Math.floor(targetMaxHP/10);
	console.log(`targetST: ${targetST}; targetMaxHP: ${targetMaxHP}; hpMaxMult: ${hpMaxMult};`);
	GURPS.SetLastActor(originalActor);

	// calculate energy cost
	let energyCost = Number(energy)+Number(CostMod);
	let cost = `/fp -${energyCost}`;
	if (source === 'HP') cost = `/hp -${energyCost}`;
	if (source === 'EnergyReserve') cost = `/tr(EnergyReserve) -${energyCost}`;
	//let heal = energy*2;
	let heal = energy*2;
	console.log(`base heal: ${heal}; energy: ${energy}; energyCost: ${energyCost}; cost: ${cost}; `);
	let critHeal = (energy*2)+energy;
	console.log(`base critHeal: ${critHeal};`);
	heal = hpMaxMult > 1 ? heal*(hpMaxMult) : heal;
	critHeal = hpMaxMult > 1 ? critHeal*(hpMaxMult) : critHeal;
	console.log(`heal adjusted for HP: ${heal}; critHeal: ${critHeal}; hpMaxMult: ${hpMaxMult};`);
	let sformula = `/w gm [/:HealSimple heal=+${heal}] \\\\${sanim} \\\\${cost} \\\\You heal target for ${heal} HP. The spell consumed ${energyCost} FP.`; // /hp ${heal} @target ${anim} \\\\${cost}
	let csformula = `/w gm [/:HealSimple heal=+${critHeal}] \\\\${sanim} \\\\You crit heal target for ${critHeal} HP. The heal consumes no energy.`; // /hp ${heal} @target ${anim} \\\\${cost}
	let cfformula = `/w gm [/:HarmSimple harm=-${energy}] \\\\/fp -${cost} \\\\${cfanim} \\\\${cost} \\\\Your spell goes horribly wrong. You lose ${energy} HP and ${cost} FP.`; // /hp ${heal} @target ${anim} \\\\${cost}
	let fformula = `/fp -1 \\\\${fanim} \\\\You fail to cast the spell and lose 1 FP.`; // /hp ${heal} @target ${anim} \\\\${cost}
	// final OtF formula
	let OtF = `[/if [Sp:${SpellName}] s:{${sformula}} cs:{${csformula}} f:{${fformula}} cf:{${cfformula}}]`; 
	
	console.log(OtF);
	let clickSpellOtF = `["${SpellTitle}"/r ${OtF}]`;
	let clickSpellMsg = `
		<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
			<strong>
				<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">
				Cast:<br /> ${clickSpellOtF}</span>
			</strong>
		</p>`;
	console.log(`clickSpellOtF: ${clickSpellOtF}; clickSpellMsg: ${clickSpellMsg}`);
	
	ChatMessage.create({
		content: clickSpellMsg, speaker: ChatMessage.getSpeaker(_token.actor)}, 
		{ chatBubble: false });
	
	GURPS.executeOTF(OtF); 
}
 
new Dialog({
 title: `Major Healing`,
 content: `
<div style='padding: 4px;'>
 <label for="energy">Energy</label>
 <input id="energy" type="text" />
</div>
<div style='padding: 4px;'>
 <label for="source">Source</label>
 <select id="source">
  <option value='FP'>FP</option>
  <option value='EnergyReserve'>Energy&nbsp;Reserve</option>
  <option value='HP' style='color: darkred;'>HP</option>
 </select>
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => majorHealing(
      parseInt(html.find('#energy').val()), 
      html.find('#source').val())
  }
 }
}).render(true)