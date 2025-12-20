/* Usage: /:ShieldLightMoonlight
 *
 */

console.log(`---------------------- Start ShieldLightMoonlight ----------------------`);
// config
let Title = 'Shield Light (Moonlight)';
let EffectMacro = '/li 3 1 360';//["Shield Light (Moonlight)"/li 3 1 360]
let CastAnim = '!/anim MarkerLightComplete_01_Regular_Blue02 c *0.3 @self \\\\!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self';

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
let OtF;
if (game.users.current.isGM) {
    OtF = `${EffectMacro}`;
    GURPS.executeOTF(CastAnim);
} else {
    GURPS.executeOTF(CastAnim);
    // notify GM to apply effect on target
    OtF = `/w gm ${actorName} casts ${Title} on ${targetName}: GM target ${targetName} and click to apply it: ["Apply ${Title} spell on target"/:ShieldLightMoonlight]`;
}
//EffectMacro = `/w gm ${actorName} casts ${Title} on [/sel ${targetName}] - use [/:${EffectMacro} rsize=${rsize}]`;

console.log(OtF);
await GURPS.executeOTF(OtF);

console.log(`---------------------- End ShieldLightMoonlight ----------------------`);

