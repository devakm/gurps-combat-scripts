/*
####################################################
   This macro needs the Sequencer module to work.
####################################################


const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
let sourcePos = await Tagger.getByTag("BXTrapStatue01")[0]; // this will return an array of tiles which contain the tag specified, as in "PoisonSprayer" or "SpikeTrap"
await wait(100);
let sourceXY;
async function trapTrigger() {
	for (const source of sourcePos) { // This will execute the Sequence for each tile of the array with the Tag
	   sourceXY = source;
	}
}


// Tagger.getByTag(tagName)[0]
/// let pos = Tagger.getByTag('TrapStatue99')[0].data.x

*/

//console.log(`args:${args[0]}`);
//let sourceTag = args[0][1].split(',')[1];
let sourceTag = args[0][1];
//let sourceTag = 'BXTrapStatue01';
console.log(`sourceTag:${sourceTag}`);

// preload animations 
await Sequencer.Preloader.preloadForClients([
  "jb2a.breath_weapons.poison.cone.green", 
  "jb2a.fog_cloud.02.green",
])
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
//let sourcePos = await Tagger.getByTag(sourceTag)[0];// this will return an array of tiles which contain the tag passed in args as sourceTag
let tileObj = await Tagger.getByTag(sourceTag)[0].data

function tileCenter(tile) {
	console.log(`top corner coordinates for tile x: ${tile.x}, y: ${tile.y}`);
	let centerX = tile.x + (tile.width / 2);
	let centerY = tile.y + (tile.height / 2);
	console.log(`center coordinates for tile x: ${centerX}, y: ${centerY}`);
	return { x: centerX, y: centerY };
}

let sourcePos = tileCenter(tileObj);

// this gets top corner instead of center: let sourcePos = { x: tileObj.x, y: tileObj.y };
//console.log(`sourcePos:${sourcePos}`);
await wait(100);


// Let's create a function with arguments. That means that we can call this function later and define each argument (here they're called dbThrow, dbFracture and dbExplosion);
// If you look at the end of the macro, we're using each arg to call a specific Database path. (i.e: await grenade('dbPath01', 'dbPath02', 'dbPath03'))
async function grenade(dbSpray,dbLingering){
    let source = sourcePos; // this is the source of the spray
    let targets = Array.from(game.user.targets); // This is an array that will contain all targeted tokens (we need at least one to know where to throw the potion or grenade)
    for(let target of targets){ // The for loop will iterate for each target, if more than one token is targeted. Otherwise it will run it only once
        new Sequence()
		.effect() 
            .file(dbSpray)
            .atLocation(source)
			.rotateTowards(target) // we rotate it so it points back towards the token throwing the potion and add a 180 degrees rotation to it
            .stretchTo(target)
  			.waitUntilFinished(-5000)  
        .effect()
            .file(dbLingering)
            .atLocation(target)
            .belowTokens()
            .scale(0.6)
            .scaleIn(0.1, 100, {ease: "easeOutExpo"})
            .persist() 
			.name('PoisonCloud')			
        .play();
        
        let delay = Sequencer.Helpers.random_int_between(600, 1000) // neat little helper from Sequencer giving us a whole number between two values
        await Sequencer.Helpers.wait(delay) // another helper that allows us to delay the time between each loop (when we have more than one target)
        
        }
    }
await grenade('jb2a.breath_weapons.poison.cone.green','jb2a.fog_cloud.02.green');

//Sequencer.EffectManager.endEffects({name: 'PoisonCloud'})        jb2a.fog_cloud.02.green02
//jb2a.fireball.loop_debris.orange
// jb2a.fog_cloud.2.green  jb2a.fog_cloud.02.green02
//jb2a.breath_weapons.poison.cone.green

