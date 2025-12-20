/* Usage: /:ContinualLight6Daylight
 *
 */

console.log(`---------------------- Start ContinualLight6Daylight ----------------------`);

let token = canvas.tokens.get(_token.id); // Get the token object

let tokenDoc = await token.document; // wake up lazy document

if (token.light.data.luminosity === 0) {
    await token.document.update({
        light: {
            alpha: 1,
            angle: 360,
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
        },
    });
} else {
    await token.document.update({
        light: {
            alpha: 0,
            angle: 0,
            bright: 0,
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