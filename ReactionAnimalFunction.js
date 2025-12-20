/* Usage: /:ReactionAnimal
	Check to see if Actor has Animal Friend advantage, 
	give bonus for Animal Friend level,
	Check to see if Actor has Power Investiture (Druidic) advantage, 
	give bonus for Power Investiture (Druidic) level,
*/
let _token = canvas.tokens.controlled[0];

function checkAdvantage(actor, advantageName, advantageCostPerLevel, otfLabel) {
    let advantagePoints = 0;
    let useAdvantage = GURPS.findAdDisad(actor, advantageName) ? true : false;
    let modifier = 0;
	let otf = '';
    if (useAdvantage) {
        console.log(`Checking AdvantageName: ${advantageName} `);
        advantagePoints = GURPS.findAdDisad(actor, advantageName) ? Number(GURPS.findAdDisad(actor, advantageName).points) : 0;
        console.log(`AdvantageName: ${advantageName}; AdvantagePoints: ${advantagePoints} `);
    
        // Ring of Animal Influence grants Animal Friend +1 for 0 points, so we count it as a flat 5 points here
        if (advantageName.includes('Ring*Animal*Influence')) {
            advantagePoints = 5; 
        }
        modifier = advantagePoints / advantageCostPerLevel;
		console.log(`Modifier: ${modifier};`);
		otf = `[+${modifier} ${otfLabel} bonus *Max:6]`;
		console.log(otf);
		GURPS.executeOTF(otf);

	} else {
        // If the advantage is not found, we skip the bonus
		console.log(`Advantage bonus skipped for ${otfLabel}`);
	}

	return { useAdvantage, otf };
}

let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
	<strong>
		<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Animal Reaction modifiers</span>
	</strong>
</p>`;
let advantages = [
    { name: 'Power*Invest*Druidic', costPerLevel: 10, label: 'Power Investiture (Druidic)' },
    { name: 'Animal*Friend', costPerLevel: 5, label: 'Animal Friend' },
    { name: 'Ring*Animal*Influence', costPerLevel: 5, label: 'Ring of Animal Influence' }
];

let results = advantages.map(adv => checkAdvantage(_token.actor, adv.name, adv.costPerLevel, adv.label));

results.forEach(result => {
    if (result.useAdvantage) {
        chatDescription += `
        <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <strong>
                <em>
                    <span style="font-size:10.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
                    ${result.otf}
                    </span>
                </em>
            </strong>
        </p>`;
    }
});

if (results.every(result => !result.useAdvantage)) {
    chatDescription += ` 
    <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <strong>
            <em>
                <span style="font-size:12.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#4472c4;mso-themecolor:accent1;mso-ansi-language:EN-US">
                No modifiers from Animal Friend, Power Investiture (Druidic), or Ring of Animal Influence.
                </span>
            </em>
        </strong>
    </p>`;
}

ChatMessage.create({
	content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)
}, { chatBubble: false });
