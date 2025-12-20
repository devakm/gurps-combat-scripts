/* Usage: /:DarkVision
 *
 */

console.log(`---------------------- Start DarkVision ----------------------`);
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let tokenDoc = await token.document; // wake up lazy document
await tokenDoc.update({"sight.range": 1, "sight.visionMode": "basic"});

console.log(`---------------------- End DarkVision ----------------------`);