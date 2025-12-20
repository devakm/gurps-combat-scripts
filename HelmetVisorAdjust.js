/* Usage: /:HelmetVisorAdjust
 *
 */

console.log(`---------------------- Start HelmetVisorAdjust ----------------------`);
let Title = 'Adjusting Visor';
let EffectMacroName = `HelmetVisorOpenClose`;
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
let EffectMacroOtF = `/w gm ${actorName} is ${Title}. Use [/:${EffectMacroName}]`;
console.log(EffectMacroOtF);
GURPS.executeOTF(EffectMacroOtF);
console.log(`---------------------- End HelmetVisorAdjust ----------------------`);