function wait(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function newArrowTracker() {
	let tr = originalActor.data.data.additionalresources.tracker;
	let trackers = Object.keys(tr).map((key) => [key, tr[key]]);
	let lastTracker;
	trackers.forEach(tr => { lastTracker = tr }); // pick the latest tracker
	console.log(lastTracker);
	tr[lastTracker[0]].name = 'Arrows';
	tr[lastTracker[0]].value = 15;
	tr[lastTracker[0]].min = 0;
	tr[lastTracker[0]].max = 20;
}

function arrowsRemaining(trackers) {
	var trackersArray = Object.keys(trackers).map(val => trackers[val]);
	let arrowsTracker = trackersArray.filter(i => 
		i.name.includes("Arrows") == true
	);
	if (arrowsTracker[0] == undefined) {
		GURPS.executeOTF(noArrowsMsg, players);
		wait(2);
		let errMsg = `You must have a tracker named "Arrows" for this macro to work.`;
		ui.notifications.error(errMsg);
		console.log(`${noArrowsMsg};`);
        console.log(`Error: ${errMsg};`);
		return;
	} else { return arrowsTracker[0].value; }
}

let originalActor = await GURPS.LastActor;
let noArrowsMsg = "Your quiver is empty. You must refill your quiver to shoot!";
let Trackers = originalActor.data.data.additionalresources.tracker;
let Arrows = arrowsRemaining(Trackers);
if (Arrows == 0) {
	await GURPS.executeOTF(noArrowsMsg, players);
} else if (Arrows == undefined) {
	await originalActor.addTracker();
	await newArrowTracker();
}