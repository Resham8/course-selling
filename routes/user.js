const { Router } = require("express");
const userRouter = Router();


app.post("/signup", function(req, res){
    res.json({
        msg:"signup endpoint"
    })
})

app.post("/signin", function(req, res){
    res.json({
        msg:"signin endpoint"
    })
})

app.get("/purchases", function(req, res){
    res.json({
        msg:"all purchases"
    })
})

module.exports = {
    userRouter: userRouter
}