/* Usage: /:SetStatusOnTarget <statusName> */

let cubData = [
    {
        "id": "prone",
        "name": "GURPS.STATUSProne",
        "icon": "systems/gurps/icons/statuses/dd-condition-prone.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "kneel",
        "name": "GURPS.STATUSKneel",
        "icon": "systems/gurps/icons/statuses/condition-kneel.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "crouch",
        "name": "GURPS.STATUSCrouch",
        "icon": "systems/gurps/icons/statuses/condition-crouch.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "sit",
        "name": "GURPS.STATUSSit",
        "icon": "systems/gurps/icons/statuses/condition-sit.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "crawl",
        "name": "GURPS.STATUSCrawling",
        "icon": "systems/gurps/icons/statuses/condition-crawl.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "grapple",
        "name": "GURPS.STATUSGrapple",
        "icon": "systems/gurps/icons/statuses/path-condition-grappled.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "stun",
        "name": "EFFECT.StatusStunned",
        "icon": "systems/gurps/icons/statuses/dd-condition-stunned.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "mentalstun",
        "name": "GURPS.StatusStunnedMental",
        "icon": "systems/gurps/icons/statuses/dd-condition-stunned-iq.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "shock1",
        "name": "EFFECT.StatusShocked",
        "icon": "systems/gurps/icons/statuses/condition-shock1.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "shock2",
        "name": "EFFECT.StatusShocked",
        "icon": "systems/gurps/icons/statuses/condition-shock2.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "shock3",
        "name": "EFFECT.StatusShocked",
        "icon": "systems/gurps/icons/statuses/condition-shock3.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "shock4",
        "name": "EFFECT.StatusShocked",
        "icon": "systems/gurps/icons/statuses/condition-shock4.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "reeling",
        "name": "GURPS.STATUSReeling",
        "icon": "systems/gurps/icons/statuses/cth-condition-major-wound.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "exhausted",
        "name": "GURPS.STATUSExhausted",
        "icon": "systems/gurps/icons/statuses/path-condition-exhausted.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "fly",
        "name": "GURPS.STATUSFly",
        "icon": "systems/gurps/icons/statuses/x-flying.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "fall",
        "name": "GURPS.STATUSFall",
        "icon": "systems/gurps/icons/statuses/condition-fall.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "pinned",
        "name": "GURPS.STATUSPin",
        "icon": "systems/gurps/icons/statuses/path-condition-pinned.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "nauseated",
        "name": "GURPS.STATUSNauseated",
        "icon": "systems/gurps/icons/statuses/path-condition-nauseated.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "coughing",
        "name": "GURPS.STATUSCoughing",
        "icon": "systems/gurps/icons/statuses/condition-cough.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "retching",
        "name": "GURPS.STATUSRetching",
        "icon": "systems/gurps/icons/statuses/condition-wretch.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "drowsy",
        "name": "GURPS.STATUSDrowsy",
        "icon": "systems/gurps/icons/statuses/x-drowsy.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "sleeping",
        "name": "GURPS.STATUSSleep",
        "icon": "systems/gurps/icons/statuses/x-asleep.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "tipsy",
        "name": "GURPS.STATUSTipsy",
        "icon": "systems/gurps/icons/statuses/condition-drunk1.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "drunk",
        "name": "GURPS.STATUSDrunk",
        "icon": "systems/gurps/icons/statuses/condition-drunk2.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "euphoria",
        "name": "GURPS.STATUSEuphoria",
        "icon": "systems/gurps/icons/statuses/path-condition-fascinated.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "mild_pain",
        "name": "GURPS.STATUSMildPain",
        "icon": "systems/gurps/icons/statuses/condition-pain1.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "moderate_pain",
        "name": "GURPS.STATUSModeratePain",
        "icon": "systems/gurps/icons/statuses/condition-pain2.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "moderate_pain2",
        "name": "GURPS.STATUSModeratePain",
        "icon": "systems/gurps/icons/statuses/condition-pain3.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "severe_pain",
        "name": "GURPS.STATUSSeverePain",
        "icon": "systems/gurps/icons/statuses/condition-pain4.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "severe_pain2",
        "name": "GURPS.STATUSSeverePain",
        "icon": "systems/gurps/icons/statuses/condition-pain5.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "terrible_pain",
        "name": "GURPS.STATUSTerriblePain",
        "icon": "systems/gurps/icons/statuses/condition-pain6.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "agony",
        "name": "GURPS.STATUSAgony",
        "icon": "systems/gurps/icons/statuses/path-condition-helpless.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bleed",
        "name": "GURPS.STATUSBleed",
        "icon": "systems/gurps/icons/statuses/path-condition-bleeding.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "poison",
        "name": "GURPS.STATUSPoison",
        "icon": "systems/gurps/icons/statuses/dd-condition-poisoned.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "burn",
        "name": "GURPS.STATUSBurn",
        "icon": "systems/gurps/icons/statuses/x-burning.webp",
        "referenceId": "",
        "activeEffect": {
            "label": "GURPS.STATUSBurn",
            "icon": "systems/gurps/icons/statuses/x-burning.webp",
            "tint": "",
            "disabled": false,
            "duration": {
                "seconds": null,
                "startTime": null,
                "rounds": null,
                "turns": null,
                "startRound": null,
                "startTurn": null
            },
            "changes": [],
            "flags": {
                "combat-utility-belt": {
                    "conditionId": "burn"
                }
            }
        },
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "suffocate",
        "name": "GURPS.STATUSSuffocate",
        "icon": "systems/gurps/icons/statuses/condition-suffocate.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "disabled",
        "name": "GURPS.STATUSDisable",
        "icon": "systems/gurps/icons/statuses/dd-condition-unconscious.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "blind",
        "name": "GURPS.STATUSBlind",
        "icon": "systems/gurps/icons/statuses/dd-condition-blinded.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "deaf",
        "name": "GURPS.STATUSDeaf",
        "icon": "systems/gurps/icons/statuses/dd-condition-deafened.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "silence",
        "name": "GURPS.STATUSSilence",
        "icon": "systems/gurps/icons/statuses/x-silenced.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "stealth",
        "name": "GURPS.STATUSStealth",
        "icon": "systems/gurps/icons/statuses/x-stealth.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "waiting",
        "name": "GURPS.STATUSWait",
        "icon": "systems/gurps/icons/statuses/x-low-light-vision.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "sprint",
        "name": "GURPS.STATUSSprint",
        "icon": "systems/gurps/icons/statuses/x-haste.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num1",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-1.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num2",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-2.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num3",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-3.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num4",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-4.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num5",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-5.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num6",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-6.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num7",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-7.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num8",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-8.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num9",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-9.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "num10",
        "name": "GURPS.STATUSCounter",
        "icon": "systems/gurps/icons/statuses/number-10.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad+1",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD+1.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad+2",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD+2.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad+3",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD+3.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad+4",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD+4.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad+5",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD+5.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad-1",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD-1.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad-2",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD-2.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad-3",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD-3.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad-4",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD-4.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "bad-5",
        "name": "GURPS.STATUSBad",
        "icon": "systems/gurps/icons/statuses/BAD-5.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "disarmed",
        "name": "GURPS.STATUSDisarmed",
        "icon": "systems/gurps/icons/statuses/disarmed.webp",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "ac73k2usr9lqluvs",
        "name": "Frozen",
        "icon": "icons/svg/frozen.svg",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "wmduzdj0ayanr7r7",
        "name": "Dazed",
        "icon": "icons/svg/daze.svg",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    },
    {
        "id": "2z0hbskt6hdapwzy",
        "name": "Paralyzed",
        "icon": "icons/svg/paralysis.svg",
        "referenceId": "",
        "options": {
            "overlay": false,
            "removeOthers": false,
            "outputChat": true,
            "markDefeated": false
        }
    }
]

console.log('------in SetStatusOnTarget: Setting status on target -----');
//let statusName = args[0][1]; // Assuming the status name is passed as an argument
//let statusId = 'grapple';
let statusId = args[0][1]; // Assuming the status name is passed as an argument
console.log(`statusId: ${statusId}`);
let originalActor = await GURPS.LastActor;
let targets = Array.from(game.user.targets);
let con_list = [];
let statusName = game.cub.conditions.find(condition => condition.id === statusId).name;
let setStatusOtF = `/r [/status on ${statusName}]`;
con_list.push(statusName);
console.log(`statusName: ${statusName}`);
let targetID,targetToken

for (let target of targets) {
    targetID = target.id;;
    targetToken = canvas.tokens.get(targetID);
    //await GURPS.SetLastActor(targetToken.actor);

    //await GURPS.executeOTF(setStatusOtF);

    if (game.cub.hasCondition(con_list, targetToken)) {
        console.log(`Target already has status: ${statusName}`);
     } else {
        console.log(`Target does not yet have status: ${statusName}, so adding it now.`);
        await game.cub.addCondition(con_list, targetToken.actor);
        //await game.cub.addCondition(con_list, targetToken.name);
        //await game.cub.addCondition(con_list, targetToken);
    }
}

await GURPS.SetLastActor(originalActor);
console.log('------ End SetStatusOnTarget: Setting status on target -----');
