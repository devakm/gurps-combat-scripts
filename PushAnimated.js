//let units = game.scenes.current.grid.units // v10+
let units = game.scenes.current.data.gridUnits
let label = units !== "" ? `Distance (${units})` : "Distance"
//let shove = 15; // feet the token is shoved

let shove = await Dialog.prompt({
  title: "Set distance",
  content:
    `<form><div class="form-group"><label>${label}:</label><input type="number" value="10" min="5" name="distance" id="distance" /></div></div></form>`,
  callback: html => html.find("#distance").val(),
  close: () => null,
  rejectClose: false,
})

if (shove) {
  //for foundry v10 and above swap these properties
  //let gridSize = game.scenes.current.grid.size
  //let gridDistance = game.scenes.current.grid.distance
  let gridSize = game.scenes.current.dimensions.size
  let gridDistance = game.scenes.current.dimensions.distance
  let gridScale = Math.floor(gridSize / gridDistance);
  let shoveDistance = shove * gridScale; // pixel distance to project the ray
  let targets = Array.from(game.user.targets);
  targets.forEach(target => {
	let ray = new Ray(_token.center, target.center);
	let targetDistance = ray.distance;
	let totalDistance = shoveDistance+targetDistance;
	let xRayData = Ray.towardsPoint(_token.center, target.center, totalDistance); // set destination point beyond target
	let xRayDistance = xRayData.distance;// distance is lazy so you have to call it first
	let xRayFinalTarget = xRayData.B; // set coordinates for the end of the ray

	console.log(`-------- End Position: x(${xRayFinalTarget.x}), y(${xRayFinalTarget.y})`);

	new Sequence()
    .effect()
      .file("jb2a.water_splash.cone.01.blue") 
      .atLocation(_token)
      .stretchTo(target)
      .scale(0.6)
      .duration(1500)
      .play()
	new Sequence()
    .effect()
        .from(target)
        .zeroSpriteRotation()
        .moveTowards(xRayFinalTarget, { ease: 'easeInOutElastic', rotate: false })
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
        .teleportTo(xRayFinalTarget, { relativeToCenter: true })
        .opacity(1)
	 .animation()
	     .thenDo(() => {
        token.document.update({ "texture.src": img });
    })
    .play();
	
  })
}