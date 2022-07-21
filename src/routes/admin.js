const { Router } = require("express");

const { addAdmin, editAdmin, getAdmin, getAdmins } = require("../controllers/admin");

const adminRouter = new Router();

adminRouter.get("/", getAdmins).get("/:_id", getAdmin).post("/", addAdmin).put("/:_id", editAdmin);

module.exports = adminRouter;
