import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : "";
    const token = bearerToken || req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid login token",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again",
    });
  }
};

export default authUser;
