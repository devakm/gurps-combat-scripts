//TestHarness-OtF


// clickable OtF test harness

let chatDescription = `["Thrice Axe Mighty Blow"/r [+0 Mighty Blow *Cost 1FP] \\\\/if [M:Thrice*Swung] s:{/r [4d+17 cut] \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3} cs:{/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut \\\\!/anim GreatAxe01_01_Regular_White *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3} f:{/ic Your attack missed! \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1} cf:{/ic You crit failed your attack, so you drop your weapon! \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self \\\\/status on disarmed \\\\/fp -1}]`;
console.log(chatDescription);
await ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });		

// tests


let chatDescription = `/r [+0 Mighty Blow *Cost 1FP] \\\\/if [M:Thrice*Swung] s:{/r [4d+17 cut] \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3} cs:{/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut \\\\!/anim GreatAxe01_01_Regular_White *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3} f:{/ic Your attack missed! \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1} cf:{/ic You crit failed your attack, so you drop your weapon! \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self \\\\/status on disarmed \\\\/fp -1}`;
console.log(chatDescription);
await ChatMessage.create({
    content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });		

/if [M:Thrice*Swung] cs:{/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut} s:{/r [4d+17 cut]} cf:{/ic You crit failed your attack, so you drop your weapon! \\\\/status on disarmed \\\\/fp -1} f:{/ic Your attack missed!}

let OtF3 = `/if [M:Thrice*Swung] cs:{/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut} s:{/r [4d+17 cut]} cf:{/ic You crit failed your attack, so you drop your weapon! \\\\/status on disarmed \\\\/fp -1} f:{/ic Your attack missed!} `;
await GURPS.executeOTF(OtF3);

["Fireball"/r [/if [Sp:Fireball] cs:{/if [R:Fireball] {!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\!/wait 500 \\!/anim FireballExplosion*Orange c *0.2 \\/m SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true }} cf:{!/anim FireballExplosion*Orange c *0.1 @self \\/rolltable CritMiss} s:{/if [R:Fireball] cs:{!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\!/wait 500 \\!/anim FireballExplosion*Orange c *0.2 \\/m SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true } s:{!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\/m SpellDamage title=Fireball dice=1 adds=0 type=burn adjust=-2 crit=false} cf:{!/anim FireballExplosion*Orange c *0.1 @self \\/rolltable CritMiss} f:{!/anim FireBolt*Regular_Orange*15ft -0.2 -3 \\/fp -1}} f:{!/anim FireBolt*Regular_Orange*15ft -0.2 -3 \\/fp -1} ]]

["Fireball"/r [/if [Sp:Fireball] cs:{/if [R:Fireball] {!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\!/wait 500 \\!/anim FireballExplosion*Orange c *0.2 \\/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true }} cf:{!/anim FireballExplosion*Orange c *0.1 @self \\/rolltable CritMiss} s:{/if [R:Fireball] cs:{!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\!/wait 500 \\!/anim FireballExplosion*Orange c *0.2 \\/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true } s:{!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\/:SpellDamage title=Fireball dice=1 adds=0 type=burn adjust=-2 crit=false} cf:{!/anim FireballExplosion*Orange c *0.1 @self \\/rolltable CritMiss} f:{!/anim FireBolt*Regular_Orange*15ft -0.2 -3 \\/fp -1}} f:{!/anim FireBolt*Regular_Orange*15ft -0.2 -3 \\/fp -1} ]]

["Fireball"/r [/if [Sp:Fireball] cs:{/if [R:Fireball] {/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true }} cf:{You Crit Miss!} s:{/if [R:Fireball] cs:{/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true } s:{/:SpellDamage title=Fireball dice=1 adds=0 type=burn adjust=-2 crit=false} cf:{You Crit Miss!} f:{/fp -1}} f:{/fp -1} ]]

["Fireball"/r [/if [Sp:Fireball] 
    cs:{/if [R:Fireball] {/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true }} 
    s:{/if [R:Fireball] 
        cs:{/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true } 
        s:{/:SpellDamage title=Fireball dice=1 adds=0 type=burn adjust=-2 crit=false} 
        cf:{Ranged attack Crit Miss} 
        f:{Ranged attack failed}} 
    cf:{Spell Crit Miss!} 
    f:{Spell failed} 
]]


let OtF = `["Thrice Axe Slash"/if [M:Thrice*Swung] s:{/r [4d+13 cut] \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 \\\\/r } cs:{/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+13 cut  \\\\!/anim GreatAxe01_01_Regular_White *0.9 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.9 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3} f:{Your attack missed! \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.2 +1} cf:{You crit failed your attack, so you drop your weapon! \\\\!/anim GreatAxe01_01_Regular_White *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconShieldCracked_01_Dark_Red c *0.3 @self \\\\/status on disarmed \\\\/fp -1}]`;
await GURPS.executeOTF(OtF);


let OtF = `["Fireball"/r [/if [Sp:Fireball] cs:{/if [R:Fireball] {Crit Success, do some damage}} 
    s:{/if [R:Fireball] cs:{Crit Success, do some damage} s:{Regular Success, do some damage} cf:{Ranged attack Crit Miss} f:{Ranged attack failed}} cf:{Spell Crit Miss!} f:{Spell failed} ]]`
await GURPS.executeOTF(OtF);


let OtF = `[/if [Sk:Fast*Draw*Arrow] s:{/r [+1 Fast-Draw (Arrow) Ready success] \\\\/r [3d cut]} cs:{/r [+3 Fast-Draw (Arrow) Ready crit] \\\\/r [4d cut]} f:{/r [-1 Fast-Draw (Arrow) failed] \\\\/r [2d cut]} cf:{/r [-3 Fast-Draw (Arrow) crit failed] \\\\/r [1d cut]}]`;
await GURPS.executeOTF(OtF);


let OtF = '[/if [Sk:Fast*Draw*Arrow] s:{/r [+1 Fast-Draw (Arrow) Ready success]} cs:{/r [+3 Fast-Draw (Arrow) Ready crit]} f:{/r [-1 Fast-Draw (Arrow) failed]} cf:{/r [-3 Fast-Draw (Arrow) crit failed]}]';
await GURPS.executeOTF(OtF);


let OtF = `[/if [Sk:Fast*Draw*Arrow] s:{You Fast-Draw your arrow in no time! You can attempt to position your bow right away. \\\\/r [+1 FastDraw]} cs:{/You Fast-Draw your arrow with such precision that you gain a bonus to position your bow!} f:{You fail to Fast-Draw an arrow this turn. You can position your bow next turn.} cf:{You fail so badly at Fast-Draw that you scatter the contents of your quiver everywhere! Take a turn to pick up a quarter of the arrows that were left in your quiver and then try again.}]`;
await GURPS.executeOTF(OtF);

let OtF5 = `[/if [S:Fast*Draw*Arrow] s:{/r [+0 Fast-Draw (Arrow) Ready success] \\\\You <strong>Fast-Draw</strong> your arrow in no time! You can attempt to position your bow right away.} cs:{/r [+3 Fast-Draw (Arrow) Ready crit] \\\\You <strong>Fast-Draw</strong> your arrow with such precision that you gain +3 to position your bow!} f:{/r [+0 Fast-Draw (Arrow) failed] \\\\You fail to <strong>Fast-Draw</strong> an arrow this turn. You can position your bow next turn.} cf:{/tr(Arrows)=0 \\\\You fail so badly at <strong>Fast-Draw</strong> that you scatter the contents of your quiver everywhere! Take a turn to pick up 1/4 of your the arrows that were left in your quiver and then try again.}]`;
await GURPS.executeOTF(OtF5);

let OtF4 = `/if [M:Thrice*Swung] cs:{/r [4d+17 cut]} s:{/r [4d+17 cut]} cf:{/ic You crit failed your attack, so you drop your weapon! \\\\/status on disarmed \\\\/fp -1} f:{/ic Your attack missed!} `;

await GURPS.executeOTF(OtF4);



let OtF=`/if [M:Thrice*Swung] s:{/r [4d+17 cut]} cs:{/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut fon=none } f:{/ic Your attack missed!} cf:{/ic You crit failed your attack, so you drop your weapon!}`;

await GURPS.executeOTF(OtF);


let OtF=`/if [M:Thrice*Swung] s:{/r [4d+17 cut]} cs:{/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut fon=none } f:{/ic Your attack missed!} cf:{/ic You crit failed your attack, so you drop your weapon!}`;

await GURPS.executeOTF(OtF);


let OtF2 = `/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut fon=none `;

await GURPS.executeOTF(OtF2);

let originalActor = await GURPS.LastActor;
let actorName = originalActor.name;
let attackDamageOtF = "4d+17 cut";
console.log(`actorName: ${actorName};`);
let d = new Date();
let ts = d.getTime()-99999999999;
console.log(`ts: "${ts}";`);
let messageList = game.messages.filter(i => 
	i.value.timestamp > ts 
	&& i.value.speaker.alias == actorName  
	&& i._roll != null
	&& i._roll._formula.includes("d6[Damage]") == true 
	&& i.value.content.includes(attackDamageOtF) == true
	); 

  
    

let d = new Date();
let ts = d.getTime()-99999999999;
let messageList = game.messages.filter(m => 
    m.timestamp > ts 
    && m.speaker.alias == actorName  
    && m.rolls.length
    && m.rolls[0]._formula.includes("d6[Damage]") 
    && m.content.includes(attackDamageOtF)
); 




/*
let OtF=`/r [+0 Mighty Blow *Cost 1FP] \\\\/if [M:Thrice*Swung] 
s:{/r [4d+17 cut]} 
cs:{/:CritHitCalcMelee attack=Thrice*Swung kbm=1 dmg=4d+17 cut fon=none } 
f:{/fp +0 \\\\Your attack missed!} 
cf:{/fp -1 \\\\You crit failed your attack, so you drop your weapon! \\\\/status on disarmed}`;

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
*/