/* Usage: /:GrappleDrag <animation> victimId <yank feet> <trap tag>
Example:
/:GrappleDrag jb2a.side_impact.part.shockwave.blue lhgxBseOWjwrcxtw 30 BXTraps01
*/

let debug = true;
if (debug) console.log('------ Start GrappleDrag ------');
let originalToken = _token;	
let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let targets = Array.from(game.user.targets); 
let target = targets[0];
let animDB = "jb2a.side_impact.part.shockwave.blue"; // default anim
let yank = 60; // feet the target is yankd
let targetID = target.id;;
let victimToken = canvas.tokens.get(targetID);
let victimTokenData = victimToken.data;
let victimName = victimTokenData.name;// 
console.log(`------ KB victimName: ${victimName}, victimToken Id: ${victimToken.id}, yank: ${yank}`);
//for foundry v10 and above swap these properties
//let gridSize = game.scenes.current.grid.size
//let gridDistance = game.scenes.current.grid.distance
//let units = game.scenes.current.grid.units // v10+
let gridSize = game.scenes.current.dimensions.size
let gridDistance = game.scenes.current.dimensions.distance
let units = game.scenes.current.data.gridUnits;
let gridScale = Math.floor(gridSize / gridDistance);
let yankDistance = yank * gridScale; // pixel distance to project the ray
let impactVelocity = yank/3; // damage mod is based on yards of velocity
let ray = new Ray(victimToken.center, originalToken.center);//originalToken
let targetDistance = ray.distance;
//let totalDistance = yankDistance+targetDistance;
let totalDistance = targetDistance;
await GURPS.SetLastActor(victimToken.actor);
let LastActorData = GURPS.LastActor.data;
if (debug) console.log(`-------- LastActorData name (${LastActorData.name})`);
let jumpBackFt = 6; // feet to bounce off first collision
let impactDmgMod = -3; // 1d-3 for 1 yard, -2 for 2 yards, -1 for 3 yards, 0 for 4 yards, +1 for 5 yards, etc.
// setting these with global scope makes debug easier; I should probably move them later
let xRayData;
let xRayFinalTarget;
let xRayStop;
let xRayDistance;
let collisionsDetected;
let shortRay;
let jumpBack;
let shortRayDistance;
let shortRayData;
let shortRayDistAdjust;
let shortStopTarget;
let dmgMod;
let dmgModSign = '';
let dmgOtF;
let kbFeet;


async function wait(x) {
	console.log(`wait(x): ${x}`);
	return new Promise((resolve) => {
	  setTimeout(() => {
		resolve(x);
	  }, 2000);
	});
  }
  
function logModBucket(modifiers) {
	// reset the modifiers for orginalActor
	console.log(`in logModBucket(): `);
	for (let mod of modifiers) {
		console.log(`logModBucket ${mod.modint} ${mod.desc}`);
	}
}

function getDetectTrapsMods(stateModifiers) {
	console.log(`ACTIVE state before getDetectTrapsMods: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in getDetectTrapsMods(): `);
	logModBucket(stateModifiers);
	let modifiers = stateModifiers.filter(mod => 
		mod.desc.includes("Detect Traps") == true 
	);
	return modifiers;
}

function restoreModBucket(modifiers) {
	// reset the modifiers for orginalActor // restoreModBucket(originalModifiers);
	GURPS.ModifierBucket.clear(update=true);
	console.log(`ACTIVE state before restore: `);
	logModBucket(GURPS.ModifierBucket.modifierStack.modifierList);
	console.log(`in restoreModBucket(): `);
	logModBucket(modifiers);
	for (let mod of modifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc);
	}
}

function impactDamage(impactVelocity) {
	//let detectTrapsModifiers = getDetectTrapsMods(GURPS.ModifierBucket.modifierStack.modifierList);
	GURPS.ModifierBucket.clear(update=true);
	dmgMod = impactDmgMod+impactVelocity;
	if (dmgMod > -1) dmgModSign = '+';
	dmgOtF = `/r [1d${dmgModSign}${dmgMod} cr] \\\\${victimName} collides with a wall or other obstacle.`;
	console.log(dmgOtF);
	GURPS.executeOTF(dmgOtF);
	wait(5);
	// reset the modifiers 
	for (let mod of detectTrapsModifiers) {
		GURPS.ModifierBucket.addModifier(mod.modint, mod.desc)
	}
	wait(3);
}

async function moveAnim(victimToken, animDB, xRayStop) {
	new Sequence()
	.effect()
	  .file(animDB) 
	  .atLocation(victimToken)
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
	.play();
}
			
if (yank) {
	jumpBack = gridScale * jumpBackFt; // distance in pixels to bounce off first collision
	let targetDistance = ray.distance;
	//let totalDistance = yankDistance+targetDistance;
	let totalDistance = targetDistance-jumpBack; // distance in pixels to project the ray
	xRayData = Ray.towardsPoint(victimToken.center, originalToken.center, totalDistance); // set destination point beyond target
	xRayDistance = xRayData.distance;// distance is lazy so you have to call it first
	xRayFinalTarget = xRayData.B; // set coordinates for the end of the ray
	collisionsDetected = canvas.walls.getRayCollisions(xRayData); // check for collisions
	xRayStop = collisionsDetected != undefined && collisionsDetected.length > 0 ? collisionsDetected[0] : xRayFinalTarget;
	if (debug) console.log(`-------- xRay Initially aimed at x(${xRayFinalTarget.x}), y(${xRayFinalTarget.y}), stopped at x(${xRayStop.x}), y(${xRayStop.y}) -- collisionsDetected: ${collisionsDetected[0]}`);
	// check for collisions and adjust position if needed
	if (collisionsDetected != undefined && collisionsDetected.length > 0) {
		shortRay = new Ray(victimToken.center, xRayStop);
		shortRayDistance = shortRay.distance;
		impactDamage(impactVelocity);
		shortRayDistAdjust = shortRayDistance-jumpBack; // collision point minus jumpBack distance
		if (debug) console.log(`-------- shortRayDistance (${shortRayDistance}); shortRayDistAdjust: ${shortRayDistAdjust}`);
		shortRayData = Ray.towardsPoint(originalToken.center, xRayStop, shortRayDistAdjust);
		shortRayDistance = shortRay.distance;
		shortStopTarget = shortRayData.B;
		if (debug) console.log(`-------- Position adjusted to shortStopTarget at x(${shortStopTarget.x}), y(${shortStopTarget.y})`);
		xRayStop = shortStopTarget;
	}
	moveAnim(victimToken, animDB, xRayStop);

}
await GURPS.SetLastActor(originalActor);
await wait(5);
if (debug) console.log('------ End GrappleDrag ------');
