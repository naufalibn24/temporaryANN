import Router from "express";
import authorization from "../middlewares/authorization";
import UserController from "../controllers/UserController";

const router = Router();

// router.get("/:tournament", function (req, res) {
//   const game = req.params.tournament;
//   res.send(`now you're about entering ${game} arena`);
// });

router.get("/halloffame", UserController.seeHallOfFame);

export default router;
