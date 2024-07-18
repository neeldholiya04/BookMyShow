const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authMiddleware = require("../middlewares/authMiddleware");
const EmailHelper = require("../utils/emailSender");

const router = express.Router();

const otpGenerator = () => {
  const otp = crypto.randomBytes(3).toString("hex");
  return parseInt(otp, 16).toString().slice(0, 6);
};

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "The user already exists!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPwd = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashPwd;
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "You've successfully signed up, please login now!",
    });
  } catch (err) {
    console.error(err);
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist, please register",
      });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.send({
        success: false,
        message: "Sorry, invalid password entered!",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.secret_key_jwt, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "You've successfully logged in!",
      token,
    });
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("-password");
    res.send({
      success: true,
      message: "You are authorized to go to the protected route!",
      data: user,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.patch("/forgetpassword", async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(401).json({
        status: "failure",
        message: "Please enter the email for forget Password",
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "User not found for this email",
      });
    }
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    await EmailHelper("otp.html", user.email, { name: user.name, otp });
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
});

router.patch("/resetpassword", async (req, res) => {
  try {
    const { otp, password } = req.body;
    if (!otp || !password) {
      return res.status(401).json({
        status: "failure",
        message: "Invalid request",
      });
    }
    const user = await User.findOne({ otp });
    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "User not found",
      });
    }
    if (Date.now() > user.otpExpiry) {
      return res.status(401).json({
        status: "failure",
        message: "OTP expired",
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = bcrypt.hashSync(password, salt);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
});

module.exports = router;
