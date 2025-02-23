const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const cors = require("cors");
// const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json())

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main() {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri)
    app.listen(3000);    
}

main()