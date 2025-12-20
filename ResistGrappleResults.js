/* Usage: ResistGrappleResults 
    * create a GURPS script implement the results of a successful Grapple grabing attack. If you succeed on a grapple against an opponent no larger than your own SM, on your next turn, and each successive turn, roll a Quick Contest of your ST vs. your victim’s ST or HT, whichever is higher. If you win, your victim takes damage equal to your margin of victory; otherwise, no damage is inflicted.

*/
console.log('------in ResistGrappleResults -----');
let messageList = [];

async function wait(x) {
    console.log(`wait(x) for ${x} seconds.`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

async function getSTMessageList(targetName,ts) {
    console.log(`-------------- getSTMessageList for Messages for  ${targetName} at time: ${ts};`);
    // targetName = 'Gallant Troglodyte (1)';
    await wait(1);
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

let ifDebug = false;
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let grabMargin = -999;
let victimGrabResistMargin = -999;
let grabResistSuccess = false;
let isFirstGrapple = true;
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
let targetID,targetToken,targetActor,targetName,targetST,hasEffects,grabMessageList,lastGrabMessage,grabMsgTitle,lastActor;
let targetMsgList,rolledTotal,rolledMargin;
let targets = Array.from(game.user.targets); 
console.log(`Wait for messages to settle before checking targets: ${targets.length};`);
await wait(3);
for(let target of targets){ 
    //let targets = Array.from(game.user.targets); 
    //let target = targets[0];
    targetID = target.id;;
    targetToken = canvas.tokens.get(targetID); 
    hasEffects = targetToken.actor.data.effects.hasOwnProperty ? true : false;
    targetActor = targetToken.actor;
    targetName = targetActor.name;
    targetMsgList = game.messages.filter(i =>
        i.data != undefined
        && i.data.timestamp > ts
        && i.data.speaker.alias == targetActor.name
        && i._roll != null
        && i.data.roll.includes("3d6[ST]") == true);
    console.log(`targetMsgList: ${targetMsgList.length};`);
    lastGrabMessage = undefined;
    targetMsgList.forEach(message => { lastGrabMessage = message }); // pick the latest message
    if (lastGrabMessage != undefined){
        console.log(`lastGrabMessage: ${lastGrabMessage.data.content};`);
    }
    rolledTotal = lastGrabMessage != undefined ? lastGrabMessage.data.document._roll.total : 999;
    await GURPS.SetLastActor(targetActor);
    await wait(5);
    lastActor = await GURPS.LastActor;
    console.log(`------------ ResistGrappleResult lastActor name: ${lastActor.name}; should match targetName: ${targetName};`);
    targetST = Number(lastActor.data.data.attributes.ST.value)+4;
    rolledMargin = Number(targetST) - Number(rolledTotal);
    console.log(`--------- ResistGrappleResult targetName: ${targetName}; targetID: ${targetID}; targetST: ${targetST}; rolledMargin: ${rolledMargin};`);
    if (hasEffects == true) {
        isGrappled = lastActor.data.effects.filter(i => i.data.label == 'GURPS.STATUSGrapple').length > 0 ? true : false ;
        if (isGrappled == true) {

            if (lastGrabMessage != undefined && lastGrabMessage.data.content.includes('Critical Success!') == true) {
                victimGrabResistMargin = 999;
                grabResistSuccess = true;
            } else if (lastGrabMessage != undefined && lastGrabMessage.data.content.includes('Critical Failure!') == true) {
                victimGrabResistMargin = -999;
                grabResistSuccess = false;
            } else if (lastGrabMessage != undefined && rolledMargin > 0) {
                victimGrabResistMargin = rolledMargin != undefined ? rolledMargin : 0;
                grabResistSuccess = true;
            } else if (lastGrabMessage != undefined && lastGrabMessage.data.document._roll.data.margin != undefined) { 
                victimGrabResistMargin = lastGrabMessage != undefined && lastGrabMessage.data.document._roll != undefined ? lastGrabMessage.data.document._roll.data.margin : 0;
                grabResistSuccess = true;
            } else {
                victimGrabResistMargin = -1;
                grabResistSuccess = false;
                console.log(`------ unable to find lastGrabMessage: ${victimGrabResistMargin};`);
            }
            console.log(`---------- ${originalActor.name} grabMargin: ${grabMargin};`);
            console.log(`---------- ${targetName} victimGrabResistMargin: ${victimGrabResistMargin};`);
            console.log(`grabResistSuccess: ${grabResistSuccess};`);
            grabMsg = ' ';
            grabMsgTitle = ' ';
            grabMsg = `<hr><p><b>${targetName}</b> is Grappled and must win a <b>Quick Contest</b> of <b>ST</b> vs attacker.</p>`;
            if (grabResistSuccess == true && victimGrabResistMargin >= 0 && victimGrabResistMargin >= grabMargin) {
                isFirstGrapple = false;
                grabMsgTitle = `Resist Grab success `;
                grabMsg = `<p><b>Resist Grab success</b>:</p>
                <p><b>${targetName}</b> successfully wins a <b>Quick Contest</b> of <b>ST+4</b> vs attacker with a success margin of ${victimGrabResistMargin} versus a attacker's margin of ${grabMargin}.</p>`;
                if (ifDebug) console.log(grabMsg);
            } else if (grabResistSuccess == true && victimGrabResistMargin >= 0 && victimGrabResistMargin < grabMargin) {
                grabResistSuccess = false;
                isFirstGrapple = false;
                grabMsgTitle = `Resist Grab fails`;
                grabMsg = `<hr><p><b>${targetName}</b> loses a <b>Quick Contest</b> of <b>ST+4</b> vs attacker.</p>
                <p><b>${targetName}</b> succeeded on ST check with a margin of ${victimGrabResistMargin}, but the margin was not enough to beat attacker's margin of ${grabMargin}.</p>
                <p><b>${targetName}</b> suffers <b>Grab and Go</b>.</p>`;
                if (ifDebug) console.log(grabMsg);
                console.log(`target ${targetName} suffers <b>Grab and Go.`);
            } else {
                isFirstGrapple = true;
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
await wait(5);
await GURPS.SetLastActor(originalActor);
await wait(5);
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
if (isFirstGrapple == false) {
    await ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
    { chatBubble: false });		
}
if (grabResistSuccess == false && isFirstGrapple == false) {
    console.log(`Grab and Go succeeded, so Drag, then Bite.`); // Bite
    let macroDrag = game.macros.getName("GrappleDrag");
    if (macroDrag) {
        await macroDrag.execute();
    } else {
        console.log(`Macro GrappleDrag not found.`);
    }
    let macroBite = game.macros.getName("RoperBite");
    if (macroBite) {
        await macroBite.execute();
    } else {
        console.log(`Macro RoperBite not found.`);
    }
}   


console.log('------ End ResistGrappleResults: -----');
