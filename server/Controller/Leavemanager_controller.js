import { EmpLeaveInfo } from "../Model/EmpLeaveInfo_model.js";
import { personal_info } from "../Model/EmpPersonal_model.js";
import { positionData } from "../Model/EmpPosition_model.js";
import { LeaveManager } from "../Model/LeaveManager_model.js";
import { LeaveTypeSchema } from "../Model/Leavetype_model.js";
import { User } from "../Model/User_Model.js";

import {
  Admin,
  ApprovedText,
  InvalidAction,
  Manager,
  MedicalLeave,
  None,
  NotAvailable,
  RejectedText,
  ResponceAfterFistApproval,
  success,
} from "../config/Variables.js";
import nodemailer from "nodemailer";
export const LeaveRequest = async (req, res) => {
  try {
    if (req.body.leaveType !== MedicalLeave) {
      const Managerinfo = await personal_info.findOne({
        FirstName: req.body.manager1,
      });

      let Levetypedata = await LeaveTypeSchema.findOne({
        typeOfLeave: req.body.leaveType,
      });
      console.log(req.body);
      console.log(req.body.leaveType);
      console.log(Levetypedata);
      if (!Levetypedata) {
        return res.json({ message: "Leavetype Not Available" });
      }

      if (!req.body.leaveType) {
        return res.json({ message: "Please select leave type." });
      }
      let UserInfo = await personal_info.findOne({
        EmployeeId: req.body.employeeId,
      });
      let Leaveinfo = await EmpLeaveInfo.findOne({
        employeeId: req.body.employeeId,
        leaveType: req.body.leaveType,
        year: Number(req.body.year),
      });
      let noOfdays = req.body.noOfDays;
      if (!(Number(Levetypedata.availableForAYear) - Number(noOfdays) < 0)) {
        if (Leaveinfo) {
          if (Number(Leaveinfo.balanceLeave) - Number(noOfdays) < 0) {
            return res.json({ message: NotAvailable });
          } else {
            let data = await LeaveManager.create(req.body);
            let Qry = {
              employeeId: req.body.employeeId,
              leaveType: req.body.leaveType,
              year: Number(req.body.year),
            };
            let vals = {
              balanceLeave: Number(Leaveinfo.balanceLeave) - Number(noOfdays),
              numOfDaysLeaveTaken:
                Number(Leaveinfo.numOfDaysLeaveTaken) + Number(noOfdays),
            };
            let Info = await EmpLeaveInfo.findOneAndUpdate(Qry, { $set: vals });
            jsonEmailNotification_toManager(
              data,
              UserInfo,
              Managerinfo.ProffessionalEmailId
            );
            return res.json({ message: success });
          }
        } else {
          let data = await LeaveManager.create(req.body);
          // let totlLeave = await LeaveType.findOne({
          //   typeOfLeave: req.body.leaveType,
          // });
          // console.log(Levetypedata);
          let availableForAYear = Levetypedata.availableForAYear;
          if ((Levetypedata = null)) {
            return res.json({ message: "LeaveType is Not Available" });
          } else {
            let leavinfo = await EmpLeaveInfo.create({
              employeeId: req.body.employeeId,
              leaveType: req.body.leaveType,
              numOfDaysLeaveTaken: Number(noOfdays),
              balanceLeave: Number(availableForAYear) - Number(noOfdays),
              year: Number(req.body.year),
            });
            jsonEmailNotification_toManager(
              data,
              UserInfo,
              Managerinfo.ProffessionalEmailId
            );
            return res.json({ message: success });
          }
        }
      } else {
        return res.json({ message: "Not Available" });
      }
    } else {
      console.log("req.body");
      // console.log(req.body.Evidence);
      console.log(req.file);

      const reqbody = {
        employeeId: req.body.employeeId,
        leaveType: req.body.leaveType,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        noOfDays: req.body.noOfDays,
        RequestedBY: req.body.RequestedBY,
        manager1: req.body.manager1,
        manager2: req.body.manager2,
        pedingWith: req.body.pedingWith,
        year: req.body.year,
        Evidence: {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          buffer: req.file.buffer,
        },
      };

      const Managerinfo = await personal_info.findOne({
        FirstName: req.body.manager1,
      });

      let Levetypedata = await LeaveTypeSchema.findOne({
        typeOfLeave: req.body.leaveType,
      });
      console.log(req.body.leaveType);
      console.log(Levetypedata);
      if (!Levetypedata) {
        return res.json({ message: "Leavetype Not Available" });
      }

      if (!req.body.leaveType) {
        return res.json({ message: "Please select leave type." });
      }
      let UserInfo = await personal_info.findOne({
        EmployeeId: req.body.employeeId,
      });
      let Leaveinfo = await EmpLeaveInfo.findOne({
        employeeId: req.body.employeeId,
        leaveType: req.body.leaveType,
        year: Number(req.body.year),
      });
      let noOfdays = req.body.noOfDays;
      if (!(Number(Levetypedata.availableForAYear) - Number(noOfdays) < 0)) {
        if (Leaveinfo) {
          if (Number(Leaveinfo.balanceLeave) - Number(noOfdays) < 0) {
            return res.json({ message: NotAvailable });
          } else {
            let data = await LeaveManager.create(reqbody);
            let Qry = {
              employeeId: req.body.employeeId,
              leaveType: req.body.leaveType,
              year: Number(req.body.year),
            };
            let vals = {
              balanceLeave: Number(Leaveinfo.balanceLeave) - Number(noOfdays),
              numOfDaysLeaveTaken:
                Number(Leaveinfo.numOfDaysLeaveTaken) + Number(noOfdays),
            };
            let Info = await EmpLeaveInfo.findOneAndUpdate(Qry, { $set: vals });
            jsonEmailNotification_toManager(
              data,
              UserInfo,
              Managerinfo.ProffessionalEmailId
            );
            return res.json({ message: success });
          }
        } else {
          let data = await LeaveManager.create(reqbody);
          // let totlLeave = await LeaveType.findOne({
          //   typeOfLeave: req.body.leaveType,
          // });
          // console.log(Levetypedata);
          let availableForAYear = Levetypedata.availableForAYear;
          if ((Levetypedata = null)) {
            return res.json({ message: "LeaveType is Not Available" });
          } else {
            let leavinfo = await EmpLeaveInfo.create({
              employeeId: req.body.employeeId,
              leaveType: req.body.leaveType,
              numOfDaysLeaveTaken: Number(noOfdays),
              balanceLeave: Number(availableForAYear) - Number(noOfdays),
              year: Number(req.body.year),
            });
            jsonEmailNotification_toManager(
              data,
              UserInfo,
              Managerinfo.ProffessionalEmailId
            );
            return res.json({ message: success });
          }
        }
      } else {
        return res.json({ message: "Not Available" });
      }
    }
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
    console.log(err);
  }
};
//for manager action
export const getalltoApprove = async (req, res) => {
  console.log(req.params.name);
  try {
    let data = await LeaveManager.find({
      pedingWith: req.params.name,
      leaveStatus: { $nin: [ApprovedText, RejectedText] },
    });
    console.log(data);
    res.json(data);
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
};
//for manager view
export const getallApproved = async (req, res) => {
  try {
    const { year, month, employeeId } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    console.log(startDate);
    console.log(endDate);

    const leaveData = await LeaveManager.find({
      employeeId: Number(employeeId),
      startDate: { $gte: startDate, $lte: endDate },
    });

    res.json(leaveData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//for manager view
export const getallRejected = async (req, res) => {
  try {
    let data = await LeaveManager.find({
      startDate: { $gt: new Date() },
      leaveStatus: RejectedText,
    });
    res.json(data);
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
};

//for Approved leaves for user view
export const getApprovedLeavesbyId = async (req, res) => {
  try {
    // console.log(req.params.id);
    console.log(new Date().toLocaleDateString());
    let data = await LeaveManager.find({
      employeeId: req.params.id,
      startDate: { $gte: new Date() },
      leaveStatus: ApprovedText,
    });
    // console.log(data);
    res.json(data);
  } catch (err) {
    res.status(500);
    res.json(err.message);
  }
};

//for pending leaves for user view
export const getpendingLeavesbyId = async (req, res) => {
  try {
    let data = await LeaveManager.find({
      employeeId: req.params.id,
      startDate: { $gt: new Date() },
      leaveStatus: { $ne: ApprovedText },
    });
    res.json(data);
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
};

//for manger action
export const getbyid = async (req, res) => {
  try {
    // console.log(req.params._id);

    let data = await LeaveManager.findById(req.params._id);
    res.json(data);
    // console.log(data);
  } catch (err) {
    res.json({ message: err.message });
  }
};

//for manager action----------under working -----------
export const ActionUpdate = async (req, res) => {
  try {
    if (!req.body.leaveStatus) {
      res.json({ message: "Please enter leave Status." });
    }
    if (!req.body.actionBy) {
      res.json({ message: "Please enter actionBy." });
    }
    if (!req.body.year) {
      res.json({ message: "Please enter year." });
    }
    let ManagerInfo = await LeaveManager.findOne({ _id: req.body._id });
    let UserDetails = await personal_info.findOne({
      EmployeeId: ManagerInfo.employeeId,
    });
    let manager2 = await personal_info.findOne({
      FirstName: ManagerInfo.manager2,
    });
    let Leaveinfo = await EmpLeaveInfo.findOne({
      employeeId: ManagerInfo.employeeId,
      leaveType: ManagerInfo.leaveType,
      year: Number(req.body.year),
    });
    if (ManagerInfo.manager1 === req.body.actionBy) {
      // console.log(req.body.LeaveStaus);
      if (req.body.leaveStatus === ApprovedText) {
        let Qry = {
          _id: req.body._id,
        };
        let vals = {
          actionBy: req.body.actionBy,
          leaveStatus: ResponceAfterFistApproval,
          pedingWith: ManagerInfo.manager2,
        };
        let Info = await LeaveManager.findOneAndUpdate(Qry, { $set: vals });
        res.json({ message: ResponceAfterFistApproval });

        jsonEmailNotification_toManager(
          ManagerInfo,
          UserDetails,
          manager2.ProffessionalEmailId
        );
      } else {
        let Qry = {
          _id: req.body._id,
        };
        let vals = {
          actionBy: req.body.actionBy,
          leaveStatus: RejectedText,
        };
        let Info = await LeaveManager.findOneAndUpdate(Qry, { $set: vals });
        let Qry1 = {
          employeeId: ManagerInfo.employeeId,
          leaveType: ManagerInfo.leaveType,
        };
        let vals1 = {
          balanceLeave:
            Number(Leaveinfo.balanceLeave) + Number(ManagerInfo.noOfDays),
          numOfDaysLeaveTaken:
            Number(Leaveinfo.numOfDaysLeaveTaken) -
            Number(ManagerInfo.noOfDays),
        };
        let Info1 = await EmpLeaveInfo.findOneAndUpdate(Qry1, {
          $set: vals1,
        });
        jsonEmailNotification_toUser(UserDetails, RejectedText);
        res.json({ message: RejectedText });
      }
    } else if (ManagerInfo.manager2 === req.body.actionBy) {
      if (req.body.leaveStatus === ApprovedText) {
        let Qry = {
          _id: req.body._id,
        };
        let vals = {
          actionBy: req.body.actionBy,
          leaveStatus: ApprovedText,
        };
        let Info = await LeaveManager.findOneAndUpdate(Qry, { $set: vals });
        jsonEmailNotification_toUser(UserDetails, ApprovedText);

        res.json({ message: ApprovedText });
      } else {
        let Qry = {
          _id: req.body._id,
        };
        let vals = {
          actionBy: req.body.actionBy,
          leaveStatus: RejectedText,
          pedingWith: None,
        };
        let Info = await LeaveManager.findOneAndUpdate(Qry, { $set: vals });
        let Qry1 = {
          employeeId: ManagerInfo.employeeId,
          leaveType: ManagerInfo.leaveType,
        };
        let vals1 = {
          balanceLeave:
            Number(Leaveinfo.balanceLeave) + Number(ManagerInfo.noOfDays),
          numOfDaysLeaveTaken:
            Number(Leaveinfo.numOfDaysLeaveTaken) -
            Number(ManagerInfo.noOfDays),
        };
        let Info1 = await EmpLeaveInfo.findOneAndUpdate(Qry1, {
          $set: vals1,
        });

        jsonEmailNotification_toUser(UserDetails, RejectedText);

        res.json({ message: RejectedText });
      }
    } else {
      res.json({ message: InvalidAction });
    }
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
};

// ----------------------display balance eave for an employeeee
export const DisplayLeaveinfo = async (req, res) => {
  try {
    let LEaveInfodata = await EmpLeaveInfo.find({
      employeeId: req.params.id,
      year: Number(req.params.year),
    });
    let leaveTypesToOmit = LEaveInfodata.map((d) => d.leaveType);
    let LeavetypeData = await LeaveTypeSchema.find({
      typeOfLeave: { $nin: leaveTypesToOmit },
    });

    let filteredLeaveInfo = LEaveInfodata.map((d) => ({
      leaveType: d.leaveType,
      remainingLeaves: d.balanceLeave,
      AvaildLeavs: d.numOfDaysLeaveTaken,
    }));
    let combinedData = [
      ...filteredLeaveInfo,
      ...LeavetypeData.map((d) => ({
        leaveType: d.typeOfLeave,
        remainingLeaves: d.availableForAYear,
        AvaildLeavs: 0,
      })),
    ];

    res.json(combinedData);
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
};

// Email jsoning function------to manager
function jsonEmailNotification_toManager(data, UserInfo, ManagerEmail) {
  console.log(UserInfo.FirstName + "UserInfo.FirstName");
  console.log(data.noOfDays + "data.noOfDays");
  // console.log(UserInfo.FirstName);
  // console.log(UserInfo.FirstName);
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      secure: true,
      port: 465,
      auth: {
        user: "internalcomm@laninnovations.com",
        pass: "CegT7372q9DX",
      },
    });

    let mailOptions = {
      from: "internalcomm@laninnovations.com",
      to: ManagerEmail,
      subject: `Leave Request from ${UserInfo.FirstName}`,
      text: `${UserInfo.FirstName} has requested Leave dueto "${
        data.reason
      }" for ${data.noOfDays}days from ${new Date(
        data.startDate
      ).toLocaleDateString()} to ${new Date(
        data.endDate
      ).toLocaleDateString()}`,
      html: `<b>Good Day <b/><br/><p>${
        UserInfo.FirstName
      } has requested Leave for ${data.noOfDays} day(s) from ${new Date(
        data.startDate
      ).toLocaleDateString()} to ${new Date(
        data.endDate
      ).toLocaleDateString()} dueto ${data.reason}<p/>
      <a href='https://laninternalapp.onrender.com/'> Click Here to Take Action</a><br/><br/>
      <b>Thank You<b/>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error({ message: "Error sending email:" + error });
      } else {
        console.log({ mesage: "Email sent:" + info.response });
      }
    });
  } catch (err) {
    res.json({ message: err.messages });
  }
}
// Email jsoning function------to User
function jsonEmailNotification_toUser(UserInfo, Status) {
  console.log(UserInfo.ProffessionalEmailId + "UserInfo.EmailId");

  // console.log(UserInfo);
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: "internalcomm@laninnovations.com",
      pass: "CegT7372q9DX",
    },
  });

  let mailOptions = {
    from: "internalcomm@laninnovations.com",
    to: UserInfo.ProffessionalEmailId,
    subject: `Leave Status`,
    text: `Your Leave Reqeust Has been ${Status}`,
    html: `<b>Good Day <b/><br/><p>Your Leave Request has been ${Status}<p/><br/><b>Thank You<b/>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error({ message: "Error Sending email:" + error });
    } else {
      console.log({ mesage: "Email sent:" + info.response });
    }
  });
}

// ------------getleavedays
export const GetLeavedays = async (req, res) => {
  let LeaveDays = 0;
  let paramsleavetpe = req.params.Leavetype;
  if (req.params.Leavetype===null) {
    res.json({ LeaveDays });
  } else {
    const EmpId = req.params.EmpId;
    const empleaveinfo = await EmpLeaveInfo.findOne({
      employeeId: EmpId,
      leaveType: paramsleavetpe,
      
      
    });
    if (empleaveinfo) {
      LeaveDays = empleaveinfo.balanceLeave;
    } else {
      let Levetypedata = await LeaveTypeSchema.findOne({
        typeOfLeave: paramsleavetpe,
      });
      LeaveDays = Levetypedata.availableForAYear;
    }

    res.json({ LeaveDays });
  }
};

export const GetEmployeesByManager = async (req, res) => {
  try {
    const UserRole = req.params.role;

    if (UserRole === Admin) {
      const Data = await User.find(
        { UserId: { $ne: 1 } },
        { UserId: 1, FirstName: 1, LastName: 1 }
      );
      res.json(Data);
    } else if (UserRole === Manager) {
      const DesignationData = await positionData.find();
      const filteredData = [];

      await Promise.all(
        DesignationData.map(async (d) => {
          if (d.designation.length !== 0) {
            let lastIndex = d.designation.length - 1;
            if (
              Number(d.designation[lastIndex].managerId) ===
              Number(req.params.employeeId)
            ) {
              filteredData.push(d.employeeId);
            }
          }
        })
      );
      let EmployeeData = [];
      let Info = [];
      for (let i = 0; i < filteredData.length; i++) {
        Info = await User.findOne(
          { UserId: filteredData[i] },
          { UserId: 1, FirstName: 1, LastName: 1 }
        );
        EmployeeData.push(Info);
      }
      res.json(EmployeeData);
    } else {
      let Data = await EmployeeSalary.findOne({
        employeeId: req.params.employeeId,
      });
      console.log(Data);
      return res.json(Data);
    }
  } catch (err) {
    res;
    res.json({ message: err.message });
  }
};
