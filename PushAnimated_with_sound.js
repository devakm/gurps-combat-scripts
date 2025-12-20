//let units = game.scenes.current.grid.units // v10+
let units = game.scenes.current.data.gridUnits
let label = units !== "" ? `Distance (${units})` : "Distance"

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
  
  let gridScale = Math.floor(gridSize / gridDistance)

  let shoveDistance = shove * gridScale

  let halfWidth = Math.floor(gridSize / 2)
  let targets = Array.from(game.user.targets)

  targets.forEach(target => {
    let ray = new Ray(token.center, target.center)
    let x = target.center.x - halfWidth
    if (ray.dx != "0") {
      x = target.center.x + (ray.dx / Math.abs(ray.dx)) * shoveDistance - halfWidth
    }
    let y = target.center.y - halfWidth
    if (ray.dy !== 0) {
      y = target.center.y + (ray.dy / Math.abs(ray.dy)) * shoveDistance - halfWidth
    }
    new Sequence()
      .effect()
      .file("jjb2a.water_splash.cone.01.blue") 
      .atLocation(token)
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
    new Sequence()
      .sound()
      .file("modules/soundfxlibrary/Nature/Loops/River/river-2.mp3")
      .duration(1500)
      .play()
  })
}