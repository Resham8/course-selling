const { Router } = require("express");
const courseRouter = Router();

courseRouter.get("/purchase", function(req, res){
    res.json({
        msg:"course"
    })
})

courseRouter.get("/preview", function(req, res){
    res.json({
        msg:"preview of courses"
    })
})

module.exports = {
    courseRouter : courseRouter
}