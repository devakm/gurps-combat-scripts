/* Usage: BreakFree
   Lets you break free from Binding effects
   /if [?AD:Hard To Kill] [HT+2] [HT-2]
   /if [?Sk:Acrobatics] {/if [SK:Acrobatics] [Dodge+2] [Dodge -2]} {[Dodge]}
   
   GustOfWind_01_White
   GroundCrackImpact_03_Regular_Orange
*/

let title = "Break Free";

function breakfree(BindingST) {
	console.log(`BindingST:${BindingST};`);
	
	// OtF action setup:
	let SkillName ='Escape'; //  name of the skill to bypass or boost your basic attribute check
	let AttributeName ='ST'; //  attribute name

	let BaseModifier = GURPS.ModifierBucket.currentSum();
	GURPS.ModifierBucket.clear(update=true);

	// check skill vs attribute levels
	let AttributeLevel = _token.actor.data.data.attributes.ST.value ? Number(_token.actor.data.data.attributes.ST.value): 0;
	let SkillLevel = GURPS.findSkillSpell(_token.actor,SkillName,1,0) ? Number(GURPS.findSkillSpell(_token.actor,SkillName,1,0).level): 0;
	console.log(`SkillName:${SkillName}; SkillLevel:${SkillLevel};`);
	let useSkill = false;
	let useAttribute = false;
	if (SkillLevel > AttributeLevel) {
		useSkill = true;
		console.log(`useSkill:${useSkill};`);
	} else if (SkillLevel < AttributeLevel) {
		useAttribute = true;
		console.log(`useAttribute:${useAttribute};`);
	} 
	
	let PreCheck = '[?Sk:'+SkillName+']' // check to see if token has SkillName before attempting to use it
	let SkillCheck = '[Sk:'+SkillName+'-'+BindingST+']'; // alter the OtF type used for primary check
	let AttributeCheck = '['+AttributeName+'-'+BindingST+']'; // alter the OtF type used for secondary check

	// Outcomes for critical success, critical failure, regular success, and regular failure
	// each of these settings can be tested individually as an OtF or chat command.
	let sanim = '!/anim GroundCrackImpact_03_Regular_Orange c *0.4 @self'; // success animation 
	let csanim = '!/anim GroundCrackImpact_03_Regular_Orange c *0.6 @self'; // critical success animation 
	let fanim = '!/anim GroundCrackImpact_03_Regular_Orange c *0.2 @self'; // failure animation 
	let cfanim = '!/anim GroundCrackImpact_03_Regular_Orange c *0.1 @self'; // critical failure animation 
	// outcome formulas:
	let csformula ='You shatter your bonds!'; // critical success formula 
	let cfformula ='/fp -4 \\\\Your attempt to break free fails disasterously. You suffer great fatigue (FP-4).'; // critical failure formula 
	let sformula ='You break free!'; //success formula 
	let fformula ='/fp -1 \\\\You fail to break free and suffer fatigue (FP-1).'; // failure formula 
	
	let OtF = '/if '+PreCheck+' {/if '+SkillCheck+' cs:{'+csanim+' \\\\'+csformula+'} s:{'+sanim+' \\\\'+sformula+'} f:{'+fanim+' \\\\'+fformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} } {/if '+AttributeCheck+' cs:{'+csanim+' \\\\'+csformula+'} s:{'+sanim+' \\\\'+sformula+'} f:{'+fanim+' \\\\'+fformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} }';
	console.log(OtF);
	GURPS.executeOTF(OtF);

}

new Dialog({
 title: title,
 content: `
<div style='padding: 4px;'>
 <label for="BindingST">Binding ST</label>
 <input id="BindingST" type="text" />
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => breakfree(
      parseInt(html.find('#BindingST').val()))
  }
 }
}).render(true)

	//if [?Sk:Acrobatics] {/if [SK:Acrobatics] [Dodge+2] [Dodge -2]} {[Dodge]}
	//let OtF = '[/if '+SkillCheck+' cs:{/if '+AttributeCheck+' {'+csanim+' \\\\'+csformula+' }} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+AttributeCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} ]';
	
	//let OtF = '[/if '+PreCheck+' {/if '+SkillCheck+' cs:{'+csanim+' \\\\'+csformula+'}} cf:{'+cfanim+' \\\\'+cfformula+'} s:{/if '+AttributeCheck+' cs:{'+csanim+' \\\\'+csformula+' } s:{'+sanim+' \\\\'+sformula+'} cf:{'+cfanim+' \\\\'+cfformula+'} f:{'+fanim+' \\\\'+fformula+'}} f:{'+fanim+' \\\\'+fformula+'} }]';
	
	//let OtF = 'if '+PreCheck+' {/if '+SkillCheck+' [success+2] [fail -2]} {[no skill]}';