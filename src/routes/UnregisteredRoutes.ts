import Router from "express";
import UnregisteredController from "../controllers/UnregisteredController";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

const router = Router();

router.post(
  "/submit",
  authorization.user,
  UnregisteredController.SubmitTournament,
  UnregisteredController.sendSubmission
);

router.post(
  "/submitGroup/:id",
  authorization.user,
  UnregisteredController.SubmitTournamentAsGroup,
  UnregisteredController.sendSubmission
);

router.get(
  "/inboxNotifications/:id",
  authorization.user,
  UnregisteredController.notifications
);

router.get("/inbox/:id", authorization.user, UnregisteredController.SeeInbox);

router.post(
  "/createGroup",
  authorization.user,
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
