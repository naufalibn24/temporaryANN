import express, { Application } from "express";
import cors from "cors";
import mongooseconnect from "../src/configs/mongoose";
import routes from "../src/routes";
// require("dotenv").config();

export const app: Application = express();

const PORT: string | number = process.env.PORT || 5000;

mongooseconnect();

var corsOptions = {
  origin: "http://localhost:4200",
  // origin: "https://revision-ass4-git-main.muhidabdul168.vercel.app",
  credentials: true,
};

app.get("", (req, res) => {
  res.send("<h1>Welcome to ANN server! Awesome right</h1>");
});
app.use(cors(corsOptions));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(PORT, () => console.log(`hosting @${PORT}`));
// app.listen(PORT, () => console.log(`server running on localhost://${PORT}`));
// taskkill /F /IM node.exe
