import express, { NextFunction } from "express";
import cors from "cors";
import mongooseconnect from "../src/configs/mongoose";
import routes from "../src/routes";
// require("dotenv").config();

const app = express();
const PORT: string | number = process.env.PORT || 5000;

mongooseconnect();

var corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};

app.use("*", (req, res) => {
  res.send("<h1>Welcome to your simple server! Awesome right</h1>");
});
app.use(cors(corsOptions));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(PORT, () => console.log(`hosting @${PORT}`));
// app.listen(PORT, () => console.log(`server running on localhost://${PORT}`));
// taskkill /F /IM node.exe
