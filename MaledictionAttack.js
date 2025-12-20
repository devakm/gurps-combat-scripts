/* Usage: /:MaledictionAttack advantage="<advantage name>" attribute=<attribute> resist=<attribute> level=<advantage level>

Quick Contest of attacker vs defender; if attacker succeeds, then defender must resist or suffer the effects of the malediction.
Contested roll is made using the attribute of the attacker and the resist attribute of the defender.

Required Macros: MaledictionResist

Example: Stunning Cone is a malediction advantage Resisted by Will-level; Any living being within the cone must resist or be stunned. Stun lasts for seconds equal to margin of failure. Add this OtF to the advantage: ["Stunning Cone"/:MaledictionAttack advantage="Stunning Cone" attribute=Will resist=Will level=2] for this.
*/

console.log(`---------- Start MaledictionAttack ---------`);

// optional anim
let anim = `!/anim EnergyStrandIN01_03_Regular_Yellow c *0.5 @self \\\\!/anim BorderInPulse_01_Circle_Normal_500 c *0.8 @self \\\\`;
// !/anim InPulse_03_Circle_Normal c *0.8 @self
// setup defaults
let advantage = 'Stunning Cone'; // name of the advantage; default to Stunning Cone
let level = 1; // level of the advantage; default to level 1
let attribute = 'WILL'; // attacker attribute; default to WILL
let resist = 'WILL'; // defender resist attribute; default to WILL

// get the scope arguments

try {
    console.log(scope)
    advantage = scope.advantage ? scope.advantage : advantage;
    attribute = scope.attribute ? scope.attribute : attribute;
    level = scope.level ? parseInt(scope.level) : level; 
    resist = scope.resist ? scope.resist : resist;
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
const originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let originalModifiers = GURPS.ModifierBucket.modifiers;
let maledictionModifier = level;
let hasAdvantage = GURPS.findAdDisad(_token.actor,advantage) ? true : false;
console.log(`advantage: ${advantage}; hasAdvantage: ${hasAdvantage}; maledictionModifier: ${maledictionModifier} `);

if (hasAdvantage) {
    console.log(`hasAdvantage:${hasAdvantage};`);
} else console.log(`hasAdvantage for ${advantage}; is False `);


let attributeOtF = `${anim}/r [${attribute}+${maledictionModifier}]`;
let maledictionSuccess = false;
if (!(await GURPS.executeOTF(attributeOtF))) {
    maledictionSuccess = false;
} else {
    maledictionSuccess = true;
}

await wait(6);
let maledictionMargin = -1;
let ltrData = await GURPS.lastTargetedRolls[_token.actor.id];
if (ltrData != undefined && ltrData.failure == false) {
    maledictionMargin = ltrData.margin;
    console.log(`maledictionMargin: ${maledictionMargin};`);
}
if (maledictionSuccess == true) {
    if (maledictionMargin >= 0) {
        // success
        console.log(`${actorName} malediction success`);
        maledictionSuccess = true;
    } else {
        // failure
        console.log(`${actorName} malediction failure`);
        maledictionSuccess = false;
    }
}

let targetID,targetToken,targetActor,tltrData,targetName,tMaledictionMargin,maledictionMsg,MaledictionDescription,chatDescription;
// now that we found the maledictionMargin, we need generate a MaledictionResist message containing the resist command for each target;
let targets = Array.from(game.user.targets); 
if (maledictionSuccess) {
    for(let target of targets){ 
        targetID = target.id;;
        targetToken = canvas.tokens.get(targetID);
        console.log(`targetID: ${targetID}`);
        await GURPS.SetLastActor(targetToken.actor);
        await wait(2);
        targetActor = await GURPS.LastActor;
        targetName = targetActor.name;
        console.log(`target: [${targetID}]-${targetName}, resist ${resist}-${maledictionModifier}`);
        maledictionMsgTitle = `Resist Malediction`;
        maledictionMsg = `<hr><p><b>${targetName}</b> must roll a <b>Quick Contest</b> of <b>${resist}</b> vs attacker or be <b>Stunned</b>.</p>
        <p><b>Target</b> rolls to ["Resist Stun"/:MaledictionResist margin=${maledictionMargin} advantage="${advantage}" attribute=${attribute} resist=${resist} level=${level}].</p>`;
        console.log(maledictionMsg);

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
        await wait(9);

    };
    await GURPS.SetLastActor(originalActor);

} else console.log(`No Malediction Advantage found.`);

console.log(`---------- End MaledictionAttack ---------`);
