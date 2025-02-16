const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
console.log("connected to")
mongoose.connect(mongoUri)

const userSchema = new Schema({
    email:{type:String, unique: true},
    password:{type:String},
    firstName: String,
    lastName: String
});

const adminSchema = new Schema({
    email:{type:String, unique: true},
    password:{type:String},
    firstName: String,
    lastName: String
});

const courseSchema = new Schema({
    title: String,
    description:String,
    price: Number,
    imageUrl: String,
    creatorId: {type:ObjectId, ref:"admin"}
});

const purchaseSchema = new Schema({
    userId : {type:ObjectId, ref:'user'},
    courseId : {type:ObjectId, ref:'course'}
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.export = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}