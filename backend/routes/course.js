const { Router } = require("express");
const courseRouter = Router();
const { courseModel, purchaseModel } = require("../database/db");
const {userMiddleware} = require("../middlewares/user");

courseRouter.post("/purchase", userMiddleware,async function(req, res){
    const userId = req.userId;
    const courseId = req.body.courseId;

    const course = await purchaseModel.findOne({userId:userId, courseId:courseId})

    if(course){
        return res.json({
            message:"Course already bought"
        })
    }

    await purchaseModel.create({
        userId:userId,
        courseId:courseId
    })

    res.json({
        message:"You have successfully bought the course"
    })
})

courseRouter.get("/preview", async function(req, res){
    const courses = await courseModel.find({});

    res.json({        
        courses:courses
    })
})

module.exports = {
    courseRouter : courseRouter
}