import mongoose from "mongoose";
require("dotenv").config();
const mongoLocal = "mongodb://localhost:27017/ANN";

const mongoURL = `mongodb+srv://WebAdmin:${process.env.DBPASS}@cluster0.ktlu5.mongodb.net/ArenaANNcup?retryWrites=true&w=majority`;

export default () => {
  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  const db = mongoose.connection;
  db.on("error", (e) => console.log(e));
  db.once("open", () => console.log("mongoose connection success!"));
};
