let skillname = "Skill*name and can use * as a wildcard"
let skill = GURPS.findSkillSpell(actor, skillname) 
console.log(skill.level)

Note this will search through all skills and spells (even if they are in containers).   If you do not want to search spells as well, you can use:
GURPS.findSkillSpell(actor, skillname, true) 
or spells only:
GURPS.findSkillSpell(actor, skillname, false, true) 

We also offer:
let attack = findAttack(actor, attackname)
if you only want to check melee:
let attack = findAttack(actor, attackname, true, false)
if you only want to check ranged:
let attack = findAttack(actor, attackname, false, true)
And YES, I know the parameter works differently than findSkillSpell... sorry, that's what happens when a system evolves over time. (edited)

And
let ad = GURPS.findAdDisad(actor, traitname)


So if you have a token selected you can just do canvas.tokens.controlled[0].actor to get the actor, then you can set flags for the actor instead of just the token. Then, when you drag the token back on, you can query the actor flags instead of the token flags.

[PDF:DFE:44]