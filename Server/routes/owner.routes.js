import express from "express";
import {
    deleteRegisteredCar,
    getAllCarsRegistered,
    getOwnerInfo,
    ownerLogin,
    ownerRegistration,
} from "../controllers/owner.controller.js";
import {
  isOwner,
  isOwnerAuthenticated,
} from "../middlewares/owner.middleware.js";
import { generateShortDescription } from "../controllers/ai.controller.js";

const router = express.Router();

// owner register owner
router.post("/owner-register", ownerRegistration);

// owner login
router.post("/owner-login", ownerLogin);

// get owner info
router.get("/get-info", isOwnerAuthenticated, isOwner, getOwnerInfo);

// get all cars registered by owner
router.get("/owner-cars", isOwnerAuthenticated, isOwner, getAllCarsRegistered);

// delete car registered by owner
router.delete("/delete-car", isOwnerAuthenticated, isOwner, deleteRegisteredCar);

// generate description for car with AI
router.post("/generate", isOwnerAuthenticated, isOwner, generateShortDescription);

export default router;
