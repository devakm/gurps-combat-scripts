[/if [Sp:Fireball] cs:{/if [R:Fireball] [1d+6 burn]} {/if [R:Fireball] [1d+1 burn *Costs 1FP]} ] 

[/if [Sp:Fireball] :crit{/if [R:Fireball] {/r [1d+6 burn]}} {/if [R:Fireball] {/r [1d+1 burn *Costs 1FP]}} ] 


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


 /if [ST] {/if [S:Tra] {/if [IQ-2] {You found the Grail!} {Ah so close}} {Failed tracking}} {Failed ST}

// 3 checks
 /if [ST] {/if [S:Tracking] {"Success tracking"/if [IQ-2] {IQ success} {IQ fail}} {Failed tracking}} {Failed ST}

 // 2 checks
 /if [ST] {/if [S:Tracking] {Success tracking} {Failed tracking}} {Failed ST}


 [/if [Sp:Fireball] cs:{/if [R:Fireball] {"Ranged success"!/anim FireBolt*Regular_Orange*webm *1.2 -0.3 +1.5 \\/:SpellDamage Fireball 1 +2 burn -4 } } cf:{!/anim FireballExplosion*Orange*.webm c *0.1 @self \\hp -1d-3!} 
 s:{/if [R:Fireball] {!/anim FireBolt*Regular_Orange*webm *0.8 -0.3 +1.5 \\/:SpellDamage Fireball 1 0 burn 0}} f:{!/anim FireBolt*Regular_Orange*webm *0.2 -0.3 -3 \\/fp -1} ]


 // Debug Use Physical Dice
 
[/if [M:Vic*Fey*Dagger*Swung] cs:{!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\!/wait 1500 \\!/anim Flames_01_Regular_Green c *0.5 \\/r [D:Vic*Fey*Dagger*Swung] \\/r [1d burn] \\/rolltable CritHit} cf:{!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\!/wait 1500 \\!/anim Flames_01_Regular_Green c *0.3 @self \\/rolltable CritMiss} s:{!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +1 \\!/wait 1500 \\!/anim Flames_01_Regular_Green c *0.3 \\/r [D:Vic*Fey*Dagger*Swung] \\/r [1d burn]} f:{!/anim Dagger*Fire_Regular_Green *0.3 -0.2 +0} ]

!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\!/wait 1500 \\!/anim Flames_01_Regular_Green c *0.5 -0 +0 \\!/wait 1500  \\/r [1d burn] \\/r [D:Vic*Fey*Dagger*Swung] \\/rolltable CritHit

!/anim Dagger*Fire_Regular_Green *0.6 -0.2 +1 \\!/wait 1500 \\!/anim Flames_01_Regular_Green c *0.5 \\!/wait 1500  \\/rolltable CritHit

!/anim Flames_01_Regular_Green c *0.3 \\!/wait 1500 \\/r [1d burn] \\/r [D:Vic*Fey*Dagger*Swung] \\/rolltable CritHit

/r [1d burn] \\/r [D:Vic*Fey*Dagger*Swung] \\/r [D:Vic*Fey*Dagger*Swung]

/r [1d burn] \\/r [1d cut] \\/r [1d cr] 
/r [+2 damage (Mighty Blow) *Cost 1FP] \\/r [D:Vic*Fey*Dagger*Swung]