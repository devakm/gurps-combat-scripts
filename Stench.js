/* Usage: /:Stench
*/


const originalActor = await GURPS.LastActor;
let actorName = originalActor.name;

let AdvantageName ='Stench'; //  name of the advantage to boost /:Reaction check
let AdvantageCostPerLevel = 5;
let AdvantagePoints = GURPS.findAdDisad(_token.actor,AdvantageName) ? Number(GURPS.findAdDisad(_token.actor,AdvantageName).points): -1;
console.log(`AdvantageName: ${AdvantageName}; AdvantagePoints: ${AdvantagePoints} `);

let useAdvantage = false;
if (AdvantagePoints > -1) {
    useAdvantage = true;
    console.log(`useAdvantage:${useAdvantage};`);
} else console.log(`AdvantagePoints for ${AdvantageName}; is False `);

let stenchModifier = 0;
let OtF, retchOtF = ''; // On the Fly code
if (useAdvantage) {
    stenchModifier =+ AdvantagePoints/AdvantageCostPerLevel;
    console.log(`stenchModifier:${stenchModifier};`);
    OtF =  `!/anim Fumes_03_Toxic_Green c90 *0.3 0.5 \\\\/r [-${stenchModifier} Stench potency] \\\\/r [/if [HT] s:{You resist the stench} f:{You suffer nausea from the stench \\\\/r [-2 to all attribute and skill rolls] \\\\/r [-1 to active defenses]}]`;
    console.log(OtF);
    retchOtF =  `["Retching-${stenchModifier}"/r [/if [HT-${stenchModifier}] s:{You resist Retching.} f:{You suffer Retching\\\\/r [-5 to all attribute and skill rolls] \\\\/r [-4 to active defenses]}]]`;
} else console.log(`Stench is False.`);

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

  
let targetID,targetToken,targetActor,targetHT,targetName,stenchDescription,chatDescription;
let nauseaDefaultDuration = 25;
let nauseaDuration = 0;
// now that we found the attackDamageTotal, we need to compare it to ST of the target(s)
let targets = Array.from(game.user.targets); 
if (useAdvantage) {
    for(let target of targets){ 
        targetID = target.id;;
        targetToken = canvas.tokens.get(targetID);
        console.log(`targetID: ${targetID}`);
        await GURPS.SetLastActor(targetToken.actor);
        targetActor = await GURPS.LastActor;
        targetName = targetActor.name;
        await GURPS.executeOTF(OtF);
        targetHT = targetActor.data.data.attributes.HT.value;
        console.log(`target: [${targetID}]-${targetName}, HT ${targetHT} minus stenchModifier: [${stenchModifier}]`);
        nauseaDuration = Number(nauseaDefaultDuration)-Number(targetHT);
        console.log(`nauseaDuration: [${nauseaDuration}]`);
        stenchDescription = `<p>Target <b>${targetName}</b> is assaulted by a powerful <b>Stench</b>, must <b>Resist Nausea</b> and has a chance of <b>Retching</b>.</p>`;
        stenchDescription += `<p>If target fails to Resist Nausea, then suffer its effects for ${nauseaDuration} (25-HT seconds).</p>`;
        stenchDescription += `<p>On the next turn after being afflicted with Nausea, make another HT roll to avoid Retching. Use ${retchOtF}.</p>`;
        stenchDescription += `<p>If you fail, then you're conscious but vomiting (or suffering dry heaves). You cannot benefit from potions – you’ll just throw them up! You can act, but you have -5 to DX, IQ, and Per, and automatically fail at anything that requires a Concentrate maneuver.</p>`;
        console.log(stenchDescription);
        chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
            <strong>
                <span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Stench</span>
            </strong>
        </p>`;
        chatDescription += ` 
        <p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
                <span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
                ${stenchDescription}
                </span>
        </p>`;
        console.log(chatDescription);
        ChatMessage.create({
        content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor)}, 
        { chatBubble: false });	
        await wait(9);
    };
    GURPS.SetLastActor(originalActor)
} else console.log(`No Stench Advantage found.`);
