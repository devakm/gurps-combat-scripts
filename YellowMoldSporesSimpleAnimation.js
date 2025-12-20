/*
####################################################
   This macro needs the Sequencer module to work.
####################################################
*/
console.log(`-----------  YellowMoldSpores Animation   -----------`);
let sourceTag = scope.tag
//let sourceTag = 'BXTrapStatue01';
console.log(`sourceTag:${sourceTag}`);
// Let's create a function with arguments. That means that we can call this function later and define each argument (here they're called dbThrow, dbFracture and dbExplosion);
// If you look at the end of the macro, we're using each arg to call a specific Database path. (i.e: await moldSpores('dbPath01', 'dbPath02', 'dbPath03'))
async function moldSpores(dbGas){
    let source = token; // this is the first selected token
    let targets = Array.from(game.user.targets); // This is an array that will contain all targeted tokens (we need at least one to know where to throw the potion or moldSpores)
        for(let target of targets){ // The for loop will iterate for each target, if more than one token is targeted. Otherwise it will run it only once
        new Sequence()
        .effect()
            .file(dbGas)
            .atLocation(target)
            .belowTokens()
            .opacity(0.5)
            .scale(0.6)
            .scaleIn(0.1, 4700, {ease: "easeOutExpo"})
            .persist() 
			.name('YellowMoldSpores')	
            .thenDo(() => {
				let triggerTag = `Reveal${sourceTag}`;
				let tile= Tagger.getByTag(triggerTag);
				//tile[0].trigger({});
                // Replace Test Tag with the Tag you're using.
                // Only triggers the oldest tile with this particular Tag
                tile[0].trigger({tokens:[canvas.tokens.controlled[0].document], method: 'trigger'})
			})			
        .play();
        
        let delay = Sequencer.Helpers.random_int_between(600, 1000) // neat little helper from Sequencer giving us a whole number between two values
        await Sequencer.Helpers.wait(delay) // another helper that allows us to delay the time between each loop (when we have more than one target)
        
        }
    }
await moldSpores('jb2a.fog_cloud.02.green02');

/*

jb2a.smoke.puff.side.green.4
jb2a.smoke.plumes.01.dark_green.0
jb2a.smoke.puff.side.dark_green.2
jb2a.toll_the_dead.green.skull_smoke
jb2a.fog_cloud.02.green02
jb2a.fog_cloud.02.green02
*/

//FogCloud_02_Regular_Green     jb2a.fog_cloud.02.green02
//Sequencer.EffectManager.endEffects({name: 'PoisonCloud'})
//jb2a.fireball.loop_debris.orange
// jb2a.fog_cloud.2.green  jb2a.fog_cloud.02.green02
//jb2a.breath_weapons.poison.cone.green

