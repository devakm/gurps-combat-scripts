// Usage: /:WallOfFire
// Ranged Attack always gets +4 Accuracy for aiming at the ground
// OtF action setup:
let SpellTitle ='Wall of Fire'; //  Spell Name, i.e. [Sp:Fireball]
let SpellName ='Wall*Fire'; //  Spell Name, i.e. [Sp:Fireball]
let RangedAttackName ='Wall*Fire'; //  Ranged Attack Name, i.e. [R:Fireball]

let BaseModifier = GURPS.ModifierBucket.currentSum();
GURPS.ModifierBucket.clear(update=true);
let Accuracy = GURPS.findAttack(_token.actor, RangedAttackName, 0, 1).acc;
let Modifier = Number(BaseModifier)+Number(Accuracy)+4;
if (isNaN(Modifier)||Modifier===0) {
	Modifier = '+0';
} else if (Modifier > 0) {
	Modifier = '+'+Modifier
}
let ModifierString = Modifier+' Modifier Bucket Applied';

// subract CostMod from spell cost, or calculate SpellDamage cost reduction with '+CostMod;
let SpellSkill = Number(GURPS.findSkillSpell(_token.actor,SpellName,0,1).level)
let CostMod = 0
if (SpellSkill > 19) {
	CostMod = -2
} else if (SpellSkill > 14) {
	CostMod = -1
} 

let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[R:'+RangedAttackName+ModifierString+']'; // alter the OtF type used for secondary check

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim FireballExplosion*Orange c *0.3'; // success animation 
let csanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim FireballExplosion*Orange c *0.5 \\\\!/anim FireballExplosion*Orange c *0.3'; // critical success animation 
let fanim = '!/anim FireBolt*Regular_Orange*15ft -0.3 -3'; // failure animation 
let cfanim = '!/anim FireballExplosion*Orange c *0.2 @self'; // critical failure animation 
// outcome formulas:
let csformula ='/:SpellDamage WallOfFire 0.5 3 burn -8 3 \\\\/rolltable CritHit'; // critical success formula 
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let sformula ='/:SpellDamage WallOfFire 0.5 0 burn '+CostMod+' 1'; //success formula 
let fformula ='/fp -1'; // failure formula 
// outcome formulas:
let csformula =`/:SpellDamage title=${SpellTitle} dice=0.5 adds=3 type=burn adjust-16 \\\\/rolltable CritHit`; // critical success formula 
let sformula =`/:SpellDamage title=${SpellTitle} dice=0.5 adds=-0.5 type=burn adjust=${CostMod}`;// success formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
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

//GURPS.executeOTF(OtF); }