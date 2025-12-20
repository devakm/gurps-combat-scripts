/* Usage: /:Blink
 *
 */

console.log(`---------------------- Start Blink ----------------------`);

let SpellName ='Blink';
let Title = 'Blink';
let Cost = 2;

let CastAnim = '!/anim MistyStep_02_Regular_Purple* c *0.6 @self \\\\!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self';

let SpellCheck = `[Sp:${SpellName}]`; // alter the OtF type used for primary check

// subract CostMod from spell cost, or calculate SpellDamage cost reduction with '+CostMod;
let SpellSkill = Number(GURPS.findSkillSpell(_token.actor,SpellName,0,1).level);
console.log(`SpellSkill: ${SpellSkill}`);
let CostMod = 0;
if (SpellSkill > 29) {
	CostMod = -4;
} if (SpellSkill > 24) {
	CostMod = -3;
} else if (SpellSkill > 19) {
	CostMod = -2;
} else if (SpellSkill > 14) {
	CostMod = -1;
} 
if (CostMod < 0) {
    Cost = Number(Cost)+Number(CostMod);
}
let CostOtF = `*Cost ${Cost}FP`;
let Setup = `/r [+0 ${Title} ${CostOtF}] \\\\${CastAnim} `;
console.log(Setup);
await GURPS.executeOTF(Setup);

let OtF = `[/if ${SpellCheck} s:{${CastAnim}} f:{${SpellName} ${Title} failed} ]`;

console.log(OtF);
await GURPS.executeOTF(OtF);

console.log(`---------------------- End Blink ----------------------`);

