import Group from "../models/GroupModel";
import User from "../models/UserModel";
import Profile from "../models/User_ProfileModel";

class ProfileController {
  static async UserProfile(req, res, next) {
    const { birthDate, fullname, subDistrict, phoneNumber } = req.body;
    const phone = await Profile.findOne({ phoneNumber });
    const user: any = await User.findById(req._id);
    const userprofile = await Profile.findOne({ _userId: req._id });
    if (user.role != "unregistered") {
      if (!userprofile) {
        if (phone) {
          next({ name: "PROFILE_EXIST" });
        } else {
          const picture = req.file.path;
          const profile = new Profile({
            _userId: req._id,
            birthDate,
            fullname,
            subDistrict,
            phoneNumber,
            picture,
          });
          profile.save();
          res.status(201).send({
            success: true,
            message: "Profile Created",
            profile,
          });
        }
      } else {
        next({ name: "PROFILE_ADD" });
      }
    } else {
      next({ name: "NOT_AUTHORIZE" });
    }
  }

  // static seeProfile(req, res, next) {
  //   Profile.findOne({ _userId: req._id })
  //     .then((user) => {
  //       if (user) {
  //         res.status(200).json({
  //           user: [
  //             {
  //               picture: user?.picture,
  //               fullname: user?.fullname,
  //               phoneNumber: user?.phoneNumber,
  //               birthDate: user?.birthDate.toDateString(),
  //               tournament: user?._tournamentId,
  //               subDistrict: user?.subDistrict,
  //               groupName: user?._groupId,
  //             },
  //           ],
  //         });
  //       } else throw { name: "NOT_FOUND" };
  //     })
  //     .catch(next);
  // }

  static async seeProfile(req, res, next) {
    const profile: any = await Profile.findOne({ _userId: req._id });
    const user: any = await User.findById(req._id);
    const group: any = await Group.findById(profile._groupId);
    if (user) {
      if (profile) {
        res.status(200).json({
          // user:
          // [
          //   {
          picture: profile?.picture,
          fullname: profile?.fullname,
          phoneNumber: profile?.phoneNumber,
          birthDate: profile?.birthDate.toDateString(),
          tournament: profile?._tournamentId,
          subDistrict: profile?.subDistrict,
          groupName: group?.groupName,
          username: user.username,
          email: user.email,
          role: user.role,
          //   },
          // ],
        });
      } else throw { name: "PROFILE_NOT_FOUND" };
    } else throw { name: "NOT_AUTHORIZE" };
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
