// Usage: SpellDamage title=<title> dice=<dice> adds=<adds> type=<type> adjust=<adjust> <rsize>
//   Title - name to display on dialog
//   Dice - dice of damage per energy point; may be a fraction
//   Adds - modifier to each die of damage, zero if none
//   Type - Damage type (cr, cut, burn, etc...)
//   Adjust - Adjust the energy cost by this number
//	 Size - Radius of Spell Area in hexes
// Examples:
//   Fireball 1 1 burn 0 -- 1d+1 burn damage per energy point
//   Concussion 0.5 0 cr -1 -- 1d cr per 2 points of energy; reduce total cost by 1

console.log('---------------------- Start SpellDamage ----------------------');
// OtF action setup:
let title = 'Fireball';
let dice = 0.5;
let adds = 1;
let type = 'dmg';
let adjust = 0;
let crit = false;

if (scope !== undefined) {
  console.log(scope)
  title = scope.title ? scope.title : 'Fireball';
  dice = scope.dice ? parseFloat(scope.dice) : 1;
  adds = scope.adds ? parseInt(scope.adds) : 0;
  type = scope.type ? scope.type : 'dmg';
  adjust = scope.adjust ? parseInt(scope.adjust) : 0;
  crit = scope.crit === 'true' ? true : false;
  console.log(`title:${title}; dice:${dice}; adds:${adds}; type:${type}; adjust:${adjust}; crit:${crit};`);
}

function damage(energy, source, rsize) {
  console.log(`energy:${energy}; source:${source}; rsize:${rsize};`);
  let costMod = Number(energy);
  if (Number(rsize) > 1) costMod = Number(energy)*Number(rsize); // calc cost for rsize > 1
  console.log(`costMod:${costMod};`);
  let adjustedCost = Number(costMod)+Number(adjust)
  console.log(`adjustedCost:${adjustedCost};`);
  if (adjustedCost < 0) adjustedCost = 0;
  console.log(`adjustedCost after zero check:${adjustedCost};`);
  let cost = `${adjustedCost}FP`;
  if (source === 'HP') cost = `${adjustedCost}HP`;
  if (source === 'EnergyReserve') cost = `${adjustedCost} tr(EnergyReserve)`;
  console.log(`cost:${cost};`);

  let d = Math.floor(dice * energy);
  let a = adds * energy;
  if (a === 0) a = ''
  else if (a > 0) a = `+${a}`;
  let formula = `[${d}d${a} ${type} *Costs ${cost}]`;
  console.log(formula);

  let chatDescription = `<b>SpellDamage</b> calculation for <b>${title}</b>:<p>Spell causes ${dice}d ${adds} ${type} `;
  chatDescription += `per 1 energy with ${adjust} cost adjustment for skill level.</p>`;
  chatDescription += `<p>With ${energy} energy invested, this attack does [${d}d${a} ${type}], `;
  chatDescription += `using ${source} as the energy source.</p>`;

  if (Number(rsize) === 1) { 
    chatDescription += `<p>Spell Area Radius ${rsize} does not increase spell cost.</p>`;
  } else if (Number(rsize) > 1) { 
    chatDescription += `<p>Spell Area Radius ${rsize} multiplies the base spell cost to ${cost}.</p>`;
  }
  chatDescription += `<p>The final calculated formula is ${formula}.</p>`;
  console.log(chatDescription);

  GURPS.executeOTF(`/r ` + formula);

  ChatMessage.create({
  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
  { chatBubble: false });

  let critOtF = ``;
  if (crit === true) {
    critOtF = `/:CritHitCalcSpell attack=${title} dice=${d} adds=${a} type=${type}`;
    console.log(`---------------- critOtF: ${critOtF}`);
    GURPS.executeOTF(critOtF);
  } else {
    console.log(`---------------- no critOtF`);
  }
}

new Dialog({
 title: title,
 content: `
<div style='padding: 4px;'>
 <label for="energy">Energy for Dmg Dice</label>
 <input id="energy" type="text" />
</div>
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
 <input id="rsize" type="text" />
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => damage(
      parseInt(html.find('#energy').val()), 
	  html.find('#source').val(),
	  parseInt(html.find('#rsize').val()))
  }
 }
}).render(true)

console.log('---------------------- End SpellDamage ----------------------');
