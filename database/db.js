const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)

const userSchema = Schema({
    email:{type:String, unique: true},
    password:{type:String},
    firstName: String,
    lastName: String
});

const adminSchema = Schema({
    email:{type:String, unique: true},
    password:{type:String},
    firstName: String,
    lastName: String
});

const courseSchema = Schema({
    title: String,
    description:String,
    price: Number,
    imageUrl: String,
    creatorId: {type:ObjectId, ref:"admin"}
});

const purchaseSchema = Schema({
    userId : {type:ObjectId, ref:'user'},
    courseId : {type:ObjectId, ref:'course'}
});

const userModel = mongoose.Model("user", userSchema);
const adminModel = mongoose.Model("admin", adminSchema);
const courseModel = mongoose.Model("course", courseSchema);
const purchaseModel = mongoose.Model("purchase", purchaseSchema);

module.export = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}