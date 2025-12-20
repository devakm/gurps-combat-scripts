// TokenRefresh.js
// token deslect then reselect 
let tokenId = _token.id;
let token = canvas.tokens.get(tokenId); // Get the token object
token.release();
token.control();