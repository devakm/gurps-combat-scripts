/* Usage: /:RollDamage dmg="<damage>"                    */
console.log('---------------------- Start RollDamage ----------------------');
let attackDamageOtF = '[1d cr]'; // [6d+14 imp] or [2d+4 cr] or [2d+4 (2) cr] 

if (scope !== undefined) {
    console.log(scope)
    attackDamageOtF = scope.dmg ? scope.dmg : '';
}
console.log(`attackDamageOtF: ${attackDamageOtF};`);
await GURPS.executeOTF(`/r ${attackDamageOtF}`); 

console.log('---------------------- End RollDamage ----------------------');
