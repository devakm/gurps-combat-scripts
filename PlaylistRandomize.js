// Playlist setup: no sounds are on repeat, and the playlist is set to Soundboard Only.
// Important constants for later use 
const MACRO_CONSTS = {
  MACRO: this,
  PLAYLIST: fromUuidSync("Playlist.i06SwMsmN4qMKySb"), // change this UUID string for your purposes.
  DELAY: 10000 // delay in ms (10000 = 10seconds)
};

// use SHIFT + CLICK to stop the loop. Current sound will end when it is done.
if(event.shiftKey) {
  ui.notifications.info("Playback will stop after this song is ended.");
  await MACRO_CONSTS.MACRO.update({img: "icons/svg/sound-off.svg"})
  return await MACRO_CONSTS.MACRO.setFlag("world","stopLoop", true);
}

async function randomPlay(sounds){
  if(MACRO_CONSTS.MACRO.getFlag("world", "stopLoop")) return;
  const randomSound = rndSound(sounds);
  await new Promise(r=>setTimeout(r, Math.random() * MACRO_CONSTS.DELAY));
  await MACRO_CONSTS.PLAYLIST.playSound(randomSound);
  const playing = MACRO_CONSTS.PLAYLIST.sounds.find(s=>s.playing);
  playing.sound.addEventListener("end", () => randomPlay(sounds), {once: true});
}

function rndSound(sounds){
  return sounds[Math.floor(Math.random()*sounds.length)];
}

if(MACRO_CONSTS.PLAYLIST.playing) return ui.notifications.warn("Don't normal click while a sound is already playing!");
await MACRO_CONSTS.MACRO.unsetFlag("world","stopLoop");
await MACRO_CONSTS.MACRO.update({img: "icons/svg/sound.svg"});
await randomPlay(MACRO_CONSTS.PLAYLIST.sounds.contents);