const managerType = "Macros Folder";

(() => {
  const macros = [
    "Slam",
    "Lightning",
    "Fireball",
    "ExplosiveLightning",
    "ExplosiveFireball",
    "MajorHealing",
    "Slam",
    "KnockBack"
  ];

  let buttons = {},
    dialog,
    content = `<div sytle="display:flex;text-align:center;><h2>Choose Macro</h2></div>`;


  macros.forEach((str) => {
    let macro = game.macros.getName(str);
    if (!macro) return;

    buttons[str] = {
      label: `
       
<style>
#GURPScs .window-content {
    background-image: url('systems/gurps/icons/hex2.webp');
        background-color: #353434;
        display: inline-block;
          width: 100%;


  }

  

  #GURPScs header {
    font-family: Roboto;
    background-color: #353434;
    border-radius: 0;
    border: none;
    margin-bottom: 2px;
    font-size: .75rem;
  }

#GURPScs .dialog-button {
  border: 1px solid #18181a;
  color: #18181a;
  font-size: 15px;
  line-height: 15px;
  padding: 5px 5px 5px;
  width: 100%;
  height: 100%;
  cursor: cell;
  background: #807f7f;
  border-radius: 18px;
  margin-bottom: 2px;
      }

    #GURPScs .dialog-button:hover {
  background-color: #353434; /* Green */
  color: white;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    }

      </style> 
         <div style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
          
        <div style="display:flex;justify-content:left;flex-grow:1;">
        <img src="${macro.data.img}" width="50" height="50" style="background-color:#5c5c5c;;border-radius: 10px;margin: 3px 3px 3px;"/></div>
          <source src="/sounds/pop.mp3" type="audio/mpeg">

        <div style="display:flex;justify-content:left;flex-grow:1"><label>${str}</label></div>
        </div>
        
        
        
        
        
        
        
        
        
        
        
        `,
      callback: () => {
        game.macros.getName(str).execute();
        dialog.render(true);
      },
    };
  });
  dialog = new Dialog(
    { title: `${managerType}`, content, buttons },
    { id: "GURPScs" }
  ).render(true);
})();