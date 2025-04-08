import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // ✅ Get token from headers
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    console.log(token);
    // ✅ Verify Token
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with actual secret key
    req.userId = decoded.id; // ✅ Attach user ID to request
    // console.log(decoded);
    // ✅ Check if user exists
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    next(); // ✅ Proceed to next middleware/controller
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

export default authenticateUser;
