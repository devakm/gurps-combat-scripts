/* Usage: /:StatusBadFooting
*/
console.log('---------------------- Start StatusBadFooting ----------------------');

// OtF action setup: 
let effectName ='BadFooting'; //   effect name, i.e. [M:BadFooting]
let effectDescription = 'Bad Footing'; // Text description of the effect
let effectPenalty = -2;
let secondaryEffectPenalty = -1;

let tokens = canvas.tokens.controlled

// If any tokens are selected ...
if (tokens && tokens.length > 0) {
    // create a new effect
    let effect = {
        icon: `systems/gurps/icons/statuses/BAD${effectPenalty}.webp`,
        id: 'badfooting',
        label: `${effectName}`,
        changes: [
            {
            key: 'system.conditions.self.modifiers',
            value: `${effectPenalty} ${effectDescription} #hit`,
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            },
            {
                key: 'system.conditions.self.modifiers',
                value: `${secondaryEffectPenalty} ${effectDescription} #defense`,
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
        } else { 
        console.log("✪ create effects")
        t.actor.createEmbeddedDocuments('ActiveEffect', [effect])
        }
    }

} else {
    console.log("No tokens selected");
    ui.notifications.warn("No tokens selected");
}


console.log(`---------------------- End StatusBadFooting ----------------------`);
