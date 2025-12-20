let sourceTag = "BuxlanTorSpikeTrap01";

let sourcePosMarker = await Tagger.getByTag(sourceTag+"Location");
console.log(`sourcePosMarker: ${sourcePosMarker}`);
let sourcePosTile = await Tagger.getByTag(sourceTag);
console.log(`sourcePosTile: ${sourcePosTile}`);
const trapSize = { width: 300, height: 300 };// predefine size for all
async function trapTrigger() {
	   new Sequence()
		  .effect()
			.file("jb2a.impact.ground_crack.02.orange")
			.atLocation(sourcePosTile[0])
			.size(trapSize)
			.fadeOut( 250,{ ease: "linear", delay: 4400 })
           .waitUntilFinished(-4400)
		  .effect()
			.file("jb2a.spike_trap.10x10ft.top.no_base.normal.01")
			.atLocation(sourcePosMarker[0])
			.size(trapSize)
			.fadeOut( 250,{ ease: "linear", delay: 2400 })
			.waitUntilFinished(2400)
		.play();
	}
await trapTrigger();