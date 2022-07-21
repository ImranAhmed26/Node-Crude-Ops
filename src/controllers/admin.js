const nid = require("nid")({
  alphabet: "ABCDEFGHIJKLMNPQRSTUVWXY123456789",
  length: 8,
});

const { Admin } = require("../models/admin");

const secret = process.env.SECRET || "";

exports.addAdmin = async (req, res) => {
  try {
    const { body } = req;

    const password = "0000" || nid();
    body.password = password;
    let admin = new Admin(body);
    admin.type = "admin";
    admin = await admin.save();
    admin.password = undefined;
    res.status(201).send(admin);
  } catch (error) {
    console.error("error : ", error);
    res.status(error.status || 500).send({ message: error.message });
  }
};

exports.editAdmin = async (req, res) => {
  try {
    const { body, params, user } = req;

    let admin = await Admin.findOne(params).select(["-password"]);
    if (!admin) {
      return res.status(404).send({ message: "Could not find the admin" });
    }

    if (body.name) {
      admin.name = body.name;
    }
    if (body.email) {
      admin.email = body.email;
    }

    admin = await admin.save();
    res.status(200).send(admin);
  } catch (error) {
    console.error("error : ", error);
    res.status(error.status || 500).send({ message: error.message });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const { params } = req;
    const admin = await Admin.findOne(params).select(["-password"]);
    res.status(200).send(admin);
  } catch (error) {
    console.error("error : ", error);
    res.status(error.status || 500).send({ message: error.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const { query } = req;
    let { limit = 0, skip = 0, search = "" } = query;
    delete query.limit;
    delete query.skip;
    delete query.search;

    const admins = await Admin.find(query)
      .select(["-password"])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).send(admins);
  } catch (error) {
    console.error("error : ", error);
    res.status(error.status || 500).send({ message: error.message });
  }
};
