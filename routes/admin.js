const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../database/db");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { adminMiddleware } = require("../middlewares/admin");

const JWT_SECRET = process.env.JWT_ADMIN_SECRET;

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A- Za-z\d!@#$%&*-]{8,}$/)
  firstName: z.string().min(3).max(10),
  lastName: z.string().min(3).max(10),
});

adminRouter.post("/signup", async function (req, res) {
  const validateData = adminSchema.safeParse(req.body);

  try {
    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 3);

    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (error) {
    console.log(error);
  }

  res.json({
    msg: "Signed-Up successful",
  });
});

adminRouter.post("/signin", async function (req, res) {
  const validateData = adminSchema.safeParse(req.body);

  const { email, password } = req.body;

  try {
    const user = await adminModel.findOne({
      email: email,
    });

    const matchPassword = await bcrypt.compare(password, user.password);

    if (user && matchPassword) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        JWT_SECRET
      );

      // do cookie logic

      res.status(200).json({
        token: token,
      });
    } else {
      res.status(403).json({
        msg: "Incorrect credentials",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

  try {
    const course = await courseModel.create({
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
      creatorId: adminId,
    });

    res.status(200).json({
      message: "Course is created",
      courseId: course._id,
    });
  } catch (error) {
    console.log(error);
  }
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;
  const { title, description, imageUrl, price, courseId } = req.body;

  try {
    const findCourse = await courseModel.findOne({
      _id: courseId,
      creatorId: adminId,
    });

    if(!findCourse){
      return res.status(404).json({
        message:"Course not found"
      })
    }

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId,
      },
      {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      });

    res.status(200).json({
      message: "Course is updated"
    });

  } catch (error) {
    console.log(error);
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.userId;
  const courses = await courseModel.find({creatorId:adminId});

  if(courses){
    res.status(200).json({
      courses:courses
    })
  }
});

module.exports = {
  adminRouter: adminRouter,
};
