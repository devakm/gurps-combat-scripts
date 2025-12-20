const options = game.tables.reduce((acc, e) => acc += `<option value="${e.id}">${e.name}</option>`,``);
const content = `<form> 
    <div class="form-group"> 
        <label>Table</label> 
        <select name="table-name">${options}</select> 
    </div> 
    <div class="form-group">
         <label>Rolled:</label> 
        <input name="roll-number" type="number" value="1"> 
    </div>
</form>`;

new Dialog({ 
    title: "Table Result", 
    content, 
    buttons: { 
        getresult: { 
            label: "Get Result", 
            callback: async (html) => { 
                const table = game.tables.get(html.find("[name=table-name]")[0].value); 
                const roll = new Roll(html.find("[name=roll-number]")[0].value); 
                const result = await table.draw({roll}); 
            } 
        }, 
        cancel: { 
            label: "cancel" 
        } 
    } 
}).render(true);