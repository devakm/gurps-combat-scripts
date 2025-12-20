/* Usage: DetectResultsCamouflageStealth 
    * GURPS script to check perception for player versus hidden or camouflaged tokens in an area 
*/
let ifDebug = false;
let chatOutput = false;
console.log(`---------- in DetectResultsCamouflageStealth ---------`);
wait(2);
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}
async function getSkillMessageList(targetName,ts,skillName) {
    console.log(`getSkillMessageList for ${skillName} Messages for  ${targetName} at time: ${ts};`);
    // targetName = 'Gallant Troglodyte (1)';
    messageList = game.messages.filter(i => 
        i.timestamp > ts 
        && i.speaker.alias == targetName  
        && i._roll != null
        && i._roll._formula.includes("3d6") == true 
        && i.content.includes(skillName) == true
        ); 
        if (messageList.length > 0) {
            for (let message of messageList) {
                console.log(`messageList for ${skillName} Messages for  ${targetName} at time: ${message.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
            return messageList;
        } else {
            console.log(`No ${skillName} Messages for ${targetName} at time: ${ts} where message[x].content.includes('${skillName}');`);
            return [];
    }
}

wait(2);
let failedPerception = [];
let failedStealth = [];
let failedCamouflage = [];
let perceptionOtF = '/r [!PER-5!]';
let perceptionSuccess = false;
let originalActor = await GURPS.LastActor;
let originalModifiers = GURPS.ModifierBucket.modifiers;
let actorName = 'Unuspecting Player';
//let actorName = originalActor.name;
console.log(`----------------- Checking PERception for actorName: ${actorName};`);

let checkOtF = 'PER'
let messageList = [];
let lastMessage;
let perceptionMargin = -1;
let ltrData = await GURPS.lastTargetedRolls[_token.actor.id];
if (ltrData != undefined && ltrData.failure == false) {
    perceptionMargin = ltrData.margin;
    perceptionSuccess = true;
    console.log(`perceptionMargin: ${perceptionMargin};`);
}
if (perceptionSuccess == true) {
    if (perceptionMargin >= 0) {
        // success
        console.log(`${actorName} perception success`);
        perceptionSuccess = true;
    } else {
        // failure
        console.log(`${actorName} perception failure`);
        perceptionSuccess = false;
    }
}

if (_token.document.hidden = true) { 
    // check if the token is hidden and has a stealth skill or chamouflage or both 
    // if so, then every token must make a stealth roll to remain hidden
} else {}
let stealthSuccess,camouflageSuccess,hasStealth,hasCamouflage,isTargetHidden = false;
let targetID,targetToken,targetActor,targetName,stealthMargin,camouflageMargin
let chatDescription,stealthMsg,camouflageMsg;
let lastStealthMessage,lastCamouflageMessage,stealthMessageList,camouflageMessageList;
let stealthMsgTitle = ' ';
let camouflageMsgTitle = ' ';
let targets = Array.from(game.user.targets); 
if (perceptionSuccess == true) {
    // if the perception check is successful, then check each target for hidden status
    // and has a stealth skill or chamouflage or both
    for(let target of targets){ 
        stealthSuccess,camouflageSuccess,hasStealth,hasCamouflage,isTargetHidden = false;
        targetID = target.id;;
        isTargetHidden = target.document.hidden;
        targetToken = canvas.tokens.get(targetID); 
        await GURPS.SetLastActor(targetToken.actor);    
        wait(2);
        targetActor = await GURPS.LastActor;
        targetName = targetActor.name;
        console.log(`targetName: ${targetName}; targetID: ${targetID}; isTargetHidden: ${isTargetHidden}; `);
        if (isTargetHidden == true) {
            console.log(`target ${targetName} is hidden.`);
            camouflageSuccess,stealthSuccess,hasStealth,hasCamouflage = false;
            hasStealth = await GURPS.findSkillSpell(targetActor, 'Stealth', true)  != undefined ? true : false;
            hasCamouflage = await GURPS.findSkillSpell(targetActor, 'Camouflage', true)  != undefined ? true : false;
            console.log(`hasStealth: ${hasStealth}; hasCamouflage: ${hasCamouflage};`);
            wait(2);
            if (hasStealth == true) {
                // if the target has a stealth skill, then check the stealth roll to see if the target remains hidden
                stealthMessageList = await getSkillMessageList(targetName,ts,'Stealth');
                if (stealthMessageList == undefined && stealthMessageList.length == 0 ) {
                    console.log(`No Stealth Messages for ${targetName} at time: ${ts} where message[x].content.includes('Stealth'); wait(910) then try again.`);
                    wait(2);
                    stealthMessageList = await getSkillMessageList(targetName,ts,'Stealth');
                    if (stealthMessageList.length > 0) {
                        for (let message of stealthMessageList) {
                            console.log(`time: ${message.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
                    } else {
                        console.log(`No Stealth Messages for ${targetName} at time: ${ts} where message[x].content.includes('Stealth'); retries exhausted.`);
                    }
                } else if (stealthMessageList.length > 0) {
                    for (let message of stealthMessageList) {
                        console.log(`time: ${message.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
                }
                // if the stealth roll is successful, then check stealthMargin vs perceptionMargin to see if the target remains hidden
                //targetName = 'Gallant Troglodyte (1)';
                lastStealthMessage = undefined;
                stealthMessageList.forEach(message => { lastStealthMessage = message }); // pick the latest message
                if (lastStealthMessage != undefined && lastStealthMessage.content.includes('Critical Success!') == true) {
                    stealthMargin = 999;
                    stealthSuccess = true;
                } else if (lastStealthMessage != undefined && lastStealthMessage.content.includes('Critical Failure!') == true) {
                    stealthMargin = -999;
                    stealthSuccess = false;
                } else if (lastStealthMessage != undefined) {                    
                    stealthMargin = lastStealthMessage != undefined && lastStealthMessage.document._roll != undefined ? lastStealthMessage.document._roll.margin : 0;
                    stealthSuccess = true;
                } else {
                    stealthMargin = -1;
                    stealthSuccess = false;
                    console.log(`------ unable to find lastStealthMessage: ${stealthMargin};`);
                }
                console.log(`stealthMargin: ${stealthMargin};`);
                console.log(`stealthSuccess: ${stealthSuccess};`);
                stealthMsg = ' ';
                stealthMsgTitle = ' ';
                if (stealthSuccess == true && stealthMargin >= 0 && stealthMargin >= perceptionMargin) {
                    stealthMsgTitle = `Stealth success `;
                    stealthMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Stealth roll to remain hidden.</p>
                    <p><b>Stealth success</b>:</p>
                    <p><b>${targetName}</b> successfully remains hidden with a <b>Stealth</b> margin of ${stealthMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                    if (ifDebug) console.log(stealthMsg);
                } else if (stealthSuccess == true && stealthMargin >= 0 && stealthMargin < perceptionMargin) {
                    stealthSuccess = false;
                    stealthMsgTitle = `Stealth fails`;
                    stealthMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Stealth roll to remain hidden.</p>
                    <p><b>Stealth success but not enough to beat Perception</b>:</p>
                    <p><b>${targetName}</b> fails to remain hidden with a <b>Stealth</b> margin of ${stealthMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                    if (ifDebug) console.log(stealthMsg);
                    console.log(`target ${targetName} is no longer hidden.`);
                } else {
                    stealthSuccess = false;
                    stealthMsgTitle = `Stealth fails`;
                    stealthMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Stealth roll to remain hidden.</p>
                    <p><b>Stealth fails</b>:</p>
                    <p><b>${targetName}</b> fails to remain hidden.</p>`;
                    if (ifDebug) console.log(stealthMsg);
                    console.log(`target ${targetName} is no longer hidden.`);
                }
            }
            // add camoflage check
        
            if (hasCamouflage == true) {    

                // if the target has a camouflage skill, then check the camouflage roll to see if the target remains hidden
                camouflageMessageList = await getSkillMessageList(targetName,ts,'Camouflage');
                if (camouflageMessageList == undefined && camouflageMessageList.length == 0 ) {
                    console.log(`No Camouflage Messages for ${targetName} at time: ${ts} where message[x].content.includes('Camouflage'); wait(910) then try again.`);
                    wait(2);
                    camouflageMessageList = await getSkillMessageList(targetName,ts,'Camouflage');
                    if (camouflageMessageList.length > 0) {
                        for (let message of camouflageMessageList) {
                            console.log(`time: ${message.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
                    } else {
                        console.log(`No Camouflage Messages for ${targetName} at time: ${ts} where message[x].content.includes('Camouflage'); retries exhausted.`);
                    }
                } else if (camouflageMessageList.length > 0) {
                    for (let message of camouflageMessageList) {
                        console.log(`time: ${message.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
                }
                // if the camouflage roll is successful, then check camouflageMargin vs perceptionMargin to see if the target remains hidden
                //targetName = 'Gallant Troglodyte (1)';
                lastCamouflageMessage = undefined;
                camouflageMessageList.forEach(message => { lastCamouflageMessage = message }); // pick the latest message
                if (lastCamouflageMessage != undefined && lastCamouflageMessage.content.includes('Critical Success!') == true) {
                    camouflageMargin = 999;
                    camouflageSuccess = true;
                } else if (lastCamouflageMessage != undefined && lastCamouflageMessage.content.includes('Critical Failure!') == true) {
                    camouflageMargin = -999;
                    camouflageSuccess = false;
                } else if (lastCamouflageMessage != undefined && lastCamouflageMessage.content.includes('Failure!') == true) {
                    camouflageMargin = -1;
                    camouflageSuccess = false;
                } else if (lastCamouflageMessage != undefined && lastCamouflageMessage.content.includes('Success!') == true) {
                    camouflageMargin = lastCamouflageMessage != undefined && lastCamouflageMessage.document._roll != undefined ? lastCamouflageMessage.document._roll.margin : 0;
                    camouflageSuccess = true;
                } else if (lastCamouflageMessage != undefined) {                    
                    camouflageMargin = lastCamouflageMessage != undefined && lastCamouflageMessage.document._roll != undefined ? lastCamouflageMessage.document._roll.margin : 0;
                    camouflageSuccess = true;
                } else {
                    camouflageMargin = -1;
                    camouflageSuccess = false;
                    console.log(`------ unable to find lastCamouflageMessage: ${camouflageMargin};`);
                }
                console.log(`${targetName} camouflageMargin: ${camouflageMargin};`);
                console.log(`${targetName} camouflageSuccess: ${camouflageSuccess};`);
                camouflageMsg = ' ';
                camouflageMsgTitle = ' ';
                if (camouflageSuccess == true && camouflageMargin >= 0 && camouflageMargin >= perceptionMargin) {
                    camouflageMsgTitle = `Camouflage success`;
                    camouflageMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Camouflage roll to remain hidden.</p>
                    <p><b>Camouflage success</b>:</p>
                    <p><b>${targetName}</b> successfully remains hidden with a <b>Camouflage</b> margin of ${camouflageMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                    if (ifDebug) console.log(camouflageMsg);
                } else if (camouflageSuccess == true && camouflageMargin >= 0 && camouflageMargin < perceptionMargin) {
                    camouflageSuccess = false;
                    camouflageMsgTitle = `Camouflage fails`;
                    camouflageMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Camouflage roll to remain hidden.</p>
                    <p><b>Camouflage success but not enough to beat Perception</b>:</p>
                    <p><b>${targetName}</b> fails to remain hidden with a <b>Camouflage</b> margin of ${camouflageMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                    if (ifDebug) console.log(camouflageMsg);
                    console.log(`target ${targetName} is no longer hidden.`);
                } else {
                    camouflageSuccess = false;
                    camouflageMsgTitle = `Camouflage fails`;
                    camouflageMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Camouflage roll to remain hidden.</p>
                    <p><b>Camouflage fails</b>:</p>
                    <p><b>${targetName}</b> fails to remain hidden.</p>`;
                    if (ifDebug) console.log(camouflageMsg);
                    console.log(`target ${targetName} is no longer hidden.`);
                }
            }
         // end check camouflaged tokens
        // add chat message for each target
        let DetectStealthTitle = ' ';
        if (camouflageMsgTitle.length > 1 && stealthMsgTitle.length > 1) {
            DetectStealthTitle = `${stealthMsgTitle} & ${camouflageMsgTitle}`;
        } else if (stealthMsgTitle.length > 1) {
            DetectStealthTitle = `${stealthMsgTitle}`;
        } else if (camouflageMsgTitle.length > 1) {
            DetectStealthTitle = `${camouflageMsgTitle}`;
        }
        chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <strong>
            <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">${DetectStealthTitle}</span>
        </strong>
        </p>`;
        chatDescription += ` 
        <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
                <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
                ${stealthMsg}
                ${camouflageMsg}
                </span>
        </p>`;
        if (ifDebug) console.log(chatDescription);
        if (chatOutput == true) {
            ChatMessage.create({
            content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor), blind: true }, 
            { chatBubble: false });	
        } 

        await wait(2);
        revealTargetMsg = ' ';
        if (hasStealth == true && stealthSuccess == true && hasCamouflage == true && camouflageSuccess == true) {
            targetToken.document.hidden = true;
            console.log(`target ${targetName} remains hidden; Stealth and Camouflage both succeeded.`);
        } else if (hasStealth == true && stealthSuccess == true && hasCamouflage == false) {
            targetToken.document.hidden = true;
            console.log(`target ${targetName} remains hidden; Stealth succeeded.`);
        } else if (hasStealth == true && stealthSuccess == false) {
            targetToken.document.hidden = false;
            if (await targetActor.token.update({hidden:false})) {
                console.log(`target ${targetName} is no longer hidden.`);
                revealTargetMsg = `<p><b>${targetName}</b> is no longer hidden.</p>
                <p><b>Stealth fails</b>:</p>
                <p><b>${targetName}</b> fails to remain hidden with a <b>Stealth</b> margin of ${stealthMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                console.log(revealTargetMsg);
            } else {
                console.log(`target ${targetName} failed to update hidden status.`);
            }
        } else if (hasCamouflage == true && camouflageSuccess == false) {
            targetToken.document.hidden = false;
            if (await targetActor.token.update({hidden:false})) {
                console.log(`target ${targetName} is no longer hidden.`);
                revealTargetMsg = `<p><b>${targetName}</b> is no longer hidden.</p>
                <p><b>Camouflage fails</b>:</p>
                <p><b>${targetName}</b> fails to remain hidden with a <b>Camouflage</b> margin of ${camouflageMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                console.log(revealTargetMsg);
            } else {
                console.log(`target ${targetName} failed to update hidden status.`);
            }
        } else {
            targetToken.document.hidden = false;
            if (await targetActor.token.update({hidden:false})) {
                console.log(`target ${targetName} is no longer hidden.`);
                revealTargetMsg = `<p><b>${targetName}</b> is no longer hidden.</p>
                <p><b>Stealth success but not enough to beat Perception</b>:</p>
                    <p><b>${targetName}</b> fails to remain hidden with a <b>Stealth</b> margin of ${stealthMargin} versus a perception margin of ${perceptionMargin}.</p>`;
            } else {
                console.log(`target ${targetName} failed to update hidden status.`);
            }
        }
        if (revealTargetMsg.length > 1) {
            chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <strong>
                <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Reveal Hidden Actor</span>
            </strong>
            </p>`;
            chatDescription += ` 
            <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
                    <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
                    ${revealTargetMsg}
                    </span>
            </p>`;
        }
        if (ifDebug) console.log(chatDescription);
        if (revealTargetMsg.length > 1) {
            ChatMessage.create({
            content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
            { chatBubble: false });	
        } 
        console.log(`-------- End for target ${targetName}.`);
    } // end for each target
} // end perceptionSuccess
} else {
    console.log(`Blind perception check failed, so no hidden tokens detected.`);
}   
await GURPS.SetLastActor(originalActor);

console.log(`---------- End DetectResultsCamouflageStealth ---------`);