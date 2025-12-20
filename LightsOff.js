/* Usage: /:LightsOff
 *
 */

console.log(`---------------------- Start LightsOff ----------------------`);

let token = canvas.tokens.get(_token.id); // Get the token object

let tokenDoc = await token.document; // wake up lazy document

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

console.log(`---------------------- End LightsOff ----------------------`);