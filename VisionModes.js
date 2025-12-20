/* Usage: /:VisionMode
 *
 */

console.log(`---------------------- Start VisionMode ----------------------`);
let NightVisionAdvantageName ='Night*Vision'; //  name of the advantage to check
let DarkVisionAdvantageName ='Dark*Vision'; //  name of the advantage to check

let updates = [];
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let tokenDoc = await token.document; // wake up lazy document
let sight = tokenDoc.sight ? tokenDoc.sight : token.document.sight;
let hasVisionEnabled = false;
let hasBasicVisionActive = false;
let hasNightVisionActive = false;
let hasDarkVisionActive = false;
let hasNightVisionAdvantage = false;
let hasDarkVisionAdvantage = false;
let advantagePoints = 0;
let advantageLevel = 0;
let sightRange = 0;
let advantageNameLevelString = '';
let advantageObject = {};
let advantageName = '';

async function vision(isCompleteDarkness) {

    // what vision advantage does the token have?
    hasNightVisionAdvantage = GURPS.findAdDisad(_token.actor,NightVisionAdvantageName) ? true : false;
    hasDarkVisionAdvantage = GURPS.findAdDisad(_token.actor,DarkVisionAdvantageName) ? true : false;

    if (hasNightVisionAdvantage === true) {
        advantageObject = GURPS.findAdDisad(_token.actor,NightVisionAdvantageName) ? GURPS.findAdDisad(_token.actor,NightVisionAdvantageName) : {};
        advantageName = advantageObject.name ? advantageObject.name: '';
        console.log(`advantageName: ${advantageName};`);
    } else if (hasDarkVisionAdvantage === true) {
        advantageObject = GURPS.findAdDisad(_token.actor,DarkVisionAdvantageName) ? GURPS.findAdDisad(_token.actor,DarkVisionAdvantageName) : {};
        advantageName = advantageObject.name ? advantageObject.name: '';
        console.log(`advantageName: ${advantageName};`);
    }

    if (sight.enabled === true) {
        hasVisionEnabled = true;
        console.log(`hasVisionEnabled: ${hasVisionEnabled};`);
        if (sight.visionMode === "lightAmplification") {
            hasNightVisionActive = true;
            console.log(`hasNightVisionActive: ${hasNightVisionActive};`);
        } else if (sight.visionMode === "darkvision") {
            hasDarkVisionActive = true;
            console.log(`hasDarkVisionActive: ${hasDarkVisionActive};`);
        } else if (sight.visionMode === "basic") {
            hasBasicVisionActive = true;
            console.log(`hasBasicVisionActive: ${hasBasicVisionActive};`);
        } else {
            console.log(`No vision mode active`);
        }
    } else {
        console.log(`Vision is not enabled`);
    }

    if (hasVisionEnabled === false) {
        console.log(`Vision is not enabled; enabling it`);
        await tokenDoc.update({"sight.enabled": true});
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

    if (hasNightVisionAdvantage === true) {
        const match = advantageName.match(/\d+$/); // \d+ matches one or more digits, $ matches the end of the string
        if (match) {
            advantageLevel = parseInt(match[0], 10); // Convert the matched string to a number
            console.log(`advantageLevel: ${advantageLevel} `); // 123
            // Night Vision grants 1 yard of sight range per level
            sightRange = advantageLevel*3;
            console.log(`Night Vision grants 1 yard of sight range per level: ${sightRange} `); // 123
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
            await tokenDoc.update({"sight.range": sightRange, "sight.visionMode": "lightAmplification"});
        } else {
            console.log("Night Vision advantage level not found.");  
        }
    } else if (hasDarkVisionAdvantage === true) {
        // Dark Vision has no levels and grants 1000 yards of sight
        sightRange = 1000;
        console.log(`Dark Vision has no levels and grants 1000 yards of sight: ${sightRange} `); // 123
        await tokenDoc.update({"sight.range": sightRange, "sight.visionMode": "darkvision"});
    } else {
        // set basic Vision mode
        if (hasBasicVisionActive === true) {
            console.log(`No vision advantage found; basic vision is already active`);
        } else {
            console.log(`No vision advantage found; Basic vision is not active; activating it`);
            await tokenDoc.update({"sight.visionMode": "basic"});
            updates.push({
                _id: tokenId,
                sight: {
                    visionMode: "basic"
                }
            });
        }

        if (isCompleteDarkness === false) {
            // not complete darkness, so basic vision and night vision work
            // && canvas.scene.environment.darknessLevel && canvas.scene.environment.darknessLevel < 1
            console.log(`Not complete darkness; setting basic vision mode`);
            await tokenDoc.update({"sight.range": 1, "sight.visionMode": "basic"}); // default range is 3 yards

        } else if (isCompleteDarkness === true) {
            // complete darkness, so basic vision does not work
            console.log(`Complete darkness; setting basic vision mode`);
            await tokenDoc.update({"sight.range": 3, "sight.visionMode": "basic"}); // default range is 3 yards
        }
    }

    // canvas.scene.update({ "darkness": (result.val()/100) },{ animateDarkness: true });
    /*
    let tokenId = _token.id;
    let token = canvas.tokens.get(tokenId); // Get the token object
    let tokenDoc = await token.document; // wake up lazy document
    let sight = token.document.sight.range
    
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

console.log(`---------------------- End VisionMode ----------------------`);