/* Usage: /:CastLight
 *
 */

console.log(`---------------------- Start CastLight ----------------------`);

let SpellName ='Light';
let Title = 'Light';
let Cost = 2;
let rsize = 1;
let glowLumin = 0.3;

let CastAnim = '!/anim MarkerLightComplete_01_Regular_Blue02 c *0.3 @self \\\\!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self';

let SpellCheck = `[Sp:${SpellName}]`; // alter the OtF type used for primary check
let EffectMacroName = 'LightAreaEffect';
let EffectMacro = '';
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
let targetID,targetToken,targetActor,targetName,chatDescription;
let targets = Array.from(game.user.targets); 
let target = targets[0];
targetID = target.id;;
targetToken = await canvas.tokens.get(targetID);
targetActor = targetToken.actor;
targetName = targetActor.name;
console.log(`targetID: ${targetID}: targetToken: ${targetToken}: targetActor: ${targetActor}: targetName: ${targetName}`);

// notify GM to apply effect on target
EffectMacro = `/w gm ${actorName} casts ${Title} on ${targetName}: GM target ${targetName} and click to apply it: ["Apply ${Title} spell on target"/:${EffectMacroName} rsize=${rsize} lumin=${glowLumin}]`;
//EffectMacro = `/w gm ${actorName} casts ${Title} on [/sel ${targetName}] - use [/:${EffectMacroName} rsize=${rsize}]`;

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

//let OtF = `[/if ${SpellCheck} s:{${EffectMacro}} f:{${SpellName} ${Title} failed} ]`;
let OtF = `[/if ${SpellCheck} s:{${CastAnim} \\\\${EffectMacro}} f:{${SpellName} ${Title} failed} ]`;

console.log(OtF);
await GURPS.executeOTF(OtF);

console.log(`---------------------- End CastLight ----------------------`);

