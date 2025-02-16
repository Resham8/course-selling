const { Router } = require("express");
const userRouter = Router();


userRouter.post("/signup", function(req, res){
    res.json({
        msg:"signup endpoint"
    })
})

userRouter.post("/signin", function(req, res){
    res.json({
        msg:"signin endpoint"
    })
})

userRouter.get("/purchases", function(req, res){
    res.json({
        msg:"all purchases"
    })
})

module.exports = {
    userRouter: userRouter
}