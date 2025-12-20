/r [/if [Sp:Fireball] crit:{/if [R:Fireball] [1d+6 burn]} {/if [R:Fireball] [1d+6 burn *Costs 1FP]} ] 10

How can I roll against a RollTable using the Modifier Bucket in a “script” macro?
To roll against the “Critical Head Blow” table, create a “script” macro (not a “chat macro”) and enter:

	let r = new Roll("3d6 + @mod", { mod: GURPS.ModifierBucket.currentSum()})
game.tables.getName("Critical Head Blow").draw({roll:r})

And if you want to clear the Modifier Bucket after the roll, just add:

GURPS.ModifierBucket.clear()

Can I add the Modifier Bucket to the RollTable formula (without making a macro)?  (e.g. Reaction tables)
Yes!  You can add "+ @gmod" to add in the global modifier (what is showing in the modifier bucket), or "+ @gmodc" which will add the modifier to the table roll, and then clear it.

 /r [On-the-Fly] 10
 [1d+6 burn *Costs 1FP]
 
 ["Fireball"/:fireball]
 
 
 [/if [Sp:"Major Healing"] cs:{/hp +12 @target \\!/anim HealingAbility*Blue*webm c *0.2} s:{/hp +8 @target \\!/anim HealingAbility*Blue*webm c *0.2 \\/fp -4 }]

[/if [Sp:"Major Healing"] cs:{!/anim HealingAbility*Blue*webm c *0.2 \\/hp +12 @target } s:{!/anim HealingAbility*Blue*webm c *0.2 \\/hp +8 @target \\/fp -4 }]

["Major Healing"/:majorHealing \\!/anim HealingAbility*Blue*webm c]

[/if [Sp:"Major Healing"] cs:{/hp +12 @target \\!/anim HealingAbility*Blue*webm c *0.2} s:{/hp +8 @target \\!/anim HealingAbility*Blue*webm c *0.2 \\/fp -4 }]


[/if [Sp:"Major Healing"] crit:{/hp +8/fp -4 @target \\!/anim HealingAbility*Blue*webm c *0.2} {/hp +8 @target} \\!/anim HealingAbility*Blue*webm c *0.2 \\/fp -4 }]

 *  ["Fireball"/if [Sp:Fireball] crit:{/if [R:Fireball] 
	{!/anim FireBolt*Regular_Orange*webm \\\\/:SpellDamage Fireball 1 0 burn -4} 
	} 
	{/if [R:Fireball] 
		{
			!/anim FireBolt*Regular_Orange*webm \\\\/:SpellDamage Fireball 1 0 burn 0
		} 
		{/fp -1}
	}
	 ]
 
  *  ["Fireball"/if [Sp:Fireball] crit:{/if [R:Fireball] 
	{!/anim FireBolt*Regular_Orange*webm \\/:SpellDamage Fireball 1 0 burn -4} 
	} 
	{/if [R:Fireball] 
		{
			!/anim FireBolt*Regular_Orange*webm \\/:SpellDamage Fireball 1 0 burn 0
		} 
		{/fp -1}
	}
	 ]
 
 *  ["Lightning"/if [Sp:Lightning] {/if [R:Lightning] {[/:SpellDamage Lightning 1 -1 burn 0]} {/r [/fp -1]}}]


 
  ["Burning Smash"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] { [/:SpellDamage BurningTouch 1 0 burn 0] \\/r [D:Quarterstaff*Swung]} {/r [/fp -1]}}]

 
 ["Frostbite Punch"/if [Sp:Frostbite] {/if [M:Nat*Attacks*Punch] {[D:Nat*Attacks*Punch] [/:SpellDamage Frostbite 1 0 burn 0]} {/r [/fp -1]}}]
 ["Frostbite Ranged"/if [Sp:Frostbite] {/if [R:Frostbite] {[/:SpellDamage Frostbite 1 0 burn 0]} {/r [/fp -1]}}]
 
 
 ["Frostbite Punch"/if [Sp:Frostbite] {/if [M:Nat*Attacks*Punch] { [/:SpellDamage Frostbite 1 0 burn 0] \\/r [D:Nat*Attacks*Punch]} {/r [/fp -1]}}]
 ["Frostbite Ranged"/if [Sp:Frostbite] {/if [R:Frostbite] { [/:SpellDamage Frostbite 1 0 burn 0]} {/r [/fp -1]}}]

 ["Burning Punch"/if [Sp:Burning*Touch] {/if [M:Nat*Attacks*Punch] { [/:SpellDamage BurningTouch 1 0 burn 0] \\/r [D:Nat*Attacks*Punch]} {/r [/fp -1]}}]
 ["Shocking Punch"/if [Sp:Shocking*Touch] {/if [M:Nat*Attacks*Punch] { [/:SpellDamage ShockingTouch 1 2 burn 0] \\/r [D:Nat*Attacks*Punch]} {/r [/fp -1]}}]
 
 * ["Lightning"/if [Sp:Lightning] {/if [R:Lightning] { [/:SpellDamage Lightning 1 0 burn 0]} {/r [/fp -1]}}]

 * ["Ice Dagger"/if [Sp:Ice*Dagger] {/if [R:Ice*Dagger] { [/:SpellDamage IceDagger 1 -1 imp 0]} {/r [/fp -1]}}]
 * ["Ice Sphere"/if [Sp:Ice*Sphere] {/if [R:Ice*Sphere] { [/:SpellDamage IceSphere 1 0 cr 0]} {/r [/fp -1]}}]


 * ["Lightning"/if [Sp:Lightning] {/if [R:Lightning] { [/:SpellDamage Lightning 1 0 burn 0]} {/r [/fp -1]}}]


 * ["Lightning"/if [Sp:Lightning] {/if [R:Lightning] { [/:SpellDamage Lightning 1 0 burn 0]} {/r [/fp -1]}}]

!/anim DetectMagicCircle_01_Regular_Blue_1200x1200.webm c @self

!/anim DetectMagicCircle_01_Regular_Blue_1200x1200.webm c @target


!/anim ChainLightning_01_Regular_Blue_30ft_Primary_1600x400.webm c @self



 * ["Lightning"/if [Sp:Lightning] {/if [R:Lightning] { \\/r [!/anim ChainLightning_01_Regular_Blue_30ft_Primary_1600x400.webm] \\/r [/:SpellDamage Lightning 1 0 burn 0]} {/r [/fp -1]}}]

*  ["Lightning"/if [Sp:Lightning] {/if [R:Lightning] {!/anim ChainLightning_01_Regular_Blue_30ft_Primary_1600x400.webm \\/:SpellDamage Lightning 1 0 burn 0} {[/fp -1]}}]

*  ["Fireball"/if [Sp:Fireball] {/if [R:Fireball] {!/anim FireBolt_01_Regular_Orange_30ft_1600x400.webm \\/:SpellDamage Fireball 1 0 burn 0} {[/fp -1]}}]

["Explosive Fireball"/if [Sp:Explosive*Fireball] {/if [R:Explosive*Fireball] {!/anim FireballExplosion_01_Orange_800x800.webm c \\/:SpellDamage ExplosiveFireball 0.5 0 burn 0} {/fp -1}}]


["Vamp Greatsword Slash"/if [A:Vam*Swing] {!/anim GreatSword*Fire*Dark_Purple*webm *0.5 \\/r [D:Vam*Swing] \\/r [1d tox] \\/hp +5}]
["Vamp Greatsword Stab"/if [A:Vam*Thrust] {!/anim GreatSword*Fire*Dark_Purple*webm *0.5 \\/r  [D:Vam*Thrust] \\/r [1d tox] \\/hp +5}]
["Mighty Vamp Greatsword Slash"/if [A:Vam*Swing] {!/anim GreatSword*Fire*Dark_Purple*webm *0.5 \\/r [D:Vam*Swing] \\/r [1d+2 tox] \\/hp +5 \\/fp -1}]
["Mighty Vamp Greatsword Stab"/if [A:Vam*Thrust] {!/anim GreatSword*Fire*Dark_Purple*webm *0.5 \\/r [D:Vam*Thrust] \\/r [1d+2 tox] \\/hp +5 \\/fp -1}]

["DK Greatsword Slash"/if [A:Vam*Swing] {/r [D:Vam*Swing] \\/r [1d tox] \\/r [/hp +10]}]
["DK Greatsword Stab"/if [A:Vam*Thrust] {/r [D:Vam*Thrust] \\/r [1d tox] \\/r [/hp +10]}]
["Mighty DK Greatsword Slash"/if [A:Vam*Swing] {/r [D:Vam*Swing] \\/r [1d+2 tox] \\/r [/hp +10] \\/r [/fp -1]}]
["Mighty DK Greatsword Stab"/if [A:Vam*Thrust] {/r [D:Vam*Thrust] \\/r [1d+2 tox] \\/r [/hp +10] \\/r [/fp -1]}]

["DK Greatsword Slash"/if [A:Vam*Swing] {!/anim GreatSword*Fire*Dark_Purple*webm *0.5 \\/r [D:Vam*Swing] \\/r [1d tox] \\/hp +10}]
["DK Greatsword Stab"/if [A:Vam*Thrust] {!/anim GreatSword*Fire*Dark_Purple*webm *0.5 \\/r  [D:Vam*Thrust] \\/r [1d tox] \\/hp +10}]
["Mighty DK Greatsword Slash"/if [A:Vam*Swing] {!/anim GreatSword*Fire*Dark_Purple*webm *0.5 \\/r [D:Vam*Swing] \\/r [1d+2 tox] \\/hp +10 \\/fp -1}]
["Mighty DK Greatsword Stab"/if [A:Vam*Thrust] {!/anim GreatSword*Fire*Dark_Purple*webm *0.5 \\/r [D:Vam*Thrust] \\/r [1d+2 tox] \\/hp +10 \\/fp -1}]


  ["Lich Staff Smash"/if [Sp:Burning*Touch] {/if [M:Wizard*Swung] {!/anim Quarterstaff03*Regular_Purple*webm *0.5 \\/:SpellDamage BurningTouch 1 0 burn 0 \\/r [D:Wizard*Swung]} {/fp -1}}]

Mace01_04_Regular_White_800x600.webm
 ["Holy Smash"/if [A:Mace*Swung] {!/anim Mace*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Mace*Swung] \\/r [1d burn]}]
["Mighty Holy Smash"/if [A:Mace*Swung] {!/anim Mace01*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Mace*Swung] \\/r [1d+2 burn] \\/fp -1}]

["Hammer Smash"/if [A:Dwar*hammer*Swung] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Dwar*hammer*Swung]}]
["Mighty Hammer Smash"/if [A:Dwar*hammer*Swung] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Dwar*hammer*Swung (Swung)]}]
["Hammer Thrown"/if [R:Dwar*hammer*Thrown] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Dwar*hammer*Thrown]}]
["Mighty Hammer Thrown"/if [R:Dwar*hammer*Thrown] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Dwar*hammer*Thrown]}]



["Use Major Healing Potion on Target"!/if [/qty -1 Major Healing Potion] {/if ! [/hp +2d @target] [/qty +1 Major Healing Potion]}]

["Use Major Healing Potion on Target"!/if [/qty -1 Major Healing Potion \\!/anim HealingAbility*Blue*webm c] {/if ! [/hp +2d @target] [/qty +1 Major Healing Potion]}]
["Use Healing Potion on Target"!/if [/qty -1 Healing Potion \\!/anim HealingAbility*Blue*webm c] {/if ! [/hp +1d @target] [/qty +1 Healing Potion]}]

["Major Healing"/:majorHealing \\!/anim HealingAbility*Blue*webm c]

 ["Holy Smash"/if [A:Mace*Swung] {!/anim Mace*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Mace*Swung] \\/r [1d burn]}]
["Mighty Holy Smash"/if [A:Mace*Swung] {!/anim Mace01*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Mace*Swung] \\/r [1d+2 burn] \\/fp -1}]




*  ["Fireball"/if [Sp:Fireball] cs:{/if [R:Fireball] {!/anim FireBolt*Regular_Orange*webm \\/:SpellDamage Fireball 1 0 burn -4}} s:{/if [R:Fireball] {!/anim FireBolt*Regular_Orange*webm \\/:SpellDamage Fireball 1 0 burn 0} {[/fp -1]}}]

!/anim FireBolt*Regular_Orange*webm *0.8 -0.3 +1.5

!/anim FireBolt*Regular_Orange*webm *1.2 -0.3 +1.5

Balthus
* 
Quarterstaff
*  ["Burning Smash"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {!/anim Quarterstaff01*Regular_Orange*webm *0.3 -0.2 +1 \\/:SpellDamage BurningTouch 1 0 burn 0 \\/r [D:Quarterstaff*Swung]} {/fp -1}}]
Spells
* ["Lightning"/:Lightning]
* ["Fireball"/:Fireball]
* ["Explosive Fireball"/:ExplosiveFireball]
* ["Explosive Lightning"/:ExplosiveLightning]
Healing
* ["Major Healing"/:majorHealing]
Misc
* ["PER !"PER!] 


Balthus
Quarterstaff
*  ["Burning Smash"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {!/anim Quarterstaff01*Regular_Orange*webm *0.3 -0.2 +1 \\/:SpellDamage BurningTouch 1 0 burn 0 \\/r [D:Quarterstaff*Swung]} {/fp -1}}]
Spells
*  ["Explosive Lightning"/if [Sp:Explosive*Lightning] {/if [R:Explosive*Lightning] {[/:SpellDamage ExplosiveLightning 0.5 -0.5 burn 0]} {/r [/fp -1]}}]
*  ["Lightning"/if [Sp:Lightning] {/if [R:Lightning] {[/:SpellDamage Lightning 1 -1 burn 0]} {/r [/fp -1]}}]
*  ["Explosive Fireball"/:ExplosiveFireball]
*  ["Fireball"/:Fireball]
Healing
* ["Major Healing"/:majorHealing]
Misc
* ["PER !"PER!] 
 
Bruja
* ["Acrobatic Dodge!"/if [S:Acrobatics] [Dodge +2] /else [Dodge -2]] 
Melee
* ["Fey Fire Slash"/if [A:Vic*Fey*Dagger*Swung] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Vic*Fey*Dagger*Swung] \\/r [1d burn]}]
* ["Mighty Fey Fire Slash"/if [A:Vic*Fey*Dagger*Swung] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Vic*Fey*Dagger*Swung] \\/r [1d+2 burn] \\/fp -1}]
* ["Fey Fire Stab"/if [A:Vic*Fey*Dagger*Thrust] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Vic*Fey*Dagger*Thrust] \\/r [1d burn]}]
* ["Mighty Fey Fire Stab"/if [A:Vic*Fey*Dagger*Thrust] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Vic*Fey*Dagger*Thrust] \\/r [1d+2 burn] \\/fp -1}]
Ranged
* ["Deathbow"/if [A:Vic*Deathbow*Shoot] {!/anim Arrow*Regular_Green_Cold*webm *0.3 -0.2 +1 \\/r [D:Vic*Deathbow*Shoot] \\/r [1d tox]}]
* ["Fey Fire Thrown"/if [A:Vic*Fey*Dagger*Thrown] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Vic*Fey*Dagger*Thrown] \\/r [1d burn]}]
* ["Mighty Fey Fire Thrown"/if [A:Vic*Fey*Dagger*Thrown] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Vic*Fey*Dagger*Thrown] \\/r [1d+2 burn] \\/fp -1}]
Misc
* ["Sk:Lockpicking"Sk:"Lockpicking"] 
* ["−4 to hit (Move and Attack)"-4 to hit (Move and Attack)] 
Healing
* ["Use Major Healing Potion on Target"!/if [/qty -1 Major Healing Potion \\!/anim HealingAbility*Blue*webm c] {/if ! [/hp +2d @target] [/qty +1 Major Healing Potion]}] 



Arrow02_01_Regular_Green_Cold_30ft_1600x400.webm

Misc
* ["Sk:Lockpicking"Sk:"Lockpicking"] 
* ["−4 to hit (Move and Attack)"-4 to hit (Move and Attack)] 
Healing
* ["Use Major Healing Potion on Target"/if [/qty -1 Major Healing Potion] {/if ! [/hp +2d @target] [/qty +1 Major Healing Potion]}]


Rusalka
* ["Acrobatic Dodge!"/if [S:Acrobatics] [Dodge +2] /else [Dodge -2]]
Melee
* ["Rapier Slash"/if [A:Vic*Nar*Rapier*Swing*] {!/anim Rapier01_06_Regular_White*webm *0.3 -0.4 +2 \\/r [D:Vic*Nar*Rapier*Swing*]}]
* ["Mighty Rapier Slash"/if [A:Vic*Nar*Rapier*Swing*] {!/anim Rapier01_06_Regular_White*webm *0.3 -0.4 +2 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Vic*Nar*Rapier*Swing*]}] 
* ["Bolas Smash"/if [A:Bolas*Swung] {!/anim DmgBludgeoning*Regular_Yellow_1Handed*webm *0.3 -0.2 +1  \\/r [D:Bolas*Swung]}] 
* ["Mighty Bolas Smash"/if [A:Bolas*Swung] {!/anim DmgBludgeoning*Regular_Yellow_1Handed*webm *0.3 -0.2 +1  \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Bolas*Swung]}]  
* ["Rapier Stab"/if [A:Vic*Nar*Rapier*Thrust*] {!/anim Rapier01_03_Regular_White*webm *0.3 -0.4 +2 \\/r [D:Vic*Nar*Rapier*Thrust*]}] 
* ["Mighty Rapier Stab"/if [A:Vic*Nar*Rapier*Thrust*] {!/anim Rapier01_03_Regular_White*webm *0.3 -0.4 +2 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Vic*Nar*Rapier*Thrust*]}] 
Ranged
* ["Bolas Thrown"/if [R:Bolas*Thrown] {!/anim LaunchCannonBall*Regular_Black*webm *0.2 -0.1 +0.4 \\/r [D:Bolas*Thrown]}] 
* ["Mighty Bolas Thrown"/if [R:Bolas*Thrown] {!/anim LaunchCannonBall*Regular_Black*webm *0.2 -0.1 +0.4 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Bolas*Thrown]}]
Healing
 ["Use Major Healing Potion on Target"/if [/qty -1 Major Healing Potion] {/if ! [/hp +2d @target] [/qty +1 Major Healing Potion]}]



Rusalka
["Rapier Slash"/if [A:Vic*Nar*Rapier*Swing*] {!/anim Rapier01_06_Regular_White*webm *0.3 -0.4 +2 \\/r [D:Vic*Nar*Rapier*Swing*]}]
["Mighty Rapier Slash"/if [A:Vic*Nar*Rapier*Swing*] {!/anim Rapier01_06_Regular_White*webm *0.3 -0.4 +2 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Vic*Nar*Rapier*Swing*]}] 
["Rapier Stab"/if [A:Vic*Nar*Rapier*Thrust*] {!/anim Rapier01_03_Regular_White*webm *0.3 -0.4 +2 \\/r [D:Vic*Nar*Rapier*Thrust*]}] 
["Mighty Rapier Stab"/if [A:Vic*Nar*Rapier*Thrust*] {!/anim Rapier01_03_Regular_White*webm *0.3 -0.4 +2 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Vic*Nar*Rapier*Thrust*]}] 


Otto
* ["Hammer Smash"/if [A:Dwar*hammer*Swung] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Dwar*hammer*Swung]}]
* ["Mighty Hammer Smash"/if [A:Dwar*hammer*Swung] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Dwar*hammer*Swung]}]
Ranged
* ["Hammer Thrown"/if [R:Dwar*hammer*Thrown] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Dwar*hammer*Thrown]}]
* ["Mighty Hammer Thrown"/if [R:Dwar*hammer*Earth] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Dwar*hammer*Thrown]}]
* ["Stone Missile"/if [Sp:Stone*Missile] {/if [R:Stone*Missile] {[/:SpellDamage Stone*Missile 1 +1 cr 0]} {/r [/fp -1]}}] 
Healing
* ["Major Healing"/:majorHealing]
Misc
* ["+4 to hit (Telegraphic Attack)"+4 to hit (Telegraphic Attack)] 
* ["(Blind Roll) PER !"!PER!] ["PER !"PER!] 
* ["−4 to hit (Move and Attack)"−4 to hit (Move and Attack)]



 OLD
 ["Burning Smash 2d Costs 1FP"/if [Sp:Burning*Touch] {/if [M:Nat*Attacks*Punch] {[2d+3 burn *Costs 1FP]} {/r [/fp -1]} } {/r [/fp -1]}]
 ["Burning Smash 3d Costs 2FP"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {[3d+3 burn *Costs 2FP]} {/r [/fp -1]} } {/r [/fp -1]}]
 ["Burning Smash 4d Costs 3FP"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {[4d+3 burn *Costs 3FP]} {/r [/fp -1]} } {/r [/fp -1]}]
 ["Burning Smash 5d Costs 4FP"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {[5d+3 burn *Costs 4FP]} {/r [/fp -1]} } {/r [/fp -1]}]