/* Usage: /:Push <animation> <distance> <trap tag>
Example:
/:Push jb2a.side_impact.part.shockwave.blue 30 BXTSpikeTrap01
*/

//let units = game.scenes.current.grid.units // v10+
let units = game.scenes.current.data.gridUnits
let debug = true;
let shove = 30; // feet the token is shoved
let animDB = "jb2a.side_impact.part.shockwave.blue"; // default anim
let trapTag = "BXTSpikeTrap01"; // default tag
if (debug) console.log('------ Push args: '+args[0]);
animDB = args[0].length > 0 ? args[0][1] : "jb2a.side_impact.part.shockwave.blue";
shove = args[0].length > 1 ? parseInt(args[0][2]) : 0;
trapTag = args[0].length > 2 ? args[0][3] : "BXTSpikeTrap01";
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

/* remove comment markers to make this script more interactive
let shove = await Dialog.prompt({
  title: "Set distance",
  content:
    `<form><div class="form-group"><label>${label}:</label><input type="number" value="10" min="5" name="distance" id="distance" /></div></div></form>`,
  callback: html => html.find("#distance").val(),
  close: () => null,
  rejectClose: false,
})
*/

// setting these with global scope makes debug easier; I should probably move them later
let targets;
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

function impactDamage(impactVelocity) {
	dmgMod = impactDmgMod+impactVelocity;
	if (dmgMod > -1) dmgModSign = '+';
	dmgOtF = `/r [1d${dmgModSign}${dmgMod} cr] \\\\${lastTarget.name} collides with a wall or other obstacle.`;
	console.log(dmgOtF);
	GURPS.executeOTF(dmgOtF);
}
			
if (shove) {
	targets = Array.from(game.user.targets);
	jumpBack = gridScale * jumpBackFt;
	targets.forEach(target => {
		ray = new Ray(_token.center, target.center);
		let targetDistance = ray.distance;
		let totalDistance = shoveDistance+targetDistance;
		lastTarget = target;
		if (debug) console.log(`-------- lastTarget name (${lastTarget.name})`);
		xRayData = Ray.towardsPoint(_token.center, target.center, totalDistance); // set destination point beyond target
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
			.from(target)
			.zeroSpriteRotation()
			.moveTowards(xRayStop, { ease: 'easeInOutElastic', rotate: false })
			.duration(2000)
			.animateProperty("spriteContainer", "scale.x", { from: 0.5, to: 0.7, duration: 250, delay: 800, ease: 'easeInOutQuint' })
			.animateProperty("spriteContainer", "scale.x", { from: 0.7, to: 0.5, duration: 125, delay: 1050, ease: 'easeInOutQuint' })
			.animateProperty("spriteContainer", "scale.y", { from: 0.5, to: 0.7, duration: 250, delay: 800, ease: 'easeInOutQuint' })
			.animateProperty("spriteContainer", "scale.y", { from: 0.7, to: 0.5, duration: 125, delay: 1050, ease: 'easeInOutQuint' })
			.wait(100)
		.animation()
			.on(target)
			.opacity(0)
			.wait(1800)
		.animation()
			.on(target)
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