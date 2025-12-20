/* Usage: /:DarkVisionSpell
 * Acts as a toggle switch to enable and disable Dark Vision spell effect. 
 * This effect alters the token visionMode and sight range and sets an actor flag so the module (Night Vision for GURPS Game Aid) can recognize it.
 * Token sight range settings can be edited below.
 * to 1000 and sets sight.visionMode to gurpsDarkvision and sets/unsets actor.flags.DarkVisionSpell
 * The Night Vision for GURPS Game Aid module recognizes
 * 
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
        console.log(`Dark Vision spell is wearing off! Setting it to false; actor.flags.DarkVisionSpell: ${actor.flags.DarkVisionSpell}`);
        await actor.update({"flags.DarkVisionSpell": false});
        await tokenDoc.update({"sight.range": 1, "sight.visionMode": "basic"});
        if (actor.flags.NightVisionSpell && actor.flags.NightVisionSpell > 0) {
            console.log(`Night Vision spell is wearing off! Setting it to 0; actor.flags.NightVisionSpell: ${actor.flags.NightVisionSpell}`);
            await actor.update({"flags.NightVisionSpell": 0});
        }
        console.log(`Dark Vision spell has worn off! actor.flags.DarkVisionSpell: ${actor.flags.DarkVisionSpell}`);
    } else if (actor.flags.DarkVisionSpell && actor.flags.DarkVisionSpell === false) {
        console.log(`Dark Vision spell is not active!  Setting it to true; actor.flags.DarkVisionSpell: ${actor.flags.DarkVisionSpell}`);
        await actor.update({"flags.DarkVisionSpell": true});
        console.log(`Dark Vision has no levels and grants 1000 yards of sight: ${dvSightRange} `); // 123
        await tokenDoc.update({"sight.range": dvSightRange, "sight.visionMode": "gurpsDarkvision"});
        if (actor.flags.NightVisionSpell && actor.flags.NightVisionSpell > 0) {
            console.log(`Night Vision spell is wearing off! Setting it to 0; actor.flags.NightVisionSpell: ${actor.flags.NightVisionSpell}`);
            await actor.update({"flags.NightVisionSpell": 0});
        }
        console.log(`Dark Vision spell is active! actor.flags.DarkVisionSpell: ${actor.flags.DarkVisionSpell}`);
    } else {
        console.log(`Dark Vision spell is not active. Setting it to true.`);
        await actor.update({"flags.DarkVisionSpell": true});
        console.log(`Set actor.flags.DarkVisionSpell: ${actor.flags.DarkVisionSpell}`);
        console.log(`Dark Vision has no levels and grants 1000 yards of sight: ${dvSightRange} `); // 123
        await tokenDoc.update({"sight.range": dvSightRange, "sight.visionMode": "darkvision"});
        console.log(`Dark Vision spell is active! actor.flags.DarkVisionSpell: ${actor.flags.DarkVisionSpell}`);
    }    
}

token.release();
token.control();

let refreshOtF = `/remote [/r [/:TokenRefresh]]`; // /remote [/r [/:TokenRefresh]]
await GURPS.executeOTF(refreshOtF);

//await tokenDoc.update({"sight.range": 1000, "sight.visionMode": "darkvision"});

console.log(`---------------------- End DarkVisionSpell ----------------------`);