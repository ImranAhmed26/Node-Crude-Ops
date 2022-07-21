const { Router } = require("express");

const adminRouter = require("./admin");
const companyRouter = require("./company");



const router = new Router();

router.use("/admin", adminRouter);
router.use("/company", companyRouter);

module.exports = router;
