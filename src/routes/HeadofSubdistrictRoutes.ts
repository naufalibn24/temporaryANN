import Router from "express";
import authentication from "../middlewares/authentication";
import HeadChiefController from "../controllers/HeadchiefController";
import authorization from "../middlewares/authorization";

const router = Router();

router.put("/assign", authorization.headchief, HeadChiefController.assign);
router.get(
  "/participantlist/:id",
  authorization.headchief,
  HeadChiefController.seeTournamentParticipantList
);
export default router;
