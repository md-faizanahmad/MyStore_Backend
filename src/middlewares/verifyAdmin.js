// import jwt from "jsonwebtoken";

// export const verifyAdmin = (req, res, next) => {
//   try {
//     const token = req.cookies?.token;
//     if (!token)
//       return res.status(401).json({ success: false, message: "No token" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.adminId = decoded.id;
//     next();
//   } catch (err) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid or expired token" });
//   }
// };
////////////////new

import jwt from "jsonwebtoken";

export function verifyAdminCookie(req, res, next) {
  const tokenCookie = req.cookies?.token;
  if (!tokenCookie) {
    return res.status(401).json({ success: false, message: "No token" });
  }
  try {
    const decoded = jwt.verify(tokenCookie, process.env.JWT_SECRET);
    // you can add role checks later if you add roles
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
