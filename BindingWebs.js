/* Usage: /:BindingWebs
make a ST roll at -9, or be trapped in webs.
!/anim OutFlow*Cone *0.3 -0.2 +1 \\\\!/wait 1000 \\\\!/anim OutFlow_02_Circle c *0.9
*/

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