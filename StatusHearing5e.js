class DetectionModeHearing extends DetectionMode$1 {
    constructor() {
        super({
            id: "hearing",
            label: "VISION5E.Hearing",
            type: DetectionMode$1.DETECTION_TYPES.SOUND,
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
        if (!(t instanceof Token) || t.document.hasStatusEffect(CONFIG.specialStatusEffects.DEFEATED) || t.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL) && !s.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL) || t.document.hasStatusEffect(CONFIG.specialStatusEffects.INAUDIBLE) || t.document.hasStatusEffect(CONFIG.specialStatusEffects.PETRIFIED))
            return false;
        if (s.document.hasStatusEffect(CONFIG.specialStatusEffects.DEFEATED) || s.document.hasStatusEffect(CONFIG.specialStatusEffects.DEAFENED) || s.document.hasStatusEffect(CONFIG.specialStatusEffects.PETRIFIED) || s.document.hasStatusEffect(CONFIG.specialStatusEffects.UNCONSCIOUS))
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

Hooks.once("init", (()=>{
    const e = foundry.utils.isNewerVersion("4.0.0", game.system.version) || "legacy" === game.settings.get("dnd5e", "rulesVersion");
    CONFIG.Actor.documentClass = a(CONFIG.Actor.documentClass);
    CONFIG.Token.documentClass = G(CONFIG.Token.documentClass);
    CONFIG.Token.objectClass = C(CONFIG.Token.objectClass);
    CONFIG.Token.hudClass = T(CONFIG.Token.hudClass);
    CONFIG.Canvas.groups.visibility.groupClass = b(CONFIG.Canvas.groups.visibility.groupClass);
    CONFIG.Canvas.visionSourceClass = M(CONFIG.Canvas.visionSourceClass);
    CONFIG.ui.combat = y(CONFIG.ui.combat);


    CONFIG.Actor.documentClass = ActorMixin(CONFIG.Actor.documentClass);
    CONFIG.Token.documentClass = TokenDocumentMixin(CONFIG.Token.documentClass);
    CONFIG.Token.objectClass = TokenMixin(CONFIG.Token.objectClass);
    CONFIG.Token.hudClass = TokenHUDMixin(CONFIG.Token.hudClass);
    
    CONFIG.statusEffects.push({
        id: "inaudible",
        name: "VISION5E.Inaudible",
        img: "modules/vision-5e/icons/inaudible.svg",
        _id: dnd5e.utils.staticID("dnd5einaudible")
    });
    CONFIG.specialStatusEffects.BLEEDING = "bleeding";
    CONFIG.specialStatusEffects.BLIND_SENSES = "blindSenses";
    CONFIG.specialStatusEffects.BLINDED = "blinded";
    CONFIG.specialStatusEffects.BURNING = "burning";
    CONFIG.specialStatusEffects.BURROWING = "burrowing";
    CONFIG.specialStatusEffects.DEAFENED = "deafened";
    CONFIG.specialStatusEffects.DEVILS_SIGHT = "devilsSight";
    CONFIG.specialStatusEffects.DISEASED = "diseased";
    CONFIG.specialStatusEffects.ECHOLOCATION = "echolocation";
    CONFIG.specialStatusEffects.ETHEREAL = "ethereal";
    CONFIG.specialStatusEffects.FLYING = "flying";
    CONFIG.specialStatusEffects.GHOSTLY_GAZE = "ghostlyGaze";
    CONFIG.specialStatusEffects.HOVERING = "hovering";
    CONFIG.specialStatusEffects.INAUDIBLE = "inaudible";
    CONFIG.specialStatusEffects.MAGICAL = "magical";
    CONFIG.specialStatusEffects.MATERIAL = "material";
    CONFIG.specialStatusEffects.MIND_BLANK = "mindBlank";
    CONFIG.specialStatusEffects.NONDETECTION = "nondetection";
    CONFIG.specialStatusEffects.OBJECT = "object";
    CONFIG.specialStatusEffects.PETRIFIED = "petrified";
    CONFIG.specialStatusEffects.POISONED = "poisoned";
    CONFIG.specialStatusEffects.POISONOUS = "poisonous";
    CONFIG.specialStatusEffects.REVENANCE = "revenance";
    CONFIG.specialStatusEffects.SLEEPING = "sleeping";
    CONFIG.specialStatusEffects.THINKING = "thinking";
    CONFIG.specialStatusEffects.UMBRAL_SIGHT = "umbralSight";
    CONFIG.specialStatusEffects.UNCONSCIOUS = "unconscious";
    if (e)
        CONFIG.specialStatusEffects.SHAPECHANGER = "shapechanger";
    Object.defineProperties(CONFIG.specialStatusEffects, {
        BLIND: {
            get() {
                return this.BLINDED
            },
            set(e) {
                this.BLINDED = e
            },
            configurable: true,
            enumerable: false
        },
        BURROW: {
            get() {
                return this.BURROWING
            },
            set(e) {
                this.BURROWING = e
            },
            configurable: true,
            enumerable: false
        },
        FLY: {
            get() {
                return this.FLYING
            },
            set(e) {
                this.FLYING = e
            },
            configurable: true,
            enumerable: false
        },
        HOVER: {
            get() {
                return this.HOVERING
            },
            set(e) {
                this.HOVERING = e
            },
            configurable: true,
            enumerable: false
        }
    });
    for (const e of [DetectionModeBlindsight, DetectionModeBloodSense, DetectionModeDarkvision, DetectionModeDetectEvilAndGood, DetectionModeDetectMagic, DetectionModeDetectPoisonAndDisease, DetectionModeDetectThoughts, DetectionModeDevilsSight, DetectionModeDivineSense, DetectionModeEtherealSight, DetectionModeEyesOfTheGrave, DetectionModeHearing, DetectionModeLifeSense, DetectionModeLightPerception, DetectionModeSeeInvisibility, DetectionModeTremorsense, DetectionModeTruesight]) {
        const t = new e;
        CONFIG.Canvas.detectionModes[t.id] = t
    }
    if (e)
        for (const e of [DetectionModeBlindsense, DetectionModeWitchSight]) {
            const t = new e;
            CONFIG.Canvas.detectionModes[t.id] = t
        }
    if (e)
        CONFIG.Canvas.detectionModes.divineSense.updateSource({
            walls: true
        });
    delete CONFIG.Canvas.detectionModes.senseAll;
    delete CONFIG.Canvas.detectionModes.senseInvisibility;
    for (const e of [VisionModeBlindsight, VisionModeDarkvision, VisionModeDevilsSight, VisionModeEtherealness, VisionModeTruesight]) {
        const t = new e;
        CONFIG.Canvas.visionModes[t.id] = t
    }
    CONFIG.Canvas.visionModes.basic?.updateSource({
        tokenConfig: false
    });
    delete CONFIG.Canvas.visionModes.lightAmplification;
    delete CONFIG.Canvas.visionModes.monochromatic;
    delete CONFIG.Canvas.visionModes.tremorsense;
    if (e)
        CONFIG.Canvas.visionModes.devilsSight.updateSource({
            canvas: {
                shader: ColorAdjustmentsSamplerShader,
                uniforms: {
                    contrast: -0.15,
                    saturation: 0,
                    exposure: 0
                }
            },
            lighting: {
                background: {
                    visibility: VisionMode.LIGHTING_VISIBILITY.REQUIRED
                }
            },
            vision: {
                darkness: {
                    adaptive: false
                },
                defaults: {
                    contrast: -0.15,
                    saturation: 0,
                    brightness: 0.5
                }
            }
        })
}
));
Hooks.once("ready", (()=>{
    for (const e of Object.values(CONFIG.Token.sheetClasses.base))
        e.cls = F(e.cls);
    CONFIG.Token.prototypeSheetClass = F(CONFIG.Token.prototypeSheetClass)
}
))

