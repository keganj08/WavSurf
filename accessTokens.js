export const accessTokens = {};
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
const tokenLength = 24;

export function generateToken(username) {
    let newToken = "";

    for(var i=0; i<tokenLength; i++){
        newToken += chars.charAt(Math.floor(Math.random()*chars.length));
    }

    accessTokens[username] = newToken;
    console.log("Created new access token for " + username + ".");
    return(newToken);
}
