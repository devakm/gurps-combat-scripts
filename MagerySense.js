/* Usage: /:MagerySense
*/
console.log('---------------------- Start MagerySense ----------------------');

// config :
let AdvantageName = 'Magery'; 
let mageName = _token.actor.name; // name of the actor to use for the check

// result text wording; adjust to your preference 
let sMsg = `/w gm ${mageName}'s Magery senses percieve whether the item is magical or not.`;
let fMsg = `/w gm ${mageName}'s Magery senses fail to percieve whether the item is magical or not.`;
let csMsg = `/w gm ${mageName}'s Magery senses percieve keen insights about the item, including whether the magic is helpful or dangerous, and about how strong it is.`;
let cfMsg = `/w gm ${mageName}'s Magery senses get scrambled so badly that you must Meditate before trying again.`; 

// get Magery level
let hasMagery = GURPS.findAdDisad(_token.actor,AdvantageName) ? true : false;
let advObj,advName,advLevel;

if (hasMagery === true) {
    advObj = GURPS.findAdDisad(_token.actor,AdvantageName) ? GURPS.findAdDisad(_token.actor,AdvantageName) : {};
    advName = advObj.name ? advObj.name: '';
    const match = advName.match(/\d+$/); // \d+ matches one or more digits, $ matches the end of the string
    advLevel = match ? parseInt(match[0], 10) : 0; // Convert the matched string to a number
    console.log(`advLevel: ${advLevel} `);
} else {
    ui.notifications.warn(`${AdvantageName} not found!`);
    console.log(`${AdvantageName} not found.`);
}

let perceptionCheck = `[!PER+${advLevel} to Magery senses]`; // alter the OtF type used for primary check

let OtF = `/if ${perceptionCheck} s:{${sMsg}} cs:{${csMsg}} f:{${fMsg}} cf:{${cfMsg}}`;
console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`---------------------- End MagerySense ----------------------`);