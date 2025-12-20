// Usage: /:HarmSimple <amount>

console.log(scope.heal ? scope.harm : '+0');
let Harm = scope.harm ? scope.harm : '+0';

if (Harm.includes('-') == true) {
	Harm = -Number(Harm.split('-')[1]);
} else if (Harm.includes('+') == true) {
	Harm = Number(Harm.split('+')[1]); // split(/[+-]/)[1]
} 
console.log(` Harm: ${Harm};`);

let HarmFormula = `/hp -${Harm} `; 
console.log(`Harm amount: ${Harm}; HarmFormula: [${HarmFormula}]`);

if (Harm > 0) {
	let OtF = `[${HarmFormula}]`; 
	console.log(OtF);
	await GURPS.executeOTF(OtF);
}
 
// on death anim? LiquidSplashSide01_Regular_Red