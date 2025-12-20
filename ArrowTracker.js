function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function newArrowTracker() {
	let tr = originalActor.trackersByName;
	let trackers = Object.keys(tr).map((key) => [key, tr[key]]);
	let lastTracker;
	trackers.forEach(tr => { lastTracker = tr }); // pick the latest tracker
	console.log(lastTracker);
	tr[lastTracker[0]].name = 'Arrows';
	tr[lastTracker[0]].value = 15;
	tr[lastTracker[0]].min = 0;
	tr[lastTracker[0]].max = 20;
}

async function arrowsRemaining(trackers) {
	var trackersArray = Object.keys(trackers).map(val => trackers[val]);
	let arrowsTracker = trackersArray.filter(i => 
		i.name.includes("Arrows") == true
	);
	if (arrowsTracker[0] == undefined) {
		let errMsg = `You must have a tracker named "Arrows" for this macro to work.`;
		GURPS.executeOTF('/ic '+errMsg);
		wait(2);
		ui.notifications.error(errMsg);
        console.log(`Error: ${errMsg};`);
		return;
	} else { return arrowsTracker[0].value; }
}

let originalActor = await GURPS.LastActor;
let Trackers = originalActor.trackersByName;
//let count = await game.macros.getName('ArrowTracker').execute();
let noArrowsMsg = "/ic Your quiver is empty. You must refill your quiver to shoot!";
let count = await arrowsRemaining(Trackers);
let Arrows = Number(count);
let ArrowsMsg = `/ic Your quiver has ${Arrows} Arrows.`;

if (Arrows < 1) {
	console.log(noArrowsMsg);
	GURPS.executeOTF(noArrowsMsg);
} else if (Arrows > 0 ) {
	console.log(ArrowsMsg);
	GURPS.executeOTF(ArrowsMsg);
} else if (Arrows == undefined) {
	await originalActor.addTracker();
	await newArrowTracker();
	Trackers = originalActor.trackersByName;
	Arrows = arrowsRemaining(Trackers);
	GURPS.executeOTF(noArrowsMsg);
}


return Arrows;