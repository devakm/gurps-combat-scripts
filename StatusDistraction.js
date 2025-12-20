/* Usage: /:StatusDistraction
*/
console.log('---------------------- Start StatusDistraction ----------------------');

// OtF action setup: 
let effectName ='Distraction'; //   effect name, i.e. [M:Distraction]
let effectId ='distraction'; //   effect name, i.e. [M:Distraction]
let effectDescription = 'to defense (Deceptive Attack)'; // Text description of the effect
let effectPenalty = -1;
let effectTag = '#defense';
let effectClear = false; // clear only; if true and effect is not set, do not set it again

// check for argument defining the effect name
//let scope = {}; // Define the scope variable
if (scope !== undefined) {
    console.log(scope)
    effectName = scope.effect ? scope.effect : 'Distraction';
    effectId = scope.id ? scope.id : 'distraction';
    effectDescription = scope.description ? scope.description : 'Deceptive Attack';
    effectPenalty = scope.penalty ? scope.penalty : -2;
    effectTag = scope.tag ? scope.tag : '#defense';
    effectClear = scope.clear ? scope.clear : false;
}
console.log(`effectName: ${effectName}; effectId: ${effectId}; effectDescription: ${effectDescription}; effectPenalty: ${effectPenalty}; effectTag: ${effectTag}; effectClear: ${effectClear}`);

let tokens = canvas.tokens.controlled

// If any tokens are selected ...
if (tokens && tokens.length > 0) {
    // create a new effect
    let effect = {
        icon: `systems/gurps/icons/statuses/BAD${effectPenalty}.webp`,
        id: effectId,
        label: effectName,
        changes: [
            {
            key: 'system.conditions.target.modifiers',
            value: `${effectPenalty} ${effectDescription} ${effectTag}`,
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            },
        ],
        duration: {
            // If a non-zero duration, show the icon on the token.
            rounds: Number.MAX_VALUE
        },
    }

    // toggle the effect for all selected tokens
    for (let t of tokens) {
        const existing = t.actor.effects.contents.filter(e => e.name === effect.label)

        if (existing && existing.length) {
            console.log("★ delete effects")
            existing.forEach(async e => t.actor.deleteEmbeddedDocuments('ActiveEffect', [e.id]))
        } else if (effectClear) { 
            console.log("✪ clear effects so no create")
        } else { 
            console.log("✪ create effects")
            t.actor.createEmbeddedDocuments('ActiveEffect', [effect])
        }
    }

} else {
    console.log("No tokens selected");
    ui.notifications.warn("No tokens selected");
}


console.log(`---------------------- End StatusDistraction ----------------------`);
