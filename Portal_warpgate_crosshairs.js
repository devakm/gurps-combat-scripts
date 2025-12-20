// Portal AOE Targetter
// Requires: Portal
// This macro captures and targets any tokens within a specified circle when clicked on, using a crosshair cursor for precise targeting.

if(!game.modules.get("portal-lib").active) return ui.notifications.warn("You need the Portal module for this macro to work");
if(!game.modules.get("sequencer").active) return ui.notifications.warn("You need the Sequencer module for this macro to work");
if(!game.modules.get("jb2a_patreon").active && !game.modules.get("JB2A_DnD5e").active) return ui.notifications.warn("You need either the free or the Patreon pack from JB2A");

// Define the radius of the AoE in grid squares
const aoeRadius = 6.5;

// Function to calculate the distance between two points
const calcDistance = (A, B) => {
    const dx = A.x - B.x;
    const dy = A.y - B.y;
    return Math.sqrt(dx * dx + dy * dy) / canvas.grid.size;
};

// Display the crosshair and get the selected position. Size is the diameter in feet so needs a *10 to convert from a radius in grid squares
let position = await new Portal().size(aoeRadius*10).texture("-Assets/Images/Ping%20Pointers/Crosshairs3.webp").color("#ffffff").pick()


// Define the capture area based on the selected position
const captureArea = {
    x: position.x,
    y: position.y,
    radius: aoeRadius * canvas.grid.size // Radius in pixels
};

// Collect tokens within the capture area
const containedTokens = canvas.tokens.placeables.filter(token => {
    const dist = calcDistance(captureArea, token.center);
    return dist <= aoeRadius; // Compare distance in grid units
});
console.log(containedTokens);

// Convert the collected tokens to an array and extract their IDs
let targetIds = containedTokens.map(token => token.id);
console.log(targetIds);

// Update the GM's token targets with the collected target IDs
game.user.updateTokenTargets(targetIds);