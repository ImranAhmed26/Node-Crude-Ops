require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

app.all("/", (req, res) => res.status(200).send({ message: "Welcome!" }));
app.use("/api/v1", routes);
app.all("*", (req, res) => res.status(404).send({ message: "Could not find any resource!" }));

const db_url = process.env.DB_URL || "";
const port = process.env.PORT || 5000;

mongoose.connect(db_url).then(() => {
  app.listen(port, () => console.log("Server started successfully!"));
});
