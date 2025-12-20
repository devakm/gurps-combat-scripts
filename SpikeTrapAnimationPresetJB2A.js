/*##################################################################
          INSTRUCTIONS
This macro requires these modules : 
- Sequencer
- Tagger

Place down a Tile with only the base using the following filepath : 
"modules/jb2a_patreon/Library/Generic/Traps/Spike_Trap/Stills/SpikeTrapTopBaseHidden01_Regular_Brown_10x10ft_600x600_StillFrame.webp"
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
let sourcePos = await Tagger.getByTag("SpikeTrapSmall01");// this will return an array of tiles which contain the tag "SpikeTrapSmall01"
const trapSize = { width: 125, height: 125 };// Instead of repeating this for every Sequencer effect, I'm defining it at the top
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
        .file("jb2a.spike_trap.10x10ft.top.no_base.rearming.01")
        .atLocation(source)
        .size(trapSize)
	  .effect()
		.file("jb2a.liquid.splash.red")
		.atLocation(source)
		.size(trapSize)
		.fadeOut( 250,{ ease: "linear", delay: 4400 })
	   .waitUntilFinished(-4400)
    .play();
}
}

await trapTrigger(); 


//  problem file modules/jb2a_patreon/Library/Generic/Traps/Spike_Trap/Stills/SpikeTrapTopNoBaseDeployed01_Regular_Grey_10x10ft_600x600_StillFrame.webp
