import express from "express";
import {
  isCustomer,
  isCustomerAuthenticated,
} from "../middlewares/customer.middlewares.js";
import {
  getBookingsForCustomer,
  getBookingsForOwner,
  rentAnyCar,
  verifyOnlinePayment,
} from "../controllers/rental.controller.js";
import {
  isOwnerAuthenticated,
  isOwner,
} from "../middlewares/owner.middleware.js";

const router = express.Router();

// route for renting a car
router.post("/rent-car", isCustomerAuthenticated, isCustomer, rentAnyCar);

// verify the payment done online
router.post(
  "/verify-payment",
  isCustomerAuthenticated,
  isCustomer,
  verifyOnlinePayment
);

// get bookings for owner
router.get(
  "/owner-booking",
  isOwnerAuthenticated,
  isOwner,
  getBookingsForOwner
);

// get bookings for customer
router.get(
  "/get-booking",
  isCustomerAuthenticated,
  isCustomer,
  getBookingsForCustomer
);

export default router;
