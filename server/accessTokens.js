export const accessTokens = {};
export const tokenLength = 24;
export const usernamePattern = /^[a-zA-Z][A-Za-z0-9_-]{4,24}$/;
export const passwordPattern = /^\S.{4,48}\S$/;
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export function generateToken(username) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate() + 7);

    let id = "";
    for(var i=0; i<tokenLength; i++){
        id += chars.charAt(Math.floor(Math.random()*chars.length));
    }

    let newToken = {"id": id, "expiryDate": expiryDate};

    accessTokens[username] = newToken;
    console.log("Created new access token for " + username + ".");
    return(newToken);
}

export function deleteToken(username) {
    accessTokens.delete(username);
}

export function validateToken(username, suppliedToken) {

    if( accessTokens[username] 
        && accessTokens[username].id == suppliedToken
        && accessTokens[username].expiryDate > new Date()
    ){
        return true;
    }
    return false;
}
