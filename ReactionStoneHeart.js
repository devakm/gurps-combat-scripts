/* Usage: /:ReactionStoneHeart
	Check to see if Actor has Stone Friend advantage, 
	give bonus for Stone Friend level,
	Check to see if Actor has Power Investiture (Druidic) advantage, 
	give bonus for Power Investiture (Druidic) level,
	
*/
console.log(`------- In ReactionStoneHeart.js `);
let OtF = '';
let OtF2 = '';

let AdvantageName ='Stone*Friend'; //  name of the advantage to boost /:Reaction check
let AdvantageCostPerLevel = 10;
let useAdvantage = await GURPS.findAdDisad(_token.actor, AdvantageName) != undefined ? true : false;
let AdvantagePoints = 0;
let Modifier = 0;
if (useAdvantage) {
    AdvantagePoints = Number(GURPS.findAdDisad(_token.actor,AdvantageName).points);
    if (AdvantagePoints > 0) {
        console.log(`AdvantageName: ${AdvantageName}; AdvantagePoints: ${AdvantagePoints} `);
    } else console.log(`AdvantagePoints for ${AdvantageName}; is 0 `);
    
    Modifier = AdvantagePoints/AdvantageCostPerLevel;
    console.log(`Modifier:${Modifier};`);
    OtF = '[+'+Modifier+' Stone Friend bonus *Max:6]';
    console.log(OtF);
    GURPS.executeOTF(OtF);	
} else console.log(`Advantage bonus skipped.`);

// look for other bonuses
let AdvantageName2 ='Heart*Stone'; //  name of the advantage to boost /:Reaction check
let AdvantagePoints2 = 0;
let Modifier2 = 0;
let AdvantageCostPerLevel2 = 5;
let useAdvantage2 = await GURPS.findAdDisad(_token.actor, AdvantageName2) != undefined ? true : false;
if (useAdvantage2) {
    AdvantagePoints2 = 5; // Heart of Stone is an item advantage with no points spent so set to 5 (+1) // Number(GURPS.findAdDisad(_token.actor,AdvantageName2).points);
    Modifier2 = AdvantagePoints2/AdvantageCostPerLevel2;
    console.log(`Modifier2:${Modifier2};`);
    OtF2 = '[+'+Modifier2+' Stone Friend bonus *Max:6]';
    console.log(OtF2);
    GURPS.executeOTF(OtF2);	
} else console.log(`Advantage2 bonus skipped.`);

let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Stone Reaction modifiers</span>
		</strong>
	</p>`;

if ( useAdvantage ) {
	chatDescription = chatDescription + `
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<em>
				<span style="font-size:10.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
				${OtF}
				</span>
			</em>
		</strong>
	</p>`;
}

if ( useAdvantage2 ) {
	chatDescription = chatDescription + `
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<em>
				<span style="font-size:10.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
				${OtF2}
				</span>
			</em>
		</strong>
	</p>`;
}

if ( ! useAdvantage || ! useAdvantage2) {
	chatDescription = chatDescription + ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<em>
				<span style="font-size:12.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
				No modifiers from Stone Friend or Power Investiture (Druidic).
				</span>
			</em>
		</strong>
	</p>`;
}

 ChatMessage.create({
  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });


console.log(`------- End ReactionStoneHeart.js `);

