import { limiter } from "./../middlewares/limiter";
import Router from "express";
import userController from "../controllers/UserController";
import pagination from "../middlewares/pagination";
import SMTPemail from "../middlewares/nodemailer";
import upload from "../helper/multer";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";
import ExpressBrute from "../middlewares/ratelimiter";
import kakek from "./../middlewares/kakek";

const router = Router();

router.post("/signup", userController.signup, SMTPemail._idActivation);

// router.post("/signin", userController.signin, userController.proceed_signin);
router.post("/signin", userController.signin, limiter);

router.get("/test", kakek, limiter, async (req, res, next) => {
  console.log("sampe akhir");
});

router.post("/confirm", userController.confirmUser);

router.put("/forget", userController.forgotPassword, SMTPemail.forgotPassword);

router.put(
  "/reset",
  userController.forgotPassword,
  userController.resetPassword
);
router.get("/tournaments", userController.seeTournamentList);
router.get("/tournamentopen", userController.tournamentAvailable);
router.get("/tournamentdetail/:id", userController.seeTournamentDetail);

router.get("/jesting", userController.Jesting);

export default router;
