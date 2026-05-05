import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// routes for user register
const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const confirmPassword = String(req.body.confirmPassword || "");

    // checking user already exists or not
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({
        success: false,
        message: "user already exists",
      });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please enter a valid email",
      });
    }

    if (!name) {
      return res.json({
        success: false,
        message: "please enter your name",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter a strong password",
      });
    }

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "password and confirm password do not match",
      });
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// routes for user login
const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "user does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// route for checking logged-in user
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("name email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// routes for admin login
const adminLogin = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();
    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || "").trim();

    if (!adminEmail || !adminPassword) {
      return res.json({
        success: false,
        message: "Admin credentials are not configured",
      });
    }

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { registerUser, loginUser, getUserProfile, adminLogin };
