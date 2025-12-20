/* Usage: /:StatusMysticMistNative

*/
console.log('---------------------- Start StatusMysticMistNative ----------------------');

// OtF action setup: 
let effectName ='MysticMistNative'; //   effect name, i.e. [M:BadFooting]
let effectDescription = 'Mystic Mist Native'; // Text description of the effect
let effectBonus = '+1'; // Bonus to apply, i.e. +1, -1, etc.

let tokens = canvas.tokens.controlled

// If any tokens are selected ...
if (tokens && tokens.length > 0) {
    // create a new effect
    let effect = {
        icon: `systems/gurps/icons/statuses/BAD${effectBonus}.webp`,
        id: 'mysticmistNative',
        label: `${effectName}`,
        changes: [
            {
                key: 'system.conditions.self.modifiers',
                value: `${effectBonus} ${effectDescription} #defense`,
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


console.log(`---------------------- End StatusMysticMistNative ----------------------`);
