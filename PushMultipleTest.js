/* Usage: /:Push <animation> <trap tag> "<victims>"
Example:
/:Push jb2a.side_impact.part.shockwave.blue BXTraps01 '{"tokenId":"lhgxBseOWjwrcxtw";"kbFeet":30;"trapTag":"BXTraps01"},{"tokenId":"FQXBKd2S4RqtDdKR";"kbFeet":25;"trapTag":"BXTraps01"}'
*/

// [{'tokenId': ${targetToken}, 'kbFeet': ${kbFeet}, 'trapTag': ${trapTag}}]

/* test harness
let kbVictimsStr = "{'tokenId':'lhgxBseOWjwrcxtw';'kbFeet':30;'trapTag':'BXTraps01'},{'tokenId':'FQXBKd2S4RqtDdKR';'kbFeet':25;'trapTag':'BXTraps01'}";
let victimToken;  // let arr = Array.from(str)
let kbFeet;
let kbVictims = kbVictimsStr.split(',')
kbVictims.forEach((x, i) => kbVictims[i] = x.replaceAll(';', ','));
kbVictims.forEach((x, i) => kbVictims[i] = x.replaceAll("'", '"'));
kbVictims.forEach((x, i) => kbVictims[i] = JSON.parse(x));
kbVictims.forEach(victim => {
	victimToken = canvas.tokens.get(victim.tokenId);
	console.log(`------ kbVictims victimName: ${victimToken.name}, victimToken: ${victimToken.id}, kbFeet: ${victim.kbFeet}`);
});
*/


//let units = game.scenes.current.grid.units // v10+
let units = game.scenes.current.data.gridUnits
let debug = true;
let shove = 10; // feet the token is shoved
let animDB = "jb2a.side_impact.part.shockwave.blue"; // default anim
let trapTag = "BXTraps01"; // default tag
let kbVictimsStr = ""; // "{'tokenId':'lhgxBseOWjwrcxtw';'kbFeet':30;'trapTag':'BXTraps01'},{'tokenId':'FQXBKd2S4RqtDdKR';'kbFeet':25;'trapTag':'BXTraps01'}";
if (debug) console.log('------ Push args: '+args[0]);
animDB = args[0].length > 0 ? args[0][1] : "jb2a.side_impact.part.shockwave.blue";
trapTag = args[0].length > 1 ? args[0][2] : "BXTraps01";
kbVictimsStr = args[0].length > 2 ? args[0][3] : "";
if (debug) console.log(`------ animDB: ${animDB}; trapTag: ${trapTag}`);
let label = units !== "" ? `Distance (${units})` : "Distance"
let jumpBackFt = 3; // feet to bounce off first collision
let impactDmgMod = -3; // 1d-3 for 1 yard, -2 for 2 yards, -1 for 3 yards, 0 for 4 yards, +1 for 5 yards, etc.

//for foundry v10 and above swap these properties
//let gridSize = game.scenes.current.grid.size
//let gridDistance = game.scenes.current.grid.distance
let gridSize = game.scenes.current.dimensions.size
let gridDistance = game.scenes.current.dimensions.distance
let gridScale = Math.floor(gridSize / gridDistance);
let shoveDistance = shove * gridScale; // pixel distance to project the ray
let impactVelocity = shove/3; // damage mod is based on yards of velocity

// setting these with global scope makes debug easier; I should probably move them later
let ray;
let xRayData;
let xRayFinalTarget;
let xRayStop;
let xRayDistance;
let collisionsDetected;
let shortRay;
let jumpBack;
let lastTarget;
let shortRayDistance;
let shortRayData;
let shortRayDistAdjust;
let shortStopTarget;
let dmgMod;
let dmgModSign = '';
let dmgOtF;
let victimToken;  // let arr = Array.from(str)
let kbFeet;
function impactDamage(impactVelocity) {
	dmgMod = impactDmgMod+impactVelocity;
	if (dmgMod > -1) dmgModSign = '+';
	dmgOtF = `/r [1d${dmgModSign}${dmgMod} cr] \\\\${lastTarget.name} collides with a wall or other obstacle.`;
	console.log(dmgOtF);
	GURPS.executeOTF(dmgOtF);
}
			
if (shove) {
	jumpBack = gridScale * jumpBackFt;
	let kbVictims = kbVictimsStr.split(',')
	kbVictims.forEach((x, i) => kbVictims[i] = x.replaceAll(';', ','));
	kbVictims.forEach((x, i) => kbVictims[i] = x.replaceAll("'", '"'));
	kbVictims.forEach((x, i) => kbVictims[i] = JSON.parse(x));
	kbVictims.forEach(victim => {
		victimToken = canvas.tokens.get(victim.tokenId);
		console.log(`------ kbVictims victimName: ${victimToken.name}, victimToken: ${victimToken.id}, kbFeet: ${victim.kbFeet}`);		ray = new Ray(_token.center, victimToken.center);
		let targetDistance = ray.distance;
		let totalDistance = shoveDistance+targetDistance;
		lastTarget = victimToken;
		if (debug) console.log(`-------- lastTarget name (${lastTarget.name})`);
		xRayData = Ray.towardsPoint(_token.center, victimToken.center, totalDistance); // set destination point beyond target
		xRayDistance = xRayData.distance;// distance is lazy so you have to call it first
		xRayFinalTarget = xRayData.B; // set coordinates for the end of the ray
		collisionsDetected = canvas.walls.getRayCollisions(xRayData);
		xRayStop = collisionsDetected != undefined && collisionsDetected.length > 0 ? collisionsDetected[0] : xRayFinalTarget;
		if (debug) console.log(`-------- xRay Initially aimed at x(${xRayFinalTarget.x}), y(${xRayFinalTarget.y}), stopped at x(${xRayStop.x}), y(${xRayStop.y}) -- collisionsDetected: ${collisionsDetected[0]}`);
		
		if (collisionsDetected != undefined && collisionsDetected.length > 0) {
			shortRay =  new Ray(_token.center, xRayStop);
			shortRayDistance = shortRay.distance;
			impactDamage(impactVelocity);
			shortRayDistAdjust = shortRayDistance-jumpBack;
			if (debug) console.log(`-------- shortRayDistance (${shortRayDistance}); shortRayDistAdjust: ${shortRayDistAdjust}`);
			shortRayData = Ray.towardsPoint(_token.center, xRayStop, shortRayDistAdjust);
			shortRayDistance = shortRay.distance;
			shortStopTarget = shortRayData.B;
			if (debug) console.log(`-------- Position adjusted to shortStopTarget at x(${shortStopTarget.x}), y(${shortStopTarget.y})`);
			xRayStop = shortStopTarget;
		}

		new Sequence()
		.effect()
		  .file(animDB) 
		  .atLocation(_token)
		  .stretchTo(xRayStop)
		  .scale(0.9)
		  .duration(1500)
		  .play()
		new Sequence()
		.effect()
			.from(victimToken)
			.zeroSpriteRotation()
			.moveTowards(xRayStop, { ease: 'easeInOutElastic', rotate: false })
			.duration(2000)
			.animateProperty("spriteContainer", "scale.x", { from: 0.5, to: 0.7, duration: 250, delay: 800, ease: 'easeInOutQuint' })
			.animateProperty("spriteContainer", "scale.x", { from: 0.7, to: 0.5, duration: 125, delay: 1050, ease: 'easeInOutQuint' })
			.animateProperty("spriteContainer", "scale.y", { from: 0.5, to: 0.7, duration: 250, delay: 800, ease: 'easeInOutQuint' })
			.animateProperty("spriteContainer", "scale.y", { from: 0.7, to: 0.5, duration: 125, delay: 1050, ease: 'easeInOutQuint' })
			.wait(100)
		.animation()
			.on(victimToken)
			.opacity(0)
			.wait(1800)
		.animation()
			.on(victimToken)
			.teleportTo(xRayStop, { relativeToCenter: true })
			.opacity(1)
			.wait(1800)
		.animation()
			.thenDo(() => {
				game.macros.getName('TriggerActiveTile').execute(trapTag, lastTarget.id);
		})
		.play();
	})
}