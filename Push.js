/* Usage: /:Push anim=<animation> victim=<victimId> shove=<feet> trap=<tag>
Example:
/:Push anim=jb2a.side_impact.part.shockwave.blue victim=lhgxBseOWjwrcxtw shove=30 trap=BXTraps01


/:Push anim=jb2a.side_impact.part.shockwave.blue victim=2b9Ya8qaupJCEdiZ shove=3 trap=BXTraps01

*/

let debug = true;

if (debug) console.log('------------------------ Push started --------------------');

let originalToken = _token;	
let animDB = "jb2a.side_impact.part.shockwave.blue"; // default anim
let targetID = " "; //2b9Ya8qaupJCEdiZ
let shove = 2; // hexes the token is shoved
//let targetID = "4zOC26GhzzgW2lRJ"; //
//let shove = 4; // hexes the token is shoved
let trapTag = "BXTraps01"; // default tag

if (scope !== undefined) {
    console.log(scope)
    animDB = scope.anim ? scope.anim : 'jb2a.side_impact.part.shockwave.blue';
    targetID = scope.victim ? scope.victim : ' ';
    shove = scope.shove ? parseInt(scope.shove) : 1;
    trapTag = scope.trap ? scope.trap : ''; // BXTraps01
}

if (targetID.length < 5) {
	await wait(3);
	if (debug) console.log(`------ targetID is empty;`);
} else {
	if (debug) console.log(`------ animDB: ${animDB}; targetID: ${targetID}; shove: ${shove}; trapTag: ${trapTag};`);
}
let victimToken = canvas.tokens.get(targetID);
let victimName = victimToken.name;// 
console.log(`------ KB victimName: ${victimName}, victimToken Id: ${victimToken.id}, shove: ${shove}; from originalToken location x(${originalToken.center.x}), y(${originalToken.center.y}) to target location x(${victimToken.center.x}), y(${victimToken.center.y})`);
//for foundry v10 and above swap these properties
//let gridSize = game.scenes.current.grid.size
//let gridDistance = game.scenes.current.grid.distance
//let units = game.scenes.current.grid.units // v10+
let gridSize = game.scenes.current.grid.size
let gridDistance = game.scenes.current.grid.distance
let units = game.scenes.current.grid.units;
let gridScale = Math.floor(gridSize / gridDistance); // correct for scenes that have multiple units per grid space
let shoveDistance = shove * gridScale; // pixel distance to project the ray, adjusted for scale
let impactVelocity = shove; // damage mod is based on yards of velocity
console.log(`------ KB gridSize: ${gridSize}, gridDistance: ${gridDistance}, units: ${units}, gridScale: ${gridScale}, shoveDistance: ${shoveDistance}, impactVelocity: ${impactVelocity}`);
let ray = new Ray(originalToken.center, victimToken.center);//originalToken
let targetDistance = ray.distance;
let totalDistance = shoveDistance+targetDistance;
await GURPS.SetLastActor(victimToken.actor);
let LastActorData = GURPS.LastActor;
if (debug) console.log(`-------- LastActorData name (${LastActorData.name})`);
let jumpBackYd = 1; // yards to bounce off first collision
let impactDmgMod = -3; // 1d-3 for 1 yard, -2 for 2 yards, -1 for 3 yards, 0 for 4 yards, +1 for 5 yards, etc.

// setting these with global scope makes debug easier; I should probably move them later
let xRayData,xRayFinalTarget,xRayStop,xRayDistance,collisionsDetected,shortRay,jumpBack,shortRayDistance;
let shortRayAdjusted,shortRayDistAdjust,shortStopTarget;
let dmgMod,dmgOtF,kbFeet;
let dmgModSign = '';

function wait(x) {
	console.log(`wait(x): ${x}`);
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

async function impactDamage(impactVelocity) {
	let detectTrapsModifiers = getDetectTrapsMods(GURPS.ModifierBucket.modifierStack.modifierList);
	GURPS.ModifierBucket.clear(update=true);
	dmgMod = impactDmgMod+impactVelocity;
	if (dmgMod > -1) dmgModSign = '+';
	dmgOtF = `[1d${dmgModSign}${dmgMod} cr] `;
	console.log(dmgOtF);
	//GURPS.executeOTF(dmgOtF);
	let pushDescription = `<p><b>${victimName}</b> collides with a wall or other obstacle at ${impactVelocity} yards velocity, taking ${dmgOtF} damage.</p>`;

	console.log(pushDescription);
	let chatDescription = `<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
		<strong>
			<span style="font-size:14.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:#231f20;mso-ansi-language:EN-US">Collision</span>
		</strong>
	</p>`;
	chatDescription += ` 
	<p class="MsoNormal" style="margin-bottom:0cm;line-height:normal;mso-layout-grid-align:none;text-autospace:none">
			<span style="font-size:9.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;color:black;font-weight:normal;mso-themecolor:accent1;mso-ansi-language:EN-US">
			${pushDescription}
			</span>
	</p>`;
	ChatMessage.create({
	  content: chatDescription, speaker: ChatMessage.getSpeaker(victimToken.actor)}, 
	{ chatBubble: false });		

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

	Sequencer | Effect | from - .from() is deprecated, please use .copySprite() instead

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
		.copySprite(victimToken)
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
	await wait(5);
	new Sequence()
		.animation()
			.thenDo(() => {
					let dtOtF = `/r [-8 to Detect Traps]`;
					console.log(dtOtF);
					GURPS.executeOTF(dtOtF);
					if (collisionsDetected != undefined && collisionsDetected.length > 0 && shortStopTarget.y > 0) {
						console.log(`-------- impactDamage(${impactVelocity}) deactivated`);
						impactDamage(impactVelocity);
					}
			})
			.wait(2400)
	.play();
	await wait(5);
	new Sequence()
		.animation()
			.thenDo(() => {				
				game.macros.getName('TriggerActiveTile').execute(trapTag, victimToken.id);
			})
			.wait(2400)
	.play();
}
			
if (shove) {
	jumpBack =  jumpBackYd * gridScale; // distance in pixels to bounce off first collision
	console.log(`-------- jumpBack: ${jumpBack}`);
	let targetDistance = ray.distance;
	let totalDistance = shoveDistance+targetDistance;
	console.log(`-------- totalDistance: ${totalDistance}; targetDistance: ${targetDistance}`);
	xRayData = Ray.towardsPoint(originalToken.center, victimToken.center, totalDistance); // set destination point beyond target
	xRayDistance = xRayData.distance;// distance is lazy so you have to call it first
	xRayFinalTarget = xRayData.B; // set coordinates for the end of the ray

	console.log(`-------- End Position: x(${xRayFinalTarget.x}), y(${xRayFinalTarget.y}); xRayDistance: ${xRayDistance}`);
	// collisionsDetected = canvas.walls.getRayCollisions(xRayData); // check for collisions PointSourcePolygon.testCollision
	collisionsDetected = ClockwiseSweepPolygon.testCollision(originalToken.center, xRayFinalTarget, {type: "move"});
	// maybe use PointSourcePolygon.testCollision
	xRayStop = collisionsDetected != undefined && collisionsDetected.length > 0 ? collisionsDetected[0] : xRayFinalTarget;
1
	if (debug) console.log(`-------- xRay Initially aimed at x(${xRayFinalTarget.x}), y(${xRayFinalTarget.y}), stopped at x(${xRayStop.x}), y(${xRayStop.y}) -- collisionsDetected: ${collisionsDetected[0]}`);
	// check for collisions and adjust position if needed
	if (collisionsDetected != undefined && collisionsDetected.length > 0) {
		shortRay = new Ray(originalToken.center, xRayStop);
		shortRayDistance = Number(shortRay.distance);
		console.log(`-------- shortRayDistance: ${shortRayDistance}`);
		shortRayDistAdjust = shortRayDistance-jumpBack; // collision point minus jumpBack distance
		if (debug) console.log(`-------- shortRayDistance (${shortRayDistance}); shortRayDistAdjust: ${shortRayDistAdjust}`);
		shortRayAdjusted = Ray.towardsPoint(originalToken.center, xRayStop, shortRayDistAdjust);
		shortRayDistance = shortRay.distance;
		shortStopTarget = shortRayAdjusted.B;
		if (debug) console.log(`-------- Position adjusted to shortStopTarget at x(${shortStopTarget.x}), y(${shortStopTarget.y})`);
		xRayStop = shortStopTarget;
		console.log(`-------- moveAnim shortStopTarget: x(${shortStopTarget.x}), y(${shortStopTarget.y}); ------- final xRayStop: x(${xRayStop.x}), y(${xRayStop.y})`);
	}

	moveAnim(victimToken, animDB, xRayStop);
	console.log(`-------- moveAnim xRayStop: x(${xRayStop.x}), y(${xRayStop.y})`);
	//wait(5);

}