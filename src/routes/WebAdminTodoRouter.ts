import Router from "express";
import WebAdminController from "../controllers/WebAdminController";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

const router = Router();

<<<<<<< HEAD
router.put("/assign", authorization.admin, WebAdminController.assign);
=======
<<<<<<< HEAD
router.put("/assign", authorization.admin, WebAdminController.assign);
=======
router.put("/assign", authorization.admin,
    WebAdminController.assign
);
>>>>>>> e5282d1898f19581e3891a1238ce9f63290833dc

>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
export default router;
