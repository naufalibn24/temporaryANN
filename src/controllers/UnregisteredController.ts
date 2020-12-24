import User from "../models/UserModel";
import Inbox from "../models/InboxModel";
import Tournament from "../models/TournamentModel";
import Group from "../models/GroupModel";
import UserProfile from "../models/User_ProfileModel";

class unregistered {
  static async SubmitTournament(req, res, next) {
    const { message, _CommitteeId } = req.body;
    const inboxes: any = await Inbox.findOne({
      _userId: _CommitteeId,
    });
    const tournament: any = await Tournament.findOne({
      tournamentName: message,
    });
    const Committee: any = await User.findById({ _id: _CommitteeId });
    const group: any = await Tournament.findOne({ tournamentName: message });
    if (Committee) {
      if (inboxes == null || inboxes) {
        const sender = await Inbox.findOne({ _senderId: req.params.id });
        const entry = await Inbox.find({ _senderId: req.params.id, message });
        if (sender && entry.length != 0) {
          next({ name: "ALREADY_SUBMITTED" });
        } else {
          if (!tournament) {
            next({ name: "TOURNAMENT_NOT_FOUND" });
          } else {
            if (group.groupEntry == false) {
              next();
            } else {
              next({ name: "GROUP_NEEDED" });
            }
          }
        }
      } else {
        next({ name: "NOT_AUTHORIZE" });
      }
    } else {
      next({ name: "NOT_AUTHORIZE" });
    }
  }

  static async SubmitTournamentAsGroup(req, res, next) {
    const { message, _CommitteeId } = req.body;
    const inboxes: any = await Inbox.findOne({
      _userId: _CommitteeId,
    });
    const tournament: any = await Tournament.findOne({
      tournamentName: message[0],
    });
    const Committee: any = await User.findById({ _id: _CommitteeId });
    const group: any = await Tournament.findOne({ tournamentName: message });
    if (Committee) {
      if (inboxes == null || inboxes) {
        const sender = await Inbox.findOne({ _senderId: req.params.id });
        const entry = await Inbox.find({ _senderId: req.params.id, message });
        if (sender && entry.length != 0) {
          next({ name: "ALREADY_SUBMITTED" });
        } else {
          if (!tournament) {
            next({ name: "TOURNAMENT_NOT_FOUND" });
          } else {
            if (group.groupEntry == false) {
              next({ name: "INDIVIDUAL_NEEDED" });
            } else {
              next();
            }
          }
        }
      } else {
        next({ name: "NOT_AUTHORIZE" });
      }
    } else {
      next({ name: "NOT_AUTHORIZE" });
    }
  }

  static async sendSubmission(req, res, next) {
    const { message, _CommitteeId } = req.body;
    const tournament: any = await Tournament.findOne({
      $or: [{ tournamentName: message }, { tournamentName: message[0] }],
    });
    const newinbox = await new Inbox({
      _userId: _CommitteeId,
      _senderId: req.params.id,
      message,
    });
    newinbox.save();

    if (tournament.groupEntry === false) {
      return res.status(201).json({
        success: true,
        message: `your proposal is submitted for ${message} to committe, stay tune until further announcement`,
      });
    } else {
      return res.status(201).json({
        success: true,
        message: `your proposal on behalf of ${message[1]} is submitted for ${message[0]} to committe, stay tune until further announcement`,
      });
    }
  }

  static async notifications(req, res, next) {
    const notification: any = await Inbox.find({
      _userId: req._id,
      read: false,
    });
    if (notification.length > 0) {
      await res.status(201).json({
        message: `You've got ${notification.length} new messages`,
        data: notification,
      });
      return Inbox.findOneAndUpdate(
        { _userId: req._id, read: false },
        { read: true }
      );
    } else {
      res.status(201).json({ success: true, message: "no new message" });
    }
  }

  static async SeeInbox(req, res, next) {
    const inbox: any = await Inbox.find({ _userId: req._id });

    if (inbox.length == 0) {
      res.status(201).json({ success: true, message: "Inbox is empty" });
    } else {
      res.status(201).json({ data: inbox });
      return Inbox.updateMany({ _userId: req._id }, { $set: { read: true } });
    }
  }

  static async createGroup(req, res, next) {
    const { groupName } = req.body;
    const myself: any = await UserProfile.findOne({ _userId: req._id });
    const group: any = await Group.findOne({ groupName });
    if (myself._groupId == null || undefined) {
      if (!group) {
        const birthdate: any = myself.birthDate.valueOf();
        const datenow = Date.now();
        const age = Math.floor((datenow - birthdate) / 31536000000);
        const subDistrict = myself.subDistrict;
        const users: any = [
          { _userId: req._id, phoneNumber: myself?.phoneNumber },
        ];

        const groups = await new Group({
          member: users,
          groupName,
          age,
          subDistrict,
        });
        groups.save();

        await UserProfile.findOneAndUpdate(
          { _userId: req._id },
          { $set: { _groupId: groups._id } }
        );

        res.status(201).json({
          success: true,
          message: `${groupName} successfully created, with you as a leader`,
        });
      } else {
        next({ name: "GROUP_EXIST" });
      }
    } else {
      next({ name: "ALREADY_IN_GROUP" });
    }
  }

  static async demolishGroup(req, res, next) {
    const { groupName } = req.body;
    const target: any = await Group.findOne({ groupName });
    const player: any = await UserProfile.findOne({
      _userId: target.member[0]._userId,
    });

    if (target) {
      if (target.member[0]._userId == req._id) {
        if (target.member.length == 1) {
          const deleted: any = await Group.deleteOne({ groupName });
          await UserProfile.findByIdAndUpdate(player._id, {
            $unset: { _groupId: "" },
          });
          res.status(201).json({
            success: true,
            message: `${target.groupName} has successfully deleted`,
          });
        } else {
          next({ name: "GROUP_NOT_EMPTY" });
        }
      } else {
        next({ name: "FORBIDDEN" });
      }
    } else {
      next({ name: "GROUP_NOT_FOUND" });
    }
  }

  static async groupRecruit(req, res, next) {
    const { _userId } = req.body;
    console.log(_userId);

    const user: any = await UserProfile.findOne({ _userId });
    const myself: any = await UserProfile.findOne({
      _userId: req._id,
    });
    const group: any = await Group.findById(myself._groupId);

    const birthdate: any = user.birthDate.valueOf();
    const MYbirthdate: any = myself.birthDate.valueOf();
    const datenow = Date.now();
    const userAge = Math.floor((datenow - birthdate) / 31536000000);
    const MYAge = Math.floor((datenow - MYbirthdate) / 31536000000);
    const member: any = [
      {
        _userId,
        phoneNumber: user?.phoneNumber,
      },
    ];

    if (group) {
      if (req._id == group.member[0]._userId) {
        if (user.subDistrict === myself.subDistrict) {
          if (user._tournamentId == null || undefined) {
            if (user._groupId == null || undefined) {
              if (userAge == MYAge) {
                await Group.findByIdAndUpdate(myself._groupId, {
                  $push: { member },
                });
                await UserProfile.findByIdAndUpdate(user._id, {
                  $set: { _groupId: myself._groupId },
                });
                res.status(201).json({
                  success: true,
                  message: `${user.fullname} has successfully join group`,
                });
              } else {
                next({ name: "REQUIREMENT_NOT_MET" });
              }
            } else {
              next({ name: "USER_ALREADY_IN_GROUP" });
            }
          } else {
            next({ name: "ALREADY_PARTICIPATED" });
          }
        } else {
          next({ name: "DIFFERENT_SUBDISTRICT" });
        }
      } else {
        console.log(group.member[0]._userId);
        console.log(myself._userId);
        console.log(myself._userId == group.member[0]._userId);

        next({ name: "FORBIDDEN" });
      }
    } else {
      next({ name: "GROUP_NOT_FOUND" });
    }
  }

  static async groupKick(req, res, next) {
    const { _userId } = req.body;
    const leader: any = await UserProfile.findOne({ _userId: req._id });
    const groupCheck: any = await Group.findById(leader._groupId);
    const user: any = await UserProfile.findOne({ _userId });
    const member: any = {
      _userId,
      phoneNumber: user?.phoneNumber,
    };

    if (groupCheck) {
      if (groupCheck.member[0]._userId == req._id) {
        if (groupCheck.member.length > 1) {
          await Group.findByIdAndUpdate(leader._groupId, {
            $pull: { member: member },
          });
          const user: any = await UserProfile.findOneAndUpdate(
            { _userId },
            {
              $unset: { _groupId: "" },
            }
          );
          res.status(201).json({
            success: true,
            message: `${user.fullname} has successfully kicked from ${groupCheck.groupName}`,
          });
          res.send("lanjut");
        } else {
          next({ name: "GROUP_EMPTY" });
        }
      } else {
        next({ name: "FORBIDDEN" });
      }
    } else {
      next({ name: "GROUP_NOT_FOUND" });
    }
  }

  static async groupEditProfile(req, res, next) {
    // const group = await Group.findbyid(_id)
    // multer
    // Group.findbyidandUpdate(_id,{$set:{groupPict}})
  }

  static async attendTournament(req, res, next) {
    // const my = await UserProfile.findOne({_userId:req.params.id})
    // const tournament= await Tournament.findbyid(my._tournamentId)
    // const stage= await TournamentReport.findOne({_tournamentId})
    // if(stage.stageName:'aboutToBegin')
    // await TournamentReport.findOne ({_tournamentId:my._tournamentId},{$push:{participant}})
  }
}

export default unregistered;
