import express from "express";
import {
  isOwner,
  isOwnerAuthenticated,
} from "../middlewares/owner.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  changeCarAvaliablity,
  newCarRegister,
} from "../controllers/car.controller.js";

const router = express.Router();

// register new car
router.post(
  "/register",
  isOwnerAuthenticated,
  isOwner,
  upload.single("image"),
  newCarRegister
);

// update car avaliablity
router.patch("/update", isOwnerAuthenticated, isOwner, changeCarAvaliablity);

export default router;
