let actor = game.actors.getName('Arne Arneson')
let data = GURPS.lastTargetedRolls[actor.id]
console.log(
  `check: [${data.thing}], modified target: [${data.finaltarget}], roll total: [${data.rtotal}], margin of success: [${data.margin}]`
  data
)