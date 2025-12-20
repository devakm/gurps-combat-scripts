/everyone hp reset
/ev fp reset

white-space: wrap;

white-space: wrap;

.chat-message .message-header .message-sender {
    white-space: wrap;
}
[Sk:Default=4] // roll against
BuxlanTorSpikeTrap01

wsl.exe -d Ubuntu

/:DetectTraps title="Pitfall Trap" dice=3d adds=3 type=pi++ armordiv=2 attrib=DX difmod=-6 skill=Acrobatics detectwith=!PER! detectdif=-8 tag=BuxlanTorSpikeTrap01


/:CritHitCalcMelee attack=Grace*Mace*Mercy*Swung kbm=1 dmg="3d+11 cr" fon="[1d burn]" 


 * ["Shield Light (Moonlight)"/li 3 1 360]  * ["Shield Light (Torchlight)"/li 6 2 360]  * ["Shield Light (Daylight)"/li 12 4 360] * ["Lights Off"/li 0 0]

Specials:  * ["Stealth" Sk:Stealth] * ["Acrobatic Dodge!" /if [Sk:Acrobatics] [Dodge +2] /else [Dodge -2] ] * ["Acrobatic Stand from Prone" /:AcrobaticStandFromProne] * ["Acrobatic Stand from Sit/Crawl" /:AcrobaticStandFromSitCrawl] * ["Perception Check (Blind Roll)" /r [!PER!]] 
Traps: * ["Active Search: Detect Traps (Blind Roll)" !Sk:IQ -5 | !Sk:Lockpicking -3 (Based:Per) | !Sk:Traps (Based:Per) ] * ["Passive Search: Detect Traps (Blind Roll)" /r [!Sk:IQ -10 | !Sk:Lockpicking -8 (Based:Per) | !Sk:Traps -5 (Based:Per) ]] * ["Disarm Traps" /r [Sk:DX -5 | Sk:Lockpicking -3 | Sk:Traps (Based:DX) ]] 
Find: * ["Find Secret Doors (Blind Roll)" !Sk:Vision -5 | !Sk:Observation | !Sk:Traps (Based:Per) ] * ["Open Secret Door"IQ -5 | Sk:Traps (Based:IQ) ] * ["Search Area (Blind Roll)" !Sk:Vision -5 | !Sk:Observation | !Sk:Traps (Based:Per) ] * ["Search Person (Blind Roll)" !Sk:Per -5 | !Sk:"Search"] 
Locks: * ["Lockpick Standard Dungeon Lock (DX-based)" DX -5 | Sk:Lockpicking (Based:DX) ] * ["Lockpick Standard Puzzle Lock (IQ-based)" IQ -5 | Sk:Lockpicking (Based:IQ) ] * ["Traps: Pick Trapped Lock" DX -5 | Sk:Traps (Based:DX) ] * ["Pick Trapped Lock with mechanism inside" DX -10 | Sk:Traps -5 (Based:DX) ]
Melee: * ["Fey Fire Slash" /:FeyFireSlash] * ["Fey Fire Stab" /:FeyFireStab] * ["Mighty Fey Fire Slash" /:FeyFireSlashMighty] * ["Mighty Fey Fire Stab" /:FeyFireStabMighty]
Ranged: * ["Deathbow" /:Deathbow] * ["Fey Fire Thrown" /if [A:Exq*Fey*Dagger*Thrown] {!/anim Dagger*Fire_Regular_Green*webm *0.3 -0.2 +1 \\/r [D:Exq*Fey*Dagger*Thrown] \\/r [1d burn]}]
Healing: * ["Use Major Healing Potion" /:DrinkHealingPotion type=Major]
Misc: * ["Scrounging" Per -4 | Sk:"Scrounging"] * ["Survival" Per -5 | Sk:Survival† | Sk:Naturalist*same*planet -3 ] * ["Search Area (Blind Roll)" !Sk:Vision -5 | !Sk:Observation | !Sk:Traps(Based:Per)] * ["Sense Foes (Blind Roll)" !Sp:"Sense Foes"] 
Concentration: * ["Break Concentration/Will-3" Will-3]  * ["Will Check (Blind Roll)" !WILL!]




["Use Lockpick"/if [/qty -1 Lockpicks] [/li 3 1 360 #ed9b0c flame]]

* ["Lockpick Standard Dungeon Lock (DX-based)"/if [/qty -1 Lockpicks] /if [DX -5 | Sk:Lockpicking (Based:DX)] s:{You pick the lock! \\\\/qty +1 Lockpicks} f:{You fail to pick the lock! \\\\/qty +1 Lockpicks} cf:{You fail Lockpiking so badly that you break it!}]]


    if (clType === 'Moonlight') {
        Title = 'Continual Light (Moonlight)';
        modTitle = 'CL Moonlight';
        Cost = 2;
        rsize = 1;
        glowLumin = 0.3;
    } else if (clType === 'Torchlight') {
        Title = 'Continual Light (Torchlight)';
        modTitle = 'CL Torchlight';
        Cost = 4;
        rsize = 2;
        glowLumin = 0.5;
    } else if (clType === 'Daylight') {
        Title = 'Continual Light (Daylight)';
        modTitle = 'CL Daylight';
        Cost = 6;
        rsize = 4;
        glowLumin = 0.75;
    }
	
 * ["Shield Light (Moonlight)"/li 3 1 360]
 * ["Shield Light (Torchlight)"/li 6 2 360]
 * ["Shield Light (Daylight)"/li 12 4 360]
 * ["Use Lantern"/if [/qty -1 Oil, Lantern, 1 Pint] [/li 6 2 360 #ed9b0c flame]] 
 * ["Use Bull's Eye Lantern"/if [/qty -1 Oil, Lantern, 1 Pint] [/li 3 10 15 #ed9b0c flame]] 
 * ["Lights Off"/li 0 0]
 
 
 Maneuvers / Concentration
* [-4 to hit Move and Attack *Max:9]  
* [-0 to hit Move and Attack (target ground) *Max:13] 
* [-2 to hit Move and Attack (Ranged)]   
* [+0 Heroic Charge *Cost 1FP]  
* [+0 Giant Step *Cost 1FP]  
* [+0 Great Lunge *Cost 1FP]
* ["Break Concentration/Will-3"Will-3]
Melee
* ["Hammer Smash"/:GracefulHammerSmash]
* ["Mighty Hammer Smash"/:MightyGracefulHammerSmash]
Ranged
* ["Stone Missile"/:StoneMissile] 
* ["Sunbolt"/:Sunbolt]
* ["Hammer Thrown"/if [R:Grace*Dwar*hammer*Thrown] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Dwar*hammer*Thrown]}]
* ["Mighty Hammer Thrown"/if [R:Grace*Dwar*hammer*Earth] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Dwar*hammer*Thrown]}]
Healing
* ["Major Healing"/:MajorHealing]
* ["Use Paut"/:DrinkPaut]
* ["Use Major Healing Potion"/:DrinkHealingPotionMajor]
Misc
* ["+4 to hit (Telegraphic Attack)"+4 to hit (Telegraphic Attack)] 
* ["Perception Check (Blind Roll)"!PER!] 
* ["−4 to hit (Move and Attack)"−4 to hit (Move and Attack)] 
* ["Will Check (Blind Roll)"!WILL!] ["Stone Missile"/:StoneMissile]
 ["Mighty Hammer Smash"/if [A:Grace*Dwar*hammer*Swung] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Grace*Dwar*hammer*Swung]}]
 
 
 
jb2a.spike_trap.10x05ft.side.base.normal.01.01
jb2a.spike_trap.10x05ft.side.base.normal.01.02


GURPS Line Editor
 
Kromm's Avatar
 
Join Date: Jul 2004
Location: Montréal, Québec
Default Re: Martial Arts: How does Disarm work?

Disarming is simply a technique to improve your odds at Knocking a Weapon Away (p. B401). As those rules note: "If you hit and your foe fails to defend, roll a Quick Contest of weapon skills with your foe; if you’re attempting to knock away a missile weapon, your opponent rolls against DX." In other words, there are four rolls in total:
Your roll against skill (or Disarming, if better) at the usual penalties to hit the weapon, and an extra -2 with a non-fencing weapon. Note that one or two special weapons in Martial Arts -- the hook sword, deer antlers, bill, and trident -- also get to ignore the extra -2.

Your foe's active defense. In this case, "parry" represents getting the weapon out of the way rather than interposing it; see Defending Your Weapon (p. B401) and What Is . . . a Parry? (Martial Arts, p. 122).

Your roll against skill (or Disarming, if better) in the Quick Contest to disarm. This can be ST-based, and some weapons get a bonus to make the attempt (Jitte/Sai & Whip weapons).

Your opponent's roll against skill (or Retain Weapon, if better) in the Quick Contest. This can be ST-based, and some weapons get a bonus to resist (two-handed weapons)


"C:\foundrydata\Data\worlds\ur\FA_Assets\Decor\Clutter\Treasure\Treasure_Piles\Treasure_Pile_Mixed1_A29_2x2.png"

Danger Sense B358
B47



Bag of Tricks
	
@PDF[Live Map of Kitaria|page=1]{Live Map of Kitaria}


#Set the URL of the website to be mirrored
URL="https://scp-wiki.wikidot.com/"
#Set the name of the directory where the mirrored website will be stored
MIRROR_DIR="scp_mirror"
#Use wget to mirror the website
wget -m -E -k -K -p "https://wiki.rpg.net/index.php/GURPS_Magical_Styles_Fan_Netbook" -P ./

 color: #3a3a3a; background-color: #ffffff;
 modules/janloos-underdark-2/Tokens/Brain-Sucker-Green.png
 
 Package Release Token:
 
 fvttp_anF1wAKHsF#Lei1Z1NMUEgIu
 
 
 https://github.com/devakm/gurps-night-vision/blob/b3d48e1268358603f699493155c17bfb9c0c948b/module.json

 I have not seen one, but my list includes:

About Face
Token Action HUD Classic
gurps-instant-defaults
giggioz-better-labels
Illandril's Token Action HUD scaler:
Chat Portrait

name: Example Workflow for Environment Files

on: push

jobs:
  set_and_use_env_vars:
    runs-on: ubuntu-latest
    steps:
      - name: Set environment variable
        run: echo "MY_ENV_VAR=myValue" >> $GITHUB_ENV

      - name: Use environment variable
        run: |
          echo "The value of MY_ENV_VAR is $MY_ENV_VAR"


name: Set variables
        run: |
          echo "VERSION_HASH_DATE=$(cat ~/varz/VERSION_HASH_DATE)" >> $GITHUB_ENV



- name: Set variables
  run: |
    VER=$(cat VERSION)
    echo "VERSION=$VER" >> $GITHUB_ENV

- name: Build Docker Image
  uses: docker/build-push-action@v2
  with:
    context: .
    file: ${{ env.BASE_DIR }}/Dockerfile
    load: true
    tags: |
      ${{ env.USER }}/${{ env.REPO }}:${{ env.VERSION }}
      ${{ env.USER }}/${{ env.REPO }}:latest
	  
jobs:
  test:
    runs-on: ubuntu-18.04
    steps:
      - name: Extract tag name
        id: tag
        uses: actions/github-script@0.2.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            return context.payload.ref.replace(/\/refs\/tags\//, '');
      - name: Echo
        run: echo ${{ steps.tag.outputs.result }}
		


 ["Fireball"/r [/if [Sp:Fireball] cs:{/if [R:Fireball+1 Modifier Bucket Applied] {!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\!/wait 500 \\!/anim FireballExplosion*Orange c *0.2 \\/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true }} cf:{!/anim FireballExplosion*Orange c *0.1 @self \\/rolltable CritMiss} s:{/if [R:Fireball+1 Modifier Bucket Applied] cs:{!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\!/wait 500 \\!/anim FireballExplosion*Orange c *0.2 \\/:SpellDamage title=Fireball dice=1 adds=+2 type=burn adjust=-8 crit=true } s:{!/anim FireBolt*Regular_Orange*15ft -0.2 +0.6 \\/:SpellDamage title=Fireball dice=1 adds=0 type=burn adjust=-2 crit=false} cf:{!/anim FireballExplosion*Orange c *0.1 @self \\/rolltable CritMiss} f:{!/anim FireBolt*Regular_Orange*15ft -0.2 -3 \\/fp -1}} f:{!/anim FireBolt*Regular_Orange*15ft -0.2 -3 \\/fp -1} ]]
 
 
 

a critical success on an attack roll is a Critical Hit
a critical success on an active defense results in a Critical Miss for the attacker
A critical failure on an attack is a Critical Miss
A successful attack is also a critical miss if an active defense critically succeeds to thwart it
A critical failure on a parry also functions like a critical miss
Other active defenses can also critically fail:
A critical failure on a block unreadies the shield
A critical failure on a dodge results in a fall

Object.keys(foundry.utils.flattenObject(GURPS.Maneuvers.getManeuver('attack')));

GURPS.StatusEffect

Object.keys(foundry.utils.flattenObject(tokens[0].actor.system));


129.146.66.151
unzip ./foundryv12/FoundryVTT-11.315.zip -d ~/foundry/

Invoke-WebRequest -Uri "https://wiki.rpg.net/index.php/GURPS_Magical_Styles_Fan_Netbook" -Method GET `-Headers @{UserAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"}`
  -WebSession ([System.Net.WebRequest]::CreateDefaultWebSession()) 
  -UseBasicParsing 
  -OutFile "example.com" 
  -Directory "C:\Users\aubre\OneDrive\rpg\GURPS_DungeonFantasy\Magical_Styles"
  -Recurse  
  
  fooo

wget --mirror --adjust-extension --page-requisites --no-parent "https://wiki.rpg.net/index.php/GURPS_Magical_Styles_Fan_Netbook" -UseBasicParsing

Invoke-WebRequest [-Uri] <uri> [-UseBasicParsing] [-WebSession <WebRequestSession>] [-SessionVariable <string>] [-Credential <pscredential>] 
    [-UseDefaultCredentials] [-CertificateThumbprint <string>] [-Certificate <X509Certificate>] [-UserAgent <string>] [-DisableKeepAlive] 
    [-TimeoutSec <int>] [-Headers <IDictionary>] [-MaximumRedirection <int>] [-Method {Default | Get | Head | Post | Put | Delete | Trace | Options 
    | Merge | Patch}] [-Proxy <uri>] [-ProxyCredential <pscredential>] [-ProxyUseDefaultCredentials] [-Body <Object>] [-ContentType <string>] 
    [-TransferEncoding {chunked | compress | deflate | gzip | identity}] [-InFile <string>] [-OutFile <string>] [-PassThru]  [<CommonParameters>]
	

jb2a.melee_attack.02.battleaxe.01.0

jb2a.melee_attack.02.battleaxe.01.0

GenericSlash01_01_Regular_Orange

MeleeAttack02_BattleAxe01_02


!/anim MeleeAttack02_BattleAxe01_02 *1.6 -0.2 +1  \\\\!/anim GenericSlash01_01_Regular_Orange *1.6 -0.2 +1
 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9


!/anim Mace*Regular_White *0.6 -0.2 +1  \\\\!/anim GenericSlash01_01_Regular_Orange *0.6 -0.2 +1
 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9 \\\\!/wait 1000 \\\\!/anim Flames_01_Regular_Orange c *0.5
 
 
 ["Holy Smash"/if [A:Graceful*Swung] {!/anim Mace*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Graceful*Swung] \\/r [1d burn]}]
["Mighty Holy Smash"/if [A:Graceful*Swung] {!/anim Mace01*Regular_White*webm *0.3 -0.2 +1 \\/r [D:Graceful*Swung] \\/r [1d+2 burn] \\/fp -1}]




["Mighty Holy Smash"/if [A:Grace*Mace*Mercy*Swung] {/r [D:Grace*Mace*Mercy*Swung] \\/r [1d+2 burn] \\/r [/fp -1]}]

["Mighty Hammer Smash"/if [A:Grace*Dwar*hammer*Swung] {!/anim Warhammer*Regular_White*webm *0.3 -0.2 +1 \\/r [+2 damage bonus *Cost 1FP] \\/r [D:Grace*Dwar*hammer*Swung]}]






Item: @JournalEntry[K6Rn1hpU2cgI0lhG]{Bag of Tricks}

Player: @Actor[dhquke7gGNKZB5V5]{Bruja Dragonslayer}





let targets = Array.from(game.user.targets); 
for(let target of targets){ 
	targetID = target.id;;
	isTargetHidden = target.data.hidden;
	targetToken = canvas.tokens.get(targetID); 
	await GURPS.SetLastActor(targetToken.actor);    
	targetActor = await GURPS.LastActor;
	targetName = targetActor.name;
	let chatDescription = `${targetName} test`;
	console.log(chatDescription);
	ChatMessage.create({
	content: chatDescription, speaker: ChatMessage.getSpeaker(targetActor), blind: true }, 
	{ chatBubble: false });	
}


args[0].length 4 : CritHitCalc,[6d+14,imp]',''
VM2060:67 Error: [6d+14 not found on actor Critical Eorkh Blaze Trapmaster (1)


systems/dnd5e/tokens/humanoid/Orc.webp

// Replace Test Tag with the Tag you're using.
// Only triggers the oldest tile with this particular Tag
Tagger.getByTag("SpikeTrap01")[0].trigger({tokens:[canvas.tokens.controlled[0].document], method: 'trigger'})


YelllowMold
jb2a.smoke.puff.side.green.1
jb2a.smoke.puff.side.green.4
jb2a.smoke.plumes.01.dark_green.0
jb2a.smoke.puff.side.dark_green.2
jb2a.toll_the_dead.green.skull_smoke
jb2a.fog_cloud.02.green02


// Replace the tile ID with the ID of the tile to be triggered.
// Requires a token to be selected when activated.
canvas.tiles.get("tile ID").document.trigger({tokens:[canvas.tokens.controlled[0].document], method: 'trigger', options: { landing: "test2"}})

/r ["Evade Pitfall Trap Very Strong"/:EvadeTrap "Pitfall Trap" 3d 3 pi++ 2 DX -6 Acrobatics]

["Search (Blind Roll)"!Sk:"Search"]
["Perception Check (Blind Roll)"!PER!]

AntilifeShell_01_Blue_Circle_400x400.webm
CastShapeCircleSingle01_01_Regular_Blue_600x600.webm
EnergyAttack_01_01_Regular_Orange_1000x1000.webm
ShrapnelGrenade03_01_Regular_Black
EnergyBeam_02_Regular_Red_30ft_1600x400.webm

EnergyWall01_01_Regular_Orange_05x05ft_Complete_400x400.webm
EnergyWall01_01_Regular_Orange_10x05ft_Loop_800x400.webm
EnergyWall01_01_Regular_Orange_25x05ft_Complete_1400x400.webm
Eruption_01_Regular_Orange_600x600.webm

Explosion_05_Regular_Orange_1200x1200.webm
Explosion_05_Dark_Orange_1200x1200.webm
Explosion_05_Regular_Orange_400x400.webm
Explosion_05_Dark_Orange_400x400.webm

Explosion_04_Regular_Orange_400x400.webm
Explosion_01_Yellow_400x400.webm
SideExplosion01_02_Regular_Orange_600x600.webm

BorderInPulse_02_Circle_Fast_500.webm
InPulse_01_Circle_Fast_500.webm
InPulse_04_Circle_Normal_500.webm
OutPulse_02_Circle_Fast_500.webm

ProjectileOutPulse_01_Circle_Fast_500.webm

Falchion01_05_Regular_Orange_800x600.webm
FireballLoopNoDebris_01_Orange_800x800.webm
FireballExplosion_01_Orange_800x800.webm
Flames03_02_Regular_Orange_10x05ft_400x300.webm
FireballExplosion_01_Orange_800x800.webm

Flames04_01_Regular_Orange_Complete_400x600.webm

FlamingSphere_02_Orange_200x200.webm
FlamingSphere_01_Orange_200x200.webm
FlamingSphere_02_Orange_400x400.webm
FlurryOfBlows_01_Regular_Orange_Physical01_800x600.webm
Fumes04_02_Grey_Complete_400x600.webm
Fumes04_02_Black_Loop_400x600.webm

Glaive01_05_Dark_OrangePurple_800x600.webm
Glaive01_05_Regular_Black_800x600.webm
GlintMany01_04_Regular_Blue_200x200.webm
GlintFew01_02_Regular_Yellow_200x200.webm

GreatAxe01_01_Regular_Red_30ft_1600x600.webm
GreatClub01_Fire_Regular_Orange_800x600.webm

GreatSword01_Fire_Regular_Orange_800x600.webm
GreatSword01_Fire_Regular_Orange_800x600.webm

Shortsword01_06_Regular_White
Shortsword01_03_Regular_Yellow
Shortsword01_06_Regular_Yellow
Sword01_Fire_Regular_Orange
Sword01_06_Regular_Orange

GreatSword01_Fire_Regular_Orange

Stab
Sword01_04_Regular_Yellow


icons/magic/fire/dagger-rune-enchant-flame-strong-orange.webp


modules/jb2a_patreon/Library/Generic/Unarmed_Attacks/Unarmed_Strike/UnarmedStrike_01_Regular_Orange_Physical02_800x600.webm

modules/jb2a_patreon/Library/Generic/Unarmed_Attacks/Unarmed_Strike/UnarmedStrikeNoHit_01_Regular_Yellow_800x600.webm

!/anim UnarmedStrike*Orange *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9

!/anim UnarmedStrike*Regular_Orange_Magical *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 1000 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9

Sword01_04_Regular_Orange
Sword01_03_Regular_Orange
Sword01_05_Regular_Orange
LiquidSplash01_Regular_Red
LiquidSplashSide01_Regular_Red

modules/jb2a_patreon/Library/Generic/Smoke/Fumes_03_Toxic_Green_400x400.webm

!/anim Fumes_03_Toxic_Green *0.3 -0.2 +1
!/anim Fumes_03_Toxic_Green c *0.7 


Melee Spear
let csanim = '!/anim Spear01_03_Regular_Yellow *0.6 -0.1 +0.9 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5'; // critical success animation 

Thrown Spear
let sanim = '!/anim Spear01_01_Regular_White_30ft *0.3 -0.2 +0.5 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim IconPoison_01_Dark_Green c *0.3'; // success animation 


!/anim Spear01_03_Regular_Yellow *0.3 -0.2 +1 

Spear01_01_Regular_White
modules/jb2a_patreon/Library/Generic/Weapon_Attacks/Ranged/Spear01_01_Regular_White_30ft_1600x400.webm
modules/jb2a_patreon/Library/Generic/Weapon_Attacks/Ranged/Spear01_01_Regular_White_Return_30ft_1600x600.webm

!/anim Spear01_01_Regular_White_30ft *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9

!/anim Sword01_04_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplashSide01_Regular_Red *0.4 +0.5  


!/anim Sword01_04_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplashSide01_Regular_Red c15 *0.4



!/anim Sword01_04_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplashSide01_Regular_Red cf *0.3 
!/anim Sword01_04_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplashSide01_Regular_Red cf90 *0.3 

!/anim Sword01_04_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplashSide01_Regular_Red c *0.2

!/anim Sword01_04_Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim LiquidSplash01_Regular_Red c *0.2 


!/anim Sword01*Fire*Regular_Orange *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/anim Flames_01_Regular_Orange c *0.5 


/r [thr(5) imp] \\\\!/anim Caltrops01_01_Regular_Grey_400x400.webm c @self

jb2a.side_impact.part.shockwave.blue

!/anim PartSideImpactShockwave01_01_Regular_Blue

!/anim PartSideImpactShockwave01_01_Regular_Blue -0.1 +1

!/anim OutPulse_01_Circle_Fast_500 c *0.9

!/anim OutPulse_01_Circle_Fast_500 c *0.6
!/anim GreatSword01_Fire_Regular_Orange -0.2 +0.6 \\\\!/wait 500 \\\\!/anim Explosion*Orange c *0.3 \\\\!/anim Flames_01_Regular_Orange c *0.4


\\\\/r [1d burn]



console.log(args[0]);
let title = args[0][1];
let dice = parseFloat(args[0][2]);
let adds = args[0].length > 3 ? parseInt(args[0][3]) : 0;
let type = args[0].length > 4 ? args[0][4] : 'dmg';
let adjust = args[0].length > 5 ? parseInt(args[0][5]) : 0;
console.log(`title:${title}; dice:${dice}; adds:${adds}; type:${type}; adjust:${adjust};`);



/*##################################################################
          INSTRUCTIONS
This macro requires these modules : 
- Sequencer
- Tagger

Place down a Tile with only the base using the following filepath : 
"/Traps/Spike_Trap/Stills/SpikeTrapTopBaseHidden01_Regular_Brown_10x10ft_600x600_StillFrame.webp"
The full size of the trap is 600x600 pixels. Let's make it half its original size at 300x300.
Also, in the details of the tile at the bottom, we have to add the tag : "SpikeTrap" (without the quotation marks) in the field provided by the Tagger module.
####################################################################*/

// Let's pre-load the animations we'll need so that every client has the animations in cache and it doesn't mess the delays.
await Sequencer.Preloader.preloadForClients([
  "jb2a.spike_trap.10x10ft.top.no_base.normal.01", 
  "jb2a.spike_trap.10x10ft.top.no_base.still_frame.deployed",
  "jb2a.liquid.splash.red",
  "jb2a.spike_trap.10x10ft.top.no_base.rearming.01",
])
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
let sourcePos = await Tagger.getByTag("SpikeTrap");// this will return an array of tiles which contain the tag "SpikeTrap"
const trapSize = { width: 300, height: 300 };// Instead of repeating this for every Sequencer effect, I'm defining it at the top
await wait(100);

async function trapTrigger() {
for (const source of sourcePos) { // This will execute the Sequence for each tile of the array with the Tag
   new Sequence()
      .effect()
        .file("jb2a.spike_trap.10x10ft.top.no_base.normal.01")
        .atLocation(source)
        .size(trapSize)
        .fadeOut( 250,{ ease: "linear", delay: -2400 })
        .waitUntilFinished(-2700)
      .effect()
        .file("jb2a.spike_trap.10x10ft.top.no_base.still_frame.deployed")
        .atLocation(source)
        .size(trapSize)
        .persist() // Persist means we'll keep this still-frame displayed until we decide to switch to the re-arming Sequence
        .name('SpikeTrap-Deployed')
    .play();
}
}

async function trapRearm(){
  for (const source of sourcePos) {
    new Sequence()
      .effect()
        .file("jb2a.spike_trap.10x10ft.top.no_base.rearming.01")
        .atLocation(source)
        .size(trapSize)
      .play()
  }
  await wait(600)
  Sequencer.EffectManager.endEffects({name: 'SpikeTrap-Deployed'}) // This will remove the still-frame we persisted earlier
}

// At this point of the macro, we have defined what we want to happen when we execute the trapTrigger() function and when we execute the trapRearm() function.
// We need a way for the macro to know which one to use depending on if the still-frame is displayed or not.

const effect = Sequencer.EffectManager.getEffects({name: 'SpikeTrap-Deployed'});

if(!effect.length){ // If the array of persisting effect is empty, let's trigger the trap, otherwise we re-arm it.
  await trapTrigger()
}
else{
  await trapRearm()
}


let selectedTokens = canvas.tokens.controlled; // This will output an array of all currently selected tokens.

// this following loop will play the animation for each selected token (each element of the array)
for(let selectedToken of selectedTokens){
    new Sequence()
        .effect()
            .file("jb2a.falling_rocks.top.1x1.sandstone") // in between the "", you can paste the database path of another asset. For example, "jb2a.falling_rocks.top.1x1.sandstone.1"
            .scale(0.5)
            .atLocation(selectedToken)
            .fadeOut(250, {ease: "easeInSine"})
            .randomizeMirrorX() // as its name suggests, this will randomize how it's displayed and avoid repetition as much as possible
            .randomizeMirrorY() 
    .play()
}


// Let's create a function with arguments. That means that we can call this function later and define each argument (here they're called dbThrow, dbFracture and dbExplosion);
// If you look at the end of the macro, we're using each arg to call a specific Database path. (i.e: await grenade('dbPath01', 'dbPath02', 'dbPath03'))
async function grenade(dbLaunch, dbSmoke, dbExplosion, dbGroundImpact){
    let source = token; // this is the first selected token
    let targets = Array.from(game.user.targets); // This is an array that will contain all targeted tokens (we need at least one to know where to throw the potion or grenade)
        for(let target of targets){ // The for loop will iterate for each target, if more than one token is targeted. Otherwise it will run it only once
        new Sequence()
        .effect()
            .file(dbSmoke)
            .atLocation(source)
            .scale(0.2)
            .offset({x:0, y:0}) // Our side impacts usually start at 100 pixels from the left
            .rotateTowards(target) // we rotate it so it points back towards the token throwing the potion and add a 180 degrees rotation to it
            .rotate(180)  
        .effect() 
            .file(dbLaunch)
            .atLocation(source)
            .stretchTo(target)
            .waitUntilFinished(-150)  
        .effect()
            .file(dbExplosion)
            .atLocation(target)
			.waitUntilFinished(-5000)  
        .effect()
            .file(dbGroundImpact)
            .atLocation(target)
            .belowTokens()
            .scale(0.2)
            .scaleIn(0.1, 100, {ease: "easeOutExpo"})
            .persist() 
			.name('PoisonCloud')			
        .play();
        
        let delay = Sequencer.Helpers.random_int_between(600, 1000) // neat little helper from Sequencer giving us a whole number between two values
        await Sequencer.Helpers.wait(delay) // another helper that allows us to delay the time between each loop (when we have more than one target)
        
        }
    }
await grenade('jb2a.throwable.throw.bomb.01.black','jb2a.smoke.puff.side.02.white.2', 'jb2a.fog_cloud.02.green02','jb2a.fog_cloud.2.green');

//Sequencer.EffectManager.endEffects({name: 'PoisonCloud'})
//jb2a.fireball.loop_debris.orange
// jb2a.fog_cloud.2.green  jb2a.fog_cloud.02.green02


