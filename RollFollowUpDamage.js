/* Usage: /:RollFollowUpDamage dmg="<damage>"  fon=<followUp>                   */
console.log('---------------------- Start RollFollowUpDamage ----------------------');
let attackDamageOtF = '[1d-4 cr]'; // [6d+14 imp] or [2d+4 cr] or [2d+4 (2) cr] 
let followUpDamage = '[1d-4 burn]'; // default follow-up damage

if (scope !== undefined) {
    console.log(scope)
    attackDamageOtF = scope.dmg ? scope.dmg : attackDamageOtF;
    followUpDamage = scope.fon ? scope.fon : followUpDamage;
}
console.log(`attackDamageOtF: ${attackDamageOtF};`);
console.log(`followUpDamage: ${followUpDamage};`);

function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

await GURPS.executeOTF(`/r ${attackDamageOtF}`); 
await wait(5);
await GURPS.executeOTF(`/r ${followUpDamage}`); 
//await wait(5);
//await GURPS.executeOTF(`/1d+1 cut \\\\/1d-1 burn`); 


console.log('---------------------- End RollFollowUpDamage ----------------------');
