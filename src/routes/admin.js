const { Router } = require("express");

const {
  addAdmin,
  editAdmin,
  getAdmin,
  getAdmins,
} = require("../controllers/admin");
const { isAdmin, isSuperAdmin } = require("../middlewares/auth");

const adminRouter = new Router();

adminRouter
  .get("/", isAdmin, getAdmins)
  .get("/:_id", isAdmin, getAdmin)
  .post("/", isSuperAdmin, addAdmin)
  .put("/:_id", isAdmin, editAdmin)

module.exports = adminRouter;
