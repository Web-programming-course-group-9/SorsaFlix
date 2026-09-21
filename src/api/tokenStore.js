//This gives other files access to these two functions and can be used to add token into requests or setting the token after refresh

let accessToken = null

//Sets the token into the variable
export function setAccessToken(token){
    accessToken = token
}

//returns the accessToken with this function
export function getAccessToken() {
    return accessToken
}