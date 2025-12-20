/*
####################################################
   This macro needs the Sequencer module to work.
####################################################
*/

// Let's create a function with arguments. That means that we can call this function later and define each argument (here they're called dbThrow, dbFracture and dbExplosion);
// If you look at the end of the macro, we're using each arg to call a specific Database path. (i.e: await grenade('dbPath01', 'dbPath02', 'dbPath03'))
async function grenade(dbLaunch, dbSmoke, dbExplosion, dbGroundImpact){
    let source = token; // this is the first selected token
    let targets = Array.from(game.user.targets); // This is an array that will contain all targeted tokens (we need at least one to know where to throw the potion or grenade)
        for(let target of targets){ // The for loop will iterate for each target, if more than one token is targeted. Otherwise it will run it only once
        new Sequence()
        .effect()
            .file(dbSmoke)
            .atLocation(source)
            .scale(0.5)
            .offset({x:0, y:0}) // Our side impacts usually start at 100 pixels from the left
            .rotateTowards(target) // we rotate it so it points back towards the token throwing the potion and add a 180 degrees rotation to it
            .rotate(180)  
        .effect() 
            .file(dbLaunch)
            .atLocation(source)
            .stretchTo(target)
            .waitUntilFinished(-150)  
        .effect()
            .file(dbExplosion)
            .atLocation(target)
			.waitUntilFinished(-5000)  
        .effect()
            .file(dbGroundImpact)
            .atLocation(target)
            .belowTokens()
            .scale(0.4)
            .scaleIn(0.1, 100, {ease: "easeOutExpo"})
            .persist() 
			.name('Grease')			
        .play();
        
        let delay = Sequencer.Helpers.random_int_between(600, 1000) // neat little helper from Sequencer giving us a whole number between two values
        await Sequencer.Helpers.wait(delay) // another helper that allows us to delay the time between each loop (when we have more than one target)
        
        }
    }
await grenade('jb2a.throwable.throw.bomb.01.black','jb2a.smoke.puff.side.02.white.2', 'jb2a.explosion.side_fracture.flask.01.1','jb2a.grease.dark_brown');

//Sequencer.EffectManager.endEffects({name: 'Grease'})


//If you liked the groundcrack showed in our patreon post, this file isn't part of our module since it is under the Fan-Content License of Forgotten Adventures. But it can be downloaded here : https://www.dropbox.com/s/7z72w0cjznx6yeo/Modified_Blast_Tile_From_ForgottenAdventures.zip?dl=1
//Replace jb2a.impact.ground_crack.orange in the last line of code by the path where you stored the downloaded files.
//As an example 'Data/yourFolderName/FireballBlast_01_Orange_800x800.webm'