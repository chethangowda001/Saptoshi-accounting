const { validateToken } = require("../services/authentication")

function checkCookie(cookieName){
    return(req, res, next)=>{
        const cookieTokenValue = req.cookie[cookieName]
        if(!cookie){
           return next()
        }
try {
    const userPayload = validateToken(cookieTokenValue);
    req.user = userPayload;
    console.log(req.user);
    return next()
    
} catch (error) {
    return next();
}
    }

}

module.exports = {
    checkCookie,
}