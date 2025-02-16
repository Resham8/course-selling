const {Router} = require("express");
const adminRouter = Router();

adminRouter.post("/signup", function(req, res){
    res.json({
        msg:"signup endpoint"
    })
})

adminRouter.post("/signin", function(req, res){
    res.json({
        msg:"signin endpoint"
    })
})

adminRouter.post("/course", function(req, res){
    res.json({
        msg:"add course endpoint"
    })
})

adminRouter.put("/course", function(req, res){
    res.json({
        msg:"update course endpoint"
    })
})

adminRouter.get("/course/bluk", function(req, res){
    res.json({
        msg:"get all the courses endpoint"
    })
})


module.exports = {
    adminRouter : adminRouter
}