async function fastDrawAndShoot() {
    // Save the current list of modifiers.
    let modifiers = GURPS.ModifierBucket.modifierStack.modifierList
   
    // Clear the Modifier Bucket.
    GURPS.ModifierBucket.clear()
   
    // Check for ammo and reduce ammo if available
    await GURPS.executeOTF(`/if [/tr(Arrows) -1] You have enough ammo`)
    
    // Execute the ready bow portion and give the user feedback.
    GURPS.ModifierBucket.addModifier(-1, "to ready and fire in same turn")
    await GURPS.executeOTF(`[S:Bow ? "You rapidly ready your bow!", "You fumble with the bow for a second."]`)
   
    // Get success or failure of the ready Bow roll.
    let roll = GURPS.lastTargetedRolls[GURPS.LastActor.id]
   
    if (!roll.failure) {
     // Execute the fast-draw portion and give the user feedback.
     await GURPS.executeOTF(`[S:Fast*Draw*Arrow ? "You quickly draw an arrow and shoot!", "You fumble with the arrow for a second."]`)
   
     // Get success or failure of the Fast-Draw roll.
     let roll = GURPS.lastTargetedRolls[GURPS.LastActor.id]
   
     // If Fast-Draw roll is successful:
     if (!roll.failure) {
          
      // Restore the list of modifiers to the Modifier Bucket.
      for (let mod of modifiers) {
        GURPS.ModifierBucket.addModifier(mod.modint, mod.desc)
      }
   
      // Add the -3 modifier for firing in the same turn as all the other rolls.
      GURPS.ModifierBucket.addModifier(-1, 'to ready and fire in same turn')
   
      // Roll the attack.
      await GURPS.executeOTF(`[A:Composite Bow]`)
     }
    }
   }
   
   fastDrawAndShoot()
   
      // Clear the Modifier Bucket again to finish
      GURPS.ModifierBucket.clear()
   