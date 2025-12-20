/* Usage: GrappleCrushingResults 
    * create a GURPS script implement the results of a successful Grapple Crushing attack. If you succeed on a grapple against an opponent no larger than your own SM, on your next turn, and each successive turn, roll a Quick Contest of your ST vs. your victim’s ST or HT, whichever is higher. If you win, your victim takes damage equal to your margin of victory; otherwise, no damage is inflicted.

*/
console.log('------in GrappleCrushingResults: -----');

let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let crushMargin = -999;
let crushSuccess = false;
let chrushOtF = '';
let crushMsg = '';
let chatDescription = '';
let ltrData = await GURPS.lastTargetedRolls[_token.actor.id];
if (ltrData != undefined && ltrData.failure == false) {
    crushMargin = ltrData.margin;
    crushSuccess = true;
    crushOtF = `/r [${crushMargin} cr]`;
    console.log(`crushMargin: ${crushMargin};`);
}
if (crushSuccess == true) {
    if (crushMargin >= 0) {
        // success
        console.log(`${actorName} crushing success with margin of ${crushMargin}`);
        crushMsg = `<p>${actorName} <b>succeeds in Grapple Crushing</b> with a margin of <b>${crushMargin}</b>, resulting in [${crushMargin} cr] damage.</p>`;
        await GURPS.executeOTF(crushOtF);
    } else {
        // failure
        console.log(`${actorName} fails in <b>Grapple Crushing</b> with margin of ${crushMargin}`);
        crushMsg = `<p>${actorName} <b>fails Grapple Crushing</b> attempt (margin was <b>${crushMargin}</b>).</p>`;
    }
}
console.log(crushMsg);
chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
    <strong>
        <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Grappled victim crush</span>
    </strong>
</p>`;
chatDescription += ` 
<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
        ${crushMsg}
        </span>
</p>`;
console.log(chatDescription);
await ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });		

console.log('------ End GrappleCrushingResults: -----');
