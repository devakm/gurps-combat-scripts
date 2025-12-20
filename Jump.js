/* Usage: /:Jump <animation> victimId <jump feet> <trap tag>
Example:
/:Jump jb2a.side_impact.part.shockwave.blue lhgxBseOWjwrcxtw 30 BXTraps01
*/

let debug = true;
if (debug) console.log('------ Push started ------');
let originalToken = _token;	
console.log('args[0].length '+args[0].length+' : '+args[0]);
let animDB = args[0].length > 1 ? args[0][1] : "jb2a.side_impact.part.shockwave.blue"; // default anim
let targetID = args[0].length > 2 ? args[0][2] : " ";
let jump = args[0].length > 3 ? parseInt(args[0][3]) : 10; // feet the token is jumpd
let trapTag = args[0].length > 4 ? args[0][4] : "BXTraps01"; // default tag
if (targetID.length < 5) {
	await wait(3);
	if (debug) console.log(`------ targetID is empty;`);
} else {
	if (debug) console.log(`------ animDB: ${animDB}; targetID: ${targetID}; jump: ${jump}; trapTag: ${trapTag};`);
}
let victimToken = canvas.tokens.get(targetID);
let victimTokenData = victimToken.data;
let victimName = victimTokenData.name;// 
console.log(`------ KB victimName: ${victimName}, victimToken Id: ${victimToken.id}, jump: ${jump}`);
//for foundry v10 and above swap these properties
//let gridSize = game.scenes.current.grid.size
//let gridDistance = game.scenes.current.grid.distance
//let units = game.scenes.current.grid.units // v10+
let gridSize = game.scenes.current.dimensions.size
let gridDistance = game.scenes.current.dimensions.distance
let units = game.scenes.current.data.gridUnits;
let gridScale = Math.floor(gridSize / gridDistance);
let jumpDistance = jump * gridScale; // pixel distance to project the ray
let impactVelocity = jump/3; // damage mod is based on yards of velocity
let ray = new Ray(originalToken.center, victimToken.center);//originalToken
let targetDistance = ray.distance;
let jumpBackFt = 3; // feet to bounce off first collision
let jumpBackDistance = gridScale * jumpBackFt; // distance in pixels to bounce off first collision
let totalDistance = targetDistance-jumpBackDistance;
if (jumpDistance < targetDistance) totalDistance = jumpDistance;
//await GURPS.SetLastActor(victimToken.actor);
let LastActorData = GURPS.LastActor.data;
if (debug) console.log(`-------- LastActorData name (${LastActorData.name})`);
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


function wait(x) {
	return new Promise((resolve) => {
	  setTimeout(() => {
		resolve(x);
	  }, 2000);
	});
  }
  
await wait(3);

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
	let detectTrapsModifiers = getDetectTrapsMods(GURPS.ModifierBucket.modifierStack.modifierList);
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
	/*
	let anim = {
		file: animDB,
		position: token.center,
		anchor: {
			x: 0.5,
			y: 0.5
		},
		angle: 0,
		scale: {
			x: 1,
			y: 1
		}
	};
	let animPreview = new Sequence([anim]);
	animPreview.play().then(result => {
		console.log(result);
	});
	token.update({x: xRayStop.x, y: xRayStop.y});
	*/
	new Sequence()
	.effect()
	  .file(animDB) 
	  .atLocation(originalToken)
	  .stretchTo(xRayStop)
	  .scale(0.9)
	  .duration(1500)
	  .play()
	new Sequence()
	.effect()
		.from(originalToken)
		.zeroSpriteRotation()
		.moveTowards(xRayStop, { ease: 'easeInOutElastic', rotate: false })
		.duration(2000)
		.animateProperty("spriteContainer", "scale.x", { from: 0.5, to: 0.7, duration: 250, delay: 800, ease: 'easeInOutQuint' })
		.animateProperty("spriteContainer", "scale.x", { from: 0.7, to: 0.5, duration: 125, delay: 1050, ease: 'easeInOutQuint' })
		.animateProperty("spriteContainer", "scale.y", { from: 0.5, to: 0.7, duration: 250, delay: 800, ease: 'easeInOutQuint' })
		.animateProperty("spriteContainer", "scale.y", { from: 0.7, to: 0.5, duration: 125, delay: 1050, ease: 'easeInOutQuint' })
		.wait(100)
	.animation()
		.on(originalToken)
		.opacity(0)
		.wait(1800)
	.animation()
		.on(originalToken)
		.teleportTo(xRayStop, { relativeToCenter: true })
		.opacity(1)
		.wait(1800)
	.play();
	await wait(5);
	new Sequence()
		.animation()
			.thenDo(() => {				
				game.macros.getName('TriggerActiveTile').execute(trapTag, originalToken.id);
			})
			.wait(2400)
	.play();
}
			
if (jump) {
	jumpBack = gridScale * jumpBackFt; // distance in pixels to bounce off first collision
	xRayData = Ray.towardsPoint(originalToken.center, victimToken.center, totalDistance); // set destination point beyond target
	xRayDistance = xRayData.distance;// distance is lazy so you have to call it first
	xRayFinalTarget = xRayData.B; // set coordinates for the end of the ray
	collisionsDetected = canvas.walls.getRayCollisions(xRayData); // check for collisions
	xRayStop = collisionsDetected != undefined && collisionsDetected.length > 0 ? collisionsDetected[0] : xRayFinalTarget;
	if (debug) console.log(`-------- xRay Initially aimed at x(${xRayFinalTarget.x}), y(${xRayFinalTarget.y}), stopped at x(${xRayStop.x}), y(${xRayStop.y}) -- collisionsDetected: ${collisionsDetected[0]}`);
	// check for collisions and adjust position if needed
	if (collisionsDetected != undefined && collisionsDetected.length > 0) {
		shortRay = new Ray(originalToken.center, xRayStop);
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