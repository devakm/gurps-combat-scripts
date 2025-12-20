// rollitem example
function rollItem(itemName, itemType, bypassData = {}) {
  const speaker = ChatMessage.getSpeaker();
  const actor = speaker.token 
    ? game.actors.tokens[speaker.token] 
    : game.actors.get(speaker.actor);

  const item = actor?.items.find(i => i.name === itemName && i.type === itemType);
  return game.dsa5.macro.runItem(actor, item, itemName, bypassData, speaker.token);
}
  
const result = rollItem("Metallbearbeitung", "skill", {mod: "undefined"});

console.log(result);


/*
Links all tokens on the currently viewed scene to an actor of matching name in the sidebar. Should no matching actor be found a warning will be displayed containing the name of the token that could not be relinked

Note that the actor and token name need to match exactly. As such a token named "Angry bear" will not be linked to an actor of the name "bear". Therefore this won't work if you use the adjective randomization added in v11. 

AI says: If you want to use this feature you will need to modify the code to match the names in a way that works for you.
*/
let updates=[]

for (let tokenDoc of canvas.scene.tokens){
    let act=game.actors.getName(tokenDoc.name)

    if (!act){
        ui.notifications.warn(`Token ${tokenDoc.name} doesn't have a matching actor`)
    }else{
        updates.push({
        _id:tokenDoc.id,
        actorId:act.id
        })
    }
}

canvas.scene.updateEmbeddedDocuments("Token",updates)


/*
For users who want to apply custom CSS only on their side without having to apply it for all other users in the game; Example usages are "increase font-size for one window" or "increase size of controls" or "accessibility for visually impaired users"

Keywords for discord search:
accessibility, visually impaired, custom css, change font size, change ui size, rescale ui, scale ui, custom style

*/
let style =`<style>
//Your CSS Style Rules Below This Line
div#sidebar {
width: 500px;
}
nav#sidebar-tabs {
zoom: 1.75;
}
//Your Style Rules Above This Line
</style>`  

document.head.insertAdjacentHTML("beforeend", style);

/*
Embedded Document Types for Common Documents (0.8.x and above)

Format:
Parent Class: 'List', 'of', 'Embedded','Types'
-----------------------------------------------------

Scene: 'AmbientLight', 'AmbientSound', 'Drawing', 'MeasuredTemplate', 'Note', 'Tile', 'Token', 'Wall'

Actor:  'ActiveEffect', 'Item'

Item: 'ActiveEffect'

Playlist: 'PlaylistSound'

Note: This list generated from Object.keys(DOCUMENT_NAME.implementation.metadata.embedded)

*/

/*
Macro Resources (WIP)
==================
PSA: Backup your world/scene etc before running any macro you don't fully understand -- data loss could occur

Types of Macros 
------------------------
Chat (uses Foundry chat commands like /r 1d20)
Script(uses the Foundry API which is built on Javascript)

Foundry VTT Specific Resources
---------------------------------------
Official Knowledgebase: https://foundryvtt.com/article/macros/

Community Wiki: https://foundryvtt.wiki/en/basics/Macros

API Documentation (For Script Macros): https://foundryvtt.com/api/

General Javascript Resources
-----------------------------------
Javascript on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript
Javascript on W3schools: https://www.w3schools.com/js/ 

*/

// Utility script that will print out the next opened compendium's key (for use in game.packs.get)

Hooks.once('renderCompendium', (app) => ChatMessage.create({content: app.collection.collection}))

/**
 * Variant Token module
 * Assign an image to be displayed to only that user.
 * @param {*} token token the image is to be applied to
 * @param {*} img image to be displayed, if no image is provided unassignUserSpecificImage(...) will be called
 * @param {*} opts.userName name of the user that the image is to be displayed to
 * @param {*} opts.id id of the user that the image is to be displayed to
 * @returns
 */
export function assignUserSpecificImage(token, img, { userName = null, userId = null } = {}) {...}

// or 
assignUserSpecificImage(tokenObj, "path/to/img", {userName: "userName"});

