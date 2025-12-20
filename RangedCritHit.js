function wait(x) {
	return new Promise((resolve) => {
	  setTimeout(() => {
		resolve(x);
	  }, 2000);
	});
  }
  
  //let RangedAttackName = args == undefined || args.length > 0 ? args[0] : 'Vic*Shoot'; // Attack Name, i.e. [R:Vic*Shoot], Vic*Deathbow*Shoot
  
  let RangedAttackName = 'Vic*Shoot';
  // save the original actor
  let originalActor = GURPS.LastActor;
  let actorName = originalActor.name;
  let rollCrit = await new Roll("3d6", _token.actor.getRollData()).roll()
  
  console.log(`actorName: "${actorName}";`);
  let RangedAttackObj = GURPS.findAttack(_token.actor, RangedAttackName, 0, 1);
  if (RangedAttackObj == undefined) {
	  let errMsg = RangedAttackName+" not found on actor "+actorName;
	  ui.notifications.error(errMsg);
	  console.log(`Error: ${errMsg};`);
  } 
  
  let attackDamageOtF = RangedAttackObj.damage;
  let attackDmgSearchOtF = RangedAttackObj.damage;
  console.log(`attackDamageOtF: ${attackDamageOtF};`);
  let dmgType = attackDamageOtF.split(' ')[1];
  console.log(`Check dmgType: ${dmgType};`);
  //let dmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] > 0 ? Number(attackDamageOtF.split(' ')[0].split('d')[1]) : 0;
  let dmgBonus = attackDamageOtF.split(' ')[0].split('d')[1].split('(')[0];
  console.log(`Check attack dmgBonus: ${dmgBonus};`);
  let dmgDiv = attackDamageOtF.split(' ')[0].split('d')[1].split('(')[1].split(')')[0]; // armor divisor, eg (2)  .replace(/\s+/g, '');
  let dmgDivTxt;
  if (dmgDiv.length > 0) { dmgDivTxt = `(${dmgDiv})`;}
  console.log(`Check attack dmgDiv: ${dmgDiv};`);
  let dmgDice = Number(attackDamageOtF.split(' ')[0].split('d')[0]);
  console.log(`Check attack dmgDice: ${dmgDice};`);
  //if (dmgDice > 2) dmgBonus = dmgBonus+dmgDice; // Slam gets “Size” modifier to each die of damage rolled by both sides.
  //let dmgOtF = `${dmgDice}d${dmgBonus} ${dmgType}`; // *Slam or *Shield*Bash
  //console.log(`Calculated dmgOtF: ${dmgOtF};`)
  let FollowOnDamage = '1d burn';
  let fdmgDice = Number(FollowOnDamage.split(' ')[0].split('d')[0]);
  let fdmgType = FollowOnDamage.split(' ')[1];
  let fdmgBonus = Number(FollowOnDamage.split(' ')[0].split('d')[1].split('+')[1]) > -5 ? Number(FollowOnDamage.split(' ')[0].split('d')[1].split('+')[1]) : 0;
  
  let originalModifiers = GURPS.ModifierBucket.modifierStack.modifierList;
  let ltrData = GURPS.lastTargetedRolls[originalActor.id];
  let ltrMargin = ltrData.margin;
  let ltrMarginTxt = ltrMargin > 0 ? '-'+ltrMargin : '' ;
  let critMulti,critBonus;
  if (ltrData.isCritSuccess == true) {
	  game.dice3d.showForRoll(rollCrit); 
	  let rollMsg = `Actor rolled a CritHit: ${_token.actor.name} rolled ${rollCrit._formula} and got a ${rollCrit._total} !!!`;
	  console.log(rollMsg);
	  let critTable = game.tables.getName('DataCritHit')
	  let critResults = critTable.getResultsForRoll(rollCrit._total > 1 ? rollCrit._total : 11);
	  console.log(`result: ${critResults[0].data.text}`);
	  const critResultsA = critResults[0].data.text.split('|');
	  critMulti = Number(critResultsA[0]);
	  critBonus = Number(critResultsA[1]);
	  console.log(`mult: ${critMulti}; bonus: ${critBonus};`);
	  let critMsgTable = game.tables.getName('CritHit')
	  let critMsgResults = critMsgTable.getResultsForRoll(rollCrit._total > 1 ? rollCrit._total : 11);
	  critMsgTable.toMessage(critMsgResults);
  
	  let maxDamage = 6*Number(dmgDice);
	  let maxFonDmg = 6*Number(fdmgDice);
  
	  let attackDamageTotal = Number(maxDamage)+Number(dmgBonus)*Number(critMulti)+Number(critBonus);
	  let maxFonDmgTotal = Number(maxFonDmg)+Number(fdmgBonus)*Number(critMulti)+Number(critBonus);
	  let msgTxt = `Base CritHit Max Damage: ${dmgDice}d6+${dmgBonus}	 = ${maxDamage} * Crit Multiplier ${critMulti} = ${maxDamage}+${dmgBonus}*${critMulti}+${critBonus} for a grand total of ${attackDamageTotal} damage! Follow-on damage is [${maxFonDmgTotal} ${fdmgType}]`;
	  console.log(msgTxt);
	  let dmgTotalOtF = `/r [${attackDamageTotal}${dmgDivTxt} ${dmgType}]  \\\\/r [${maxFonDmgTotal} ${fdmgType}]`;
	  GURPS.executeOTF(dmgTotalOtF); 
  };