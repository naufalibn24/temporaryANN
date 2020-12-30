import User from "../models/UserModel";
import Profile from "../models/User_ProfileModel";

class ProfileController {
  static async UserProfile(req, res, next) {
    const { birthDate, fullname, subDistrict, phoneNumber } = req.body;

    const user = await User.findById(req._id);
    const picture = req.file.path;
    const profile = new Profile({
      _userId: req._id,
      birthDate,
      fullname,
      subDistrict,
      phoneNumber,
      picture,
    });
    const userprofile = await Profile.findOne({ _userId: req._id });

    if (userprofile) {
      next({ name: "PROFILE_ADD" });
    } else {
      profile.save();
      res.status(201).send({
        success: true,
        message: "Profile Created",
        profile,
      });
    }
  }

  static seeProfile(req, res, next) {
    console.log(req._id);
    Profile.findOne({ _userId: req._id })
      .then((user) => {
        console.log(user);
        if (user) {
          res.status(200).json({
            user: [
              {
                picture: user?.picture,
                fullname: user?.fullname,
                phoneNumber: user?.phoneNumber,
                birthDate: user?.birthDate.toDateString(),
                tournament: user?._tournamentId,
                subDistrict: user?.subDistrict,
                groupName: user?._groupId,
              },
            ],
          });
        } else throw { name: "NOT_FOUND" };
      })
      .catch(next);
  }

  static changeProfile(req, res, next) {
    const { fullname } = req.body;
    const id = req._id;
    Profile.findOne({ _userId: req._id })
      .then((user) => {
        if (user && user.fullname != fullname) {
          return Profile.findOneAndUpdate(
            { _userId: req._id },
            { fullname }
          ).then((user) => {
            res.status(200).json({
              message: `successfuly renamed to ${fullname}`,
            });
          });
        } else throw { name: "ALREADY_RENAMED" };
      })
      .catch(next);
  }
}

export default ProfileController;
