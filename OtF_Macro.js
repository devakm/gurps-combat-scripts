// DK Greatsword Slash 

let OtF = '["DK Greatsword Slash"/if [A:Vam*Swing] {!/anim Greatsword*Fire*Regular_Green *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.6 \\/r [D:Vam*Swing] \\/r [1d tox] \\/hp +10}] '; 
console.log(OtF);
GURPS.executeOTF(OtF);




// Mighty DK Greatsword Slash 

let OtF = '["Mighty DK Greatsword Slash"/if [A:Vam*Swing] {!/anim Greatsword*Fire*Regular_Green *0.3 -0.2 +1 \\\\!/wait 1500 \\\\!/anim Flames_01_Regular_Green c *0.6 \\/r [D:Vam*Swing] \\/r [1d+2 tox] \\/hp +10 \\/fp -1}]'; 
console.log(OtF);
GURPS.executeOTF(OtF);
