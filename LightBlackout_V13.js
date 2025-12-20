/* Usage: /:Blackout
 *
 */

// This does not work since the token cannot emit darkness without using Token Attacher in V12; this is supposed to be fixed in V13
console.log(`---------------------- Start Blackout ----------------------`);
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
let actor = token.actor;
let tokenDoc = await token.document; // wake up lazy document
let lightBright = 6;
let lightDim = 0;
let lightAngle = 360;

if (!actor) {
    ui.notifications.warn(`Token does not have an associated actor.`);
} else {
    console.log(`actor name: ${actor.name}: setting {"light.bright": 2, "light.dim": 6}`);
    await tokenDoc.update({"light.bright": lightBright, "light.dim": lightDim, "light.angle": lightAngle, "light.animation.type": null, "light.luminosity": 0.5, "light.negative": true});
}

console.log(`---------------------- End Blackout ----------------------`);

// module stuff
/*
class VisionModeBlindsight extends VisionMode{constructor(){super({id:"blindsight",label:"GURPS.SenseBlindsight",canvas:{shader:ColorAdjustmentsSamplerShader,uniforms:{contrast:0,saturation:-1,exposure:0}},lighting:{background:{visibility:VisionMode.LIGHTING_VISIBILITY.REQUIRED}},vision:{darkness:{adaptive:false},defaults:{contrast:0.3,saturation:-1,brightness:0}}},{animated:true})}}

class VisionModeDarkvision extends VisionMode{constructor(){super({
    id:"darkvision",label:"GURPS.SenseDarkvision",
    canvas:{shader:ColorAdjustmentsSamplerShader,uniforms:{contrast:0,saturation:-1,exposure:0}},
    lighting:{background:{visibility:VisionMode.LIGHTING_VISIBILITY.REQUIRED}},
    vision:{darkness:{adaptive:false},defaults:{contrast:0,saturation:-1,brightness:0.1}}
})}}

class VisionModeDevilsSight extends VisionMode{constructor(){super({
    id:"devilsSight",label:"VISION5E.DevilsSight",
    vision:{darkness:{adaptive:false},defaults:{contrast:0,saturation:0,brightness:1}}
})}}

class VisionModeEtherealness extends VisionMode{constructor(){super({id:"etherealness",tokenConfig:false,canvas:{shader:ColorAdjustmentsSamplerShader,uniforms:{contrast:0,saturation:-1,exposure:0}},lighting:{background:{postProcessingModes:["SATURATION"],uniforms:{saturation:-1,tint:[1,1,1]}},illumination:{postProcessingModes:["SATURATION"],uniforms:{saturation:-1,tint:[1,1,1]}},coloration:{postProcessingModes:["SATURATION"],uniforms:{saturation:-1,tint:[1,1,1]}},darkness:{postProcessingModes:["SATURATION"],uniforms:{saturation:-1,tint:[1,1,1]}}},vision:{darkness:{adaptive:false},defaults:{color:null,contrast:0,saturation:-1,brightness:0}}})}}

class VisionModeTruesight extends VisionMode{constructor(){super({id:"truesight",label:"GURPS.SenseTruesight",vision:{darkness:{adaptive:false},defaults:{contrast:0,saturation:0,brightness:1}}})}}Hooks.once("init",(()=>{const e=foundry.utils.isNewerVersion("4.0.0",game.system.version)||"legacy"===game.settings.get("GURPS","rulesVersion");
*/
