# GURPS Foundry VTT Macro Development Guide

## Project Overview
This is a collection of macros for the GURPS 4e Game Aid in Foundry VTT. Macros automate combat actions, spells, animations, and game mechanics using the GURPS Game Aid (GGA) API and JB2A animations.

**Key Reference**: [GGA\gurps\README.md](../gurps-0.17.18/README.md) - Official GURPS 4e Game Aid documentation  
**Compatible with**: Foundry VTT v12.x, GURPS GGA v0.17.18

## Core Architecture

### GURPS Game Aid (GGA) API
All macros use the `GURPS` global object provided by the GGA system:

- **`GURPS.executeOTF(formula)`** - Execute "On-the-Fly" formulas (chat commands with conditional logic)
- **`GURPS.findAttack(actor, attackName, rollDamage, getDetails)`** - Retrieve attack data by wildcard pattern
- **`GURPS.findSkillSpell(actor, spellName, rollSkill, getDetails)`** - Retrieve spell/skill data  
- **`GURPS.LastActor`** - Reference to the last actor that performed an action
- **`GURPS.ModifierBucket`** - Global modifier stack with `.currentSum()`, `.clear()`, `.addModifier(value, description)`

### OtF (On-The-Fly) Formula Syntax
OtF formulas are strings that combine dice rolls, conditionals, animations, and commands:

**Core OtF Types**:
- `[R:AttackName]` - Ranged attack roll
- `[M:AttackName]` - Melee attack roll  
- `[D:AttackName]` - Damage roll
- `[Sp:SpellName]` - Spell casting roll
- `[S:SkillName]` - Skill check

**Conditional Structure**: `[/if <check> cs:{...} s:{...} f:{...} cf:{...}]`
- `cs:` - Critical success outcome
- `s:` - Success outcome
- `f:` - Failure outcome
- `cf:` - Critical failure outcome

**Resource Management**:
- `/FP -2` - Subtract fatigue points
- `/HP -5` - Subtract hit points
- `/tr(ResourceName) -3` - Modify custom resource tracker

**Escaping**: Use `\\\\` to escape backslashes in nested OtF formulas (each level doubles)

### JB2A Animation Integration
Animations use the `!/anim` command within OtF formulas:

```javascript
// Pattern: !/anim <AnimationPath> [c] [*scale] [xOffset] [yOffset]
let sanim = '!/anim MeleeAttack*HandAxe *0.6 -0.3 +3 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7';
```

- Animations are from `modules/jb2a_patreon/Library/` paths
- `c` targets current token center
- `@self` explicitly targets caster
- `@target` targets selected token
- Chained with `\\\\!/wait <ms>` for sequencing
- Use wildcards (`*`) for flexible path matching

## Common Macro Patterns

### Attack Macro Template
See [HalberdHookSwungMighty.js](HalberdHookSwungMighty.js) or [HalberdHammerSmash.js](HalberdHammerSmash.js):
```javascript
// 1. Define attack configuration
let AttackName = 'Holy*Frenzy*Swung';
let originalActor = await GURPS.LastActor;
let attackData = await GURPS.findAttack(_token.actor, AttackName, 1, 0);

// 2. Parse damage formula (handle armor divisor)
let attackDmgDice = Number(attackDamageOtF.split(' ')[0].split('d')[0]);
let armorDivisor = attackDamageOtF.includes('(') ? attackDamageOtF.split('(')[1].split(')')[0] : 1;

// 3. Build OtF with animations
let attackFormulaOtF = `[/if [M:${AttackName}] cs:{${csanim} \\\\${csformula}} s:{${sanim} \\\\${sformula}} f:{${fanim}} cf:{${cfanim} \\\\${cfformula}}]`;
GURPS.executeOTF(attackFormulaOtF);
```

### Spell Casting Pattern
See [CastContinualLight.js](CastContinualLight.js):

```javascript
let SpellName = 'Continual*Light';
let SpellSkill = Number(GURPS.findSkillSpell(_token.actor, SpellName, 0, 1).level);

// Calculate cost reduction based on skill
let CostMod = SpellSkill > 24 ? -3 : SpellSkill > 19 ? -2 : -1;
let adjustedCost = Math.max(0, baseCost + CostMod);

let costSource = `/FP -${adjustedCost}`;
let sformula = `${CastAnim} \\\\${costSource} \\\\${EffectMacro}`;
```

### Active Effects Pattern
See [active-effects.js](active-effects.js), [DeceptiveAttack_modular.js](DeceptiveAttack_modular.js):

```javascript
let effect = {
  icon: 'path/to/icon.webp',
  label: 'EffectName',
  changes: [
    {
      key: 'system.attributes.ST.import',
      value: '+4',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    },
    {
      key: 'system.conditions.self.modifiers',
      value: '+4 ST',
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    }
  ],
  duration: {seconds: 600}
};

token.actor.createEmbeddedDocuments('ActiveEffect', [effect]);
```

**Common Effect Keys**:
- `system.conditions.self.modifiers` - Self modifiers
- `system.conditions.target.modifiers` - Target modifiers  
- `system.conditions.usermods` - User-defined modifiers (use `#defense` or `#hit` tags)
- `system.attributes.ST.import` - Attribute modifications

### Macro Parameter Passing
Use `scope` object for parameterized macros:

```javascript
/* Usage: /:MacroName attack=Value kbm=2 dmg=3d+5 */
if (scope !== undefined) {
    AttackName = scope.attack ? scope.attack : 'DefaultAttack';
    kbm = scope.kbm ? parseInt(scope.kbm) : 1;
    attackDamageOtF = scope.dmg ? scope.dmg : '1d';
}
```

## Naming Conventions

- **Wildcard Matching**: Use `*` in attack/spell names (e.g., `Vic*Deathbow*Shoot`)
- **File Naming**: CamelCase with descriptive names (e.g., `FrenzySwungMighty.js`, `CastContinualLight.js`)
- **Versioning**: Use `_old`, `_oldest`, `_update2` suffixes for iterations
- **Modular/Shareable**: Suffix for reusable variants

## Development Workflow

1. **Copy Template**: Duplicate similar macro (e.g., attack → new attack)
2. **Configure Header**: Update usage comment with OtF call syntax
3. **Set Variables**: Define attack/spell names, animations, formulas
4. **Test Incrementally**: Use `console.log()` extensively for debugging
5. **Animation Tuning**: Adjust scale/offset parameters iteratively

## Common Pitfalls

- **Escaping**: Nested OtF requires `\\\\` (doubles each nesting level)
- **Armor Divisor**: Must parse `(2)` from damage strings like `2d+4 (2) imp`
- **ModifierBucket**: Clear after use with `GURPS.ModifierBucket.clear(update=true)`
- **Async/Await**: Use `await` with `GURPS.LastActor`, `GURPS.findAttack()`, `GURPS.executeOTF()`
- **Attack Not Found**: Always check if `attackData == undefined` and notify errors

## Key Files for Reference

- [DeathbowFeyFire.js](../DeathbowFeyFire.js) - Complete ranged attack with animations
- [FrenzySwungMighty.js](../FrenzySwungMighty.js) - Melee attack with Mighty Blow calculation
- [CastContinualLight.js](../CastContinualLight.js) - Spell casting with cost reduction
- [DeceptiveAttack.js](../DeceptiveAttack.js) - Modifier bucket manipulation
- [AfterAttackKnockback.js](../AfterAttackKnockback.js) - Complex post-attack calculation
- [active-effects.js](../active-effects.js) - Active Effect creation patterns
