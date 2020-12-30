import Router from "express";
import UnregisteredUserTodo from "../controllers/UnregisteredController";
import authorization from "../middlewares/authorization";
import CommitteeController from "../controllers/CommitteeController";
import authentication from "../middlewares/authentication";
import upload from "../helper/multer";
const router = Router();

router.post(
  "/createRules/:id",
  authorization.comittee,
  CommitteeController.createRules
);

router.post(
  "/createGame",
  authorization.comittee,
  upload.single("tournamentPict"),
  CommitteeController.createTournament
);

router.put(
  "/approve",
  authorization.comittee,
  CommitteeController.approveSubmission
);

router.put(
  "/approveGroup",
  authorization.comittee,
  CommitteeController.approveGroup
);

router.put(
  "/kickParticipant",
  authorization.comittee,
  CommitteeController.kickParticipant
);

router.put("/kickGroup", authorization.comittee, CommitteeController.kickGroup);

router.post(
  "/createRules",
  authorization.comittee,
  CommitteeController.createRules
);

router.get(
  "/seeList",
  authorization.comittee,
  CommitteeController.seeParticipantList
);

router.put("/startFreeForAll");

router.put("/putScore", authorization.comittee, CommitteeController.putScore);

router.put(
  "/proceedTournament",
  authorization.comittee,
  CommitteeController.proceedTournament
);

export default router;
