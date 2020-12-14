import Router from "express";
import UserController from "../controllers/UserController";
import authorization from "../middlewares/authorization";

const router = Router();

// router.get("/:tournament", function (req, res) {
//   const game = req.params.tournament;
//   res.send(`now you're about entering ${game} arena`);
// });

router.get("/halloffame", UserController.seeHallOfFame)

export default router;
