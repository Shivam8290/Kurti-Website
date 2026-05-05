import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || "").trim();

    if (token_decode !== adminEmail + adminPassword) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    next();

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default adminAuth;
