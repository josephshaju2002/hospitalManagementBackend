const medicines = require("../model/medicineModel");
const users = require("../model/userModel");
const jwt = require("jsonwebtoken");

// register
exports.registerController = async (req,res) => {
    console.log("Inside register Controller");

    const {username,password,email} = req.body
    console.log(username,password,email);

    // res.status(200).send("Register request received")
    // logic
    try {
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(404).json("User Already Exists...Please Login!!!")
        }else{
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
}

// login
exports.loginController = async (req, res) => {
  console.log("inside login controller");
  const { password, email } = req.body;
  console.log(password, email);

  // logic
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      if (existingUser.password == password) {
        const token = jwt.sign(
          { userMail: existingUser.email, role: existingUser.role },
          process.env.JWTSecretKey
        );
        res.status(200).json({ existingUser,token });
      } else {
        res.status(401).json("Invalid Credentials");
      }
    } else {
      res.status(404).json("User Not Found... Please Register!!!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// get home medicines

exports.getFeaturedMedicinesController = async (req, res) => {
  try {
    const medicinesList = await medicines.find().sort({ createdAt: -1 }).limit(6);

    res.status(200).json(medicinesList);
  } catch (error) {
    res.status(500).json(error);
  }
};
