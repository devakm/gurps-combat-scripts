//TestHarness-OtF

let OtF=`/r [+0 Mighty Blow *Cost 1FP] \\/if [M:Thrice*Swung] s:{!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1 \\!/wait 1500 \\!/anim Impact_01_Regular_Yellow c *0.7 \\!/wait 1000 \\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\!/wait 1000 \\!/anim IconShieldCracked_01_Dark_Red c *0.3 \\/r [4d+17 cut]} cs:{!/anim GreatAxe01_01_Regular_White *0.9 -0.2 +1 \\!/wait 1500 \\!/anim Impact_01_Regular_Yellow c *0.9 \\!/wait 1000 \\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\!/wait 1000 \\!/anim IconShieldCracked_01_Dark_Red c *0.3 \\/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut fon= } f:{!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1 \\/fp +0 \\Your attack missed!} cf:{!/anim GreatAxe01_01_Regular_White *0.6 -0.1 +0.9 \\!/wait 1500 \\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self \\/fp -1 \\You crit failed your attack, so you drop your weapon! \\/status on disarmed}`;

await GURPS.executeOTF(OtF);


let AI=`/bin/cat <<EOF
{
  "name": "Thrice*Swung",
  "type": "attack",
  "atk": 17,
  "def": 0,
  "dmg": "4d+17 cut",
  "desc": "A powerful attack that strikes three times in quick succession. The first two strikes are normal, but the third is a critical hit.",
  "tags": ["melee", "physical", "cutting", "critical", "multi-strike"],
  "cost": 1,
  "fp": 0,
  "anim": {
    "atk": "GreatAxe01_01_Regular_White",
    "hit": "Impact_01_Regular_Yellow",
    "miss": "GreatAxe01_01_Regular_White",
    "crit": "LiquidSplashSide01_Regular_Red",
    "critmiss": "GreatAxe01_01_Regular_White",
    "critfail": "IconShieldCracked_01_Dark_Red"
  },
  "effects": [
    {
      "type": "multi-strike",
      "count": 3,
      "atk": 17,
      "dmg": "4d+17 cut",
      "crit": true
    }
  ]
}`;
