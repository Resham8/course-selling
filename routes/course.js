const { Router } = require("express");
const courseRouter = Router();

app.get("/courses", function(req, res){
    res.json({
        msg:"course"
    })
})

module.exports = {
    courseRouter : courseRouter
}