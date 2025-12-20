// Usage: /:CastNightVision

console.log(`---------------------- Start CastNightVision ----------------------`);

// set up the spell
let SpellTitle ='Night Vision'; //  Spell Name, i.e. [Sp:Fireball]
let SpellName ='Night*Vision'; //  Spell Name, i.e. [Sp:Fireball]
let energy = 3;
let sanim = '!/anim Marker_01_Regular_BlueYellow c *0.6'; //MarkerLightComplete_01_Regular_Blue02
let csanim = '!/anim Marker_01_Regular_BlueYellow c *0.8';// Marker_01_Regular_BlueYellow
let cfanim = '!/anim IconDrop_01_Regular_Red c *0.3 @self';// IconDrop_01_Regular_Red_200x200.webm
let fanim = '!/anim Marker_01_Regular_Red c *0.4 @self'; //Marker_01_Regular_Red

// do the thing
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let actor = token.actor;
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
console.log(`actorName: ${actorName};`);
//let SpellSkill = Number(GURPS.findSkillSpell(_token.actor,SpellName,0,1).level)
let SpellSkill = GURPS.findSkillSpell(actor,SpellName,0,1) ? Number(GURPS.findSkillSpell(actor,SpellName,0,1).level) : 0;
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
async function castNightVision(source) {
	// subract CostMod from spell energyCost for high skill levels
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
	let costSource = `/fp -${energyCost}`;
	if (source === 'HP') costSource = `/hp -${energyCost}`;
	if (source === 'EnergyReserve') costSource = `/tr(EnergyReserve) -${energyCost}`;
	console.log(`${SpellTitle} source: ${source}; energy: ${energy}; energyCost: ${energyCost}; costSource: ${costSource}; `);
	let sformula = `/w gm ${actorName} casts ${SpellTitle} on ${targetName}. Click to apply it: ["Apply Night Vision spell"/:NightVisionSpell] \\\\${sanim} \\\\${costSource} \\\\The spell consumed ${energyCost} from ${source}.`; 
	let csformula = `/w gm ${actorName} casts ${SpellTitle} on ${targetName}. Click to apply it: ["Apply Night Vision spell"/:NightVisionSpell] \\\\${sanim} \\\\You crit on the spell cast. It consumes no energy.`; 
	let cfformula = `/fp -${energyCost} \\\\${cfanim} \\\\Your spell goes horribly wrong. You lose ${energyCost} FP.`; 
	let fformula = `/fp -1 \\\\${fanim} \\\\You fail to cast the spell and lose 1 FP.`; 
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
  <option value='HP' style='color: Nightred;'>HP</option>
 </select>
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => castNightVision(
      html.find('#source').val())
  }
 }
}).render(true)

console.log(`---------------------- End CastNightVision ----------------------`);