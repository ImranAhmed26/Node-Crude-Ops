const { Types } = require("mongoose");
const { Storage } = require("@google-cloud/storage");

const { Chip } = require("../models/chip");
const { Waste } = require("../models/waste");
const { Product } = require("../models/product");

exports.getBucket = () => {
  const keyFile =
    process.env.NODE_ENV === "local" ? { keyFilename: "project-gprc-storage.json" } : {};

  const storage = new Storage(keyFile);
  return storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
};

// Defines which type of company will sell which type of products
exports.getProductTypeForSale = (companyType = "") => {
  let productType = "";
  if (companyType === "collector") {
    productType = "waste";
  } else if (companyType === "trader") {
    productType = "trading_waste";
  } else if (companyType === "recycle_plant") {
    productType = "chip";
  } else if (companyType === "manufacturer") {
    productType = "product";
  } else if (companyType === "rmg") {
    productType = "rmg_waste";
  }
  return productType;
};

// Defines which type of company will demand which type of products
exports.getProductTypeForDemand = (companyType = "") => {
  let productType = "";
  if (companyType === "collector") {
    productType = "rmg_waste";
  } else if (companyType === "trader") {
    productType = "waste";
  } else if (companyType === "recycle_plant") {
    productType = "trading_waste";
  } else if (companyType === "manufacturer") {
    productType = "chip";
  } else if (companyType === "rmg") {
    productType = "product";
  }
  return productType;
};

exports.getProductInfoForTVC = async (ids = [], user) => {
  const query = { _id: { $in: ids.map(Types.ObjectId) } };
  const Collection = this.getCollection(user);

  query[user.type] = Types.ObjectId(user.id);
  if (user.type === "collector") {
    query.status = "new";
  } else if (user.type === "trader") {
    query.tradeStatus = "new";
  } else if (user.type === "rmg") {
    query.rmgStatus === "new";
  }

  const [productInfo] = await Collection.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
        products: { $push: "$_id" },
      },
    },
  ]);
  return { Collection, productInfo };
};

exports.getCollection = ({ type }) => {
  let Collection = "";
  if (["collector", "trader", "rmg"].includes(type)) {
    Collection = Waste;
  } else if (type === "recycle_plant") {
    Collection = Chip;
  } else if (type === "manufacturer") {
    Collection = Product;
  }
  return Collection;
};

exports.getMonthName = (index) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[index];
};

exports.getFolderName = (adminName, certNo, dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  return `${date.getFullYear()}/${adminName}/${this.getMonthName(date.getMonth())}/${certNo}`;
};
