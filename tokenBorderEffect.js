const effects = Sequencer.EffectManager.getEffects({ name: "*bordinha*", object: token });
      if (effects.length) {
            Sequencer.EffectManager.endEffects({ name: "*bordinha*", object: token });
} else {
    new Sequence()
        .effect()
        .file("circle.webm")
        .attachTo(token)
        .scale(0.39)
        .atLocation(token)
        .persist()
        .name("bordinha")
        .belowTokens()
        .play()
}