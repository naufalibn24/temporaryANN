import User from "../models/UserModel";
import Inbox from "../models/InboxModel";
import Tournament from "../models/TournamentModel";
import Group from "../models/GroupModel";
import UserProfile from "../models/User_ProfileModel";
import Profile from "../models/User_ProfileModel";
import { reduce } from "lodash";

class unregistered {
  // static async SubmitTournament(req, res, next) {
  //   const { message, _CommitteeId } = req.body;
  //   const inboxes: any = await Inbox.findOne({
  //     _userId: _CommitteeId,
  //   });
  //   const tournament: any = await Tournament.findOne({
  //     tournamentName: message,
  //   });
  //   const Committee: any = await User.findById({ _id: _CommitteeId });
  //   const id = req._id;
  //   const user = await User.findById(id);
  //   const group: any = await Tournament.findOne({ tournamentName: message });
  //   if (Committee) {
  //     if (inboxes == null || inboxes) {
  //       // const sender = await Inbox.findOne({ _senderId: req.params.id });
  //       // const entry = await Inbox.find({ _senderId: req.params.id, message });
  //       const sender = await Inbox.findOne({ _senderId: req._id });
  //       const entry = await Inbox.find({ _senderId: req._id, message });
  //       if (sender && entry.length != 0) {
  //         next({ name: "ALREADY_SUBMITTED" });
  //       } else {
  //         if (!tournament) {
  //           next({ name: "TOURNAMENT_NOT_FOUND" });
  //         } else {
  //           if (group.groupEntry == false) {
  //             next();
  //           } else {
  //             next({ name: "GROUP_NEEDED" });
  //           }
  //         }
  //       }
  //     } else {
  //       next({ name: "NOT_AUTHORIZE" });
  //     }
  //   } else {
  //     next({ name: "NOT_AUTHORIZE" });
  //   }
  // }

  static async SubmitTournament(req, res, next) {
    const { tournamentName } = req.body;

    const profile: any = await Profile.findOne({ _userId: req._id });
    const tournament: any = await Tournament.findOne({
      tournamentName,
    });
    const Committee: any = await User.findOne({
      role: "comittee",
    });
    const inboxes: any = await Inbox.find({
      _userId: Committee._id,
      _senderId: req._id,
      message: { $in: [tournamentName] },
    });

    const message: any[] = [tournamentName];

    if (tournament) {
      if (profile._tournamentId === undefined || null) {
        if (tournament.groupEntry === false) {
          if (inboxes.length === 0) {
            // console.log("daftar");
            const newinbox = await new Inbox({
              _userId: Committee._id,
              _senderId: req._id,
              message,
            });
            newinbox.save();

            return res.status(201).json({
              success: true,
              message: `your proposal is submitted for ${message} to committe, stay tune until further announcement`,
            });
          } else {
            next({ name: "ALREADY_SUBMITTED" });
          }
        } else {
          next({ name: "GROUP_NEEDED" });
        }
      } else {
        next({ name: "ALREADY_PARTICIPATED" });
      }
    } else {
      next({ name: "TOURNAMENT_NOT_FOUND" });
    }
  }

  // static async SubmitTournamentAsGroup(req, res, next) {
  //   const { message, _CommitteeId } = req.body;
  //   const inboxes: any = await Inbox.findOne({
  //     _userId: _CommitteeId,
  //   });
  //   const tournament: any = await Tournament.findOne({
  //     tournamentName: message[0],
  //   });
  //   const Committee: any = await User.findById({ _id: _CommitteeId });
  //   const group: any = await Tournament.findOne({ tournamentName: message });
  //   if (Committee) {
  //     if (inboxes == null || inboxes) {
  //       // const sender = await Inbox.findOne({ _senderId: req.params.id });
  //       // const entry = await Inbox.find({ _senderId: req.params.id, message });
  //       const sender = await Inbox.findOne({ _senderId: req._id });
  //       const entry = await Inbox.find({ _senderId: req._id, message });
  //       if (sender && entry.length != 0) {
  //         next({ name: "ALREADY_SUBMITTED" });
  //       } else {
  //         if (!tournament) {
  //           next({ name: "TOURNAMENT_NOT_FOUND" });
  //         } else {
  //           if (group.groupEntry == false) {
  //             next({ name: "INDIVIDUAL_NEEDED" });
  //           } else {
  //             next();
  //           }
  //         }
  //       }
  //     } else {
  //       next({ name: "NOT_AUTHORIZE" });
  //     }
  //   } else {
  //     next({ name: "NOT_AUTHORIZE" });
  //   }
  // }

  static async SubmitTournamentAsGroup(req, res, next) {
    const { tournamentName, groupName } = req.body;
    const user: any = await User.findById(req._id);
    const tournament: any = await Tournament.findOne({
      tournamentName,
    });
    const Committee: any = await User.findOne({
      role: "comittee",
    });
    const profile: any = await Profile.findOne({ _userId: req._id });
    const inboxes: any = await Inbox.find({
      _userId: Committee._id,
      _senderId: req._id,
      message: { $in: [tournamentName] },
    });
    const groupLead: any = await Group.findOne({ groupName });
    const message: any[] = [tournamentName, groupName];
    const leader: any = groupLead.member[0]._userId == req._id;
    // console.log(req._id);
    // console.log(groupLead.member[0]._userId);
    // console.log(leader);

    if (groupName != undefined || null) {
      if (tournament) {
        if (profile._tournamentId === undefined || null) {
          if (tournament.groupEntry === true) {
            if (profile._groupId != null || undefined) {
              if (leader === true) {
                if (inboxes.length === 0) {
                  const newinbox = await new Inbox({
                    _userId: Committee._id,
                    _senderId: req._id,
                    message,
                  });
                  newinbox.save();

                  return res.status(201).json({
                    success: true,
                    message: `your proposal on behalf of ${message[1]} is submitted for ${message[0]} to committe, stay tune until further announcement`,
                  });
                } else {
                  next({ name: "ALREADY_SUBMITTED" });
                }
              } else {
                next({ name: "LEADER_ONLY" });
              }
            } else {
              next({ name: "GROUP_NOT_FOUND" });
            }
          } else {
            next({ name: "INDIVIDUAL_NEEDED" });
          }
        } else {
          next({ name: "ALREADY_PARTICIPATED" });
        }
      } else {
        next({ name: "TOURNAMENT_NOT_FOUND" });
      }
    } else {
      next({ name: "FIELD_BLANK" });
    }
  }

  static async sendSubmission(req, res, next) {
    const { message, _CommitteeId } = req.body;
    const tournament: any = await Tournament.findOne({
      $or: [{ tournamentName: message }, { tournamentName: message[0] }],
    });
    const newinbox = await new Inbox({
      _userId: _CommitteeId,
      // _senderId: req.params.id,
      _senderId: req._id,
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
        // message: `You've got ${notification.length} new messages`,
        message: notification.length,
        data: notification,
      });
      // return Inbox.findOneAndUpdate(
      //   { _userId: req._id, read: false },
      //   { read: true }
      // );
    } else {
      res.status(201).json({
        success: true,
        //  message: "no new message"
        message: notification.length,
      });
    }
  }

  static async SeeInbox(req, res, next) {
    try {
      const inbox: any = await Inbox.find({ _userId: req._id });
      if (inbox.length == 0) {
        res.status(201).json({
          success: true,
          message: "Inbox is empty",
          length: inbox.length,
        });
      } else {
        let falsy: number = 0;
        for (let i in inbox) {
          if (inbox[i].read != true) {
            falsy++;
          }
        }
        res.status(201).json({ message: inbox, length: inbox.length, falsy });
        return Inbox.updateMany({ _userId: req._id }, { $set: { read: true } });
      }
    } catch {
      next({ name: "NOT_FOUND" });
    }
  }

  static async seeGroup(req, res, next) {
    const user: any = await User.findById(req._id);
    const profile: any = await Profile.findOne({ _userId: user._id });
    const group: any = await Group.findById(profile._groupId);

    if (group) {
      let members: any = [];
      for (let i in group.member) {
        const member: any = await Profile.findOne({
          _userId: group.member[i]._userId,
        });
        members.push(member);
      }
      return res.status(201).json({
        group,
        members,
      });
    } else {
      next({ name: "GROUP_NOT_FOUND" });
    }
  }

  static async createGroup(req, res, next) {
    const { groupName } = req.body;
    const groupPict = req.file.path;
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
          groupPict,
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
        next({ name: "LEADER_ONLY" });
      }
    } else {
      next({ name: "GROUP_NOT_FOUND" });
    }
  }

  static async groupRecruit(req, res, next) {
    const { _userId } = req.body;

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
        next({ name: "LEADER_ONLY" });
      }
    } else {
      next({ name: "GROUP_NOT_FOUND" });
    }
  }

  static async groupKick(req, res, next) {
    const { _userId } = req.body;
    try {
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
          next({ name: "LEADER_ONLY" });
        }
      } else {
        next({ name: "GROUP_NOT_FOUND" });
      }
    } catch {
      next({ name: "LEADER_ONLY" });
    }
  }

  static async groupEditProfile(req, res, next) {
    // const pic = req.file;
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
