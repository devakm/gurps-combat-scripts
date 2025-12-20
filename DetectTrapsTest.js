(function anonymous({speaker, actor, token, character, args, scene}={}
) {
return (async () => {
			/* Usage: DetectTraps
   Lets you auto-detect a trap; doesn't yet consider active searching
   Defauls are DX and Jumping
   Basic formula concept
   ["Evade Deadly "Spike Trap" DX-8"/r [DX-8] {"You Evade!"} {[2d tox]}]
   
	Difficulty Examples:
	Evade Crude "Spike Trap" DX+2
	["Evade Basic "Spike Trap" DX
	["Evade Devious "Spike Trap" DX-4
	["Evade Vicious "Spike Trap" DX-6
	["Evade Deadly "Spike Trap" DX-8"/DX-8 You Evade! /else [3d+3 (2) pi++]]
   
 Usage: EvadeTrap <title> <dice> <adds> <type> <rsize> <attribute> <difficulty> <skill> <divisor>
   Title - name to display on dialog
   Dice - dice of damage per energy point; may be a fraction
   Adds - modifier to each die of damage, zero if none
   Type - Damage type (cr, cut, burn, etc...)
   Divisor / Radius - Reduce DR by (x) or spread to Radius hexes
   Attribute - DX, ST, DX, IQ, Will, etc
   Difficulty Modifier
   Skill - Skill name Precheck to evade, i.e. Acrobatics
  
 Examples:
   -- 1d+9 imp 3-hex radius, Evade using DX-6, difficulty modifier
   /:EvadeTrap "Spike Trap" 1d 9 imp 3 DX -6 Acrobatics

   /:EvadeTrap "Pitfall Trap" 3d 6 pi++ 2 DX -6 Jumping

   -- 3d (2) pi++ damage, Evade using DX-2, difficulty modifier
   /:EvadeTrap "Pitfall Trap" 3d 3 pi++ 2 DX -2 Acrobatics
   
  Sample animations:
  modules/jb2a_patreon/Library/Generic/Healing/HealingAbility_01_Blue_400x400.webm
  modules/jb2a_patreon/Library/Generic/UI/IconDrop_01_Regular_Red_200x200.webm
  modules/jb2a_patreon/Library/1st_Level/Bless/Bless_01_Regular_Blue_Intro_200x200.webm

*/

console.log(args[0]);
let title = args[0][1];
let dice = args[0][2];
let adds = args[0].length > 2 ? parseInt(args[0][3]) : 0;
let type = args[0].length > 3 ? args[0][4] : 'dmg';
let armorDivisor = args[0].length > 4 ? parseInt(args[0][5]) : 1;
let radius = args[0].length > 4 ? parseInt(args[0][5]) : 1;
let attribName = args[0].length > 5 ? args[0][6] : 'DX';
let difMod = args[0].length > 6 ? parseInt(args[0][7]) : 0; // Trap difficulty
let skillName = args[0].length > 7 ? args[0][8] : 'Jumping'; // default to Jumping
let detectWith = args[0].length > 8 ? args[0][9] : '!PER!'; // default to Perception
// detect difficulty defaults to trap difficulty if not specified separately !PER-${detectDif}!
let detectDif = args[0].length > 9 && !Number.isNaN(parseInt(args[0][10])) ? parseInt(args[0][10]) : difMod; 
let trapTag = args[0].length > 10 ? args[0][11] : 'BuxlanTorSpikeTrap01';

// 
console.log(`---------- Traps detect difficulty detectDif: ${detectDif};`);

console.log(`title: ${title}; dice: ${dice}; adds: ${adds}; type: ${type}; difMod: ${difMod}; attribName: ${attribName}; detectDif: ${detectDif}; trapTag: ${trapTag}`);

// detect
let detectWarningTxt = `You detect a trap!`;
let detectWarningCritTxt = `You detect a trap with such precision that you gain +3 to disarm it! Use [+3 to disarm]`;
let rslTraps = 'PER-5'; // default detect traps
let trapsMod = -5;
let adjustedTrapsMod = -5;
let trapsObj;
let hasTraps = await GURPS.findSkillSpell(_token.actor, 'Traps', true)  != undefined ? true : false;
if (hasTraps == true) {
	trapsObj = GURPS.findSkillSpell(_token.actor, 'Traps', true);
	rslTraps = trapsObj.relativelevel;
	console.log(`rslTraps: ${rslTraps};`);
	if (rslTraps.includes('-') == true) {
		trapsMod = -Number(rslTraps.split('-')[1]);
		console.log(`trapsMod from rslTraps: ${trapsMod};`);
	} else if (rslTraps.includes('+') == true) {
		trapsMod = Number(rslTraps.split('+')[1]); // split(/[+-]/)[1]
		console.log(`trapsMod from rslTraps: ${trapsMod};`);
	} 
}
adjustedTrapsMod = Number(trapsMod)+Number(detectDif);
if (Number.isNaN(adjustedTrapsMod)) adjustedTrapsMod = detectDif;
console.log(`adjustedTrapsMod: ${adjustedTrapsMod};`);
let critFailDifMod = Number(difMod)-2;
console.log(`critFailDifMod: ${critFailDifMod};`);
let modTxt = '';
if (adjustedTrapsMod < 0) modTxt = ''
else if (adjustedTrapsMod > -1) modTxt = '+';
let evadeTrapsOtF = '';
let evadeTrapsCfOtF = '';
let resistTrapsOtF = '';
let resistTrapsCfOtF = '';
let failTrapsOtF = '';
let critFailTrapsOtF = '';
let detectTrapsOtF = `[!PER${modTxt}${adjustedTrapsMod}!]`;
let dtOtF = '';
if (title.includes('Poison') == true) {
	///:ResistEffect Poison 1d 9 tox 3 HT -6]
	resistTrapsOtF = `/:ResistEffect "${title}" ${dice} ${adds} ${type} ${radius} ${attribName} ${difMod}`;
	resistTrapsCfOtF = `/:ResistEffect "${title}" ${dice} ${adds} ${type} ${radius} ${attribName} ${critFailDifMod}`;
	failTrapsOtF = `/:PoisonSpray ${trapTag} \\\\${resistTrapsOtF}`;
	critFailTrapsOtF = `/:PoisonSpray ${trapTag} \\\\${resistTrapsCfOtF}`;
} else {
	evadeTrapsOtF =`/:EvadeTrap "${title}" ${dice} ${adds} ${type} ${armorDivisor} ${attribName} ${difMod} ${skillName}`;
	evadeTrapsCfOtF =`/:EvadeTrap "${title}" ${dice} ${adds} ${type} ${armorDivisor} ${attribName} ${critFailDifMod} ${skillName}`;
	failTrapsOtF = `/:SpikeTrap160x160px ${trapTag} \\\\${evadeTrapsOtF}`;
	critFailTrapsOtF = `/:SpikeTrap160x160px ${trapTag} \\\\${evadeTrapsCfOtF}`;
}
console.log(`failTrapsOtF: ${failTrapsOtF}`);


dtOtF = `/if ${detectTrapsOtF} s:{${detectWarningTxt}} cs:{${detectWarningCritTxt}} f:{${failTrapsOtF}} cf:{${critFailTrapsOtF}}`;
console.log(dtOtF);
await GURPS.executeOTF(dtOtF, players);
		})()
})