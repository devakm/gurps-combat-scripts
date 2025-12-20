// SetNameAndBars.js

/*
  Name: Set Names and Bars
  Description: Update all tokens on the map to show their names and bars on hover, 
  filtering based on a predefined condition (e.g., NPCs only).
*/

const { ALWAYS, CONTROL, HOVER, NONE, OWNER, OWNER_HOVER } = CONST.TOKEN_DISPLAY_MODES; 

const FILTER_MODE = {
  CHARACTER: (t) => t.actor?.type === "npc",     
  NPC: (t) => t.actor?.type === "character",      
  ALL: (t) => !!t.actor                           
};

const displayBars = OWNER_HOVER;
// Choose bar visibility.
const displayName = OWNER_HOVER;
// Choose name visibility.
const filterMode = FILTER_MODE.CHARACTER;
// Choose a filter mode: CHARACTER, NPC or ALL.

const updates = canvas.tokens.placeables
  .filter(filterMode)
  .map(token => ({
    _id: token.id,
    "bar1.attribute": "attributes.hp",
    "bar2.attribute": "None",
    displayName,
    displayBars
  }));
await canvas.scene.updateEmbeddedDocuments('Token', updates);