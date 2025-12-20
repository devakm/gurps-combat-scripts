// Create a dialog to prompt the user for the dice roll
new Dialog({
  title: "Roll Dice",
  content: `
    <form>
      <div class="form-group">
        <label for="dice">Enter Dice Roll (e.g., 1d20+5):</label>
        <input type="text" id="dice" name="dice" value="1d20">
      </div>
    </form>
  `,
  buttons: {
    roll: {
      icon: "<i class='fas fa-dice'></i>",
      label: "Roll",
      callback: (html) => {
        // Get the user input
        let diceRoll = html.find('[name="dice"]').val();
        
        // Roll the dice
        let roll = new Roll(diceRoll).roll();
        
        // Send the result to chat
        roll.toMessage({
          speaker: ChatMessage.getSpeaker(),
          flavor: `Rolling ${diceRoll}`
        });
      }
    },
    cancel: {
      icon: "<i class='fas fa-times'></i>",
      label: "Cancel"
    }
  },
  default: "roll"
}).render(true);
