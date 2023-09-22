import mongoose from "mongoose";

const Schema = new mongoose.Schema({

    username:{
    type : String,
    require : true,
    unique : true,
    },

    password:{
        type : String,
        require : true,
        select: false,
    },

    mobilenumber:{
    type : Number,
    require : true,
    },

    otp:{
        type : String,
        },

},{
    timestamps : true,
})

export const User = mongoose.model("User", Schema);