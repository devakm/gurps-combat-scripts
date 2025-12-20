/* Usage: /:SlamDistance
	Interact with user to get SlamDistance, then call Slam!
*/

let distanceTitle = "Distance Moved";
new Dialog({
 title: distanceTitle,
 content: `
<div style='padding: 4px;'>
 <label for="distanceFeetMoved">Enter Distance you moved in feet</label>
 <input id="distanceFeetMoved" type="text" />
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => {
		let distFt =parseInt(html.find('#distanceFeetMoved').val());
		let rollCrit = await new Roll("3d6", _token.actor.getRollData()).roll();
		//rollCrit.roll();
		slamDistanceXL(distFt,rollCrit);
      },

  }
 }
}).render(true)

/*
      callback: () => {
        game.macros.getName(str).execute();
        dialog.render(true);
      },
*/

function slamDistanceXL(distanceFeetMoved,rollCrit) {
	let distFt = Number(distanceFeetMoved) > 0 ? Number(distanceFeetMoved): 1;
	game.macros.getName('Slam').execute(distFt,rollCrit);
	//game.macros.getName('Slam').execute(40);
	//let OtF = `/:Slam ${distFt}`;
	//console.log(OtF);
	//GURPS.executeOTF(OtF);
}

