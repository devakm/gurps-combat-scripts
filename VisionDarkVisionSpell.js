/* Usage: /:DarkVisionSpell
 * Acts as a toggle switch to enable and disable Dark Vision spell effect, altering the token's vision. 
 * This effect alters the token visionMode and sight range and sets an actor flag so the module (Night Vision for GURPS Game Aid) can recognize it.
 * Dark Vision sets Token sight range to 1000 and sets sight.visionMode to gurpsDarkvision; it also sets/unsets actor.flags.
 * The Night Vision for GURPS Game Aid module recognizes the spell flag to disable any Darkness sources in the scene for the selected token only. Run the script again when the spell duration ends.
 * Token sight range settings can be edited below.
 */

console.log(`---------------------- Start DarkVisionSpell ----------------------`);
// config
let bSightRange = 0; // basic visionMode sight range
let dvSightRange = 1000; // darkvision sight range

let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let actor = token.actor;
let tokenDoc = await token.document; // wake up lazy document

if (!actor) {
    ui.notifications.warn(`Token does not have an associated actor.`);
} else {
    console.log(`actor name: ${actor.name}`);
    if (actor.flags.DarkVisionSpell && actor.flags.DarkVisionSpell === true) {
        console.log(`Dark Vision spell is wearing off!`);
        await actor.update({"flags.DarkVisionSpell": false});
        await tokenDoc.update({"sight.range": bSightRange, "sight.visionMode": "basic"});
    } else if (actor.flags.DarkVisionSpell && actor.flags.DarkVisionSpell === false) {
        console.log(`Dark Vision spell effect is starting!`);
        await actor.update({"flags.DarkVisionSpell": true});
        await tokenDoc.update({"sight.range": dvSightRange, "sight.visionMode": "gurpsDarkvision"});
        if (actor.flags.NightVisionSpell && actor.flags.NightVisionSpell > 0) {
            console.log(`Night Vision spell is wearing off!`);
            await actor.update({"flags.NightVisionSpell": 0});
        }
    } else {
        console.log(`Dark Vision spell starting!`);
        await actor.update({"flags.DarkVisionSpell": true});
        await tokenDoc.update({"sight.range": dvSightRange, "sight.visionMode": "gurpsDarkvision"});
    }    
}

token.release();
token.control();

let refreshOtF = `/remote [/r [/:TokenRefresh]]`; // /remote [/r [/:TokenRefresh]]
await GURPS.executeOTF(refreshOtF);

console.log(`---------------------- End DarkVisionSpell ----------------------`);