/* Usage: /:MaledictionResist advantage="<advantage name>" attribute=<attribute> resist=<attribute> level=<advantage level>

Description: This script is used to resist a malediction attack. The script will check the attacker's margin of success and compare it to the defender's margin of success. If the defender's margin of success is greater than or equal to the attacker's margin of success, then the defender resists the malediction. If the defender's margin of success is less than the attacker's margin of success, then the defender fails to resist the malediction. The script will then send a chat message to the GM and the player with the results of the resist check.

Required Macros: MaledictionAttack calls this macro with result of attacker roll MoS (margin of success).

Examples
* Stunning Cone Description: Resisted by Will-level; Any living being within the cone must resist or be stunned. Stun lasts for seconds equal to margin of failure. Add this OtF to the advantage: ["Stunning Cone"/:MaledictionResist margin=2 advantage="Stunning Cone" attribute=Will resist=Will level=2] for this.
*/

console.log(`---------- Start MaledictionResist ---------`);

// optional anim
let anim = `!/anim CastIce*Regular_Blue c *0.8 0.5 \\\\`;
let durationUnits = 'seconds'; // duration units; default to seconds
let statusType = 'stun'; // status type; default to Stun

// setup defaults
let advantage = 'Stunning Cone'; // name of the advantage; default to Stunning Cone
let level = 1; // level of the advantage; default to level 1
let attribute = 'WILL'; // attacker attribute; default to WILL
let resist = 'WILL'; // defender resist attribute; default to WILL
let margin = 0; // margin of success

// get the scope arguments

try {
    console.log(scope)
    advantage = scope.advantage ? scope.advantage : advantage;
    attribute = scope.attribute ? scope.attribute : attribute;
    level = scope.level ? parseInt(scope.level) : level; 
    resist = scope.resist ? scope.resist : resist;
    margin = scope.margin ? parseInt(scope.margin) : margin;
} catch (error) {
    console.error('Error accessing scope:', error);
}

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

// initialize variables
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);
const originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let originalModifiers = GURPS.ModifierBucket.modifiers;
let maledictionModifier = level;
let maledictionMargin = margin;
console.log(`name: ${actorName}; advantage: ${advantage}; maledictionModifier: ${maledictionModifier}; attribute: ${attribute}; resist: ${resist}; margin: ${margin} `);

let attributeOtF = `/r [${attribute}-${maledictionModifier}]`;
let maledictionResistSuccess = false;
if (!(await GURPS.executeOTF(attributeOtF))) {
    maledictionResistSuccess = false;
} else {
    maledictionResistSuccess = true;
}

let maledictionResistMargin = -1;
await wait(2);
// get roll margin
let ltrData = await GURPS.lastTargetedRolls[_token.actor.id];
if (ltrData != undefined) {
    maledictionResistMargin = ltrData.margin;
    console.log(`maledictionResistMargin: ${maledictionResistMargin};`);
}
// verify results
if (maledictionResistSuccess == true) {
    if (maledictionResistMargin >= 0) {
        // success
        console.log(`${actorName} Resist malediction success`);
        maledictionResistSuccess = true;
    } else {
        // failure
        console.log(`${actorName} Resist malediction failure`);
        maledictionResistSuccess = false;
    }
} else {
    // failure
    console.log(`${actorName} Resist malediction failure`);
    maledictionResistSuccess = false;
}
let maledictionOtF = `/status on ${statusType}`; // add status effect to target
let maledictionMsgTitle,maledictionMsg,MaledictionDescription,chatDescription,marginOfFailure;  
if (maledictionResistSuccess == true && maledictionResistMargin >= 0 && maledictionResistMargin >= maledictionMargin) {
    maledictionMsgTitle = `Resisted Malediction`;
    maledictionMsg = `<p><b>Resist Maledition success</b>:</p>
            <p><b>${targetName}</b> successfully wins a <b>Quick Contest</b> of <b>${resist}</b> vs attacker with a success margin of ${maledictionResistMargin} versus a attacker's margin of ${maledictionMargin}.</p>`;
} else if (maledictionResistSuccess == true && maledictionResistMargin >= 0 && maledictionResistMargin < maledictionMargin) {
    marginOfFailure = maledictionMargin - maledictionResistMargin;
    maledictionMsgTitle = `Resist Malediction fails`;
    maledictionMsg = `<hr><p><b>${targetName}</b> loses a <b>Quick Contest</b> of <b>${resist}</b> vs attacker.</p>
    <p><b>${targetName}</b> succeeded on attribute check with a margin of ${maledictionResistMargin}, but the margin was not enough to beat attacker's margin of ${maledictionMargin}.</p>
    <p><b>${targetName}</b> is <b>Stunned</b> for ${marginOfFailure} ${durationUnits}.</p>`;
    await GURPS.executeOTF(maledictionOtF);
    console.log(maledictionMsg);
} else {
    marginOfFailure = maledictionMargin - maledictionResistMargin;
    maledictionResistSuccess = false;
    maledictionMsgTitle = `Resist Malediction fails`;
    maledictionMsg = `<hr><p><b>${targetName}</b> loses a <b>Quick Contest</b> of <b>${resist}</b> vs attacker.</p>
    <p><b>${targetName}</b> is <b>Stunned</b> for ${marginOfFailure} ${durationUnits}.</p>`;
    await GURPS.executeOTF(maledictionOtF);
    console.log(maledictionMsg);
}

chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
    <strong>
        <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">${maledictionMsgTitle}</span>
    </strong>
</p>`;
chatDescription += ` 
<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
        ${maledictionMsg}
        </span>
</p>`;
console.log(chatDescription);
await ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
{ chatBubble: false });	

console.log(`---------- End MaledictionResist ---------`);
