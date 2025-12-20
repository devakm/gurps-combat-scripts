/* Usage: DetectCamouflageStealth 
    * GURPS script to check perception for player versus hidden or camouflaged tokens in an area 
*/
console.log(`---------- in DetectCamouflageStealth ---------`);

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

let failedPerception = []
let perceptionOtF = '/r [!PER-5!]';
let perceptionSuccess = false;
if (!(await GURPS.executeOTF(perceptionOtF))) {
    failedPerception.push(_token);
    perceptionSuccess = false;
} else {
    perceptionSuccess = true;
}

let originalActor = await GURPS.LastActor;
let originalModifiers = GURPS.ModifierBucket.modifiers;
let actorName = originalActor.name;
console.log(`----------------- Checking PERception for actorName: ${actorName};`);


wait(6);
let checkOtF = 'PER'
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);
let messageList = [];
let lastMessage;
let perceptionMargin = -1;
let ltrData = await GURPS.lastTargetedRolls[_token.actor.id];
if (ltrData != undefined && ltrData.failure == false) {
    perceptionMargin = ltrData.margin;
    console.log(`perceptionMargin: ${perceptionMargin};`);
}
if (perceptionSuccess == true) {
    messageList = game.messages.filter(i => 
        i.data.timestamp > ts 
        && i.data.speaker.alias == actorName  
        && i._roll != null
        && i._roll._formula.includes("3d6") == true 
        && i.data.content.includes(checkOtF) == true
        ); 
    for (let message of messageList) {
        console.log(`Message time: ${message.data.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} rolled for ${actorName}; perceptionMargin: ${message.data.document._roll.data.margin}`)};
    lastMessage;
    messageList.forEach(message => { lastMessage = message }); // pick the latest message

    perceptionMargin = lastMessage != undefined && lastMessage.data.document._roll != undefined ? lastMessage.data.document._roll.data.margin : 0;
    console.log(`perceptionMargin: ${perceptionMargin};`);

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

if (_token.data.hidden = true) { 
    // check if the token is hidden and has a stealth skill or chamouflage or both 
    // if so, then every token must make a stealth roll to remain hidden
} else {}
let stealthSuccess,camouflageSuccess,hasStealth,hasCamouflage,isTargetHidden = false;
let targetID,targetToken,targetActor,targetName,stealthMargin,camouflageMargin
let chatDescription,stealthMsg,camouflageMsg,lastStealthMessage,lastCamouflageMessage,stealthMessageList,camouflageMessageList;
let stealthOtF = `/r [S:Stealth]`; // /r [S:Stealth | DX-5 | IQ-5]
let camouflageOtF = `/r [S:Camouflage]`; // /r [S:Camouflage | IQ-4 | S:Survival-2]

let targets = Array.from(game.user.targets); 
if (perceptionSuccess == true) {
    // if the perception check is successful, then check each target for hidden status
    // and has a stealth skill or chamouflage or both
    for(let target of targets){ 
        stealthSuccess,camouflageSuccess,hasStealth,hasCamouflage,isTargetHidden = false;
        targetID = target.id;;
        isTargetHidden = target.data.hidden;
        targetToken = canvas.tokens.get(targetID); 
        await GURPS.SetLastActor(targetToken.actor);    
        wait(21);
        targetActor = await GURPS.LastActor;
        targetName = targetActor.name;
        console.log(`targetName: ${targetName}; targetID: ${targetID}; isTargetHidden: ${isTargetHidden}; `);
        if (isTargetHidden == true) {
            console.log(`target ${targetName} is hidden.`);
            camouflageSuccess,stealthSuccess,hasStealth,hasCamouflage = false;
            hasStealth = await GURPS.findSkillSpell(targetActor, 'Stealth', true)  != undefined ? true : false;
            hasCamouflage = await GURPS.findSkillSpell(targetActor, 'Camouflage', true)  != undefined ? true : false;
            console.log(`hasStealth: ${hasStealth}; hasCamouflage: ${hasCamouflage};`);
            
            if (hasStealth == true) {
                await GURPS.executeOTF(stealthOtF);
                wait(61);
                stealthMessageList = game.messages.filter(i => 
                    i.data.timestamp > ts 
                    && i.data.speaker.alias == targetName  
                    && i._roll != null
                    && i._roll._formula.includes("3d6") == true 
                    && i.data.content.includes('Stealth') == true
                    ); 
                for (let message of stealthMessageList) {
                    console.log(`time: ${message.data.timestamp} > ${ts} ; roll 3d6: ${message._roll._total} `)};
                lastStealthMessage = undefined;
                stealthMessageList.forEach(message => { lastStealthMessage = message }); // pick the latest message
                stealthMargin = lastStealthMessage != undefined && lastStealthMessage.data.document._roll != undefined ? lastStealthMessage.data.document._roll.data.margin : 0;
                console.log(`stealthMargin: ${stealthMargin};`);
                if (stealthMargin >= 0 && stealthMargin >= perceptionMargin) {
                    stealthSuccess = true;
                    stealthMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Stealth roll to remain hidden.</p>
                    <p><b>Stealth success</b>:</p>
                    <p><b>${targetName}</b> successfully remains hidden with a <b>Stealth</b> margin of ${stealthMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                    console.log(stealthMsg);
                } else {
                    stealthSuccess = false;
                    stealthMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Stealth roll to remain hidden.</p>
                    <p><b>Stealth success</b>:</p>
                    <p><b>${targetName}</b> fails to remain hidden with a <b>Stealth</b> margin of ${stealthMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                    console.log(stealthMsg);
                    console.log(`target ${targetName} is no longer hidden.`);
                }
                
            }
            // add camoflage check
            
        if (hasCamouflage == true) {
            await GURPS.executeOTF(camouflageOtF);
            wait(61);
            camouflageMessageList = game.messages.filter(i => 
                i.data.timestamp > ts 
                && i.data.speaker.alias == targetName  
                && i._roll != null
                && i._roll._formula.includes("3d6") == true 
                && i.data.content.includes('Camouflage') == true
                ); 
            for (let message of camouflageMessageList) {
                console.log(`time: ${message.data.timestamp} > ${ts} ; roll 3d6: ${message._roll._total}`)};
            lastCamouflageMessage = undefined;
            camouflageMessageList.forEach(message => { lastCamouflageMessage = message }); // pick the latest message
            camouflageMargin = lastCamouflageMessage != undefined && lastCamouflageMessage.data.document._roll != undefined ? lastCamouflageMessage.data.document._roll.data.margin : 0;
            console.log(`camouflageMargin: ${camouflageMargin};`);
            if (camouflageMargin >= 0 && camouflageMargin >= perceptionMargin) {
                camouflageSuccess = true;
                camouflageMsg = `<hr><p><b>${targetName}</b> is hidden and must make a <b>Camouflage</b> roll to remain hidden.</p>
                <p><b>Camouflage success</b>:</p>
                <p><b>${targetName}</b> successfully remains hidden with a <b>Camouflage</b> margin of ${camouflageMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                console.log(camouflageMsg);
            } else {
                camouflageSuccess = false;
                camouflageMsg = `<hr><p><b>${targetName}</b> is hidden and must make a <b>Camouflage</b> roll to remain hidden.</p>
                <p><b>Camouflage fails</b>:</p>
                <p><b>${targetName}</b> fails to remain hidden with a <b>Camouflage</b> margin of ${camouflageMargin} versus a perception margin of ${perceptionMargin}.</p>`;
                console.log(camouflageMsg);
                console.log(`target ${targetName} is no longer hidden.`);
            }

        } // end check camouflaged tokens
        // add chat message for each target
        chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
        <strong>
            <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Hidden</span>
        </strong>
        </p>`;
        chatDescription += ` 
        <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
                <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
                ${stealthMsg}
                ${camouflageMsg}
                </span>
        </p>`;
        console.log(chatDescription);
        console.log(chatDescription);
        ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
        { chatBubble: false });	
        await wait(21);
        if (stealthSuccess == true && camouflageSuccess == true) {
            targetToken.data.hidden = true;
            console.log(`target ${targetName} remains hidden.`);
        } else {
            targetToken.data.hidden = false;
            await targetToken.update({hidden:false});
            console.log(`target ${targetName} is no longer hidden.`);
        }
    } // end for each target
} // end perceptionSuccess
} else {
    console.log(`Blind perception check failed, so no hidden tokens detected.`);
}   
await GURPS.SetLastActor(originalActor);

console.log(`---------- End DetectCamouflageStealth ---------`);