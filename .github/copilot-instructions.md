# GURPS Foundry VTT Macro Development

This codebase contains macros for GURPS 4e Game Aid in Foundry VTT, automating combat, spells, and game mechanics using the GGA API and JB2A animations.

**Compatible with**: Foundry VTT v12.x, GURPS GGA v0.17.18

## Architecture Overview

### Macro Composition Pattern
Most macros follow a **lightweight wrapper → shared engine** pattern:
- **Individual attack macros** (e.g., [HalberdHookSwungMighty.js](../HalberdHookSwungMighty.js), [FeyFireBackstab.js](../FeyFireBackstab.js)) are thin wrappers that configure parameters
- **Generic engines** ([GenericMeleeAttack.js](../GenericMeleeAttack.js)) contain shared logic for attack resolution, animations, critical hits, knockback
- **Post-processing macros** ([AfterAttackKnockback.js](../AfterAttackKnockback.js)) handle complex calculations triggered after attacks

**Why**: Reduces duplication across 200+ attack variations while preserving custom attack-specific configurations.

### Key API: GURPS Game Aid (GGA)
All macros use the global `GURPS` object:
```javascript
GURPS.executeOTF(formula)          // Execute On-The-Fly formulas
GURPS.findAttack(actor, name, rollDamage, getDetails)  // Retrieve attack by wildcard
GURPS.findSkillSpell(actor, name, rollSkill, getDetails)
GURPS.LastActor                     // Last actor that performed action
GURPS.ModifierBucket.currentSum()   // Get total modifiers
GURPS.ModifierBucket.clear(true)    // Clear modifier stack
```

### OtF (On-The-Fly) Formula System
OtF strings combine dice, conditionals, animations, and resource changes in a single executable formula:

**Pattern**: `[/if [M:AttackName] cs:{anim \\FP -1 \\dmg} s:{anim \\dmg} f:{miss_anim} cf:{crit_fail}]`

- `[M:AttackName]` = Melee attack roll, `[R:AttackName]` = Ranged attack, `[D:AttackName]` = Damage
- Conditionals: `cs:{}` (critical success), `s:{}` (success), `f:{}` (failure), `cf:{}` (critical failure)
- Resources: `/FP -2`, `/HP -5`, `/tr(TrackerName) -3`
- **Escaping**: Each nesting level doubles backslashes (`\\` → `\\\\` → `\\\\\\\\`)

### Animation Integration (JB2A)
Animations use `!/anim` commands within OtF:
```javascript
let sanim = '!/anim MeleeAttack*HandAxe *0.6 -0.3 +3 \\\\!/wait 1500 \\\\!/anim Impact_01*Yellow c *0.7';
```
- Paths from `modules/jb2a_patreon/Library/`
- `c` = target center, `@self` = caster, `@target` = selected token
- Wildcards (`*`) for flexible matching
- Chain with `\\\\!/wait <ms>` for timing

## Development Workflows

### Creating a New Attack Macro
1. **Copy similar macro** (e.g., `FeyFireStab.js` for melee, `DeathbowFeyFire.js` for ranged)
2. **Update wrapper parameters**:
   ```javascript
   let AttackTitle = 'Holy Hammer Smash';
   let AttackName = 'Thrice*Hammer*Smash';  // Uses wildcards
   let kbm = 2;  // Knockback multiplier for crushing attacks
   let animSet = 'HalberdHammerSwung';
   let attackSkill = 'Two-Handed Axe/Mace';
   ```
3. **Call generic engine**:
   ```javascript
   OtF = `/:GenericMeleeAttack title="${AttackTitle}" attack=${AttackName} kbm=${kbm} anim=${animSet} ...`;
   GURPS.executeOTF(OtF);
   ```
4. **Test with**: `console.log(OtF)` to verify formula construction

### Creating a New Combat Spell Macro
Combat spells like [Fireball.js](../Fireball.js) or [FireballExplosive.js](../FireballExplosive.js) use the **SpellDamageMacro.js** shared component:

1. **Copy similar spell** (e.g., `Fireball.js` for direct damage, `FireballExplosive.js` for area effect)
2. **Configure spell parameters**:
   ```javascript
   let SpellName = 'Explosive*Fireball';
   let RangedAttackName = 'Explosive*Fireball';  // Often same as SpellName
   
   // Animation sequences for different outcomes
   let sanim = '!/anim FireBolt*Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim FireballExplosion*Orange c *0.3';
   let csanim = '!/anim FireBolt*Orange*15ft -0.2 +0.6 \\\\!/wait 500 \\\\!/anim FireballExplosion*Orange c *0.5';
   ```
3. **Call SpellDamage engine** with outcome formulas:
   ```javascript
   // Regular success: dice=0.5 means 1d per 2 energy, adds=0, adjust by skill cost mod
   let sformula = '/:SpellDamage title=ExplosiveFireball dice=0.5 adds=0 type=burn adjust='+CostMod+' crit=false';
   
   // Critical success: bonus dice/adds, adjust=-16 for massive reduction, triggers crit calc
   let csformula = '/:SpellDamage title=ExplosiveFireball dice=0.5 adds=3 type=burn adjust=-16 crit=true';
   ```
4. **Two-stage spell check**: Primary spell roll, then secondary ranged attack roll (nested `/if`)
   ```javascript
   let OtF = '[/if [Sp:'+SpellName+'] cs:{/if [R:'+RangedAttackName+'] {'+csanim+' \\\\'+csformula+'}} s:{/if [R:'+RangedAttackName+'] s:{'+sanim+' \\\\'+sformula+'} f:{'+fanim+'}}]';
   ```

**Key SpellDamage Parameters**:
- `dice` — Damage dice per energy point (can be fractional: `0.5` = 1d per 2 energy)
- `adds` — Flat modifier per die (e.g., `+2` for `1d+2`)
- `type` — Damage type (`burn`, `cr`, `tox`, etc.)
- `adjust` — Energy cost adjustment from skill level (use calculated `CostMod`)
- `crit=true` — Triggers critical hit calculation for explosive effects

### Debugging Macros
- Use `console.log()` extensively—see examples in [GenericMeleeAttack.js](../GenericMeleeAttack.js#L14)
- Check `GURPS.LastActor` and `GURPS.ModifierBucket.modifierStack` for state
- Test animations individually in chat: `!/anim Arrow*Regular_Green c *0.3`
- For attack lookup failures, verify wildcard patterns match actor's attack names

### File Naming Conventions
- **CamelCase**: `DeathbowFeyFire.js`, `FrenzySwungMighty.js`
- **Versioning**: `_old`, `_oldest` suffixes (e.g., `CastContinualLight_old.js`)
- **Variants**: `_modular`, `_shareable`, `_simple` (e.g., `DeceptiveAttack_modular.js`)
- **200+ variations exist**—use `grep` to find similar attacks before creating new ones

## Common Patterns & Gotchas

### Parsing Damage Formulas
Attacks may include armor divisors that must be extracted:
```javascript
// Handle "2d+4 (2) imp" format
let attackDmgDice = attackDamageOtF.split(' ')[0].split('d')[0];
let armorDivisor = attackDamageOtF.includes('(') 
    ? Number(attackDamageOtF.split('(')[1].split(')')[0]) 
    : 1;
```

### Spell Cost Reduction
All spell macros calculate cost based on skill level thresholds:
```javascript
let SpellSkill = Number(GURPS.findSkillSpell(_token.actor, SpellName, 0, 1).level);
let CostMod = 0;
if (SpellSkill > 29) CostMod = -4;
else if (SpellSkill > 24) CostMod = -3;
else if (SpellSkill > 19) CostMod = -2;
else if (SpellSkill > 14) CostMod = -1;
// For fixed-cost spells like Continual Light
let adjustedCost = Math.max(0, baseCost + CostMod);
// For variable-damage spells, pass CostMod to SpellDamage
let sformula = `/:SpellDamage ... adjust=${CostMod} ...`;
```

### Macro Parameter Passing
Use `scope` object for parameterized macros:
```javascript
if (scope !== undefined) {
    AttackName = scope.attack ? scope.attack : 'Punch';
    kbm = scope.kbm ? parseInt(scope.kbm) : 1;
}
```
**Called as**: `/:MacroName attack=Value kbm=2 dmg=3d+5`

### Critical Pitfalls
- **Always `await`**: `GURPS.LastActor`, `GURPS.findAttack()`, `GURPS.executeOTF()` are async
- **Clear ModifierBucket**: After reading with `.currentSum()`, call `.clear(update=true)`
- **Attack not found**: Check if `GURPS.findAttack()` returns `undefined` before accessing properties
- **Knockback only for crushing**: Check `attackDmgType == 'cr'` before applying knockback

## Key Reference Files
- [GenericMeleeAttack.js](../GenericMeleeAttack.js) — 475-line shared engine for all melee attacks
- [SpellDamageMacro.js](../SpellDamageMacro.js) — Variable-damage spell engine with energy-based scaling
- [AfterAttackKnockback.js](../AfterAttackKnockback.js) — Complex knockback/push calculations
- [Fireball.js](../Fireball.js) — Direct damage spell with single target
- [FireballExplosive.js](../FireballExplosive.js) — Area-effect spell with fractional dice
- [DeathbowFeyFire.js](../DeathbowFeyFire.js) — Complete ranged attack example
- [CastContinualLight.js](../CastContinualLight.js) — Spell casting with variable cost
- [DeceptiveAttack_modular.js](../DeceptiveAttack_modular.js) — ModifierBucket manipulation

**See also**: [copilot-instructions.md](../copilot-instructions.md) for extended API documentation and active effects patterns.
