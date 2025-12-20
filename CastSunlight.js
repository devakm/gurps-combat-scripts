// Usage: /:CastSunlight

console.log(`---------------------- Start CastSunlight ----------------------`);
function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 20000);
    });
  }

let Title = 'Sunlight';
let SpellName ='Sunlight';
let Cost = 2;
let animation = 'sunburst';
let glowColor = '#21170d'; // light orange #f9c56c, darkOrange #21170d,
let CastAnim = '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self \\\\!/anim MarkerLightOrbComplete_01_Regular_White c *0.2';
let EffectMacroName = `LightAreaEffect`;

// setup
let SpellCheck = `[Sp:${SpellName}]`; // alter the OtF type used for primary check
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

// subract CostMod from spell cost, or calculate SpellcastSpell cost reduction with '+CostMod;
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

let energy = 0;
let adjustedCost = 0;
let modTitle = '';
let glowLumin = 1.0;

async function castSpell(source, rsize) {
    console.log(`source:${source}; rsize:${rsize};`);

    energy = Number(rsize)*Number(Cost);// calc cost for rsize
    if (CostMod < 0) {
        adjustedCost = energy+Number(CostMod);
    }
    console.log(`adjustedCost:${adjustedCost}; CostMod:${CostMod}; energy:${energy};`);
    if (adjustedCost < 0) adjustedCost = 0;
    console.log(`adjustedCost after zero check: ${adjustedCost};`);

    let costSource = `/FP -${adjustedCost}`;
    if (source === 'HP') costSource = `/HP -${adjustedCost}`;
    if (source === 'EnergyReserve') costSource = `/tr(EnergyReserve) -${adjustedCost}`;
    console.log(`costSource:${costSource};`);

    let formula = `/r [+0 ${Title} *Costs ${costSource}]`;
    console.log(formula);
    //GURPS.executeOTF(formula);


    // notify GM to apply effect on target
    EffectMacro = `/w gm ${actorName} casts ${Title} on ${targetName}: GM target ${targetName} and click to apply it: ["Apply ${Title} spell on target"/:${EffectMacroName} rsize=${rsize} lumin=${glowLumin} anim=${animation} color="${glowColor}"]`; // dsize=0 is default for Glow since the spell creates a uniform area of brightness

    let sformula = `${CastAnim} \\\\${costSource} \\\\${EffectMacro}`;
    let csformula = `${CastAnim} \\\\${EffectMacro} \\\\Critical Success! Spell consumes no energy.`;
    let fformula = `${SpellName} ${Title} failed!`;
    let cfformula = `Your spell goes horribly wrong. You lose ${costSource} \\\\${costSource}`;
    let OtF = `[/if ${SpellCheck} s:{${sformula}} cs:{${csformula}} f:{${fformula}} cf:{${cfformula}} ]`;
    console.log(OtF);

    let chatDescription = `<b>Area Effect</b> for <b>${Title}</b> with a <b>${rsize}-hex radius</b>. </p>`;
    chatDescription += `<p><b>${Title}</b> costs ${Cost} per hex of radius.</p>`;
    if (Number(rsize) === 1) { 
        chatDescription += `<p>Spell Area Radius ${rsize} does not increase base spell cost.</p>`;
    } else if (Number(rsize) > 1) { 
        chatDescription += `<p>Spell Area Radius ${rsize} multiplies the base spell cost to ${energy}.</p>`;
    }
    if (CostMod < 0) {
        chatDescription += `High skill ${SpellSkill} reduces the ${energy} energy cost by ${CostMod}`;
    } else {
        chatDescription += `Normal skill ${SpellSkill} does not reduce energy cost`;
    }
    chatDescription += `, giving a total of ${adjustedCost} energy cost using ${source} as the energy source.</p>`;
    chatDescription += `<p>The final calculated formula is ${formula}.</p>`;
    console.log(chatDescription);
    
    ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });

    GURPS.executeOTF(OtF);
}

new Dialog({
 title: Title,
 content: `
<div style='padding: 4px;'>
 <label for="source">Energy Source</label>
 <select id="source">
  <option value='FP'>FP</option>
  <option value='EnergyReserve'>Energy&nbsp;Reserve</option>
  <option value='HP' style='color: darkred;'>HP</option>
 </select>
</div>
<div style='padding: 4px;'>
 <label for="rsize">Spell Area Size</label>
 <select id="rsize">
  <option value='1'>1-hex radius *Cost 2</option>
  <option value='2'>2-hex radius *Cost 4</option>
  <option value='3'>3-hex radius *Cost 6</option>
  <option value='4'>4-hex radius *Cost 8</option>
  <option value='5'>5-hex radius *Cost 10</option>
  <option value='6'>6-hex radius *Cost 12</option>
 </select>
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => castSpell(
	  html.find('#source').val(),
	  parseInt(html.find('#rsize').val()))
  }
 }
}).render(true)

console.log(`---------------------- End CastSunlight ----------------------`);