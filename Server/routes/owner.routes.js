import express from 'express';
import { getOwnerInfo, ownerLogin, ownerRegistration } from '../controllers/owner.controller.js';
import { isOwner, isOwnerAuthenticated } from '../middlewares/owner.middleware.js';

const router = express.Router();

// owner register owner
router.post("/owner-register", ownerRegistration);

// owner login
router.post("/owner-login", ownerLogin);

// get owner info
router.get("/get-info", isOwnerAuthenticated, isOwner, getOwnerInfo);

export default router;