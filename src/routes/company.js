const { Router } = require("express");

const { addCompany, editCompany, getCompany, getCompanies } = require("../controllers/company");


const companyRouter = new Router();

companyRouter
  .get("/", getCompanies)
  .get("/:_id", getCompany)
  .post("/", addCompany)
  .put("/:_id", editCompany);

module.exports = companyRouter;
