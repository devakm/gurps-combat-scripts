// Usage: /:ImprovedExplosiveFireball

console.log(`---------------------- Start ImprovedExplosiveFireball ----------------------`);

// OtF action setup:
let SpellTitle ='ImprovedExplosive Fireball'; //  Spell Name, i.e. [Sp:Fireball]
let SpellName ='Improved*Explosive*Fireball'; //  Spell Name, i.e. [Sp:Fireball]
let RangedAttackName ='Improved*Explosive*Fireball'; //  Ranged Attack Name, i.e. [R:Fireball]
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim FireballExplosion*Orange c *0.6'; // success animation 
let csanim = '!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim FireballExplosion*Orange c *0.9 \\\\!/anim FireballExplosion*Orange c *0.3'; // critical success animation 
let fanim = '!/anim FireBolt*Regular_Orange*15ft -0.3 -3'; // failure animation 
let cfanim = '!/anim FireballExplosion*Orange c *0.2 @self'; // critical failure animation 
let selfanim = '!/anim FireballExplosion*Orange c *0.1 @self'; // Held Spell animation when targeting self

// check for held spell cast (targeting self)
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
//let sformula ='/:SpellDamage ExplosiveFireball 0.5 0 burn '+CostMod;; //success formula // v9
let sformula ='/:SpellDamage title=ImprovedExplosiveFireball dice=0.34 adds=0 type=burn adjust='+CostMod+' crit=false'; //success formula /v12
//let csformula ='/:SpellDamage ExplosiveFireball 0.5 3 burn -8 \\\\/rolltable CritHit'; // critical success formula // v9
let csformula ='/:SpellDamage title=ImprovedExplosiveFireball dice=0.34 adds=0 type=burn adjust=-30 crit=true'; // critical success formula 
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let fformula ='/fp -1'; // failure formula 

let OtF = '[/if '+PrimaryCheck+' cs:{/if '+SecondaryCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+SecondaryCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
console.log(OtF);
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

GURPS.executeOTF(OtF);

console.log(`---------------------- End ImprovedExplosiveFireball ----------------------`);