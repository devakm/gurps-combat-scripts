/* Usage: /:ReactionAnimal
	Check to see if Actor has Animal Friend advantage, 
	give bonus for Animal Friend level,
	Check to see if Actor has Power Investiture (Druidic) advantage, 
	give bonus for Power Investiture (Druidic) level,
	
*/

let OtF = '';
let OtF2 = '';
let OtF3 = '';

let AdvantageName ='Power*Invest*Druidic'; //  name of the advantage to boost /:Reaction check
let AdvantageCostPerLevel = 10;
let AdvantagePoints = GURPS.findAdDisad(_token.actor,AdvantageName) ? Number(GURPS.findAdDisad(_token.actor,AdvantageName).points): 0;
console.log(`AdvantageName: ${AdvantageName}; AdvantagePoints: ${AdvantagePoints} `);

let useAdvantage = false;
if (AdvantagePoints > 0) {
	useAdvantage = true;
	console.log(`useAdvantage:${useAdvantage};`);
} else console.log(`AdvantagePoints for ${AdvantageName}; is 0 `);


let Modifier = 0;
if (useAdvantage) {
	Modifier =+ AdvantagePoints/AdvantageCostPerLevel;
	console.log(`Modifier:${Modifier};`);
	OtF = '[+'+Modifier+' Power Investiture (Druidic) bonus *Max:6]';
	console.log(OtF);
	GURPS.executeOTF(OtF);	

// look for other bonuses
} else console.log(`Advantage bonus skipped.`);

let AdvantageName2 ='Animal*Friend'; //  name of the advantage to boost /:Reaction check
let AdvantageCostPerLevel2 = 5;
let AdvantagePoints2 = GURPS.findAdDisad(_token.actor,AdvantageName2) ? Number(GURPS.findAdDisad(_token.actor,AdvantageName2).points): 0;
console.log(`AdvantageName2: ${AdvantageName2}; AdvantagePoints: ${AdvantagePoints2} `);

let useAdvantage2 = false;
if (AdvantagePoints2 > 0) {
	useAdvantage2 = true;
	console.log(`useAdvantage2:${useAdvantage2};`);
} else console.log(`AdvantagePoints2 for ${AdvantageName2}; is 0 `);


let Modifier2 = 0;
if (useAdvantage2) {
	Modifier2 =+ AdvantagePoints2/AdvantageCostPerLevel2;
	console.log(`Modifier2:${Modifier2};`);
	OtF2 = '[+'+Modifier2+' Animal Friend bonus *Max:6]';
	console.log(OtF2);
	GURPS.executeOTF(OtF2);	
} else console.log(`Advantage2 bonus skipped.`);

// look for other bonuses
let AdvantageName3 ='Ring*Animal*Influence'; //  name of the advantage to boost /:Reaction check
let AdvantagePoints3 = 0;
let Modifier3 = 0;
let AdvantageCostPerLevel3 = 5;
let useAdvantage3 = await GURPS.findAdDisad(_token.actor, AdvantageName3) != undefined ? true : false;
console.log(`AdvantageName3: ${AdvantageName3}; useAdvantage3: ${useAdvantage3} `);
if (useAdvantage3) {
    AdvantagePoints3 = 5; // Ring of Animal Influence is an item advantage with no points spent so set to 5 (+1) // Number(GURPS.findAdDisad(_token.actor,AdvantageName2).points);
    Modifier3 = AdvantagePoints3/AdvantageCostPerLevel3;
    console.log(`Modifier3:${Modifier3};`);
    OtF3 = '[+'+Modifier3+' Animal Friend bonus *Max:6]';
    console.log(OtF3);
    GURPS.executeOTF(OtF3);	
} else console.log(`Advantage3 bonus skipped.`);


let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Animal Reaction modifiers</span>
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

if ( useAdvantage3 ) {
	chatDescription = chatDescription + `
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<em>
				<span style="font-size:10.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
				${OtF3}
				</span>
			</em>
		</strong>
	</p>`;
}

if ( ! useAdvantage || ! useAdvantage2 || ! useAdvantage3) {
	chatDescription = chatDescription + ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<em>
				<span style="font-size:12.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
				No modifiers from Animal Friend or Power Investiture (Druidic).
				</span>
			</em>
		</strong>
	</p>`;
}

 ChatMessage.create({
  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });



