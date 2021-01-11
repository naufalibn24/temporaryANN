import { limiter } from "./../middlewares/limiter";
import Router from "express";
import userController from "../controllers/UserController";
import pagination from "../middlewares/pagination";
import SMTPemail from "../middlewares/nodemailer";
import upload from "../helper/multer";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";
import ExpressBrute from "../middlewares/ratelimiter";

const router = Router();

router.post("/signup", userController.signup, SMTPemail._idActivation);

router.post("/signin", userController.signin);

router.post("/confirm", userController.confirmUser);

router.post("/forget", userController.forgotPassword, SMTPemail.forgotPassword);

router.post(
  "/reset",
  // userController.forgotPassword,
  userController.resetPassword
);
// router.get("/tournaments", userController.seeTournamentList);
router.get("/tournaments", userController.tournamentListPlain);
router.get("/tournamentopen", userController.tournamentAvailable);
router.get("/tournamentdetail/:id", userController.seeTournamentDetail);
router.get("/FFA/:id", userController.seeFFA);
router.get("/Branches/:id", userController.seeBranch);
// router.get("/FFA/:id", userController.seeFFA);

router.post("/tester", upload.single("pic"), userController.tester);
export default router;
