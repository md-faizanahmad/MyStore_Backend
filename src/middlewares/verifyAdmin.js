import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
