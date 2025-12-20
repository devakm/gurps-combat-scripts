/if [S:Acrobatics -4 | DX -10 | S:Jumping -4] 
cs:{!/anim Bless*Regular_Blue c *0.4 @self \\You easily evade the AxeTrap! You feel great! Gain FP+2  \\/fp +2} 
s:{!/anim Bless*Regular_Blue c *0.2 @self \\You evade the AxeTrap! No bad stuff happens.} 
f:{!/anim IconDrop*Regular_Red c *0.2 @self \\You fail to evade the AxeTrap! Bad stuff happens. \\/r [5d+2 (5) cut] \\You can make a last-ditch attempt to ["Dodge and Drop-4"Dodge-4] (WARNING: the Dodge and Drop Maneuver leaves you prone!) or ["Acrobatic Dodge-4!"/if [S:Acrobatics-4] [Dodge-2] /else [Dodge-6]]. If you succeed at either, take half damage from an area attack or no damage from a regular attack.} 
cf:{!/anim IconDrop*Regular_Red c *0.5 @self \\Your attempt to evade the AxeTrap fails disasterously. You suffer great harm. \\/r [5d+2 (5) cut] \\/rolltable CritHit}


/:DetectTraps Caltrops thr -2 imp 3 DX -6 Acrobatics !PER! -2 BuxlanTorCaltrops01


/:DetectTraps title="Caltrops" dice=thr adds=-2 type=imp armordiv=2 attrib=DX difmod=-6 skill=Acrobatics detectwith=!PER! detectdif=-2 tag=BuxlanTorCaltrops02

tah-title-button

CastWater02_01_Regular_Blue

ImpactWater02_01_Regular_Blue

LiquidSplashSide01_Regular_Blue


!/anim CastWater02_01_Regular_Blue c *0.5 @self \\\\!/wait 1500 \\\\!/anim LiquidSplashSide01_Regular_Blue *0.5 -0.2 +3 \\\\!/wait 500 \\\\!/anim ImpactWater02_01_Regular_Blue c *0.5

"X:\FoundryVirtualTabletop\foundrydata\Data\systems\gurps\icons\statuses\dd-condition-standing.webp"


GURPS.StatusEffect.getAllPostures()


modules/jb2a_patreon/Library/5th_Level/Cone_Of_Cold/ConeOfCold_01_Regular_Blue_600x600.webm
modules/jb2a_patreon/Library/Generic/Liquid/WaterSplashConeLoop_01_01_Regular_Black_600x600.webm
