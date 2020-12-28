import Router from "express";
import UserController from "../controllers/UserController";
import authorization from "../middlewares/authorization";

const router = Router();

router.get("/halloffame", UserController.seeHallOfFame);

export default router;
