import Router from "express";
import UnregisteredUserTodo from "../controllers/UnregisteredController";
import authorization from "../middlewares/authorization";
import CommitteeController from "../controllers/CommitteeController";
import authentication from "../middlewares/authentication";
const router = Router();

router.post(
  "/createRules/:id",
  authorization.comittee,
  CommitteeController.createRules
);

router.post(
  "/createGame",
  authorization.comittee,
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

router.put(
  "/kickGroup",
  authorization.comittee,
  CommitteeController.approveGroup
);

router.put(
  "/kickParticipant/:id",
  authorization.comittee,
  CommitteeController.kickParticipant
);

router.put(
  "/kickGroup/:id",
  authorization.comittee,
  CommitteeController.kickGroup
);

router.put(
  "/kickGroup/:id",
  authorization.comittee,
  CommitteeController.approveGroup
);

router.get(
  "/seeList",
  authorization.comittee,
  CommitteeController.seeParticipantList
);

router.put("/startFreeForAll/:id");

router.put(
  "/putScore/:id",
  authorization.comittee,
  CommitteeController.putScore
);

router.put(
  "/proceedTournament/:id",
  authorization.comittee,
  CommitteeController.proceedTournament
);

export default router;
