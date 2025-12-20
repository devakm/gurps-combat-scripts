await game.scenes.updateAll({
    //...
  })
  
  // play sound in a loop
  const pathSound1 = "path/to/sound1.wav";
  const pathSound2 = "path/to/sound2.wav";
  
  const soundIds = this.getFlag("world", "soundIds");
  
  if (!soundIds) {
    const sound1 = await foundry.audio.AudioHelper.play(
      { src: pathSound1, autoplay: true, volume: 0.8, loop: true },
      true
    );
    const sound2 = await foundry.audio.AudioHelper.play(
      { src: pathSound2, autoplay: true, volume: 0.8, loop: true },
      true
    );
    await this.setFlag("world", "soundIds", [sound1.id, sound2.id]);
  } else {
    await game.audio.playing.get(soundIds[0]).stop();
    await game.audio.playing.get(soundIds[1]).stop();
    await this.unsetFlag("world", "soundIds");
  }
  //end
  
  
  
  
  ChatMessage.create({
    content: "Your stress level has changed from Stress-Free to Normal.",
    whisper: game.users.players.filter(u => token.actor.testUserPermission(u, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))
  });

  ChatMessage.create({
    content: "Your stress level has changed from Stress-Free to Normal.",
    whisper: Object.keys(token.actor.ownership).filter(e=> e !== "default" && token.actor.ownership[e] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)
});

ChatMessage.create({
    content: "Your stress level has changed from Stress-Free to Normal.",
    whisper: game.users.filter(u => token.testUserPermission(u, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))
  });


  // remove all conditions on a token
  await token.actor.deleteEmbeddedDocuments("ActiveEffect", CONFIG.statusEffects.filter(e => token.actor.statuses.has(e.id)).map(e => e._id));


  await token.document.update({
    light:{
      color: "#ff0000",
      dim: 40,
      bright: 20
      animation: {
        type: "flame",
        intensity: 2,
        speed: 2
      }
    }
  });


  const DialogV2 = foundry.applications.api.DialogV2;

  const roll = new foundry.data.fields.NumberField({ integer: true }).toFormGroup(
    { label: "Roll" },
    { name: "roll", value: 2 }
  );
  const keep = new foundry.data.fields.NumberField({ integer: true }).toFormGroup(
    { label: "Keep" },
    { name: "keep", value: 1 }
  );
  const content = `
  ${roll.outerHTML}
  ${keep.outerHTML}
  `;
  
  DialogV2.prompt({
    content,
    ok: {
      callback: (_e, btn) => {
        const data = new FormDataExtended(btn.form).object;
        const die = "1d10x";
        const inner = Array(data.roll).fill(die).join(",");
        const formula = `{${inner}}kh${data.keep}`;
        const roll = new foundry.dice.Roll(formula);
        roll.toMessage();
      },
    },
  });

    const content = `<form><file-picker name="test"></form>`;
  Dialog.prompt({
    title: "Image picker",
    content: `<form>
        <div class="form-group">
          <label>Filename:</label>
          <div class="form-fields">
            <file-picker name="imagePath" type="image"></file-picker>
          </div>
        </div>
      </form>`,
  });

const data = await foundry.applications.api.DialogV2.prompt({
  content,
  ok: {
    callback: (_event,button)=> new FormDataExtended(button.form).object.test
  }
});
console.log(data)


const content = `<form><file-picker name="test"></form>`;

const data = await Dialog.prompt({
  content,
  callback: ([html])=> new FormDataExtended(html.querySelector("form")).object.test
});
console.log(data)
