/* Usage: /:WaterJet or /:WaterJet
 * copy this macro and rename it to match other spells, then reference it in an OtF like this: [/:spellname]
 * then fill in the values below to match the name of the spell, the ranged attack, the animations, and outcomes.
 * the example success formulas use the SpellDamage macro
*/
console.log('---------------------- Start WaterJet ----------------------');

// OtF action setup:
let SpellTitle = 'Water Jet'; //   Spell Name, i.e. [Sp:WaterJet]
let SpellName ='Water*Jet'; //  Spell Name, i.e. [Sp:WaterJet]
let AttackName ='Water*Jet'; //  Ranged Attack Name, i.e. [R:WaterJet]
let dice = 1; // number of dice in the spell damage formula
let adds = 0; // adds in the spell damage formula
let type = 'cr'; // type of damage in the spell damage formula

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim CastWater02_01_Regular_Blue c *0.6 @self \\\\!/wait 1500 \\\\!/anim LiquidSplashSide01_Regular_Blue *0.6 -0.2 +3 \\\\!/wait 500 \\\\!/anim ImpactWater02_01_Regular_Blue c *0.6'; // success animation 
let csanim = '!/anim CastWater02_01_Regular_Blue c *0.9 @self \\\\!/wait 1500 \\\\!/anim LiquidSplashSide01_Regular_Blue *0.8 -0.2 +3 \\\\!/wait 500 \\\\!/anim ImpactWater02_01_Regular_Blue c *0.9'; // critical success animation 
let fanim = '!/anim CastWater02_01_Regular_Blue c *0.3 @self \\\\!/wait 1500 \\\\!/anim LiquidSplashSide01_Regular_Blue *0.3 -0.2 +1'; // failure animation 
let cfanim = '!/anim ImpactWater02_01_Regular_Blue c *0.6 @self'; // critical failure animation 
// check accuracy

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
let SecondaryCheck = '[M:'+AttackName+']'; // alter the OtF type used for secondary check
 
// outcome formulas:
let csformula ='/:SpellDamage title=WaterJet dice=1 adds=+2 type=cr adjust=-8 crit=true'; // critical success formula 
let cfformula ='/rolltable CritMiss'; // critical failure formula 
let sformula ='/:SpellDamage title=WaterJet dice=1 adds=0 type=cr adjust='+CostMod+' crit=false'; //success formula
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
console.log(`clickAttackMsg: ${clickAttackMsg}`);
console.log(`clickAttackOtF: ${clickAttackOtF}`);
GURPS.executeOTF(OtF);

console.log(`---------------------- End WaterJet ----------------------`);
