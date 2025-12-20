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
let projected;

let shove = await Dialog.prompt({
  title: "Set distance",
  content:
    `<form><div class="form-group"><label>${label}:</label><input type="number" value="10" min="5" name="distance" id="distance" /></div></div></form>`,
  callback: html => html.find("#distance").val(),
  close: () => null,
  rejectClose: false,
})

if (shove) {
  //let gridSize = game.scenes.current.grid.size
  //let gridDistance = game.scenes.current.grid.distance
  let gridSize = game.scenes.current.dimensions.size
  let gridDistance = game.scenes.current.dimensions.distance
  let gridScale = Math.floor(gridSize / gridDistance);
  let shoveDistance = shove * gridScale; // pixel distance to project the ray

  console.log(`Given Shove distance calc: gridSize(${gridSize}) / gridDistance(${gridDistance}) = gridScale(${gridScale}) (gridScale is in pixels per foot), then shove feet(${shove}) * gridScale(${gridScale})  = shoveDistance(${shoveDistance})`);

  let halfWidth = Math.floor(gridSize / 2)
  console.log(`halfWidth (gridSize / 2) is the distance we're using in the next calcs: halfWidth(${halfWidth}) `);
  let targets = Array.from(game.user.targets)

  let targetsProjected = Array.from(game.user.targets);
  targetsProjected.forEach(target => {
	let ray = new Ray(_token.center, target.center);
	
	projected = ray.project(shoveDistance);
	console.log(`-------- Preject End Position: ray.dx(${ray.dx}) x ray.dy(${ray.dy})`);
  })
  
  await wait(6);
	
  targets.forEach(target => {
	console.log(`--------Start Position: target.center.x(${target.center.x}) target.center.y(${target.center.y})`);

    let ray = new Ray(_token.center, target.center)
	ray.project(shoveDistance);
	
    let x = target.center.x - halfWidth
	console.log(`x(${x}) = target.center.x(${target.center.x}) - halfWidth(${halfWidth}) `);
	
    if (ray.dx != 0) {
		x = target.center.x + (ray.dx / Math.abs(ray.dx)) * shoveDistance - halfWidth;
		let rdxABS = Math.abs(ray.dx);
		console.log(`x(${x}) = target.center.x${target.center.x}) + (ray.dx (${ray.dx}) / rdxABS(${rdxABS})) * shoveDistance(${shoveDistance}) - halfWidth(${halfWidth})`);
    }
    let y = target.center.y - halfWidth
	console.log(`y(${y}) = target.center.y(${target.center.y}) - halfWidth(${halfWidth}) `);

    if (ray.dy !== 0) {
		y = target.center.y + (ray.dy / Math.abs(ray.dy)) * shoveDistance - halfWidth;
		let rdyABS = Math.abs(ray.dy);
		console.log(`y(${y}) = target.center.y${target.center.y}) + (ray.dy (${ray.dy}) / rdyABS(${rdyABS})) * shoveDistance(${shoveDistance}) - halfWidth(${halfWidth})`);
    }

    new Sequence()
      .effect()
      .file("jb2a.water_splash.cone.01.blue") 
      .atLocation(_token)
      .stretchTo(target)
      .scale(0.6)
      .duration(1500)
      .play()
    new Sequence()
      .animation()
      .on(target)
      .moveTowards({ x: x, y: y })
      .snapToGrid()
      .delay(1000)
      .waitUntilFinished()
      .play()
	  
	console.log(`--------Calculated End Position: target.center.x(${target.center.x}) target.center.y(${target.center.y})`);

  })
  
  // show end Position
  await wait(6);
  let targetsLanded = Array.from(game.user.targets);
  targetsLanded.forEach(target => {
	  	console.log(`-------- Actual End Position: target.center.x(${target.center.x}) target.center.y(${target.center.y})`);
  })
}