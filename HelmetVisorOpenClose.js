/* Usage: /:HelmetVisorOpenClose
 *
 */

console.log(`---------------------- Start HelmetVisorOpenClose ----------------------`);

let token = canvas.tokens.get(_token.id); // Get the token object
let tokenDoc = await token.document; // wake up lazy document
let OtF = ''; 

// tokenDoc.data.sightAngle = 120/240;
// token.document.update({sightAngle: 240});
if (token.data.sightAngle === 120) {
    console.log(`Visor is closed; opening it; face unprotected`);
    OtF = `/fp +0 \\\\Visor opened. Face unprotected.`; 
    await tokenDoc.update({sightAngle: 240});
} else {
    console.log(`Visor is open; closing it; face protected`);
    OtF = `/fp +0 \\\\Visor closed. Face protected.`;
    await tokenDoc.update({sightAngle: 120});
}

console.log(OtF);
GURPS.executeOTF(OtF);

console.log(`---------------------- End HelmetVisorOpenClose ----------------------`);