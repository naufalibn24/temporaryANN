import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import User from "../models/UserModel";
import UserProfile from "../models/User_ProfileModel";
<<<<<<< HEAD
<<<<<<< HEAD
import _ from "lodash";
import Tournament from "../models/TournamentModel";
import TournamentReport from "../models/TournamentReportModel";
=======
=======
>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
import _, { identity } from "lodash";
import console from "console";
import Tournament from "../models/TournamentModel";
import TournamentRules from "../models/TournamentRulesModel";

import ItournamentRules from "../models/interfaces/TournamentRulesInterface";
import TournamentReport from "../models/TournamentReportModel";
import { report } from "process";
<<<<<<< HEAD
>>>>>>> 890e203
=======
>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
require("dotenv").config();

class UserController {
  static async signup(req, res, next) {
    const { username, email, password } = req.body;
    const emailCheck = await User.findOne({ email });
    const usernameCheck = await User.findOne({ username });

    if (emailCheck) {
      next({ name: "EMAIL_EXIST" });
    } else {
      if (usernameCheck) {
        next({ name: "USERNAME_EXIST" });
      } else {
        const user = new User({
          username,
          email,
          password,
        });
        user.save();
        next();
      }
    }
  }

  static async signin(req, res, next) {
<<<<<<< HEAD
    const { email, username, password, verifyingToken } = req.body;
    const Check: any = await User.findOne({ $or: [{ email }, { username }] });
    const Pass: any = await bcrypt.compare(password, Check?.password);
    const Profile: any = await UserProfile.findOne({ _userId: Check._id });
<<<<<<< HEAD

    if ((await Check) && (await Pass)) {
      if (Profile) {
        next();
      } else {
        const secret: any = process.env.JWT_Activate;
        jwt.verify(verifyingToken, secret, (err, decoded) => {
          if (decoded.email != email || decoded.username != username) {
            next({ name: "INVALID_TOKEN" });
=======
    if (Check && Pass) {
      if (Check.role === "unregistered") {
        console.log(Check.role);
        const secret: any = process.env.JWT_Activate;
        await jwt.verify(verifyingToken, secret, (err, decoded) => {
          if (decoded.email == email || decoded.username == username) {
            next();

            // if ((await Check) && (await Pass)) {
            //   if (Profile) {
            //     next();
            //   } else {
            //     const secret: any = process.env.JWT_Activate;
            //     jwt.verify(verifyingToken, secret, (err, decoded) => {
            //       if (decoded.email != email || decoded.username != username) {
            //         next({ name: "INVALID_TOKEN" });
            //       } else {
            //         const profile = new UserProfile({
            //           _userId: Check._id,
            //           birthDate,
            //           subDistrict,
            //           phoneNumber,
            //           fullname,
            //         });
            //         profile.save();
            //         next();
>>>>>>> 890e203
          } else {
            next({ name: "INVALID_TOKEN" });
            next();
          }
        });
      } else {
        next();
=======
    const {
      email,
      username,
      password,
      verifyingToken,
    } = req.body;
    const Check: any = await User.findOne({ $or: [{ email }, { username }] });
    const Pass: any = await bcrypt.compare(password, Check?.password);
    const Profile: any = await UserProfile.findOne({ _userId: Check._id });
    if ((Check) && (Pass)) {
      if (Check.role === "unregistered") {
        console.log(Check.role)
        const secret: any = process.env.JWT_Activate;
        await jwt.verify(verifyingToken, secret, (err, decoded) => {
          if (decoded.email == email || decoded.username == username) {
            next()
          }
          else {
            next({ name: "INVALID_TOKEN" })
          }
        })
      }
      else {
        next()
>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
      }
    } else {
      next({ name: "NOT_FOUND" });
    }
  }

  static async proceed_signin(req, res, next) {
    const { email, username } = req.body;
    const Found: any = await User.findOne({ $or: [{ email }, { username }] });
    const secret_key: any = process.env.JWT_Accesstoken;
    const access_token: any = jwt.sign({ _id: Found._id }, secret_key);
    const response = res.status(201).json({
      success: true,
      message: `${username || email} has successfully login`,
      access_token,
    });
    if (Found.role === "unregistered") {
      await User.findOneAndUpdate(
        { $or: [{ email }, { username }] },
        { $set: { role: "user" } }
<<<<<<< HEAD
      );
      return response;
    } else {
      response;
=======
      )
      return response
    } else {
      response
>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
    }
  }

  static async forgotPassword(req, res, next) {
    const { email } = req.body;
    const Check: any = await User.findOne({ email });
    if (Check) {
      next();
    } else {
      next({ name: "USER_NOT_FOUND" });
    }
  }

  static resetPassword(req, res, next) {
    const { resetLink, newPassword, email } = req.body;
    if (resetLink) {
      const jwtforgottoken: any = process.env.JWT_ForgotPassword;
      jwt.verify(resetLink, jwtforgottoken, function (error, decodedData) {
<<<<<<< HEAD
        if (decodedData.email != email) {
<<<<<<< HEAD
=======
        console.log(decodedData)
        if (error) {
>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
          throw { name: "INVALID_TOKEN" };
        } else {
          User.findOne({ resetLink }, (err, user) => {
            if (err || !user) {
              throw { name: "NOT_FOUND" };
            } else {
              const salt = bcrypt.genSaltSync(10);
              const password = bcrypt.hashSync(newPassword, salt);
              return User.findOneAndUpdate(
                { resetLink },
                { $set: { password } }
              )
                .then(() => {
                  if (err) {
                    throw { name: "INVALID_TOKEN" };
                  } else {
                    User.findOneAndUpdate(
                      { email },
                      { $set: { resetLink: null } }
                    ).then(() => {
                      res.status(200).json({
                        success: true,
                        message: `Password successfully changed`,
=======
          console.log(decodedData);
          if (error) {
            throw { name: "INVALID_TOKEN" };
          } else {
            User.findOne({ resetLink }, (err, user) => {
              if (err || !user) {
                throw { name: "NOT_FOUND" };
              } else {
                const salt = bcrypt.genSaltSync(10);
                const password = bcrypt.hashSync(newPassword, salt);
                return User.findOneAndUpdate(
                  { resetLink },
                  { $set: { password } }
                )
                  .then(() => {
                    if (err) {
                      throw { name: "INVALID_TOKEN" };
                    } else {
                      User.findOneAndUpdate(
                        { email },
                        { $set: { resetLink: null } }
                      ).then(() => {
                        res.status(200).json({
                          success: true,
                          message: `Password successfully changed`,
                        });
>>>>>>> 890e203
                      });
                    }
                  })
                  .catch(next);
              }
            });
          }
        } else {
          next({ name: "INVALID_TOKEN" });
        }
      });
    }
  }

  static async tournamentAvailable(req, res, next) {
    // const data= await TournamentReport.find ({_tournamentId,stageName:'participantList'})
    // const tournament= await Tournament.findOne ({_tournamentId})
    // const rules= await TournamentRules.findOne ({tournament._tournamentRulesId})
    // if(rules.maxParticipant >= data.participant.length )
<<<<<<< HEAD
    const tournament: any = await Tournament.find().exec();
    const newTournament = await tournament.map(async (tournaments, index) => {
      const rules = await TournamentRules.findOne({
        _id: tournaments._tournamentRulesId,
      }).exec();
      return { id: tournaments._id, rules: rules?.maxParticipant };
    });

    Promise.all(newTournament).then((results) => {
      const data = results.map(async (data: any, index) => {
        const _id = data.id;
        const report = await TournamentReport.findOne({
          _tournamentId: data.id,
        });
        const participant: any = report?.participant;
        console.log(data.rules, participant.length);
        const tourn = await Tournament.findOne({ _id: data.id });

        if (data.rules <= participant.length) {
          return { status: 1, message: "tidak tersedia", data: tourn };
        } else {
          return { status: 0, message: "tersedia", data: tourn };
        }
      });

      Promise.all(data).then((result) => {
        res.status(200).send(result);
      });
    });
  }

  static async seeTournamentList(req, res, next) {
    const { page = 1, limit = 10, q = "" } = req.query;
    try {
      const tournament: any = await Tournament.find({
        tournamentName: { $regex: q, $options: "i" },
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const nextpage = parseInt(page) + parseInt("1");
      const previouspage = parseInt(page) - parseInt("1");
      const jumlahData = await Tournament.countDocuments({
        tournamentName: { $regex: q, $options: "i" },
      });
      const jumlahpage = Math.ceil(jumlahData / limit);
      console.log(jumlahpage);
      var npg, ppg;
      if (parseInt(page) === jumlahpage && parseInt(page) === 1) {
        npg = null;
        ppg = null;
      } else if (parseInt(page) === jumlahpage) {
        ppg = "http://localhost:5000/tournaments?page=" + previouspage;
        npg = null;
      } else if (parseInt(page) === 1) {
        npg = "http://localhost:5000/tournaments?page=" + nextpage;
        ppg = null;
      } else {
        npg = "http://localhost:5000/tournaments?page=" + nextpage;
        ppg = "http://localhost:5000/tournaments?page=" + previouspage;
=======
    const tournament: any = await Tournament.find().exec()
    const newTournament = await tournament.map(async (tournaments, index) => {
      const rules = await TournamentRules.findOne({ _id: tournaments._tournamentRulesId }).exec()
      return { "id": tournaments._id, "rules": rules?.maxParticipant }
    })

    Promise.all(newTournament).then(results => {

      const data = results.map(async (data: any, index) => {
        const _id = data.id
        const report = await TournamentReport.findOne({ _tournamentId: data.id })
        const participant: any = report?.participant
        console.log(data.rules, participant.length)
        const tourn = await Tournament.findOne({ _id: data.id })


        if (data.rules <= participant.length) {
          return { status: 1, message: "tidak tersedia", data: tourn }

        }
        else {
          return { status: 0, message: "tersedia", data: tourn }
        }
      })

      Promise.all(data).then(result => {
        res.status(200).send(result)
      })
    })


  }

  static async seeTournamentList(req, res, next) {
    // pagination
    // search pake regex
    // const tournament= await Tournament.find()
    // res.json({ tournament})
    const { page = 1, limit = 5, q = '' } = req.query
    try {
      const tournament: any = await Tournament.find({ tournamentName: { '$regex': q, '$options': 'i' } })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()
      const nextpage = parseInt(page) + parseInt("1")
      const previouspage = parseInt(page) - parseInt("1")
      const jumlahData = await Tournament.countDocuments({ tournamentName: { '$regex': q, '$options': 'i' } })
      const jumlahpage = Math.ceil(jumlahData / limit)
      console.log(jumlahpage)
      var npg, ppg
      if (parseInt(page) === jumlahpage && parseInt(page) === 1) {
        npg = null
        ppg = null
      } else if (parseInt(page) === (jumlahpage)) {
        ppg = 'http://localhost:5000/tournaments?page=' + previouspage
        npg = null
      }
      else if (parseInt(page) === 1) {
        npg = 'http://localhost:5000/tournaments?page=' + nextpage
        ppg = null
      } else {
        npg = 'http://localhost:5000/tournaments?page=' + nextpage
        ppg = 'http://localhost:5000/tournaments?page=' + previouspage
>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
      }
      res.status(200).send({
        tournament,
        page: page,
        totalPage: jumlahpage,
        nexpages: npg,
<<<<<<< HEAD
        previousPage: ppg,
      });
    } catch (error) {
      console.error(error.message);
=======
        previousPage: ppg
      })
    } catch (error) {
      console.error(error.message)
>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
    }
  }

  static async seeTournamentDetail(req, res, next) {
<<<<<<< HEAD
    const { id } = req.params;
    const tournament = await Tournament.findById(id);
    const participant = await TournamentReport.findOne({
      _tournamentId: id,
    });
    const part: any = participant?.participant.length;
    const rules = await TournamentRules.findOne({
      _id: tournament?._tournamentRulesId,
    });
    const max: any = rules?.maxParticipant;
    const booked = parseInt(part) + "/" + parseInt(max);
    res.status(200).send({
      StartDate: tournament?.tournamentOpen,
      EndDate: tournament?.tournamentClose,
      participant: participant?.participant,
      by: rules?.subdistrict,
      maximumage: rules?.age,
      slot: booked,
    });
=======
    const { id } = req.params
    const tournament = await Tournament.findById(id)
    const participant = await TournamentReport.findOne({
      _tournamentId: id,
    })
    const part: any = participant?.participant.length
    const rules = await TournamentRules.findOne({
      _id: tournament?._tournamentRulesId,
    })
    const max: any = rules?.maxParticipant
    const booked = parseInt(part) + "/" + parseInt(max)
    res.status(200).send({ StartDate: tournament?.tournamentOpen, EndDate: tournament?.tournamentClose, participant: participant?.participant, by: rules?.subdistrict, maximumage: rules?.age, slot: booked })
>>>>>>> 131d6384ed3bc929d993841bd02ca67c6e3ac9c7
  }

  static async seeHallOfFame(req, res, next) {
<<<<<<< HEAD
    // const FFA:any = await Tournament.find({finished:true, tournamentType:'freeforall'})
    // const BRANCHES:any = await Tournament.find({finished:true, tournamentType:'branches'})
    // if(FFA){
    //   // for looping berdasarkan FFA.length
    //   const rank: any = await TournamentReport.find({
    //     _tournamentId: FFA[i]._id,
    //   });
    //   const result = Math.max(rank.stageName);
    //   const winner:any=await TournamentReport.find({stageName:result})
    //   const sort= winner.participant[i].score
    //   res.status(201).json({ result:sort.sort() });
    // }else if (BRANCHES) {
    //   // looping berdasarkan BRANCHES.length
    //   const rank: any = await TournamentReport.findOne({
    //     _tournamentId: BRANCHES._id,
    //   });
    //   const result = Math.max(rank.stageName);
    //   const winner: any = await TournamentReport.find({ stageName: result });
    //   const sort = winner.participant[i].score;
    //   res.status(201).json({ result: sort.sort() });
    // }
=======
    const FFA: any = await Tournament.find({
      finished: true,
      tournamentType: "freeforall",
    });
    const BRANCHES: any = await Tournament.find({
      finished: true,
      tournamentType: "branches",
    });
    if (FFA) {
      const report: any = await TournamentReport.findOne({
        _tournamentId: FFA,
      }).populate({ path: "_tournamentId" });

      TournamentReport.aggregate([
        { $match: { $expr: { _tournamentId: FFA } } },
        {
          $lookup: {
            from: "tournaments",
            localField: "_tournamentId",
            foreignField: "_id",
            as: "tournament",
          },
        },

        { $unwind: { path: "$participant", preserveNullAndEmptyArrays: true } },
        {
          $sort: {
            "participant.score": -1,
          },
        },
        { $unwind: "$tournament" },
      ]).exec((err, result) => {
        if (err) {
          console.error(err);
        }
        res.status(200).send(result);
      });
    } else {
      next({ name: "NO_WINNER" });
    }
    if (BRANCHES) {
    }
>>>>>>> 890e203
  }
}

export default UserController;
