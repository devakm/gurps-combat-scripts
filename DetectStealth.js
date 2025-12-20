/* Usage: /:DetectStealth tag=<sourceTag>
Example
    /:DetectStealth tag=DetectStealthBXT01

    * GURPS script to check perception for player versus hidden  tokens in an area 
*/
console.log(`---------- in DetectStealth ---------`);

let sourceTag = 'DetectStealthBXT52';
//let sourceTag = 'DetectStealthBXT01';
// console.log(`sourceTag:${sourceTag}`);
//let sourceTag = 'DetectStealthBXT01';
//let sourceTag = 'DetectStealthBXT01';

try {
    console.log(scope)
	sourceTag = scope.tag ? scope.tag : sourceTag
} catch (error) {
    console.error('Error accessing scope:', error);
}
console.log(`sourceTag: ${sourceTag};`);

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

//target the tile to select targets and trigger the perception check vs those hidden targets using Stealth and Camouflage
let triggerTag = sourceTag;
let tile= Tagger.getByTag(triggerTag);
tile[0].trigger({});

// initialize variables
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);
let failedPerception = [];
let failedStealth = [];
let failedCamouflage = [];


let perceptionOtF = '/r [!Per-5 | !Sk:"Observation" | !Sk:"Shadowing"-5 (Based:Per)]';
let perceptionSuccess = false;
if (!(await GURPS.executeOTF(perceptionOtF))) {
    perceptionSuccess = false;
} else {
    perceptionSuccess = true;
}

await wait(6);
let perceptionMargin = -1;
let ltrData = await GURPS.lastTargetedRolls[_token.actor.id];
if (ltrData != undefined && ltrData.failure == false) {
    perceptionMargin = ltrData.margin;
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

let originalActor = await GURPS.LastActor;

if (_token.document.hidden = true) { 
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
        isTargetHidden = target.document.hidden;
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
            wait(21);
            if (hasStealth == true) {
                if (!(await GURPS.executeOTF(stealthOtF))) {
                    failedStealth.push(targetToken);
                    stealthSuccess = false;
                    console.log(`Stealth roll failed for ${targetName}.`);
                } else {
                    stealthSuccess = true;
                    console.log(`Stealth roll success for ${targetName}.`);
                }
                wait(1);
                stealthMsg = '';
                if (stealthSuccess == true) {
                    // if the stealth roll is successful, then check stealthMargin vs perceptionMargin to see if the target remains hidden (folloup with external script)
                    stealthMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Stealth roll to remain hidden.</p>
                    <p><b>Stealth success</b>:</p>
                    <p><b>${targetName}</b> successfully used <b>Stealth</b>. Checking margin vs perception momentarily....</p>`;
                    console.log(stealthMsg);
                } else {
                    stealthSuccess = false;
                    stealthMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Stealth roll to remain hidden.</p>
                    <p><b>Stealth fails</b>:</p>
                    <p><b>${targetName}</b> fails to remain hidden.</p>`;
                    console.log(stealthMsg);
                    console.log(`target ${targetName} is no longer hidden.`);
                }
                
            }
            // add camoflage check
        
            if (hasCamouflage == true) {    
                if (!(await GURPS.executeOTF(camouflageOtF))) {
                    failedCamouflage.push(targetToken);
                    camouflageSuccess = false;
                    console.log(`Camouflage roll failed for ${targetName}.`);
                } else {
                    camouflageSuccess = true;
                    console.log(`Camouflage roll success for ${targetName}.`);
                }
                wait(1);
                camouflageMsg = '';
                if (camouflageSuccess == true) {
                    // if the camouflage roll is successful, then check camouflageMargin vs perceptionMargin to see if the target remains hidden (folloup with external script)
                    camouflageMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Camouflage roll to remain hidden.</p>
                    <p><b>Camouflage success</b>:</p>
                    <p><b>${targetName}</b> successfully used <b>Camouflage</b>. Checking margin vs perception momentarily....</p>`;
                    console.log(camouflageMsg);
                } else {
                    camouflageSuccess = false;
                    camouflageMsg = `<hr><p><b>${targetName}</b> is hidden and must make a Camouflage roll to remain hidden.</p>
                    <p><b>Camouflage fails</b>:</p>
                    <p><b>${targetName}</b> fails to remain hidden.</p>`;
                    console.log(camouflageMsg);
                    console.log(`target ${targetName} is no longer hidden.`);
                }
            }
         // end check camouflaged tokens
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
        /* console.log(chatDescription);
        ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor), blind: true }, 
        { chatBubble: false});	
         */
        await wait(9);
    } // end for each target
} // end perceptionSuccess
} else {
    console.log(`Blind perception check failed, so no hidden tokens detected.`);
}   
await GURPS.SetLastActor(originalActor);
let macro = game.macros.getName("DetectResultsSilent");
if (macro) {
    await macro.execute( );
} else {
    console.log(`Macro DetectResultsSilent not found.`);
}
console.log(`---------- End DetectStealth ---------`);