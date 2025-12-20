/* Usage: /:Reaction
*/

const roll = new Roll("3d6 + @gmod", _token.actor.getRollData());
await roll.roll();
game.dice3d.showForRoll(roll)
let rollMsg = `${_token.actor.name} rolled ${roll._formula} and got a ${roll.total} !!!`;
console.log(rollMsg);

roll.toMessage({
rollMode: 'roll',
speaker: ChatMessage.getSpeaker(_token.actor)
});

const reactionTable = game.tables.getName('Reaction')
const reactionResults = reactionTable.getResultsForRoll(roll.total > 1 ? roll.total : 1);
reactionTable.toMessage(reactionResults);


// extra 

let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
	<strong>
		<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Animal Empathy Success</span>
	</strong>
</p>
<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
	<strong>
		<span style="font-size:12.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US"> </span>
	</strong>
</p>
<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
	<strong>
		<em>
			<span style="font-size:12.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">General reaction</span>
		</em>
	</strong>
</p>
<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
	<span style="font-size:12.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">The creature is impressed by the PCs and delays doing anything else to see what they say.</span>
</p>`

 ChatMessage.create({
  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });



/*
["Animal Empathy"/if [?AD:Animal*Empathy] {/ra AnimalEmpathy-10} {[/ooc You don't have Animal Empathy!]}]



["Animal Empathy"/if [?AD:Animal*Empathy] /else [/ooc You don]["Veterinary+1"/if [S:Veterinary+1 | S:Animal*Handling-5 | S:Physician-4 | S:Surgery-4] /else [/ooc Sorry I can’t do that!]]


*/


// scratch

I think you need to call roll.evaluate after the roll like this:

let roll = new Roll("2d6 + 2").evaluate({async: false});

Then after you can call:

roll.toMessage({
rollMode: 'roll',
speaker: {alias: name}
});


const challengevalue = difficulty == 60 ? "Very Easy"
		: difficulty == 40 ? "Easy"
		: difficulty == 20 ? "Simple"
		: difficulty == 0 ? "Average"
		: difficulty == -10 ? "Tricky"
		: difficulty == -20 ? "Hard"
		: difficulty == -30 ? "Very Hard"
		: "Invalid";
		

// /rolltable Reaction
// await game.tables.getName("Reaction").draw();

const roll = new Roll("3d6 + @gmod", _token.actor.getRollData());
await roll.roll();
game.dice3d.showForRoll(roll)
if (isNaN(Number(roll.total))||roll.total < 0) roll.total = 0;
const reactionTable = game.tables.getName('Reaction')
const reactionResults = reactionTable.getResultsForRoll(roll.total);
reactionTable.toMessage(reactionResults);

console.log(`${_token.actor.name} rolled: ${roll.total} !!!!`);

 let chatDescription = `<p style="font-size:14px;">Test</p>`

 ChatMessage.create({
  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });



 let chatDescription = `<p style="font-size:14px;">Result 1 is: ${roll.results[0].data.text}.<br> Of course we also have results 2: ${roll.results[1].data.text}, 3: ${roll.results[2].data.text} and 4: ${roll.results[3].data.text} as well.</p>`
 


const table = game.tables.find(t => t.name === "Reaction");


let table = game.tables.getName("Results")
let roll = await(table.roll({async:true}));

var msg = `<p style="font-size:14px;">Result 1 is: ${roll.results[0].data.text}.<br> Of course we also have results 2: ${roll.results[1].data.text}, 3: ${roll.results[2].data.text} and 4: ${roll.results[3].data.text} as well.</p>`

ChatMessage.create({
    content: msg,
});


	
//await game.tables.getName("Reaction").draw({roll});
//const table = game.tables.getName("Reaction");
//table.draw({roll});
			
				
				
// OtF action setup:
let RangedAttackName ='Binding*Thrown'; //  Ranged Attack Name, i.e. [R:Wall*Lightning]

let BaseModifier = GURPS.ModifierBucket.currentSum();
GURPS.ModifierBucket.clear(update=true);
let Accuracy = GURPS.findAttack(_token.actor, RangedAttackName, 0, 1).acc;
let Modifier = Number(BaseModifier)+Number(Accuracy);
if (isNaN(Modifier)||Modifier===0) {
	Modifier = '+0';
} else if (Modifier > 0) {
	Modifier = '+'+Modifier
}
let ModifierString = Modifier+' Modifier Bucket Applied';

let Attack = '[R:'+RangedAttackName+ModifierString+']'; // alter the OtF type used for attack
let CritHit = '/rolltable CritHit'; // critical hit rolltable
let CritMiss = '/rolltable CritMiss'; // critical miss rolltable
// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations:
let sanim = '!/anim OutFlow*Cone *0.3 -0.2 +1 \\\\!/wait 1000 \\\\!/anim OutFlow_02_Circle c *0.9'; // success animation 
let csanim = '!/anim OutFlow*Cone *0.3 -0.2 +1 \\\\!/wait 1000 \\\\!/anim OutFlow_02_Circle c *1.2'; // critical success animation 
let fanim = '!/anim OutFlow*Cone *0.1 -0.1 -1'; // failure animation 
let cfanim = '!/anim OutFlow_02_Circle c *0.5 @self'; // critical failure animation 
// outcome formulas:
let csformula = 'You may choose to web an extra 1 hex radius. If the crit indicates double or triple damage, add an extra 2 or 3 hexes to the radius. The webs inflict Binding at [ST-9] to everyone in the target area! Use ["Break Free"/:BreakFree] to see if anyone escapes each turn. \\\\'+CritHit; // critical success formula 
let cfformula = 'You fumble your web cast and hit yourself instead. Use Scatter rules to determine which adjacent hex it strikes ([PDF:DFE45]). The webs inflict Binding at [ST-9] to everyone in the target area! Use ["Break Free"/:BreakFree] to see if anyone escapes each turn. \\\\'+CritMiss; // critical failure formula 
let sformula ='Your webs spray directly into the target area. The webs inflict Binding at [ST-9] to everyone in the target area! Use ["Break Free"/:BreakFree] to see if anyone escapes each turn.'; //success formula 
let fformula ='Your webs miss the target area. Use Scatter rules to determine which adjacent hex it strikes ([PDF:DFE45]). The webs inflict Binding at [ST-9] to everyone in the target area! Use ["Break Free"/:BreakFree] to see if anyone escapes each turn.'; // failure formula 

let OtF = '[/if '+Attack+' cs:{'+csanim+' \\\\'+csformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} s:{'+sanim+' \\\\'+sformula+'} f:{'+fanim+' \\\\'+fformula+'} ]'; 
console.log(OtF);
GURPS.executeOTF(OtF);