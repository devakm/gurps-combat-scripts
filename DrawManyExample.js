const nr=10
let sixes=0
let ones=0

const table = game.tables.getName('DataCritHit'); // or await fromUuid("table uuid here")

for (i=0;i<nr;i++){
let r=await new Roll("1d6").evaluate()
if (r.total===1) ones++;
if (r.total===6) sixes++;
}

if (sixes>0) await table.drawMany(sixes)

if(ones===1){
await ChatMessage.create({content:"your text here"})
}else if(ones===2){
await ChatMessage.create({content:"your text here"})
}else if(ones===3){
await ChatMessage.create({content:"your text here"})
}else if(ones>=4){
await ChatMessage.create({content:"your text here"})
}