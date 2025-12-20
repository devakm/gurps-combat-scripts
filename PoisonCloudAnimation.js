/*
####################################################
   This macro needs the Sequencer module to work.
####################################################
*/

// Let's create a function with arguments. That means that we can call this function later and define each argument (here they're called dbThrow, dbFracture and dbExplosion);
// If you look at the end of the macro, we're using each arg to call a specific Database path. (i.e: await grenade('dbPath01', 'dbPath02', 'dbPath03'))
async function grenade(dbLaunch, dbSmoke, dbGroundImpact){
    let source = token; // this is the first selected token
    let targets = Array.from(game.user.targets); // This is an array that will contain all targeted tokens (we need at least one to know where to throw the potion or grenade)
        for(let target of targets){ // The for loop will iterate for each target, if more than one token is targeted. Otherwise it will run it only once
        new Sequence()
        .effect()
            .file(dbSmoke)
            .atLocation(source)
            .scale(0.8)
            .offset({x:0, y:0}) // Our side impacts usually start at 100 pixels from the left
            .rotateTowards(target) // we rotate it so it points back towards the token throwing the potion and add a 180 degrees rotation to it
            .rotate(180)  
        .effect() 
            .file(dbLaunch)
            .atLocation(source)
            .stretchTo(target)
            .waitUntilFinished(-150)  
        .effect()
            .file(dbGroundImpact)
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
await grenade('jb2a.throwable.throw.bomb.01.black','jb2a.smoke.puff.side.02.white.2','jb2a.fog_cloud.02.green02');

//FogCloud_02_Regular_Green     jb2a.fog_cloud.02.green02
//Sequencer.EffectManager.endEffects({name: 'PoisonCloud'})
//jb2a.fireball.loop_debris.orange
// jb2a.fog_cloud.2.green  jb2a.fog_cloud.02.green02
//jb2a.breath_weapons.poison.cone.green

