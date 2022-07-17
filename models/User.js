const mongoose =  require("mongoose");
const UserSchema = new mongoose.Schema({
    fullname: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: Number, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        default:"customer",
    },
    date:{
        type: Date,
        default: Date.now(),
    },
})

const User = mongoose.model("User", UserSchema);
module.exports = User;