import Router from "express";
import authorization from "../middlewares/authorization";

const router = Router();

// router.get("/:tournament", function (req, res) {
//   const game = req.params.tournament;
//   res.send(`now you're about entering ${game} arena`);
// });

router.get("/hallOfFame", function (req, res) {
  res.send(`Hall of Fame`);
});

export default router;
