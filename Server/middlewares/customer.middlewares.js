import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export const isCustomerAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided or bad format",
        success: false,
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach customer data
    req.customer = decoded;

    next();
  } catch (error) {;
    res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export const isCustomer = (req, res, next) => {
  if (req.customer?.role !== "customer") {
    return res.status(403).json({
      message: "Access denied. Customers only.",
      success: false,
    });
  }
  next();
};
