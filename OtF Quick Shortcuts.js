Balthus
Maneuvers / Concentration
* [-4 to hit Move and Attack *Max:9]  
* [-0 to hit Move and Attack (target ground) *Max:13] 
* [-2 to hit Move and Attack (Ranged)]   
* [+0 Heroic Charge *Cost 1FP]  
* [+0 Giant Step *Cost 1FP]  
* [+0 Great Lunge *Cost 1FP]
* ["Break Concentration/Will-3"Will-3]
Wizard Staff
* ["Burning Smash"/:BurningSmash]  * ["Death Smash"/:DeathSmash]  * ["Shocking Smash"/:ShockingSmash]
Spells
* ["Lightning"/:Lightning] * ["Fireball"/:Fireball]
* ["Explosive Fireball"/:ExplosiveFireball] * ["Explosive Lightning"/:ExplosiveLightning]
* ["Wall of Lightning"/:WallOfLightning] * ["Wall of Fire"/:WallOfFire]
Healing / Paut
* ["Major Healing"/:MajorHealing]
* ["Use Paut"/:DrinkPaut]
* ["Use Major Healing Potion"/:DrinkHealingPotionMajor]
Misc
* ["Perception Check (Blind Roll)"!PER!] 
* ["Will Check (Blind Roll)"!WILL!] 
* ["Thaumatology (Blind)"!Sk:"Thaumatology"!] 


Balthus
* 
Wizard Staff
* ["Burning Smash"/:BurningSmash]
Spells
* ["Lightning"/:Lightning]
* ["Fireball"/:Fireball]
* ["Explosive Fireball"/:ExplosiveFireball]
* ["Explosive Lightning"/:ExplosiveLightning]
Healing
* ["Major Healing"/:majorHealing \\!/anim HealingAbility*Blue*webm c]
Misc
* ["Perception Check (Blind Roll)"!PER!] 
* ["Use Major Healing Potion"!/if [/qty -1 Major Healing Potion] {!/anim HealingAbility*Blue c \\!/if ! [/hp +2d] [/qty +1 Major Healing Potion]}]  

 
Bruja
* ["Acrobatic Dodge!"/if [S:Acrobatics] [Dodge +2] /else [Dodge -2]] 
* ["Check for Traps"Sk:"Traps"]
* ["Search"Sk:"Search"]
* ["Perception Check (Blind Roll)"!PER!] 
Melee
* ["Fey Fire Slash"/:FeyFireSlash]
* ["Fey Fire Stab"/:FeyFireStab]
* ["Mighty Fey Fire Slash"/:FeyFireSlashMighty]
* ["Mighty Fey Fire Stab"/:FeyFireStabMighty]
Ranged
* ["Deathbow"/if [A:Vic*Deathbow*Shoot] {!/anim Arrow*Regular_Green_Cold*webm *0.3 -0.2 +1 \\/r [D:Vic*Deathbow*Shoot] \\/r [1d tox]}]
* ["Fey Fire Thrown"/if [A:Vic*Fey*Dagger*Thrown] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Vic*Fey*Dagger*Thrown] \\/r [1d burn]}]
* ["Mighty Fey Fire Thrown"/if [A:Vic*Fey*Dagger*Thrown] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Vic*Fey*Dagger*Thrown] \\/r [1d+2 burn] \\/fp -1}]
Misc
* ["Sk:Lockpicking"Sk:"Lockpicking"] 
* ["−4 to hit (Move and Attack)"-4 to hit (Move and Attack)] 
Healing
* ["Use Major Healing Potion"!/if [/qty -1 Major Healing Potion] {!/anim HealingAbility*Blue c \\!/if ! [/hp +2d] [/qty +1 Major Healing Potion]}]  


Fergus

Melee
* ["Holy Smash"/if [A:Mace*Mercy*Swung] {/r [D:Mace*Mercy*Swung] \\/r [1d burn]}] 
* ["Mighty Holy Smash"/if [A:Mace*Mercy*Swung] {/r [D:Mace*Mercy*Swung] \\/r [1d+2 burn] \\/r [/fp -1]}]
Ranged
* ["Sunbolt"/:Sunbolt]  
Healing
 * ["Major Healing"/:majorHealing] 
 * ["Use Major Healing Potion"!/if [/qty -1 Major Healing Potion] {!/anim HealingAbility*Blue c \\!/if ! [/hp +2d] [/qty +1 Major Healing Potion]}]  
Misc
* ["Perception Check (Blind Roll)"!PER!] 



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
Misc
* ["Use Major Healing Potion"!/if [/qty -1 Major Healing Potion] {!/anim HealingAbility*Blue c \\!/if ! [/hp +2d] [/qty +1 Major Healing Potion]}]  
* ["Perception Check (Blind Roll)"!PER!] 

!/anim LaunchCannonBall*Regular_Black*webm *0.3 -0.4 +2


Rusalka
["Rapier Slash"/if [A:Vic*Nar*Rapier*Swing*] {!/anim Rapier01_06_Regular_White*webm *0.3 -0.4 +2 \\/r [D:Vic*Nar*Rapier*Swing*]}]
["Mighty Rapier Slash"/if [A:Vic*Nar*Rapier*Swing*] {!/anim Rapier01_06_Regular_White*webm *0.3 -0.4 +2 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Vic*Nar*Rapier*Swing*]}] 
["Rapier Stab"/if [A:Vic*Nar*Rapier*Thrust*] {!/anim Rapier01_03_Regular_White*webm *0.3 -0.4 +2 \\/r [D:Vic*Nar*Rapier*Thrust*]}] 
["Mighty Rapier Stab"/if [A:Vic*Nar*Rapier*Thrust*] {!/anim Rapier01_03_Regular_White*webm *0.3 -0.4 +2 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Vic*Nar*Rapier*Thrust*]}] 


Otto

Maneuvers / Concentration
* [-4 to hit Move and Attack *Max:9] * [-0 to hit Move and Attack (target ground) *Max:13] * [-2 to hit Move and Attack (Ranged)] * [+0 Heroic Charge *Cost 1FP] * [+0 Giant Step *Cost 1FP] * [+0 Great Lunge *Cost 1FP] * * [+4 to hit (Telegraphic Attack)] 
* ["Break Concentration/Will-3"Will-3] * * ["Will Check (Blind Roll)"!WILL!]   
Melee
* Thrice Halberd: * ["Thrice Axe Slash"/:ThriceAxeSlash] * ["Mighty Thrice Axe Slash"/:MightyThriceAxeSlash] * ["Thrice Hook Swung"/:ThriceHookSwung] * ["Mighty Thrice Hook Swung"/:MightyThriceHookSwung] * ["Thrice Spear Thrust"/:ThriceSpearThrust] * ["Mighty Thrice Spear Thrust"/:MightyThriceSpearThrust] * ["Thrice Hammer Smash"/:ThriceHammerSmash] * ["Mighty Thrice Hammer Smash"/:MightyThriceHammerSmash]
* Warhammer of Crushing Earth: * ["Hammer Smash"/:GracefulHammerSmash] * ["Mighty Hammer Smash"/:MightyGracefulHammerSmash]
Ranged
* ["Stone Missile"/:StoneMissile] * ["Sunbolt"/:Sunbolt] * ["Hammer Thrown"/if [R:Grace*Dwar*hammer*Thrown] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Dwar*hammer*Thrown]}] 
Healing
* ["Major Healing"/:MajorHealing] * ["Use Paut"/:DrinkPaut] * ["Use Major Healing Potion"/:DrinkHealingPotion type=Major]
Misc
* ["Perception Check (Blind Roll)"!PER!] 
 


Heirophant 
*  ["Burning Smash"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {!/anim Quarterstaff01*Regular_Orange*webm *0.3 -0.2 +1 \\/:SpellDamage BurningTouch 1 0 burn 0 \\/r [D:Quarterstaff*Swung]} {/fp -1}}]


 OLD
 ["Burning Smash 2d Costs 1FP"/if [Sp:Burning*Touch] {/if [M:Nat*Attacks*Punch] {[2d+3 burn *Costs 1FP]} {/r [/fp -1]} } {/r [/fp -1]}]
 ["Burning Smash 3d Costs 2FP"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {[3d+3 burn *Costs 2FP]} {/r [/fp -1]} } {/r [/fp -1]}]
 ["Burning Smash 4d Costs 3FP"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {[4d+3 burn *Costs 3FP]} {/r [/fp -1]} } {/r [/fp -1]}]
 ["Burning Smash 5d Costs 4FP"/if [Sp:Burning*Touch] {/if [M:Quarterstaff] {[5d+3 burn *Costs 4FP]} {/r [/fp -1]} } {/r [/fp -1]}]