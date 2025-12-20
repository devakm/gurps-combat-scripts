function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

//let units = game.scenes.current.grid.units // v10+
let units = game.scenes.current.data.gridUnits
let label = units !== "" ? `Distance (${units})` : "Distance"
let targetDistance; // define scope here to make console testing easier
let totalDistance;
let ray;
let xRayData;
let shove = 15;
if (shove) {
  //for foundry v10 and above swap these properties
  //let gridSize = game.scenes.current.grid.size
  //let gridDistance = game.scenes.current.grid.distance
  let gridSize = game.scenes.current.dimensions.size
  let gridDistance = game.scenes.current.dimensions.distance
  let gridScale = Math.floor(gridSize / gridDistance);
  let shoveDistance = shove * gridScale; // pixel distance to project the ray

  console.log(`Given Shove distance calc: gridSize(${gridSize}) / gridDistance(${gridDistance}) = gridScale(${gridScale}) (gridScale is in pixels per foot), then shove feet(${shove}) * gridScale(${gridScale})  = shoveDistance(${shoveDistance})`);

  let targets = Array.from(game.user.targets);
  targets.forEach(target => {
	ray = new Ray(_token.center, target.center);
	targetDistance = ray.distance;
	totalDistance = shoveDistance+targetDistance;
	xRayData = Ray.towardsPoint(_token.center, target.center, totalDistance); // set destination point beyond target
	let xRayDistance = xRayData.distance;// distance is lazy so you have to call it first
	xRayFinalTarget = xRayData.B; // set coordinates for the end of the ray
	
			/* [honeybadger] checks for wall collision along the array form of a ray */
		/*getRayCollisions(ray, {type="move", mode="all", debug=false}={}) {
		
		_getRayCollisions(ray, activeEdges, {minimumDistance=0}={}) {
			_getClosestCollision(collisions) {
				collisionDetected = canvas.walls.getRayCollisions(xRayData)
		//xRayStop = canvas.walls.checkCollision(xRayData, {type:"limited", mode:"closest"}); 
		//xRayStop = canvas.walls.checkCollision(xRayData, {type="move", mode="closest", debug=true});
		xRayStop = xRayFinalTarget
		//CONFIG.Canvas.polygonBackends.move.testCollision(_token.center, xRayFinalTarget, {mode:"any", type:"move"});
		*/
		
		//collisionDetected = canvas.walls.checkCollision(xRayData, {mode:'closest',type:'normal'});
		
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
    .play();
	
	  
	console.log(`-------- End Position: x(${xRayFinalTarget.x}), y(${xRayFinalTarget.y})`);
  })
  //await wait(6);
}