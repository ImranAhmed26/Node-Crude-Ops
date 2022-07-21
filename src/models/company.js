const { model, Schema } = require("mongoose");

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    details: { type: String },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

exports.Company = model("Company", CompanySchema);
