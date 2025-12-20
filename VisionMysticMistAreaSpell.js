/* Usage: /:MysticMistAreaSpell
 * Acts as a toggle switch to enable and disable Night Vision spell effect, altering the token's vision. 
 * This effect sets an actor flag so the module (Night Vision for GURPS Game Aid) can recognize it.
 * The Night Vision for GURPS Game Aid module recognizes the spell flag to increase the dim/bright radius of light sources in the scene for the selected token only. Run the script again when the spell duration ends.
 */

console.log(`---------------------- Start MysticMistAreaSpell ----------------------`);

let targetID,targetToken,targetActor,tltrData,targetName,actor;
let targets = Array.from(game.user.targets); 
for(let target of targets){ 
    targetID = target.id;;
    targetToken = canvas.tokens.get(targetID);
    actor = targetToken.document.actor; // get the actor from the token
    if (!actor) {
        ui.notifications.warn(`Token does not have an associated actor.`);
    } else {
        console.log(`actor name: ${actor.name}`);
        if (actor.flags.MysticMistSpell && actor.flags.MysticMistSpell === true) { //=== true
            console.log(`Mystic Mist spell is wearing off!`);
            await actor.update({"flags.MysticMistSpell": false});
        } else if (actor.flags.MysticMistSpell && actor.flags.MysticMistSpell === false) {
            console.log(`Mystic Mist spell starting!`);
            await actor.update({"flags.MysticMistSpell": true});
        } else {
            console.log(`Mystic Mist spell starting!`);
            await actor.update({"flags.MysticMistSpell": true});
        }    
    }
    targetToken.release();
    targetToken.control();
}

let refreshOtF = `/remote [/r [/:TokenRefresh]]`; // /remote [/r [/:TokenRefresh]]
await GURPS.executeOTF(refreshOtF);

console.log(`---------------------- End MysticMistAreaSpell ----------------------`);