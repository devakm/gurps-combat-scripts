const macro = await Macro.create({
    name: "the name of macro here",
    type: CONST.MACRO_TYPES.SCRIPT, //or CONST.MACRO_TYPES.CHAT
    img: "path/to/img.png",
    command: "command here"
  });
  game.user.assignHotbarMacro(macro, numberOfSlotHere);