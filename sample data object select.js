// simple data objects
exam = [
{'name': 'sanim', 'anim': 'success'},
{'name': 'csanim', 'anim': 'critHit'},
{'name': 'fanim', 'anim': 'fail'},
{'name': 'cfanim', 'anim': 'critFail'}
];

tox = [
{'name': 'sanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3'},
{'name': 'csanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.5'},
{'name': 'fanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.3 -0.2 +0'},
{'name': 'cfanim', 'anim': '!/anim Arrow*Regular_Green_Cold *0.6 -0.2 +1 \\\\!/wait 1500 \\\\!/anim IconPoison_01_Dark_Green c *0.3 @self'}
];

function getAnim(animData, animName) {
	let anim = animData.find(x => x.name == animName).anim;
	return anim;
}
let sanim = getAnim(tox, 'sanim');
let csanim = getAnim(tox, 'csanim');
let csanim = getAnim(tox, 'csanim');
let csanim = getAnim(tox, 'csanim');