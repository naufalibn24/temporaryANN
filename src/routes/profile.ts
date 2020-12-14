import Router from "express";
import ProfileController from "../controllers/ProfileController";
import upload from "../helper/multer";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

const router = Router();

<<<<<<< HEAD
router.post("/profile", ProfileController.UserProfile);
=======
router.post("/profile", ProfileController.UserProfile)
>>>>>>> e5282d1898f19581e3891a1238ce9f63290833dc
router.get("/profile/:id", authorization.user, ProfileController.seeProfile);
router.put("/profile/:id", authorization.user, ProfileController.changeProfile);

export default router;
