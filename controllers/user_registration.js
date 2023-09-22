import express from "express";
import {User} from "../models/user.js";
import bcrypt from "bcrypt";
import twilio from 'twilio';

const twilioAccountSid = process.env.SID;
const twilioAuthToken = process.env.TOKEN;
const MessagingServiceSid = process.env.MSID;


const client = new twilio(twilioAccountSid, twilioAuthToken);

export const register = async(req,res)=>{
  
    try {
         //get user data in body
        const { username, password, mobilenumber } = req.body;

        //acccess the user
        let user = await User.findOne({mobilenumber})

        //check if user exists already  
        if(user)
          return res.status(404).json({
          success : false,
          message : "This User Already exits!",   
        });
    
        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Hash the OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // new user? then hash the password
        const hashedpassword = await bcrypt.hash(password,10);
    
        // Create a new user
        const newUser = new User({
          username,
          password:hashedpassword, // Hash this password
          mobilenumber,
          otp: hashedOtp,
        });

        // Save the user to MongoDB
        await newUser.save();

        // Send OTP via Twilio
        const v = await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: MessagingServiceSid,
        to: mobilenumber,
       });

        console.log(`${v.body}`);

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
    

};


export const verifyotp = async(req,res)=>{

    try {
        const { mobilenumber, otp } = req.body;
    
        const user = await User.findOne({ mobilenumber });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const isOtpValid = await bcrypt.compare(otp, user.otp);
    
        if (isOtpValid) {
          // OTP is valid, you can perform further actions here
          res.status(200).json({ message: 'OTP verified successfully' });
        } else {
          res.status(400).json({ error: 'Invalid OTP' });
        }
      } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({ error: 'OTP verification failed' });
      }

}