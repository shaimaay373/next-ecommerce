import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['customer','seller','admin'],
        default:'customer'
    },
    address:{
        street: String,
        city: String,
        country: String,
    },
    avatar: {
    type: String,
    default: null
},
    paymentDetails:{
        cardLastFour: String,
        cardBrand: String,
    },
    isActive:{
        type:Boolean,
        default:true  
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
}]
},{timestamps:true});
UserSchema.methods.comparePassword =async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}
export default mongoose.model('User',UserSchema);







