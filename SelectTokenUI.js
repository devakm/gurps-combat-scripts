// Select a token and target it
// Usage: /:SelectToken -- select and target a token
//let tokenPicked = 'YShlinDoAv3dMXwL'; // test using this line
let tokenPicked = ''; 
// Test with Fergus 'dV9Y2WVh5Uogenql' or Rusalka "YShlinDoAv3dMXwL"
console.log(`----- in SelectToken, tokenPicked: ${tokenPicked} ----`);
let GMid = "sVxF0AzuvK7ZMqXx";
let targetToken = canvas.tokens.get(tokenPicked); // select the token that started this action
let tokenSelect = canvas.tokens.get(tokenPicked);
tokenSelect.control();


// add the rest for UI

function selectToken(tokenId) {
	let tokenSelect = canvas.tokens.get(tokenId);
	tokenSelect.control();
	let GM = game.users.get("sVxF0AzuvK7ZMqXx"); // uses id for Gamemaster
	//GM.updateTokenTargets(tokenId);
    //UserTargets = GM.targets;
    GM.targets.add(tokenId);
    //GM.updateTokenTargets(tokenId);
 }
 
new Dialog({
 title: `Select Token`,
 content: `
<div style='padding: 4px;'>
 <label for="tokenId">Token</label>
 <select id="tokenId">
  <option value='${targetToken.data._id}'>${targetToken.data.name}</option>
 </select>
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => selectToken(
      html.find('#tokenId').val())
  }
 }
}).render(true)