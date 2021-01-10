import Router from "express";
import UserController from "../controllers/UserController";
import authorization from "../middlewares/authorization";

const router = Router();

router.get("/halloffame", UserController.seeHallOfFame);
router.get("/getFFA", UserController.getFFA);
router.get("/getBranches", UserController.getBranches);

export default router;
