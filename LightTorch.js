/* Usage: /:LightTorch
 *
 */


console.log(`---------------------- Start LightTorch ----------------------`);
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let actor = token.actor;
let tokenDoc = await token.document; // wake up lazy document
let lightBright = 2;
let lightDim = 6;
let lightAngle = 360;

if (!actor) {
    ui.notifications.warn(`Token does not have an associated actor.`);
} else {
    console.log(`actor name: ${actor.name}: setting {"light.bright": 2, "light.dim": 6}`);
    await tokenDoc.update({"light.bright": lightBright, "light.dim": lightDim, "light.angle": lightAngle, "light.animation.type": "torch"});
}

console.log(`---------------------- End LightTorch ----------------------`);

