// Usage: /:CastGlow

console.log(`---------------------- Start CastGlow ----------------------`);
function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 20000);
    });
  }

let Title = 'Glow';
let SpellName ='Glow';
let Cost = 0.5;
let animation = 'none';
let CastAnim = '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self \\\\!/anim MarkerLightOrbComplete_01_Regular_White c *0.2';
let EffectMacroName = `LightAreaEffect`;
let durationType = 'days';
let durationDice = 2; // days

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
let glowLumin = 0.1;

console.log(`SpellSkill: ${SpellSkill}; CostMod: ${CostMod};`);

function castSpell(source, rsize, glowType) {
    console.log(`source:${source}; glowType:${glowType}; `);
    if (glowType === 'Starlight') {
        Title = 'Glow (Starlight)';
        modTitle = 'Glow Starlight';
        Cost = 0.5 * rsize;
        glowLumin = 0.2;
    } else if (glowType === 'Moonlight') {
        Title = 'Glow (Moonlight)';
        modTitle = 'Glow Moonlight';
        Cost = 1 * rsize;
        glowLumin = 0.3;
    } else if (glowType === 'Torchlight') {
        Title = 'Glow (Torchlight)';
        modTitle = 'Glow Torchlight';
        Cost = 1.5 * rsize;
        glowLumin = 0.5;
    } else if (glowType === 'Daylight') {
        Title = 'Glow (Daylight)';
        modTitle = 'Glow Daylight';
        Cost = 2 * rsize;
        glowLumin = 0.75;
    }
    console.log(`Title:${Title}; modTitle:${modTitle}; Cost:${Cost};`);
    energy = Cost;// fixed cost for Glow
    if (CostMod < 0) {
        adjustedCost = Cost + CostMod;
        console.log(`adjustedCost:${adjustedCost}; CostMod:${CostMod}; energy:${energy};`);
    }
    console.log(`adjustedCost:${adjustedCost}; CostMod:${CostMod}; energy:${energy};`);
    if (adjustedCost < 0) adjustedCost = 0;
    console.log(`adjustedCost after zero check: ${adjustedCost};`);

    let costSource = `/FP -${adjustedCost}`;
    if (source === 'HP') costSource = `/HP -${adjustedCost}`;
    if (source === 'EnergyReserve') costSource = `/tr(EnergyReserve) -${adjustedCost}`;
    console.log(`costSource:${costSource};`);
    
    //let formula = `/r [+0 ${Title} *Costs ${costSource}] \\\\/r [${d}d ${type}]`;
    let formula = `/r [+0 ${modTitle} *Costs ${costSource}]`;
    console.log(formula);
    //GURPS.executeOTF(formula);


    // notify GM to apply effect on target
    EffectMacro = `/w gm ${actorName} casts ${Title} on ${targetName}: GM target ${targetName} and click to apply it: ["Apply ${modTitle} spell on target"/:${EffectMacroName} rsize=${rsize} lumin=${glowLumin} anim=${animation} dsize=1]`; // dsize=0 is default for Glow since the spell creates a uniform area of brightness
    let critDuration = durationDice*6;

    let sformula = `${CastAnim} \\\\${costSource} \\\\${EffectMacro} \\\\/${durationDice}d ${durationType}.`;
    let csformula = `${CastAnim} \\\\${EffectMacro} \\\\Critical Success! Duration: ${critDuration} ${durationType}`;
    let fformula = `${SpellName} ${Title} failed!`;
    let cfformula = `Your spell goes horribly wrong. You lose ${costSource} \\\\${costSource}`;
    let OtF = `[/if ${SpellCheck} s:{${sformula}} cs:{${csformula}} f:{${fformula}} cf:{${cfformula}} ]`;
    console.log(OtF);

    let chatDescription = `<b>Light Effect</b> for <b>${Title}</b> has a <b>${rsize}-hex radius</b>. </p>`;
    chatDescription += `<p><b>${Title}</b> has fixed cost of ${Cost}.</p>`;
    if (CostMod < 0) {
        chatDescription += `High skill ${SpellSkill} reduces the ${energy} energy cost by ${CostMod}`;
    } else {
        chatDescription += `Normal skill ${SpellSkill} does not reduce energy cost`;
    }
    chatDescription += `, giving a total of ${adjustedCost} energy cost using ${source} as the energy source.</p>`;
    console.log(chatDescription);
    
    ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });

    wait(9);
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
 <label for="glowType">Glow Type</label>
 <select id="glowType">
  <option value='Starlight'>Starlight *Cost 0.5</option>
  <option value='Moonlight'>Moonlight *Cost 1</option>
  <option value='Torchlight'>Torchlight *Cost 1.5</option>
  <option value='Daylight'>Daylight *Cost 2</option>
 </select>
</div>
<div style='padding: 4px;'>
 <label for="rsize">Spell Area Size</label>
 <select id="rsize">
  <option value='2'>2-hex radius</option>
  <option value='3'>3-hex radius</option>
  <option value='4'>4-hex radius</option>
  <option value='5'>5-hex radius</option>
  <option value='6'>6-hex radius</option>
 </select>
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => castSpell(
	  html.find('#source').val(),
      parseInt(html.find('#rsize').val()),
	  html.find('#glowType').val())
  }
 }
}).render(true)

console.log(`---------------------- End CastGlow ----------------------`);