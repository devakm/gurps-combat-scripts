/* Usage: /:SunlightAreaEffect
 *
 */

console.log(`---------------------- Start SunlightAreaEffect ----------------------`);
let rsize = 1;
let glowLumin = 0.5;
let rAngle = 360;
let glowColor = '#000000'; // default #000000 , greyscale #ffffff; orange #ed9b0c, #ff9900, yellow #ffff00; blue #0000ff; red #ff0000; green #00ff00; purple #9900ff
let animation = 'flame'; // Flickering Light: 'torch', Torch Light: 'flame', 'sunburst', 'pulse', chroma, wave, fog, sunbirst, dome, emanation, hexa, ghost, energy, rolling, hole, 
// ?? pulse, spiral, sweep, flicker, blink, flash, fade

// test for scope changes by entering this first in console:
// let scope = { "rsize": 6, "lumin": 0.5}; // etc
try {
    console.log(scope);
    rsize = scope.rsize > 0 ? Number(parseInt(scope.rsize)) : rsize;
    glowLumin = scope.lumin > 0 ? parseFloat(scope.lumin) : glowLumin;
    rAngle = scope.angle > 0 ? Number(parseInt(scope.angle)) : rAngle;
    glowColor = scope.color ? scope.color : glowColor;
    animation = scope.animation ? scope.animation : animation;
} catch (error) {
    console.error('Error accessing scope:', error);
}

// config
let gridUnits = 1; // adjust this if hex size is not 1 yd
let dimRadius = Number(rsize)*3; // GURPS default light rule is that dim area is triple the bright radius
let rDim = dimRadius*gridUnits;
let rBright = rsize*gridUnits;
console.log(`rsize:${rsize}; rDim:${rDim}; rBright:${rBright}; glowLumin:${glowLumin}; rAngle:${rAngle}; glowColor:${glowColor};`);

let targetID,targetToken,targetActor,targetName,tokenDoc;
let targets = Array.from(game.user.targets); 
    for(let target of targets){ 
        targetID = target.id;;
        targetToken = canvas.tokens.get(targetID);
        targetActor = targetToken.actor;
        targetName = targetActor.name;
        console.log(`targetID: ${targetID}`);
        tokenDoc = await targetToken.document; // wake up lazy document
            await tokenDoc.update({
                light: {
                    alpha: 1,
                    angle: rAngle,
                    bright: rBright,
                    coloration: 1,
                    dim: rDim,
                    gradual: true,
                    luminosity: glowLumin,
                    saturation: 0,
                    contrast: 0,
                    shadows: 0,
                    animation: {
                        speed: 1,
                        intensity: 2,
                        reverse: false,
                        type: animation,
                    },
                    darkness: {
                        min: 0,
                        max: 1,
                    },
                    color: glowColor,
                }
            });
            console.log(`targetID: ${targetID}: targetName: ${targetName}`);
            console.log(tokenDoc.light);
        } 

console.log(`---------------------- End SunlightAreaEffect ----------------------`);

