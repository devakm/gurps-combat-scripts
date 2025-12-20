skill= Thaumatology
ra = 15

async function quickContest() {
    const original = GURPS.LastActor
    if (!original) {
            ui.notifications.warn('No actor selected!')
            return
        }
    let roll = '[sk:'+skill+'=12]'
    await GURPS.executeOTF(roll)
    const margin = GURPS.lastTargetedRoll.margin
    let contest = '[/ra '+ra+']'
    console.log(contest);
    await GURPS.executeOTF(contest)
    const thisMargin = GURPS.lastTargetedRoll.margin
    if (thisMargin >= margin) {
            console.log('Merchant Wins')
        } else {
            console.log('Negotiator Wins')
        }
}
quickContest() 
