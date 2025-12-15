const medicines = require("../model/medicineModel");
const users = require("../model/userModel");
const jwt = require("jsonwebtoken");
const stripe = require("../config/stripe");

// register
exports.registerController = async (req, res) => {
  console.log("Inside register Controller");

  const { username, password, email } = req.body;
  console.log(username, password, email);

  // res.status(200).send("Register request received")
  // logic
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(404).json("User Already Exists...Please Login!!!");
    } else {
      const newUser = new users({
        username,
        email,
        password,
      });
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

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
        res.status(200).json({ existingUser, token });
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
    const medicinesList = await medicines
      .find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json(medicinesList);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all medicines

exports.getAllMedicinesController = async (req, res) => {
  try {
    const allMedicines = await medicines.find();
    res.status(200).json(allMedicines);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// get one medicine

exports.getSingleMedicineController = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await medicines.findById(id);

    if (!medicine) {
      return res.status(404).json("Medicine not found");
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json(error);
  }
};

// payment stripe
exports.makeCartPaymentController = async (req, res) => {
  try {
    const userId = req.payload;

    const userMail = req.payload;

        const { items } = req.body;


    if (!items || items.length === 0) {
      return res.status(400).json("Cart is empty");
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ✅ Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.imageUrl],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/paymentsuccess`,
      cancel_url: `${process.env.CLIENT_URL}/paymenterror`,
      metadata: {
        userMail,
        totalAmount,
      },
    });

    res.status(200).json({
      checkoutSessionUrl: session.url,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json("Payment session creation failed");
  }
};

