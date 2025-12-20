/* Usage: /:LightAreaEffect rSize=1 rDim=3 rBright=1 rAngle=360 glowLumin=0.3 glowColor=#000000 animation=flame
 * 1 yard: candle, Continual Light spell (moonlight)*, Light spell*
 */
function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 20000);
    });
}

console.log(`---------------------- Start LightAreaEffect ----------------------`);
let rSize = 1; // bright radius
let glowLumin = 0.3; // luminosity
let rAngle = 360; // light angle
let gridUnits = 1; // adjust this if hex size is not 1 yd
let dSize = 0; // GURPS default light rule is that dim area is triple the bright radius

let glowColor = '#000000'; // default #000000 , darkOrange #21170d, greyscale #ffffff; orange #ed9b0c, #ff9900, yellow #ffff00; blue #0000ff; red #ff0000; green #00ff00; purple #9900ff
let animation = 'flame'; // Flickering Light: 'torch', Torch Light: 'flame', 'sunburst', 'pulse', chroma, wave, fog, sunbirst, dome, emanation, hexa, ghost, energy, rolling, hole, 
// ?? pulse, spiral, sweep, flicker, blink, flash, fade

// test for scope changes by entering this first in console:
// let scope = { "rSize": 6, "lumin": 0.5}; // etc
try {
    console.log(scope);
    rSize = scope.rsize > 0 ? Number(parseInt(scope.rsize)) : rSize; // bright radius
    dSize = scope.dsize > 0 ? Number(parseInt(scope.dsize)) : dSize; // dim radius
    glowLumin = scope.lumin > 0 ? parseFloat(scope.lumin) : glowLumin;
    rAngle = scope.angle > 0 ? Number(parseInt(scope.angle)) : rAngle;
    glowColor = scope.color ? scope.color : glowColor;
    animation = scope.anim ? scope.anim : animation;
    dSize = scope.dsize !== undefined ? Number(parseInt(scope.dsize)) : dSize; // dim radius
} catch (error) {
    console.error('Error accessing scope:', error);
}

// config
if (dSize === 0) dSize = rSize*3; // GURPS default light rule is that dim area is triple the bright radius
let rDim = dSize*gridUnits;
let rBright = rSize*gridUnits;
console.log(`rSize:${rSize}; rDim:${rDim}; rBright:${rBright}; glowLumin:${glowLumin}; rAngle:${rAngle}; glowColor:${glowColor};`);

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

if (animation === 'sunburst') {
    await wait(18);
    await targetToken.document.update({"light.animation.type": "none"});
}

console.log(`---------------------- End LightAreaEffect ----------------------`);

/*
let targets = Array.from(game.user.targets); 
let target = targets[0];
targetID = target.id;;
targetToken = await canvas.tokens.get(targetID);
await targetToken.document.update({"light.animation.type": "none"});
 */
