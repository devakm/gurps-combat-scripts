// Usage: /:HealSimple heal=<amount>

console.log(scope.heal ? scope.heal : '+0');
let heal = scope.heal ? scope.heal : '+0';
if (heal.includes('-') == true) {
	heal = -Number(heal.split('-')[1]);
} else if (heal.includes('+') == true) {
	heal = Number(heal.split('+')[1]); // split(/[+-]/)[1]
} 
console.log(` heal: ${heal};`);

let healFormula = `/hp +${heal} @target`; 
console.log(`heal amount: ${heal}; healFormula: [${healFormula}]`);

if (heal > 0) {
	let OtF = `[${healFormula}]`; 
	console.log(OtF);
	await GURPS.executeOTF(OtF);
}
 
