/* Usage: /:Fireball or /:Fireball
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro

 * Modifiers:
 * 	GURPS.gmod  /roll [-2 due to poor footing]
 * GURPS.ModifierBucket.currentSum()
 * let myActor = _token.actor
 * GURPS.findAttack(actor, sname, isMelee,isRanged)
  * GURPS.findAttack(_token.actor, 'Fireball', False, True)
*/
console.log('---------------------- Start Fireball ----------------------');

// OtF action setup:
let SpellTitle = 'Fireball'; //   Spell Name, i.e. [Sp:Fireball]
let SpellName ='Fireball'; //  Spell Name, i.e. [Sp:Fireball]
let RangedAttackName ='Fireball'; //  Ranged Attack Name, i.e. [R:Fireball]
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6'; // success animation 
let csanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim FireballExplosion*Orange c *0.2'; // critical success animation 
let fanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 -3'; // failure animation 
let cfanim = '!/anim FireballExplosion*Orange c *0.1 @self'; // critical failure animation 
let selfanim = '!/anim FireballExplosion*Orange c *0.1 @self'; // Held Spell animation when targeting self

// check for held spell cast (targeting self)
//let HeldSpell = false;
/*
if (game.user.targets.size === 1) {
	let Target = game.user.targets.values().next().value;
	if (Target.actor === _token.actor) {
		HeldSpell = true;
	}
}
*/
//let destTokens = Array.from(game.user.targets).map(t => t.actor);
let destTokens = Array.from(game.user.targets);
let srcToken = canvas.tokens.placeables.find(e => e.actor == GURPS.LastActor)
if (!srcToken) srcToken = canvas.tokens.controlled[0];

if (destTokens[0] == srcToken) { 
	sanim = selfanim;
	csanim = selfanim;
	fanim = selfanim;
} 

// check accuracy
let BaseModifier = GURPS.ModifierBucket.currentSum();
GURPS.ModifierBucket.clear(update=true);
let Accuracy = GURPS.findAttack(_token.actor, RangedAttackName, 0, 1).acc;
let Modifier = Number(BaseModifier)+Number(Accuracy);
if (isNaN(Modifier)||Modifier===0) {
	Modifier = '+0';
} else if (Modifier > 0) {
	Modifier = '+'+Modifier
}
let ModifierString = Modifier+' Modifier Bucket Applied';

// subract CostMod from spell cost, or calculate SpellDamage cost reduction with '+CostMod;
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

let PrimaryCheck = '[Sp:'+SpellName+']'; // alter the OtF type used for primary check
let SecondaryCheck = '[R:'+RangedAttackName+ModifierString+']'; // alter the OtF type used for secondary check
 
// outcome formulas:
let csformula ='/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true'; // critical success formula 
let cfformula ='/rolltable CritMiss'; // critical failure formula 
let sformula ='/:SpellDamage title=Fireball dice=1 adds=0 type=burn adjust='+CostMod+' crit=false'; //success formula
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
console.log('Modifier: '+Modifier)

let clickAttackOtF = `["${SpellTitle}"/r ${OtF}]`;
let clickAttackMsg = `
    <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">
            Ranged Spell Attack:<br /> ${clickAttackOtF}</span>
		</strong>
	</p>`;
console.log(`clickAttackOtF: ${clickAttackOtF}; clickAttackMsg: ${clickAttackMsg}`);

ChatMessage.create({
    content: clickAttackMsg, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });
console.log(`clickAttackMsg: ${clickAttackMsg}`);
console.log(`clickAttackOtF: ${clickAttackOtF}`);
GURPS.executeOTF(OtF);

console.log(`---------------------- End Fireball ----------------------`);
