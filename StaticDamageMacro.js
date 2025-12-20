// Usage: SpellDamage <title> <dice> <adds> <type> <adjust> <rsize>
//   Title - name to display on dialog
//   Dice - dice of damage per energy point; may be a fraction
//   Adds - modifier to each die of damage, zero if none
//   Type - Damage type (cr, cut, burn, etc...)
//   Adjust - Adjust the energy cost by this number
//	 Size - Radius of Spell Area in hexes
// Examples:
//   Fireball 1 1 burn 0 -- 1d+1 burn damage per energy point
//   Concussion 0.5 0 cr -1 -- 1d cr per 2 points of energy; reduce total cost by 1

console.log(args[0]);
let title = args[0][1];
let dice = parseFloat(args[0][2]);
let adds = args[0].length > 3 ? parseInt(args[0][3]) : 0;
let type = args[0].length > 4 ? args[0][4] : 'dmg';
let adjust = args[0].length > 5 ? parseInt(args[0][5]) : 0;
console.log(`title:${title}; dice:${dice}; adds:${adds}; type:${type}; adjust:${adjust};`);

function damage(energy, source, rsize) {
 console.log(`energy:${energy}; source:${source}; rsize:${rsize};`);


 
 let d = dice * energy;
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

}

new Dialog({
 title: title,
 content: `
<div style='padding: 4px;'>
 <label for="energy">Enter Your Resistance</label>
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