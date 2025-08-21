import express from "express";
import {
  isCustomer,
  isCustomerAuthenticated,
} from "../middlewares/customer.middlewares.js";
import {
  customerLogin,
  customerRegistration,
  getCustomerInfo,
} from "../controllers/customer.controller.js";

// intilaize the router
const router = express.Router();

// new customer registration
router.post("/register", customerRegistration);

// customer login
router.post("/login", customerLogin);

// get customer info
router.get("/get", isCustomerAuthenticated, isCustomer, getCustomerInfo);

export default router;
