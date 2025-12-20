//import { GURPS } from "../module/config.js";
let NightVisionAdvantageName ='Night*Vision'; //  name of the advantage to check
let DarkVisionAdvantageName ='Dark*Vision'; //  name of the advantage to check
let nightVisionLevelMultiplier = 1;
let advantageLevel = 0;
let hasNightVisionAdvantage = false;
let hasDarkVisionAdvantage = false;
let hasNightVisionActive = false;
let hasDarkVisionActive = false;
let advantageObject = {};

/**
 * The vision mode for GURPS Darkvision.
 */
class VisionModeGurpsDarkvision extends VisionMode {
    constructor() {
        super({
            id: "gurpsDarkvision",
            label: "GURPS.SenseDarkvision",
            canvas: {
                shader: ColorAdjustmentsSamplerShader,
                uniforms: { contrast: 0, saturation: -1, exposure: 0 },
            },
            vision: {
                darkness: { adaptive: false },
                defaults: { contrast: 0, saturation: -1, brightness: 0.1 },
            },
        });
    }
}
class DetectionModeHearing extends DetectionMode {
    constructor() {
        super({
            id: "hearing",
            label: "GURPS.Hearing",
            type: DetectionMode.DETECTION_TYPES.SOUND,
            angle: false,
            imprecise: true,
            priority: 1
        })
    }
    static getDetectionFilter() {
        return this._detectionFilter ??= PingDetectionFilter.create({
            color: [1, 1, 1],
            alpha: 0.75
        })
    }
    _canDetect(e, t) {
        const s = e.object;
        //let gurpsStealthStatusId ='stealth'; //   
        //let statusId ='stealth'; // _token.document.detectionModes
        //let hasStealth = _token.actor.statuses.some(e => e === statusId);
        //let hasStealth = _token.document.hasStatusEffect('stealth');

        if (!(t instanceof Token) || t.document.hasStatusEffect(CONFIG.specialStatusEffects.DEFEATED) || t.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL) && !s.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL) || t.document.hasStatusEffect(CONFIG.specialStatusEffects.INAUDIBLE) || t.document.hasStatusEffect('stealth') || t.document.hasStatusEffect(CONFIG.specialStatusEffects.PETRIFIED))
            return false;
        if (s.document.hasStatusEffect(CONFIG.specialStatusEffects.DEFEATED) || s.document.hasStatusEffect('dead') || s.document.hasStatusEffect(CONFIG.specialStatusEffects.DEAFENED) || s.document.hasStatusEffect('deaf') || s.document.hasStatusEffect(CONFIG.specialStatusEffects.PETRIFIED) || s.document.hasStatusEffect(CONFIG.specialStatusEffects.UNCONSCIOUS))
            return false;
        else
            return true
    }
    _testLOS(e, t, s, i) {
        return !CONFIG.Canvas.polygonBackends.sound.testCollision({
            x: e.x,
            y: e.y
        }, i.point, {
            type: "sound",
            mode: "any",
            source: e,
            wallDirectionMode: PointSourcePolygon.WALL_DIRECTION_MODES.REVERSED,
            useThreshold: true
        })
    }
}
class PingDetectionFilter extends AbstractBaseFilter {
    autoFit = false;
    animated = true;
    static defaultUniforms = {
        color: [1, 1, 1],
        alpha: 1
    };
    static vertexShader = "\n        attribute vec2 aVertexPosition;\n\n        uniform mat3 projectionMatrix;\n        uniform vec4 inputSize;\n        uniform vec4 outputFrame;\n\n        varying vec2 vFilterCoord;\n\n        void main() {\n            vFilterCoord = aVertexPosition;\n            vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n            gl_Position = vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n        }";
    static fragmentShader = `\n        varying vec2 vFilterCoord;\n\n        uniform vec3 color;\n        uniform float alpha;\n        uniform float time;\n\n        ${this.CONSTANTS}\n        ${this.WAVE()}\n\n        void main(void) {\n            float dist = distance(vFilterCoord, vec2(0.5)) * 2.0;\n            gl_FragColor = vec4(color, 1.0) * alpha * wcos(0.0, 1.0, dist * 75.0, -time * 0.01 + 3.0 * step(dist, 1.0)) * (1.0 - dist);\n        }`;
    apply(e, t, s, i) {
        this.uniforms.time = this.animated && !canvas.photosensitiveMode ? canvas.app.ticker.lastTime : 0;
        e.applyFilter(this, t, s, i)
    }
}

Hooks.once("init", () => {
    CONFIG.AmbientLight.objectClass = mixin(CONFIG.AmbientLight.objectClass);
    CONFIG.Token.objectClass = mixin(CONFIG.Token.objectClass);

    // Add the new VisionMode to CONFIG.Canvas.visionModes
    CONFIG.Canvas.visionModes.gurpsDarkvision = new VisionModeGurpsDarkvision(); 
    CONFIG.Canvas.detectionModes.hearing = new DetectionModeHearing(); 
});

Hooks.on('init', () => {
    game.settings.register("gurps-night-vision", "onlyOnSelection", {
        name: "Night Vision requires selection",
        hint: "With this setting on, players must select a token to see with Night Vision",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => {
            // Refresh canvas sight
            canvas.perception.update(
                { initializeLighting: true, initializeVision: true, refreshLighting: true, refreshVision: true },
                true
            );
        },
    });

    game.settings.register("gurps-night-vision", "nightVisionDistance", {
        name: "Night Vision multiplier",
        hint: "Modifies the light multiplier granted per level of Night Vision (1-9). Recommended setting is 2 or 3. Default is 3.",
        scope: "world",
        config: true,
        default: 3,
        type: Number,
        step: "any",
        onChange: () => {
            // Refresh canvas sight
            canvas.perception.update(
                { initializeLighting: true, initializeVision: true, refreshLighting: true, refreshVision: true },
                true
            );
        },
    });

    game.settings.register("gurps-night-vision", "nightVisionBright", {
        name: "Night Vision affects bright illumination",
        hint: "With this setting on, Night Vision also increases the radius of bright illumination by half the value of dim illumination.",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => {
            // Refresh canvas sight
            canvas.perception.update(
                { initializeLighting: true, initializeVision: true, refreshLighting: true, refreshVision: true },
                true
            );
        },
    });
    CONFIG.specialStatusEffects.DEAFENED = "deafened";
    CONFIG.specialStatusEffects.INAUDIBLE = "inaudible";
    CONFIG.specialStatusEffects.PETRIFIED = "petrified";
    CONFIG.specialStatusEffects.UNCONSCIOUS = "unconscious";
    CONFIG.specialStatusEffects.DEFEATED = "defeated";
    CONFIG.specialStatusEffects.ETHEREAL = "ethereal";
    CONFIG.specialStatusEffects.DEAD = "dead";
});

//define the values that calculate the Nightvision multiplier, and make them 0 so they don't introduce undefined into the calculation
let multiplier = { dim: 0, bright: 0 };
let nightVisionDistance = 0;
let gridUnitPixels = 0;

const mixin = Base => class extends Base {
    /** @override */
    _getLightSourceData() {
        const data = super._getLightSourceData();
        if (data.negative === true && data.disabled === false && hasDarkVisionActive === true) {
			console.log (`---  DARKNESS:  Dark Vision active, and this light emits Darkness, so setting radius to 0;`);
			data.dim = 0;
			data.bright = 0;
			data.radius = 0;
        } else if (data.negative === false && multiplier.dim > 1 && hasNightVisionActive === true ) {
            data.dim += multiplier.dim * nightVisionDistance * gridUnitPixels;
        } 

        if (game.settings.get("gurps-night-vision", "nightVisionBright")) {
            if (data.negative === false && hasNightVisionActive === true && multiplier.bright > 1 ) {
                data.bright += multiplier.bright * nightVisionDistance / 2 * gridUnitPixels;
            }
        }
        return data;
    }
};

const visionCalculator = async function () {
    multiplier = { dim: 0, bright: 0 }; //reset multiplier to 0 (erases previous values)
    const gmSelection = game.user.isGM || game.settings.get("gurps-night-vision", "onlyOnSelection");
    const controlledtoken = canvas.tokens.controlled;
    let relevantTokens; // define which tokens with which to calculate Night Vision settings.

    if (controlledtoken.length) {
        relevantTokens = canvas.tokens.placeables.filter(
            (o) =>
                !!o.actor && o.actor?.testUserPermission(game.user, "OBSERVER") && o.controlled
        );
    } else {
        relevantTokens = canvas.tokens.placeables.filter(
            (o) =>
                !!o.actor && o.actor?.testUserPermission(game.user, "OBSERVER") && (gmSelection ? o.controlled : true)
        );
    }

    if (gmSelection && relevantTokens.length) {
        multiplier = { dim: 999, bright: 999 };
		hasNightVisionAdvantage = false;
		hasDarkVisionAdvantage = false;
		hasNightVisionActive = false;
		hasDarkVisionActive = false;

        for (const t of relevantTokens) {
            hasNightVisionAdvantage = GURPS.findAdDisad(t.actor,NightVisionAdvantageName) ? true : false;
            hasDarkVisionAdvantage = GURPS.findAdDisad(t.actor,DarkVisionAdvantageName) ? true : false;
            console.log(`Checking selected token(s) for Night Vision and Dark Vision: ${t.name}`);

            if (t.actor.flags.DarkVisionSpell && t.actor.flags.DarkVisionSpell === true) {
                console.log(`Has Dark Vision spell: ${t.actor.flags.DarkVisionSpell}`);
                hasDarkVisionActive = true;
                await t.document.update({"sight.visionMode": "gurpsDarkvision", "sight.range": 1000});
                await t.vision.visionMode.updateSource({"id": "gurpsDarkvision", "label": "GURPS.SenseDarkvision"});
                await t.document.update({"vision.blinded.darkness": false});

                if (t.document.sight.visionMode.id !== "gurpsDarkvision") {
                    console.log(`Has Dark Vision advantage (${hasDarkVisionAdvantage}), so try setting visionMode=gurpsDarkvision`);
                    await t.document.update({"sight.visionMode": "gurpsDarkvision", "sight.range": 1000});
                    await t.vision.visionMode.updateSource({"id": "gurpsDarkvision", "label": "GURPS.SenseDarkvision"});
                    await t.document.update({"vision.blinded.darkness": false});
                }
            } else if (hasDarkVisionAdvantage === true) {
                console.log(`Has Dark Vision advantage (${hasDarkVisionAdvantage});`);
                hasDarkVisionActive = true;
                await t.document.update({"sight.visionMode": "gurpsDarkvision", "sight.range": 1000});
                await t.vision.visionMode.updateSource({"id": "gurpsDarkvision", "label": "GURPS.SenseDarkvision"});
                await t.document.update({"vision.blinded.darkness": false});

                if (t.document.sight.visionMode.id !== "gurpsDarkvision") {
                    console.log(`Has Dark Vision advantage (${hasDarkVisionAdvantage}), so try setting visionMode=gurpsDarkvision`);
                    await t.document.update({"sight.visionMode": "gurpsDarkvision", "sight.range": 1000});
                    await t.vision.visionMode.updateSource({"id": "gurpsDarkvision", "label": "GURPS.SenseDarkvision"});
                    await t.document.update({"vision.blinded.darkness": false});
                }
            } else if (t.actor.flags.NightVisionSpell && t.actor.flags.NightVisionSpell > 0) {
                hasNightVisionActive = true;
                nightVisionDistance = game.settings.get("gurps-night-vision", "nightVisionDistance");
                advantageLevel = t.actor.flags.NightVisionSpell;
                nightVisionLevelMultiplier = advantageLevel * nightVisionDistance;
                console.log(`token: ${t.actor.name}; has Night Vision spell active; actor.flags.NightVisionSpell: ${t.actor.flags.NightVisionSpell}; spell Level: ${advantageLevel} ; nightVisionLevelMultiplier: ${nightVisionLevelMultiplier};`);
                multiplier.dim = Math.min(multiplier.dim, nightVisionLevelMultiplier);
                multiplier.bright = Math.min(multiplier.bright, nightVisionLevelMultiplier);
            } else if (hasNightVisionAdvantage === true) {
                hasNightVisionActive = true;
                advantageObject = GURPS.findAdDisad(t.actor,NightVisionAdvantageName) ? GURPS.findAdDisad(t.actor,NightVisionAdvantageName) : {};
                let advantageName = advantageObject.name ? advantageObject.name: '';
                const match = advantageName.match(/\d+$/);
                if (match) {
                    advantageLevel = parseInt(match[0], 10);
                    console.log(`advantageLevel: ${advantageLevel} `);
                    nightVisionDistance = game.settings.get("gurps-night-vision", "nightVisionDistance");
                    nightVisionLevelMultiplier = advantageLevel * nightVisionDistance;
                    console.log(`nightVisionLevelMultiplier: ${nightVisionLevelMultiplier};`);
                }
                multiplier.dim = Math.min(multiplier.dim, nightVisionLevelMultiplier);
                multiplier.bright = Math.min(multiplier.bright, nightVisionLevelMultiplier);
            } else {
                hasNightVisionActive = false;
                hasDarkVisionActive = false;
                console.log(`token: ${t.actor.name}; does not have Night Vision advantage, so no light multiplier`);
                multiplier.dim = 1;
                multiplier.bright = 1;
                nightVisionDistance = 1;
            }
            console.log(`multiplier.dim: ${multiplier.dim};`);
        }
    } else {
        multiplier = { dim: 1, bright: 1 };
		hasNightVisionAdvantage = false;
		hasDarkVisionAdvantage = false;
		hasNightVisionActive = false;
		hasDarkVisionActive = false;

        for (const t of relevantTokens) {
            hasNightVisionAdvantage = GURPS.findAdDisad(t.actor,NightVisionAdvantageName) ? true : false;
            hasDarkVisionAdvantage = GURPS.findAdDisad(t.actor,DarkVisionAdvantageName) ? true : false;
            console.log(`Checking selected token(s) for Night Vision and Dark Vision: ${t.name}`);

            if (t.actor.flags.DarkVisionSpell && t.actor.flags.DarkVisionSpell === true) {
                console.log(`Has Dark Vision spell: ${t.actor.flags.DarkVisionSpell}`);
                hasDarkVisionActive = true;
                await t.document.update({"sight.visionMode": "gurpsDarkvision", "sight.range": 1000});
                await t.vision.visionMode.updateSource({"id": "gurpsDarkvision", "label": "GURPS.SenseDarkvision"});
                await t.document.update({"vision.blinded.darkness": false});

                if (t.document.sight.visionMode.id !== "gurpsDarkvision") {
                    console.log(`Has Dark Vision advantage (${hasDarkVisionAdvantage}), so try setting visionMode=gurpsDarkvision`);
                    await t.document.update({"sight.visionMode": "gurpsDarkvision", "sight.range": 1000});
                    await t.vision.visionMode.updateSource({"id": "gurpsDarkvision", "label": "GURPS.SenseDarkvision"});
                    await t.document.update({"vision.blinded.darkness": false});
                }
            } else if (hasDarkVisionAdvantage === true) {
                console.log(`Has Dark Vision advantage (${hasDarkVisionAdvantage});`);
                hasDarkVisionActive = true;
                await t.document.update({"sight.visionMode": "gurpsDarkvision", "sight.range": 1000});
                await t.vision.visionMode.updateSource({"id": "gurpsDarkvision", "label": "GURPS.SenseDarkvision"});
                await t.document.update({"vision.blinded.darkness": false});

                if (t.document.sight.visionMode.id !== "gurpsDarkvision") {
                    console.log(`Has Dark Vision advantage (${hasDarkVisionAdvantage}), so try setting visionMode=gurpsDarkvision`);
                    await t.document.update({"sight.visionMode": "gurpsDarkvision", "sight.range": 1000});
                    await t.vision.visionMode.updateSource({"id": "gurpsDarkvision", "label": "GURPS.SenseDarkvision"});
                    await t.document.update({"vision.blinded.darkness": false});
                }
            } else if (t.actor.flags.NightVisionSpell && t.actor.flags.NightVisionSpell > 0) {
                hasNightVisionActive = true;
                nightVisionDistance = game.settings.get("gurps-night-vision", "nightVisionDistance");
                advantageLevel = t.actor.flags.NightVisionSpell;
                nightVisionLevelMultiplier = advantageLevel * nightVisionDistance;
                console.log(`token: ${t.actor.name}; has Night Vision spell active; actor.flags.NightVisionSpell: ${t.actor.flags.NightVisionSpell}; spell Level: ${advantageLevel} ; nightVisionLevelMultiplier: ${nightVisionLevelMultiplier};`);
                multiplier.dim = Math.min(multiplier.dim, nightVisionLevelMultiplier);
                multiplier.bright = Math.min(multiplier.bright, nightVisionLevelMultiplier);
            } else if (hasNightVisionAdvantage === true) {
				hasNightVisionActive = true;
                let advantageObject = GURPS.findAdDisad(t.actor,NightVisionAdvantageName) ? GURPS.findAdDisad(t.actor,NightVisionAdvantageName) : {};
                let advantageName = advantageObject.name ? advantageObject.name: '';
                const match = advantageName.match(/\d+$/);
                if (match) {
                    advantageLevel = parseInt(match[0], 10);
                    console.log(`advantageLevel: ${advantageLevel} `);
                    nightVisionDistance = game.settings.get("gurps-night-vision", "nightVisionDistance");
                    nightVisionLevelMultiplier = advantageLevel * nightVisionDistance;
                    console.log(`nightVisionLevelMultiplier: ${nightVisionLevelMultiplier};`);
                }
                multiplier.dim = Math.max(multiplier.dim, nightVisionLevelMultiplier);
                multiplier.bright = Math.max(multiplier.bright, nightVisionLevelMultiplier);
            } else {
                console.log(`token: ${t.actor.name}; does not have Night Vision advantage, so no light multiplier`);
                multiplier.dim = 1;
                multiplier.bright = 1;
                nightVisionDistance = 1;
            }
        }
    }

    gridUnitPixels = game.scenes.viewed.dimensions.distancePixels;

    for (const { object } of canvas.effects.lightSources) {
        if (!((object instanceof AmbientLight) || (object instanceof Token))) continue;
        object.initializeLightSource();
    }
	for (const { object } of canvas.effects.darknessSources) {
        if (!((object instanceof AmbientLight) || (object instanceof Token))) continue;
        object.initializeLightSource();
    }
};

const Debouncer = foundry.utils.debounce(visionCalculator, 10);

Hooks.on("controlToken", () => {
    Debouncer();
});