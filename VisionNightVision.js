/* Usage: /:NightVision
 *
 */

console.log(`---------------------- Start NightVision ----------------------`);
let updates = [];
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let tokenDoc = await token.document; // wake up lazy document
let sight = tokenDoc.sight ? tokenDoc.sight : token.document.sight;
let hasVisionEnabled = false;
let sightRange = 27;

async function vision(isCompleteDarkness) {

    if (sight.enabled === false) {
        console.log(`Vision is not enabled; enabling it`);
        await tokenDoc.update({"sight.enabled": true});
        hasVisionEnabled = true;
        updates.push({
            _id: tokenId,
            sight: {
                enabled: true
            }
        }); 
    }

    // determine range of vision based on advantage
    // GGA does not import advantage level to Foundry so we have to parse the name field to get the level
    // Night Vision grants 1 yard of sight range per level
    if (isCompleteDarkness === false) {
        // not complete darkness, so basic vision and night vision work
        // && canvas.scene.environment.darknessLevel && canvas.scene.environment.darknessLevel < 1
        // sight range is tripled in partial darkness
        sightRange = sightRange*3;
        console.log(`Not complete darkness; setting night vision mode with sight range: ${sightRange} `);
    } else if (isCompleteDarkness === true) {
        // complete darkness, so basic vision does not work and night vision is calculated in feet instead of yards
        sightRange = Math.floor(sightRange/3);
        console.log(`Complete darkness; setting night vision mode with sight range: ${sightRange} `);
    }
    await tokenDoc.update({"sight.range": sightRange, "sight.visionMode": "darkvision"}); // lightAmplification

    // canvas.scene.update({ "darkness": (result.val()/100) },{ animateDarkness: true });
    /*
    let tokenId = _token.id;
    let token = canvas.tokens.get(tokenId); // Get the token object
    let tokenDoc = await token.document; // wake up lazy document
    let sight = token.document.sight
    
    await tokenDoc.update({"sight.range": 27, "sight.visionMode": "lightAmplification"});
    await tokenDoc.update({"sight.range": 27, "sight.visionMode": "lightAmplification"});
    await tokenDoc.update({"sight.range": 81, "sight.visionMode": "darkvision"});
    */

}

// callback: async (html) => damage(
// prompt user 
await Dialog.confirm({
    title: "Is it completely dark here?",
    content: "Vision is limited in complete darkness. Night Vision only works in partial darkness. If it is completely dark, you will need to use Dark Vision.",
    yes: async () => vision(true),
    no: async () => vision(false)
});

console.log(`---------------------- End NightVision ----------------------`);