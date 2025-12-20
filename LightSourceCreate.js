/* Usage: /:LightSorceCreate
 *
 */


console.log(`---------------------- Start LightSorceCreate ----------------------`);
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let actor = token.actor;
let tokenDoc = await token.document; // wake up lazy document
let lightBright = 3;
let lightDim = 0;
let lightAngle = 360;

// Create a new light object
const lightData = {
    "type": "ambient", // Change to "point" or "cone" if needed
    "angle": lightAngle,
    "animation.type": "torch",
    "bright": lightBright, // Bright light radius
    "dim": lightDim, // Dim light radius
    "luminosity": 0.5, // Light source luminosity
    "negative": true,
    "x": token.center.x, // Light source x-coordinate
    "y": token.center.y, // Light source y-coordinate
};

// Create the light in the scene
const newLight = await canvas.scene.createEmbeddedDocuments("AmbientLight", [lightData]);
// Attach the light to the token
await tokenAttacher.attachElementToToken(newLight[0], _token, true);



/*
(async () => {
	let targets = Array.from(game.user.targets);
	if(targets.length > 0){
		if(targets.length > 1) return ui.notification.error("Can't mount more then one token!");
		let mount = targets[0];
		let newCoords = {x:token.x, y:token.y};
		if(mount.x+mount.w-token.w < token.x) newCoords.x = mount.x+mount.w-token.w;
		else if(mount.x > token.x) newCoords.x = mount.x;

		if(mount.y+mount.h-token.h < token.y) newCoords.y = mount.y+mount.h-token.h;
		else if(mount.y > token.y) newCoords.y = mount.y;
		await token.document.update({x: newCoords.x, y: newCoords.y});
		ui.chat.processMessage(`I mount this ${targets[0].name}`);
		await tokenAttacher.attachElementToToken(token, targets[0], true);
		await tokenAttacher.setElementsLockStatus(token, false, true);
		await tokenAttacher.setElementsMoveConstrainedStatus(token, true, true, {type: tokenAttacher.CONSTRAINED_TYPE.TOKEN_CONSTRAINED});
	}
})();
*/

console.log(`---------------------- End LightSorceCreate ----------------------`);

