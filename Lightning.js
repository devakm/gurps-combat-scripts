/* Usage: /:Lightning
make a HT roll, at -1 per 2 HP
suffered, or be physically stunned.
*/
console.log('---------------------- Start Lightning ----------------------');
// OtF action setup:
let SpellTitle ='Lightning'; //  Spell Name, i.e. [Sp:Lightning]
let SpellName ='Lightning'; //  Spell Name, i.e. [Sp:Lightning]
let RangedAttackName ='Lightning'; //  Ranged Attack Name, i.e. [R:Lightning]
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations: ChainLightning_01_Regular_Blue02_30ft_Primary_1600x400.webm
let sanim = '!/anim ChainLightning*Regular_Blue*15ft*Secondary -0.2 +0.7'; // success animation 
let csanim = '!/anim ChainLightning*Regular_Blue*15ft*Primary -0.2 +0.7 \\\\!/wait 1000 \\\\!/anim LightningBall*Regular_Blue c *0.5'; // critical success animation 
let fanim = '!/anim ChainLightning*Regular_Blue*15ft*Secondary -0.2 -3'; // failure animation 
let cfanim = '!/anim LightningBall*Regular_Blue c *0.5 @self'; // critical failure animation 
let selfanim = '!/anim LightningBall*Regular_Blue c *0.2 @self'; // Held Spell animation when targeting self

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

let PrimaryCheck = `[Sp:${SpellName}]`; // alter the OtF type used for primary check
let SecondaryCheck = `[R:${RangedAttackName+ModifierString}]`; // alter the OtF type used for secondary check

// outcome formulas:
//let sformula ='/:SpellDamage Lightning 1 -1 burn '+CostMod; //success formula v9
let sformula =`/:SpellDamage title=Lightning dice=1 adds=-1 type=burn adjust=${CostMod} crit=false`; //success formula v12
//let csformula ='/:SpellDamage Lightning 1 +1 burn -8 \\\\/rolltable CritHit'; // critical success formula v9
let csformula ='/:SpellDamage title=Lightning dice=1 adds=+1 type=burn adjust=-8 crit=true'; // critical success formula v12
let cfformula ='/hp -1d-3! \\\\/rolltable CritMiss'; // critical failure formula 
let fformula ='/fp -1'; // failure formula 

let OtF = `[/if ${PrimaryCheck} cs:{/if ${SecondaryCheck} {${csanim} \\\\${csformula} }} cf:{${cfanim} \\\\${cfformula}} s:{/if ${SecondaryCheck} cs:{${csanim} \\\\${csformula} } s:{${sanim} \\\\${sformula}} cf:{${cfanim} \\\\${cfformula}} f:{${fanim} \\\\${fformula}}} f:{${fanim} \\\\${fformula}} ]`; 
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

GURPS.executeOTF(OtF);

console.log(`---------------------- End Lightning ----------------------`);