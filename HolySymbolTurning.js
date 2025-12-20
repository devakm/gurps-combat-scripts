/* Usage: /:HolySymbolTurning
*/
console.log('---------------------- Start HolySymbolTurning ----------------------');

// config :
let AdvantageName = 'Power*Investiture'; 
// get PI level
let hasPI = GURPS.findAdDisad(_token.actor,AdvantageName) ? true : false;
let advObj,advName,advLevel;

if (hasPI === true) {
    advObj = GURPS.findAdDisad(_token.actor,AdvantageName) ? GURPS.findAdDisad(_token.actor,AdvantageName) : {};
    advName = advObj.name ? advObj.name: '';
    const match = advName.match(/\d+$/); // \d+ matches one or more digits, $ matches the end of the string
    advLevel = match ? parseInt(match[0], 10) : 0; // Convert the matched string to a number
    console.log(`advLevel: ${advLevel} `);
} else {
    ui.notifications.warn(`${AdvantageName} not found!`);
    console.log(`${AdvantageName} not found.`);
}

// check for Holy Symbol or Emblem
let symbolBonus = 0;
let itemName = '';
let actor = _token.actor;
let tokenId = _token.id;
function findItem (actor, tokenId) {
    GURPS.recurselist(actor.system.equipment.carried, (e, k, d) => {
        if ((e.name.includes('High Holy') || e.name.includes('Blessed Holy')) && (e.name.includes('Symbol') || e.name.includes('Emblem'))) {
            console.log(`Found ${e.name} in ${actor.name}'s inventory. Gain +2 bonus.`);
            symbolBonus = 2;
            itemName = e.name;
        } else if ((e.name.includes('Holy')) && (e.name.includes('Symbol') || e.name.includes('Emblem'))) {
            console.log(`Found ${e.name} in ${actor.name}'s inventory. Gain +1 bonus.`);
            symbolBonus = symbolBonus < 2 ? 1 : symbolBonus;
            itemName = e.name;
        } 
    })
  };

findItem(actor,tokenId);

let modOtF = `/r [+${advLevel} Power Investiture] \\\\/r [+${symbolBonus} ${itemName}]`;
GURPS.executeOTF(modOtF);

let willCheck = `[WILL]`; // alter the OtF type used for primary check
let OtF = `${willCheck}`;
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`---------------------- End HolySymbolTurning ----------------------`);