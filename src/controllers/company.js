const nid = require("nid")({
  alphabet: "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789",
  length: 8,
});

const { Company } = require("../models/company");

const secret = process.env.SECRET || "";

exports.addCompany = async (req, res) => {
  try {
    const { body, user } = req;

    const password = "0000" || nid();
    body.password = password

    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 5);
    body.validUntil = validUntil;


    let company = new Company(body);
    company = await company.save();
    company.password = undefined;
    res.status(201).send(company);
  } catch (error) {
    console.error("error : ", error);
    res.status(error.status || 500).send({ message: error.message });
  }
};

exports.editCompany = async (req, res) => {
  try {
    const { body, params, user } = req;


    let company = await Company.findOne(params).select(["-password"]);
    if (!company) {
      res.status(404).send({ message: "Could not find the company" });
      return;
    }

    if (body.name) {
      company.name = body.name;
    }
    if (body.email) {
      company.email = body.email;
    }
    if (body.phone) {
      company.phone = body.phone;
    }
    if (body.details) {
      company.details = body.details;
    }

    company = await company.save();
    res.status(200).send(company);
  } catch (error) {
    console.error("error : ", error);
    res.status(error.status || 500).send({ message: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const { params, user } = req;
    

    const company = await Company.findOne(params).select(["-password"]);
    res.status(200).send(company);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
};

// TODO: Need another api according to actors
exports.getCompanies = async (req, res) => {
  try {
    const { query, user } = req;
    let { limit = 0, skip = 0, search = "" } = query;
    delete query.limit;
    delete query.skip;
    delete query.search;

    const companies = await Company.find(query)
      .select(["-password"])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).send(companies);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
};


