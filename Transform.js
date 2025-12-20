let notTransformed = 'systems/dnd5e/tokens/humanoid/Thug.webp';
let transformed = 'systems/dnd5e/tokens/humanoid/Werebear.webp';

let img = token.document.texture.src === notTransformed ? transformed : notTransformed;

new Sequence()
    .effect()
        .file("modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_02_Regular_Blue_400x400.webm")
        .atLocation(token)
        .scaleToObject(2.5)
        .randomRotation()
    .wait(1500)
    .thenDo(() => {
        token.document.update({ "texture.src": img });
    })
    .play()