import Router from "express";
import ProfileController from "../controllers/ProfileController";
import upload from "../helper/multer";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

const router = Router();

router.post(
  "/profile",
  authorization.user,
  upload.single("picture"),
  ProfileController.UserProfile
);

router.get("/profile", authorization.user, ProfileController.seeProfile);

router.put(
  "/profile",
  authorization.user,
  upload.single("picture"),
  ProfileController.changeProfile
);

export default router;
