/*
myArray = [{'id':'73','foo':'bar'},{'id':'45','foo':'bar'}, etc.]
myArray.find(x => x.id === '45').foo;
yards = ft/3;
*/

srData = [
{'yards': 0, 'srMod': 0, 'sMod': 0},
{'yards': 1, 'srMod': 0, 'sMod': 0},
{'yards': 2, 'srMod': 0, 'sMod': 0},
{'yards': 3, 'srMod': -1, 'sMod': 1},
{'yards': 5, 'srMod': -2, 'sMod': 2},
{'yards': 7, 'srMod': -3, 'sMod': 3},
{'yards': 10, 'srMod': -4, 'sMod': 4},
{'yards': 15, 'srMod': -5, 'sMod': 5},
{'yards': 20, 'srMod': -6, 'sMod': 6},
{'yards': 30, 'srMod': -7, 'sMod': 7},
{'yards': 50, 'srMod': -8, 'sMod': 8},
{'yards': 70, 'srMod': -9, 'sMod': 9},
{'yards': 100, 'srMod': -10, 'sMod': 10},
{'yards': 150, 'srMod': -11, 'sMod': 11},
{'yards': 200, 'srMod': -12, 'sMod': 12},
{'yards': 300, 'srMod': -13, 'sMod': 13},
{'yards': 500, 'srMod': -14, 'sMod': 14},
{'yards': 700, 'srMod': -15, 'sMod': 15}
];
let distFt = 15;
let distYd = Math.floor(distFt/3);
srData.find(x => x.yards >= distYd).sMod;
