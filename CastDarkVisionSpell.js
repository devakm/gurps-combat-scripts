// Usage: /:CastDarkVision

// set up the spell
let SpellTitle ='Dark Vision'; //  Spell Name, i.e. [Sp:Fireball]
let SpellName ='Dark*Vision'; //  Spell Name, i.e. [Sp:Fireball]
let energy = 5;
// animations; 
let sanim = '!/anim Marker_01_Regular_BlueYellow c *0.6'; // MarkerLightComplete_01_Regular_Blue02
let csanim = '!/anim Marker_01_Regular_BlueYellow c *0.8';// Marker_01_Regular_BlueYellow
let cfanim = '!/anim IconDrop_01_Regular_Red c *0.3 @self';// IconDrop_01_Regular_Red
let fanim = '!/anim Marker_01_Regular_Red c *0.4 @self'; //Marker_01_Regular_Red

// do the thing
let SpellSkill = Number(GURPS.findSkillSpell(_token.actor,SpellName,0,1).level)
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
let targetID,targetToken,targetActor,targetName,energyCost;
let targets = Array.from(game.user.targets); 
if (targets.length === 0) {
    ui.notifications.warn(`You must target a token to use this ability.`);
    //return;
} else {
    target = targets[0];
    targetID = target.id;
    targetToken = await canvas.tokens.get(targetID);
    targetActor = targetToken.actor;
    targetName = targetActor.name;
    console.log(`targetID: ${targetID}: targetToken: ${targetToken}: targetActor: ${targetActor}: targetName: ${targetName}`);
    await GURPS.SetLastActor(targetToken.actor);
    targetActor = await GURPS.LastActor;
    GURPS.SetLastActor(originalActor);
} 

// cast function
async function castDarkVision(source) {
	// subract CostMod from spell cost for high skill levels
	let CostMod = 0
	if (SpellSkill > 24) {
		CostMod = -3
	} else if (SpellSkill > 19) {
		CostMod = -2
	} else if (SpellSkill > 14) {
		CostMod = -1
	}

	// calculate energy cost
	energyCost = Number(energy)+Number(CostMod);
	let cost = `/fp -${energyCost}`;
	if (source === 'HP') cost = `/hp -${energyCost}`;
	if (source === 'EnergyReserve') cost = `/tr(EnergyReserve) -${energyCost}`;
	//let heal = energy*2;
	console.log(`${SpellTitle} source: ${source}; energy: ${energy}; energyCost: ${energyCost}; cost: ${cost}; `);
	let sformula = `/w gm ${actorName} casts ${SpellTitle} on ${targetName}. Click to apply it: ["Apply Dark Vision spell"/:DarkVisionSpell] \\\\${sanim} \\\\${cost} \\\\The spell consumed ${energyCost} from ${source}.`; // /hp ${heal} @target ${anim} \\\\${cost}
	let csformula = `/w gm ${actorName} casts ${SpellTitle} on ${targetName}. Click to apply it: ["Apply Dark Vision spell"/:DarkVisionSpell] \\\\${sanim} \\\\You crit on the spell cast. It consumes no energy.`; // /hp ${heal} @target ${anim} \\\\${cost}
	let cfformula = `/fp -${cost} \\\\${cfanim} \\\\${cost} \\\\Your spell goes horribly wrong. You lose ${cost} FP.`; // /hp ${heal} @target ${anim} \\\\${cost}
	let fformula = `/fp -1 \\\\${fanim} \\\\You fail to cast the spell and lose 1 FP.`; // /hp ${heal} @target ${anim} \\\\${cost}
	// final OtF formula
	let OtF = `[/if [Sp:${SpellName}] s:{${sformula}} cs:{${csformula}} f:{${fformula}} cf:{${cfformula}}]`; 
	
	console.log(OtF);
	GURPS.executeOTF(OtF); 
}
 
new Dialog({
 title: `${SpellTitle}`,
 content: `
<div style='padding: 4px;'>
 <label for="source">Source</label>
 <select id="source">
  <option value='FP'>FP</option>
  <option value='EnergyReserve'>Energy&nbsp;Reserve</option>
  <option value='HP' style='color: darkred;'>HP</option>
 </select>
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => castDarkVision(
      html.find('#source').val())
  }
 }
}).render(true)