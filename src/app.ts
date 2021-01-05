import express, { Application } from "express";
import cors from "cors";
import mongooseconnect from "../src/configs/mongoose";
import routes from "../src/routes";
require("dotenv").config();

export const app: Application = express();
const PORT = 5000;

mongooseconnect();

var corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(PORT, () => console.log(`server running on localhost://${PORT}`));
// taskkill /F /IM node.exe
