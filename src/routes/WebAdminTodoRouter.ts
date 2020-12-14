import Router from "express";
import WebAdminController from "../controllers/WebAdminController";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

const router = Router();

router.put("/assign", authorization.admin, WebAdminController.assign);
export default router;
