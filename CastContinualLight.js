// Usage: /:CastContinualLight

console.log(`---------------------- Start CastContinualLight ----------------------`);
function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 20000);
    });
  }

// config
let Title = 'Continual Light';
let SpellName ='Continual*Light';
let Cost = 2;
let CastAnim = '!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.3 @self \\\\!/anim MarkerLightOrbComplete_01_Regular_White c *0.6';
let EffectMacroName = 'LightAreaEffect';
let durationType = 'days';
let durationDice = 2; // days
let animation = 'sunburst';
let glowColor = '#21170d'; // light orange #f9c56c, darkOrange #21170d,

// setup
let SpellCheck = `[Sp:${SpellName}]`; // alter the OtF type used for primary check
let EffectMacro = '';
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
let targetID,targetToken,targetActor,targetName,followOnMsg,chatDescription;
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

function castSpell(source, clType) {
    console.log(`source:${source}; clType:${clType}; `);
    if (clType === 'Moonlight') {
        Title = 'Continual Light (Moonlight)';
        modTitle = 'CL Moonlight';
        Cost = 2;
        rsize = 1;
        glowLumin = 0.3;
    } else if (clType === 'Torchlight') {
        Title = 'Continual Light (Torchlight)';
        modTitle = 'CL Torchlight';
        Cost = 4;
        rsize = 2;
        glowLumin = 0.5;
    } else if (clType === 'Daylight') {
        Title = 'Continual Light (Daylight)';
        modTitle = 'CL Daylight';
        Cost = 6;
        rsize = 4;
        glowLumin = 0.75;
    }
    
    energy = Cost;// fixed cost for Continual Light
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

    // notify GM to apply effect on target
    EffectMacro = `/w gm ${actorName} casts ${Title} on ${targetName}: GM target ${targetName} and click to apply it: ["Apply ${modTitle} spell on target"/:${EffectMacroName} rsize=${rsize} lumin=${glowLumin} anim=${animation} color="${glowColor}"]`; // dsize=0 is default for Glow since the spell creates a uniform area of brightness

    let critDuration = durationDice*6;
    let sformula = `${CastAnim} \\\\${costSource} \\\\${EffectMacro} \\\\/${durationDice}d ${durationType}.`;
    let csformula = `${CastAnim} \\\\${EffectMacro} \\\\Critical Success! Duration: ${critDuration} ${durationType}`;
    let fformula = `${SpellName} ${Title} failed!`;
    let cfformula = `Your spell goes horribly wrong. You lose ${costSource} \\\\${costSource}`;
    let OtF = `[/if ${SpellCheck} s:{${sformula}} cs:{${csformula}} f:{${fformula}} cf:{${cfformula}} ]`;
    console.log(OtF);

    let chatDescription = `<b>Light Effect</b> for <b>${Title}</b> has a <b>${rsize}-hex radius</b>. </p>`;
    chatDescription += `<p><b>${Title}</b> has fixed cost of ${energy} energy.</p>`;
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
 <label for="clType">Spell Area Size</label>
 <select id="clType">
  <option value='Moonlight'>1-hex radius Moonlight *Cost 2</option>
  <option value='Torchlight'>2-hex radius Torchlight *Cost 4</option>
  <option value='Daylight'>4-hex radius Daylight *Cost 6</option>
 </select>
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => castSpell(
	  html.find('#source').val(),
	  html.find('#clType').val())
  }
 }
}).render(true)

console.log(`---------------------- End CastContinualLight ----------------------`);