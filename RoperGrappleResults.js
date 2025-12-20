/* Usage: RoperGrappleResults 
    * create a GURPS script implement the results of a successful Grapple grabing attack. If you succeed on a grapple against an opponent no larger than your own SM, on your next turn, and each successive turn, roll a Quick Contest of your ST vs. your victim’s ST or HT, whichever is higher. If you win, your victim takes damage equal to your margin of victory; otherwise, no damage is inflicted.

*/
console.log('------in RoperGrappleResults -----');
let messageList = [];

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 20000);
    });
}

async function getSTMessageList(targetName,ts) {
    console.log(`-------------- getSTMessageList for Messages for  ${targetName} at time: ${ts};`);
    // targetName = 'Gallant Troglodyte (1)';
    wait(5);
    messageList = game.messages.filter(i => 
        i.data.timestamp > ts 
        && i.data.speaker.alias == targetName  
        && i._roll != null
        && i._roll._formula.includes("3d6[ST]") == true); 
        if (messageList.length > 0) {
            for (let message of messageList) {
                console.log(`messageList for ST Messages for  ${targetName} at time: ${message.data.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
            return messageList;
        } else {
            console.log(`No ST Messages for ${targetName} at time: ${ts} where message[x].data.content.includes('ST');`);
            return [];
    }
}
wait(5);
let ifDebug = false;
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let grabMargin = -999;
let victimGrabResistMargin = -999;
let grabResistSuccess = false;
let chrushOtF = '';
let grabMsg = '';
let attackedWith = '';
let attackedWithFormula = '';
let chatDescription = '';
let ltrData = await GURPS.lastTargetedRolls[_token.actor.id];
if (ltrData != undefined && ltrData.failure == false) {
    grabMargin = ltrData.margin;
    grabResistSuccess = true;
    attackedWith = ltrData.thing;
    attackedWithFormula = ltrData.chatthing;
    grabOtF = `/r [${grabMargin} cr]`;
    console.log(`grabMargin: ${grabMargin};`);
}
// give target a chance to resist Grab and Go with a Quick Contest of ST vs victim
let targetID,targetToken,targetActor,targetName,targetST,hasEffects,grabMessageList,lastgrabMessage,grabMsgTitle,lastActor;
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
    targetID = target.id;;
    targetToken = canvas.tokens.get(targetID); 
    hasEffects = targetToken.actor.data.effects.hasOwnProperty ? true : false;
    targetActor = targetToken.actor;
    targetName = targetActor.name;
    await GURPS.SetLastActor(targetActor);
    wait(5);
    lastActor = await GURPS.LastActor;
    console.log(`lastActor: ${lastActor.name};`);
    targetST = lastActor.data.data.attributes.ST.value
    console.log(`--------- RoperGrappleResult targetName: ${targetName}; targetID: ${targetID}; targetST: ${targetST};`);
    if (hasEffects == true) {
        isGrappled = lastActor.data.effects.filter(i => i.data.label == 'GURPS.STATUSGrapple').length > 0 ? true : false ;
        if (isGrappled == true) {
            console.log(`------ RoperGrappleResult targetName: ${targetName} isGrappled: ${isGrappled}; if the ${actorName} wins a Quick Contest of ST vs victim then victim suffers Grab and Go`);
            grabMessageList = await getSTMessageList(targetName,ts);
            if (grabMessageList == undefined && grabMessageList.length == 0 ) {
                console.log(`No grab Messages for ${targetName} at time: ${ts} where message[x].data.content.includes('grab'); wait(910) then try again.`);
                wait(12);
                grabMessageList = await getSTMessageList(targetName,ts);
                if (grabMessageList.length > 0) {
                    for (let message of grabMessageList) {
                        console.log(`time: ${message.data.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
                } else {
                    console.log(`No grab Messages for ${targetName} at time: ${ts} where message[x].data.content.includes('grab'); retries exhausted.`);
                }
            } else if (grabMessageList.length > 0) {
                for (let message of grabMessageList) {
                    console.log(`time: ${message.data.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
            }
            // if the grab roll is successful, then check grabMargin vs victimGrabResistMargin
            //targetName = 'Gallant Troglodyte (1)';
            lastgrabMessage = undefined;
            grabMessageList.forEach(message => { lastgrabMessage = message }); // pick the latest message
            if (lastgrabMessage != undefined && lastgrabMessage.data.content.includes('Critical Success!') == true) {
                victimGrabResistMargin = 999;
                grabResistSuccess = true;
            } else if (lastgrabMessage != undefined && lastgrabMessage.data.content.includes('Critical Failure!') == true) {
                victimGrabResistMargin = -999;
                grabResistSuccess = false;
            } else if (lastgrabMessage != undefined) {                    
                victimGrabResistMargin = lastgrabMessage != undefined && lastgrabMessage.data.document._roll != undefined ? lastgrabMessage.data.document._roll.data.margin : 0;
                grabResistSuccess = true;
            } else {
                victimGrabResistMargin = -1;
                grabResistSuccess = false;
                console.log(`------ unable to find lastgrabMessage: ${victimGrabResistMargin};`);
            }
            console.log(`---------- grabMargin: ${grabMargin};`);
            console.log(`---------- victimGrabResistMargin: ${victimGrabResistMargin};`);
            console.log(`grabResistSuccess: ${grabResistSuccess};`);
            grabMsg = ' ';
            grabMsgTitle = ' ';
            grabMsg = `<hr><p><b>${targetName}</b> is Grappled and must win a <b>Quick Contest</b> of <b>ST</b> vs attacker.</p>`;
            if (grabResistSuccess == true && victimGrabResistMargin >= 0 && victimGrabResistMargin >= grabMargin) {
                grabMsgTitle = `Resist Grab success `;
                grabMsg = `<p><b>Resist Grab success</b>:</p>
                <p><b>${targetName}</b> successfully wins a <b>Quick Contest</b> of <b>ST</b> vs attacker with a success margin of ${victimGrabResistMargin} versus a attacker's margin of ${grabMargin}.</p>`;
                if (ifDebug) console.log(grabMsg);
            } else if (grabResistSuccess == true && victimGrabResistMargin >= 0 && victimGrabResistMargin < grabMargin) {
                grabResistSuccess = false;
                grabMsgTitle = `Resist Grab fails`;
                grabMsg = `<hr><p><b>${targetName}</b> loses a <b>Quick Contest</b> of <b>ST</b> vs attacker.</p>
                <p><b>${targetName}</b> succeeded on ST check with a margin of ${victimGrabResistMargin}, but the margin was not enough to beat attacker's margin of ${grabMargin}.</p>
                <p><b>${targetName}</b> suffers <b>Grab and Go</b>.</p>`;
                if (ifDebug) console.log(grabMsg);
                console.log(`target ${targetName} suffers <b>Grab and Go.`);
            } else {
                grabResistSuccess = false;
                grabMsgTitle = `Resist Grab fails`;
                grabMsg = `<hr><p><b>${targetName}</b> loses a <b>Quick Contest</b> of <b>ST</b> vs attacker.</p>
                <p><b>${targetName}</b> suffers <b>Grab and Go</b>.</p>`;
                if (ifDebug) console.log(grabMsg);
                console.log(`target ${targetName} suffers <b>Grab and Go.`);
            }

        }
    }

}

if (grabResistSuccess == true) {
    if (grabMargin >= 0) {
        // success
        console.log(`${actorName} Grab and Go success with margin of ${grabMargin} using ${attackedWith} (${attackedWithFormula})`);
        grabMsg = `<p>${actorName} <b>succeeds at Grab and Go</b> with a margin of <b>${grabMargin}</b> using ${attackedWith} (${attackedWithFormula}), resulting in victim getting dragged along wherever the grappler wants.</p>`;
        await GURPS.executeOTF(grabOtF);
    } else {
        // failure
        console.log(`${actorName} <b>fails at Grab and Go</b> with margin of ${grabMargin} using ${attackedWith} (${attackedWithFormula})`);
        grabMsg = `<p>${actorName} <b>fails at Grab and Go</b> attempt (margin was <b>${grabMargin}</b> using ${attackedWith}: ${attackedWithFormula}).</p>`;
    }
}
console.log(`grabMsg:  ${grabMsg}`);
chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
    <strong>
        <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Grab and Go</span>
    </strong>
</p>`;
chatDescription += ` 
<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
        ${grabMsg}
        </span>
</p>`;
console.log(chatDescription);
await ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });		

console.log('------ End RoperGrappleResults: -----');
