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

export default router;
