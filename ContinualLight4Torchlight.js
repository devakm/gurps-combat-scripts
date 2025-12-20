/* Usage: /:ContinualLight4Torchlight
 *
 */

console.log(`---------------------- Start ContinualLight4Torchlight ----------------------`);
//console.log('args[0].length '+args[0].length+' : '+args[0]);
//let rsize = args[0].length > 0 ? Number(args[0][1]) : 1;
let rsize = 2; // yards radius of light
let rDim = 6; // yards radius of dim light
let gridFeet = 3; //game.scenes.current.dimensions.distance
let targetID,targetToken;

let targets = Array.from(game.user.targets); 
    for(let target of targets){ 
        targetID = target.id;;
        targetToken = canvas.tokens.get(targetID);
        console.log(`targetID: ${targetID}`);
        let tokenDoc = await targetToken.document; // wake up lazy document
            await tokenDoc.update({
                light: {
                    alpha: 1,
                    angle: 360,
                    bright: rsize*gridFeet,
                    coloration: 1,
                    dim: rDim*gridFeet,
                    gradual: true,
                    luminosity: 0.5,
                    saturation: 0,
                    contrast: 0,
                    shadows: 0,
                    animation: {
                        speed: 1,
                        intensity: 2,
                        reverse: false,
                        type: "torch",
                    },
                    darkness: {
                        min: 0,
                        max: 1,
                    },
                    color: "#000000",
                }
            });
        } 

console.log(`---------------------- End ContinualLight4Torchlight ----------------------`);

