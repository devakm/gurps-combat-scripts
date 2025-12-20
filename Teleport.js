let tokenD = canvas.tokens.controlled[0];

async function captureClick(fn, remove = true) {
  const m = () => canvas.app.renderer.plugins.interaction.mouse.getLocalPosition(canvas.app.stage);
  const c = (p) => canvas.grid.getCenter(p.x, p.y);
  return await new Promise(async (resolve) => {
    $(document.body).on("click", async (e) => {
      if (remove) $(document.body).off("click");
      new Sequence()
        .effect()
        .file("jb2a.misty_step.01.blue")
        .atLocation(tokenD)
        .play()
      setTimeout(function () {
        resolve(fn(e, m(), c(m())));
      }, 1000);
    });
  });
}
let tokens = [];
if (event.shiftKey) {
  console.log(canvas.tokens.placeables);
  tokens = canvas.tokens.placeables.filter(t => t.actor.type === "character" && t.actor.hasPlayerOwner);
}
else {
  tokens = canvas.tokens.controlled;
}
await new Promise(resolve => { setTimeout(resolve, 100) });
await captureClick(async (event, position, grid) => {
  let update = tokens.map((t, i) => ({ _id: t.id, x: grid[0] - canvas.grid.size / 2 + i * (canvas.grid.size / 2), y: grid[1] - canvas.grid.size / 2 + i * (canvas.grid.size / 2) }));
  new Sequence()
    .effect()
    .file("jb2a.misty_step.01.blue")
    .atLocation({ event, position, grid })
    .name("love")
    .play()
  setTimeout(async function () {
    return await canvas.scene.updateEmbeddedDocuments("Token", update, { animate: false });
  }, 800);

});