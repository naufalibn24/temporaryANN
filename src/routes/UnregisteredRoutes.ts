import Router from "express";
import UnregisteredController from "../controllers/UnregisteredController";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

const router = Router();

router.post(
  "/submit/:id",
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
  "/createGroup/:id",
  authorization.user,
  UnregisteredController.createGroup
);

router.delete(
  "/demolishGroup/:id",
  authorization.user,
  UnregisteredController.demolishGroup
);

router.put(
  "/groupRecruit/:id",
  authorization.user,
  UnregisteredController.groupRecruit
);

router.put(
  "/groupKick/:id",
  authorization.user,
  UnregisteredController.groupKick
);

export default router;
