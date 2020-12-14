import Router from "express";
import userController from "../controllers/UserController";
import pagination from "../middlewares/pagination";
import SMTPemail from "../middlewares/nodemailer";
import upload from "../helper/multer";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

const router = Router();

router.post("/signup", userController.signup, SMTPemail._idActivation);

router.post("/signin", userController.signin, userController.proceed_signin);

router.put("/forget", userController.forgotPassword, SMTPemail.forgotPassword);

router.put(
  "/reset",
  userController.forgotPassword,
  userController.resetPassword
);
router.get("/tournaments", userController.seeTournamentList);
<<<<<<< HEAD
router.get("/tournamentopen", userController.tournamentAvailable);
router.get("/tournamentdetail/:id", userController.seeTournamentDetail);
=======
router.get("/tournamentopen", userController.tournamentAvailable)
router.get("/tournamentdetail/:id", userController.seeTournamentDetail)


>>>>>>> e5282d1898f19581e3891a1238ce9f63290833dc
export default router;
