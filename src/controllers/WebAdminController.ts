import User from "../models/UserModel";
import Profile from "../models/User_ProfileModel";

class WebAdminController {
  static async assign(req, res, next) {
    const { subDistrict, _id } = req.body;
    const district = await Profile.findOne({ subDistrict });
    const roles = await User.findOne({ role: "user" });
    if (district) {
      if (roles) {
        const update = await User.findOneAndUpdate(
          { _id },
          { $set: { role: "headchief" } }
        );
        res.status(201).send({ message: "Successfully update" });
        console.log(update);
      } else {
        res.status(403).send({ message: "you only assign to headchief" });
      }
    } else {
      res.status(403).send({
        message: "you already assign the headchief of this subdistrict",
      });
    }
  }
}

export default WebAdminController;
