const { Router } = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { userModel, purchaseModel, courseModel } = require("../database/db");
const { userMiddleware } = require("../middlewares/user");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_USER_SECRET;

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A- Za-z\d!@#$%&*-]{8,}$/)
  firstName: z.string().min(3).max(10),
  lastName: z.string().min(3).max(10),
});

userRouter.post("/signup", async function (req, res) {
  const validateData = userSchema.safeParse(req.body);

  try {
    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 3);

    await userModel.create({
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

userRouter.post("/signin", async function (req, res) {
  const validateData = userSchema.safeParse(req.body);

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
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

userRouter.get("/purchases", userMiddleware,async function (req, res) {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId:userId
  })  

  const courses = await courseModel.find({
    _id: {$in: purchases.map(x => x.courseId)}
  })

  res.json({
    purchases,
    courses
  })
});

module.exports = {
  userRouter: userRouter,
};

// test the purchases , preview, get purchases endpoints