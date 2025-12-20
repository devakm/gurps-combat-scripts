/* Usage: /:NightVisionSpell
 * Acts as a toggle switch to enable and disable Night Vision spell effect, altering the token's vision. 
 * This effect sets an actor flag so the module (Night Vision for GURPS Game Aid) can recognize it.
 * The Night Vision for GURPS Game Aid module recognizes the spell flag to increase the dim/bright radius of light sources in the scene for the selected token only. Run the script again when the spell duration ends.
 */

console.log(`---------------------- Start NightVisionSpell ----------------------`);
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let actor = token.actor;
if (!actor) {
    ui.notifications.warn(`Token does not have an associated actor.`);
} else {
    console.log(`actor name: ${actor.name}`);
    if (actor.flags.NightVisionSpell && actor.flags.NightVisionSpell > 0) {
        console.log(`Night Vision spell is wearing off!`);
        await actor.update({"flags.NightVisionSpell": 0});
    } else if (actor.flags.NightVisionSpell && actor.flags.NightVisionSpell < 1) {
        console.log(`Night Vision spell is starting! Setting Night Vision level to 9.`);
        await actor.update({"flags.NightVisionSpell": 9});
    } else {
        console.log(`Night Vision spell is starting! Setting Night Vision level to 9.`);
        await actor.update({"flags.NightVisionSpell": 9});
    }    
}

token.release();
token.control();

let refreshOtF = `/remote [/r [/:TokenRefresh]]`; // /remote [/r [/:TokenRefresh]]
await GURPS.executeOTF(refreshOtF);

console.log(`---------------------- End NightVisionSpell ----------------------`);