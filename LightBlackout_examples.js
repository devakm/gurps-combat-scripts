/* Usage: /:BlackoutEffect
 *
 */


if (_token.light.data.luminosity === 0 || _token.light.data.luminosity === 0.5) {
    await _token.document.update({
        light: {
            alpha: 1,
            angle: 0,
            bright: 3,
            coloration: 1,
            dim: 0,
            gradual: true,
            luminosity: -0.5,
            saturation: 0,
            contrast: 0.25,
            shadows: 0,
            animation: {
                speed: 1,
                intensity: 2,
                reverse: false,
                type: "vortex",
            },
            darkness: {
                min: 0,
                max: 1,
            },
            color: "#000000",
        },
    });
} else {
    await token.document.update({
        light: {
            alpha: 0,
            angle: 0,
            bright: 0,
            color: "#000000",
            coloration: 1,
            dim: 0,
            gradual: true,
            luminosity: 0,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
                speed: 5,
                intensity: 5,
                reverse: false,
            },
            darkness: {
                min: 0,
                max: 1,
            },
        },
    });
}
console.log(`---------------------- Start BlackoutEffect ----------------------`);

let token = canvas.tokens.get(_token.id); // Get the token object

let tokenDoc = await token.document; // wake up lazy document
// _token.light.data.luminosity
if (token.light.data.luminosity === 0) {
    await tokenDoc.update({
        light: {
            alpha: 1,
            angle: 0,
            bright: 12,
            coloration: 1,
            dim: 36,
            gradual: true,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
                speed: 1,
                intensity: 2,
                reverse: false,
                type: "torch",
            },
            darkness: {
                min: 0,
                max: 1,
            },
            color: "#000000",
        },
    });
} else {
    await tokenDoc.update({
        light: {
            alpha: 0,
            angle: 0,
            bright: 0,
            color: "#000000",
            coloration: 1,
            dim: 0,
            gradual: true,
            luminosity: 0,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
                speed: 5,
                intensity: 5,
                reverse: false,
            },
            darkness: {
                min: 0,
                max: 1,
            },
        },
    });
}

console.log(`---------------------- End BlackoutEffect ----------------------`);

let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let actor = token.actor;
let tokenDoc = await token.document; // wake up lazy document

let sightRange = 1000;

if (!actor) {
    ui.notifications.warn(`Token does not have an associated actor.`);
} else {
    console.log(`actor name: ${actor.name}`);
    await tokenDoc.update({"light.bright": 2, "light.dim": 6});

}