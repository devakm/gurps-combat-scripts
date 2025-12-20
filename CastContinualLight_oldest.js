/* Usage: /:ContinualLight2Moonlight
 *
 */

console.log(`---------------------- Start Cast ContinualLight2Moonlight ----------------------`);

let SpellName ='Continual*Light';
let Title = 'Moonlight';
let Cost = '*Cost 2FP';
let SpellCheck = `[Sp:${SpellName}]`; // alter the OtF type used for primary check
let EffectMacro = '/w gm [/:ContinualLight2Moonlight';
let CastAnim = '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self';
let Setup = `/r [+0 ${Title} ${Cost}] \\\\${CastAnim} `;
GURPS.executeOTF(Setup);

let OtF = `[/if ${SpellCheck} s:{${EffectMacro}} f:{${SpellName} ${Title} failed} ]`;
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`---------------------- End Cast ContinualLight2Moonlight ----------------------`);

