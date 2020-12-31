import Router from "express";
import UnregisteredController from "../controllers/UnregisteredController";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";
import upload from "../helper/multer";

const router = Router();

router.get("/getUser");

router.post(
  "/submit",
  authorization.user,
  UnregisteredController.SubmitTournament,
  UnregisteredController.sendSubmission
);

router.post(
  "/submitGroup",
  authorization.user,
  UnregisteredController.SubmitTournamentAsGroup,
  UnregisteredController.sendSubmission
);

router.get(
  "/inboxNotifications",
  authorization.user,
  UnregisteredController.notifications
);

router.get("/inbox", authorization.user, UnregisteredController.SeeInbox);

router.get("/group", authorization.user, UnregisteredController.seeGroup);

router.post(
  "/createGroup",
  authorization.user,
  upload.single("groupPict"),
  UnregisteredController.createGroup
);

router.delete(
  "/demolishGroup",
  authorization.user,
  UnregisteredController.demolishGroup
);

router.put(
  "/groupRecruit",
  authorization.user,
  UnregisteredController.groupRecruit
);

router.put("/groupKick", authorization.user, UnregisteredController.groupKick);

export default router;
