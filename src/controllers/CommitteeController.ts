import { shuffle } from "lodash";
import User from "../models/UserModel";
import UserProfile from "../models/User_ProfileModel";
import Rules from "../models/TournamentRulesModel";
import Tournament from "../models/TournamentModel";
import TournamentRules from "../models/TournamentRulesModel";
import TournamentReport from "../models/TournamentReportModel";
import TournamentStage from "../models/TournamentStageModel";
import Group from "../models/GroupModel";
import Inbox from "../models/InboxModel";
import moment from "moment";
import errorHandling from "../middlewares/errorHandler";
import { log } from "console";

class CommitteeController {
  static async createRules(req, res, next) {
    const { groupMember, age, minParticipant, maxParticipant } = req.body;
    const member: any =
      !groupMember || groupMember == undefined || groupMember == null
        ? 1
        : groupMember;
    const panitia = await UserProfile.findOne({ _userId: req._id });
    const rulesName: any = `${age}_${member}_${panitia?.subDistrict}`;

    try {
      const rules = await Rules.findOne({ rulesName });
      if (rules) {
        console.log(!groupMember);

        next({ name: "RULES_EXIST" });
      } else {
        const rules = new Rules({
          rulesName,
          groupMember,
          age,
          subdistrict: panitia?.subDistrict,
          minParticipant,
          maxParticipant,
        });
        rules.save();
        res.status(201).json({
          message: `rules ${rules.rulesName} has been created`,
          data: rules,
        });
      }
    } catch {
      next({ name: "NOT_FOUND" });
    }
  }

  static async editRules(req, res, next) {
    // edit rules turnamen
  }

  static async createTournament(req, res, next) {
    const {
      tournamentName,
      tournamentOpen,
      tournamentStart,
      tournamentClose,
      tournamentType,
      rulesName,
      groupEntry,
    } = req.body;
    const tournamentPict = req.file.path;
    const user: any = await UserProfile.findOne({ _userId: req._id });
    const open: number = new Date(tournamentOpen).valueOf();
    const start: number = new Date(tournamentStart).valueOf();
    const close: number = new Date(tournamentClose).valueOf();
    const now: number = Date.now().valueOf();
    const rulesCheck: any = await TournamentRules.findOne({
      rulesName,
    });
    const tournament = await Tournament.findOne({
      tournamentName,
    });
    const tournamentNames: any = await Tournament.findOne({
      tournamentName,
      _tournamentRulesId: tournament?._tournamentRulesId,
    });

    if (rulesCheck?.subdistrict == user?.subDistrict) {
      if (tournamentNames && rulesCheck) {
        next({ name: "TOURNAMENT_EXIST" });
      } else {
        if (!rulesCheck) {
          next({ name: "RULES_NOT_FOUND" });
        } else {
          if (close > start && start > open && open > now) {
            const tournament = await new Tournament({
              tournamentName,
              tournamentOpen,
              tournamentStart,
              tournamentClose,
              tournamentType,
              _tournamentRulesId: rulesCheck?._id,
              groupEntry,
              tournamentPict,
            });
            tournament.save();
            const tournamentReport = new TournamentReport({
              _tournamentId: tournament._id,
            });

            tournamentReport.save();

            res.status(201).json({
              success: true,
              message: `${tournamentName} tournament has successfully created`,
            });

            next();
          } else {
            next({ name: "TIME_ERR" });
          }
        }
      }
    } else {
      next({ name: "NOT_AUTHORIZE" });
    }
  }

  static async editTournament(req, res, next) {
    // edit tanggal turnamen, type turnamen
  }

  static async approveSubmission(req, res, next) {
    const { _tournamentId, _userId, _groupId } = req.body;

    const tournament = await Tournament.findById(_tournamentId);
    const tournamentRule: any = await TournamentRules.findOne({
      _id: tournament?._tournamentRulesId,
    });
    const tournamentReport: any = await TournamentReport.findOne({
      _tournamentId,
    });

    const lists: any = await TournamentReport.findOne({
      _tournamentId,
      stageName: 0,
    });
    const user: any = await UserProfile.findOne({ _userId });

    const birthdate: any = user?.birthDate.valueOf();
    const datenow = Date.now();
    const userAge = Math.floor((datenow - birthdate) / 31536000000);
    const rules: any = await Rules.findById(tournament?._tournamentRulesId);
    const rulesAge: any = rules?.age;

    if (user._tournamentId == null) {
      if (tournamentReport.stageName === 0) {
        if (user.subDistrict == tournamentRule.subdistrict) {
          if (tournament != null) {
            if (tournament.groupEntry == false) {
              if (tournamentRule.age == userAge) {
                if (
                  tournamentRule.maxParticipant >=
                  lists.participant.length + 1
                ) {
                  const userId: any = { _userId };
                  const userName: any = await User.findByIdAndUpdate(_userId, {
                    $set: { role: "participant" },
                  });

                  await UserProfile.findOneAndUpdate(
                    { _userId },
                    { $set: { _tournamentId } }
                  );

                  await TournamentReport.findOneAndUpdate(
                    { _tournamentId },
                    { $push: { participant: userId } }
                  );

                  res.status(201).json({
                    success: true,
                    message: `${user.fullname} has been assigned to be an participant of ${tournament?.tournamentName}`,
                  });
                } else {
                  next({ name: "LIMIT_REACHED" });
                }
              } else {
                next({ name: "REQUIREMENT_NOT_MET" });
              }
            } else {
              next({ name: "GROUP_NEEDED" });
            }
          } else {
            next({ name: "TOURNAMENT_NOT_FOUND" });
          }
        } else {
          next({ name: "DIFFERENT_SUBDISTRICT" });
        }
      } else {
        next({ name: "ALREADY_LATE" });
      }
    } else {
      next({ name: "ALREADY_PARTICIPATED" });
    }
  }

  static async approveGroup(req, res, next) {
    const { _tournamentId, _groupId } = req.body;

    const group: any = await Group.findById(_groupId);
    const tournament: any = await Tournament.findById(_tournamentId);
    const rules: any = await TournamentRules.findById(
      tournament._tournamentRulesId
    );
    const report: any = await TournamentReport.findOne({ _tournamentId });

    if (group) {
      if (group._tournamentId == null || undefined) {
        if (tournament.groupEntry == true) {
          if (group.member.length == rules.groupMember) {
            if (rules.age == group.age) {
              if (rules.subdistrict == group.subDistrict) {
                if (rules.maxParticipant >= report.participant.length + 1) {
                  const groupId: any = { _groupId };

                  await Group.findByIdAndUpdate(_groupId, {
                    $set: { _tournamentId },
                  });

                  await TournamentReport.findOneAndUpdate(
                    { _tournamentId },
                    { $push: { participant: groupId } }
                  );

                  for (let i = 0; i < group.member.length; i++) {
                    const userProfile: any = await UserProfile.findOneAndUpdate(
                      { _userId: group.member[i]._userId },
                      {
                        $set: { _tournamentId },
                      }
                    );

                    const userName: any = await User.findByIdAndUpdate(
                      group.member[i]._userId,
                      {
                        $set: { role: "participant" },
                      }
                    );
                  }

                  res.status(201).json({
                    success: true,
                    message: `${group.groupName} has been assigned to be an participant of ${tournament?.tournamentName}`,
                  });
                } else {
                  next({ name: "LIMIT_REACHED" });
                }
              } else {
                next({ name: "DIFFERENT_SUBDISTRICT" });
              }
            } else {
              next({ name: "REQUIREMENT_NOT_MET" });
            }
          } else {
            next({ name: "GROUP_SIZE" });
          }
        } else {
          next({ name: "INDIVIDUAL_NEEDED" });
        }
      } else {
        next({ name: "ALREADY_PARTICIPATED" });
      }
    } else {
      next({ name: "GROUP_NOT_FOUND" });
    }
  }

  static async kickParticipant(req, res, next) {
    try {
      const { _userId, _groupId, _tournamentId } = req.body;
      const tournament: any = await Tournament.findById(_tournamentId);
      const target: any = await UserProfile.findOne({ _userId });
      const lists: any = await TournamentReport.findOne(
        { _tournamentId },
        { participant: { $elemMatch: { _userId } } }
      );

      if (tournament) {
        if (target && lists.participant[0]._userId) {
          await TournamentReport.findOneAndUpdate(
            { _tournamentId },
            {
              $pull: { participant: { _userId } },
            }
          );

          await UserProfile.findOneAndUpdate(
            { _userId },
            {
              $unset: { _tournamentId: "" },
            }
          );

          await User.findByIdAndUpdate(_userId, {
            $set: { role: "user" },
          });

          res.status(201).json({
            success: true,
            message: `${target.fullname} has been kicked from ${tournament.tournamentName}`,
          });
        } else {
          next({ name: "USER_NOT_FOUND" });
        }
      } else {
        next({ name: "TOURNAMENT_NOT_FOUND" });
      }
    } catch {
      next({ name: "USER_NOT_FOUND" });
    }
  }

  static async kickGroup(req, res, next) {
    try {
      const { _groupId, _tournamentId } = req.body;
      const tournament: any = await Tournament.findById(_tournamentId);
      const target: any = await Group.findById(_groupId);
      const lists: any = await TournamentReport.findOne(
        { _tournamentId },
        { participant: { $elemMatch: { _groupId } } }
      );

      if (tournament) {
        if (target && lists.participant[0]._groupId) {
          await TournamentReport.findOneAndUpdate(
            { _tournamentId },
            {
              $pull: { participant: { _groupId } },
            }
          );

          await Group.findByIdAndUpdate(_groupId, {
            $unset: { _tournamentId: "" },
          });

          for (let i = 0; i < target.member.length; i++) {
            await UserProfile.findOneAndUpdate(
              { _userId: target.member[i]._userId },
              {
                $unset: { _tournamentId: "" },
              }
            );

            await User.findByIdAndUpdate(target.member[i]._userId, {
              $set: { role: "user" },
            });
          }

          res.status(201).json({
            success: true,
            message: `${target.groupName} has been kicked from ${tournament.tournamentName}`,
          });
        } else {
          next({ name: "GROUP_NOT_FOUND" });
        }
      } else {
        next({ name: "TOURNAMENT_NOT_FOUND" });
      }
    } catch {
      res.status(409).json({
        success: false,
      });
    }
  }

  static async seeParticipantList(req, res, next) {
    const { _id } = req.body;
    const lists: any = await TournamentReport.findById(_id);
    res.status(201).json({
      success: true,
      data: lists.participant,
    });
  }

  // static async shufflingParticipantList(req, res, next) {
  //   const { _id } = req.body;
  //   const participant: any = await TournamentReport.findById(_id);
  //   const shuffled: any = shuffle(participant.participant);

  //   const tournament: any = await Tournament.findById(
  //     participant._tournamentId
  //   );

  //   if (tournament.stageName === participant.stageName) {
  //     const stageName: number = (await participant.stageName) + 1;
  //     const tournamentReport = new TournamentReport({
  //       _tournamentId: participant._tournamentId,
  //       participant: shuffled,
  //       stageName,
  //     });

  //     tournamentReport.save();
  //     const update: any = await Tournament.findByIdAndUpdate(
  //       participant._tournamentId,
  //       { $set: { stageName: tournamentReport.stageName } }
  //     );

  //     res.status(201).json({
  //       success: true,
  //       message: `${update.tournamentName} has been moving to next stage`,
  //     });
  //   } else {
  //     next({ name: "STAGE_ERROR" });
  //   }
  // }

  // static async shufflingBranchesList(req, res, next) {
  //   const { _id, participant, _userId } = req.body;

  //   const list: any = await TournamentReport.findById(_id);
  //   const shuffled: any = shuffle(list.participant);

  //   const tournament: any = await Tournament.findById(list._tournamentId);

  //   if (tournament.stageName === list.stageName) {
  //     if (list.stageName === 0) {
  //       for (let i = 0, j = shuffled.length; i < j; i += 2) {
  //         const temparray = shuffled.slice(i, i + 2);
  //         const stageName: number = (await list.stageName) + 1;
  //         const tournamentReport = new TournamentReport({
  //           _tournamentId: list._tournamentId,
  //           participant: temparray,
  //           stageName,
  //         });

  //         tournamentReport.save();
  //         const update: any = await Tournament.findByIdAndUpdate(
  //           list._tournamentId,
  //           { $set: { stageName: tournamentReport.stageName } }
  //         );

  //         res.status(201).json({
  //           success: true,
  //           message: `${update.tournamentName} has been moving to next stage`,
  //         });
  //       }
  //     }
  //   } else {
  //     next({ name: "STAGE_ERROR" });
  //   }
  // }

  static async proceedTournament(req, res, next) {
    try {
      const { _id } = req.body;
      const Check: any = await TournamentReport.findById(_id);
      const Stage: any = await Tournament.findById(Check._tournamentId);
      const Shuffled: any = await shuffle(Check.participant);
      const scored: any = await TournamentReport.findOne({
        _id,
        participant: { $elemMatch: { score: null } },
      });

      if (Check && Stage) {
        if (Stage.finished == false) {
          if (Stage.stageName == Check.stageName) {
            // if (scored == null) {
            if (Stage.tournamentType == "branches") {
              if (Check.stageName == 0) {
                for (let i = 0; i < Shuffled.length; i += 2) {
                  let temparray = Shuffled.slice(i, i + 2);
                  const stageName: number = Check.stageName + 1;
                  const tournamentReport = new TournamentReport({
                    _tournamentId: Check._tournamentId,
                    participant: temparray,
                    stageName,
                  });

                  await tournamentReport.save();

                  Tournament.findByIdAndUpdate(Check._tournamentId, {
                    $set: { stageName: tournamentReport.stageName },
                  }).then((update) => {
                    res
                      .status(201)
                      .json({
                        success: true,
                        message: `${update?.tournamentName} has been moving to next stage`,
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  });
                }
              } else if (Check.participant.length > 2) {
                res.send("finish keluarin ranking, tournament.finished:true");
              } else {
                res.send("next bikin fungsi baru");
              }
            } else {
              // FREE FOR ALL
              // sorting score, ranking
              const stageName: number = Check.stageName + 1;
              const tournamentReport = new TournamentReport({
                _tournamentId: Check._tournamentId,
                participant: Check.participant,
                stageName,
              });

              await tournamentReport.save();

              Tournament.findByIdAndUpdate(Check._tournamentId, {
                $set: {
                  stageName: tournamentReport.stageName,
                  finished: true,
                },
              }).then((update) => {
                res
                  .status(201)
                  .json({
                    success: true,
                    message: `${update?.tournamentName} has been moving to next stage`,
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          } else {
            next({ name: "STAGE_ERROR" });
          }
        } else {
          next({ name: "ALREADY_HAVE_WINNER" });
        }
      } else {
        next({ name: "TOURNAMENT_NOT_FOUND" });
      }
    } catch (error) {
      console.error(error);
    }
  }

  static async putScore(req, res, next) {
    const { _groupId, _userId, _id, score } = req.body;
    const profile: any = await TournamentReport.findOne({
      _id,
      participant: { $elemMatch: { _groupId } },
    });

    if (profile != null) {
      const put: any = await TournamentReport.findOneAndUpdate(
        { _id, participant: { $elemMatch: { _groupId } } },
        {
          $set: {
            "participant.$.score": score,
          },
        },
        { new: true, upsert: true }
      );

      res.status(201).json({
        success: true,
        message: `${_groupId} got ${score} on stage${put.stageName}`,
      });
    } else {
      next({ name: "NOT_FOUND" });
    }
  }

  static async finishingStage(req, res, next) {
    // nge ganti stage turnamen branches
  }

  static async postTournamentResult(req, res, next) {
    // nge post turnamen result
  }
}

export default CommitteeController;
