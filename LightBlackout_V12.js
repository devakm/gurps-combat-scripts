/* Usage: /:BlackoutEffect */

console.log(`---------------------- Start BlackoutEffect ----------------------`);

let token = canvas.tokens.get(_token.id); // Get the token object
let lightBright = 3;
let lightDim = 1;
let lightAngle = 360;

// Create a new light object
// removed     "type": "ambient", // Change to "point" or "cone" if needed
const lightData = {
    "config.angle": lightAngle,
    "config.animation.type": "torch",
    "config.bright": lightBright, // Bright light radius
    "config.dim": lightDim, // Dim light radius
    "config.luminosity": 0.5, // Light source luminosity
    "config.negative": true,
    "x": token.center.x, // Light source x-coordinate
    "y": token.center.y, // Light source y-coordinate
};

console.log(lightData);

// Create the light in the scene
const newLight = await canvas.scene.createEmbeddedDocuments("AmbientLight", [lightData]);
// Attach the light to the token
await tokenAttacher.attachElementToToken(newLight[0], token, true);

console.log(`---------------------- End BlackoutEffect ----------------------`);