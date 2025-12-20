/* CombatIntiative
wo parts, a macro, and a modification to the initiative formula.

The macro (which is a script macro, not chat), takes all selected tokens and puts them into combat, but it also checks them for various things like Combat Reflexes, Tactics, and so on - whatever you might decide to house rule into adding to initiative.  If you read through it, you'll see where we check for various things and assign a value to a string which is when used in the initiative formula.  You can change, add, remove as you see fit to customise it:
*/
canvas.tokens.controlled.forEach(token => {
  const actor = token.actor
  let crb = 0
  if (!!GURPS.findAdDisad(actor, "Combat Reflexes")) {
    crb = 1
    ChatMessage.create({content:actor.name + " has Combat Reflexes!"})
  }
  let tact = 0
  if (!!GURPS.findSkillSpell(actor, "Tactics")) {
    tact = 1
    ChatMessage.create({content:actor.name + " has Tactics"})
  }
  let ecs = 0
  if (!!GURPS.findAdDisad(actor, "Enhanced Combat Sense")) {
    crb = 10
    ChatMessage.create({content:actor.name + " has Enhanced Combat Sense!"})
  }
  actor.update({"data.additionalresources.crb": crb})
  actor.update({"data.additionalresources.tact": tact})
  actor.update({"data.additionalresources.ecs": ecs})
})

async function quickCombat() {
    await _token.toggleCombat();
    await game.combat.rollAll();
    await game.combat.startCombat();
    await ui.combat.renderPopout();
}
quickCombat();

/*
You can set the amount of the "bonus" to initiative as you like, too.

Once you have that, set the Combat Initiative Formula:

((@basicspeed.value100) + (@attributes.DX.value / 100) + (1d6 / 1000) + (@additionalresources.crb100) + (@additionalresources.ecs100) + (@additionalresources.tact100)) / 100

Add or remove the strings you decide to include from the macro.

*/