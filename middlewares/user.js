const jwt = require("jsonwebtoken");
require("dotenv").config()

function userMiddleware(req, res, next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token, process.env.JWT_USER_SECRET) 

    if(decodedData){
        req.userId = decodedData.id;
        next();
    } else {
        res.status(403).json({
            message: "You are not signed in"
        })
    }
} 

module.exports = {
    userMiddleware : userMiddleware
}