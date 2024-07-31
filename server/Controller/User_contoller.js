import { contactdata } from "../Model/EMpContact_Model.js";
import { BankInfo } from "../Model/EmpBankInfo_model.js";
import { EmpdependentInfo } from "../Model/EmpDependent_model.js";
import { employeedocument } from "../Model/EmpDocuments_model.js";
import { EmpExitManagement } from "../Model/EmpExitManagement_model.js";
import EmpExperienceInfo from "../Model/EmpExperienceInfo_model.js";
import { personal_info } from "../Model/EmpPersonal_model.js";
import { positionData } from "../Model/EmpPosition_model.js";
import { empQualiInfo } from "../Model/EmpQualificaaion_model.js";
import { Role } from "../Model/Role_Model.js";
import { User } from "../Model/User_Model.js";
import { Admin, Manager, success } from "../config/Variables.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
export const createUser = async (req, res) => {
  console.log(req.body);
  try {
    const RoleDetails = await Role.findOne({ roleId: req.body.RoleID });
    console.log(RoleDetails);
    const { UserId, FirstName, LastName, EmailId, RoleID, RoleName, Username } =
      req.body;
    if (!RoleDetails) {
      res.json({ message: "Please Check Your Role Name/Id" });
    } else {
      // const password = " ";
      const OTP = Math.floor(100000 + Math.random() * 900000);
      const bodydata = {
        UserId,
        FirstName,
        LastName,
        EmailId,
        Username,
        RoleId: RoleID,
        RoleName,
        OTP,
      };
      console.log("bodydata");
      console.log(bodydata);
      const data = await User.create(bodydata);
      const Personaldata = await personal_info.create({
        EmployeeId: UserId,
        FirstName: FirstName,
        LastName: LastName,
        ProffessionalEmailId: EmailId,
        UserId: UserId,
      });
      const qualificationdata = await empQualiInfo.create({
        employeeId: UserId,
      });
      const BankData = await BankInfo.create({ EmployeeId: UserId });
      const contactDataa = await contactdata.create({ employeeId: UserId });
      const Exitdata = await EmpExitManagement.create({
        EmployeeId: UserId,
        EmpName: FirstName,
      });
      const experienceData = await EmpExperienceInfo.create({
        EmployeeId: UserId,
      });
      const dependentData = await EmpdependentInfo.create({
        EmployeeId: UserId,
      });
      const Designation = await positionData.create({
        employeeId: UserId,
        emailId: EmailId,
        EmpName: FirstName,
      });
      const documentData = await employeedocument.create({
        employeeID: UserId,
      });
      res.status(200);
      res.json({ message: success, Username: req.body.Username, OTP });
    }
  } catch (err) {
    res.json({ message: err.message });
    console.log(err);
  }
};

export const Sigin = async (req, res) => {
  try {
    console.log(req.body);
    const UserDetails = await User.findOne({ Username: req.body.Username });
    console.log(UserDetails);
    if (!UserDetails) {
      res.json({ message: "No user found" });
    } else {
      const RoleDetails = await Role.findOne({ roleId: UserDetails.RoleId });
      const EmplyeeDetails = await personal_info.findOne({
        UserId: UserDetails.UserId,
      });

      if (UserDetails.Password === "") {
        const now = new Date();
        const otpExpiryTime = new Date(UserDetails.otpExpires);

        if (now > otpExpiryTime) {
          res.status(201).json("OTP Expired");
        } else {
          if (UserDetails.OTP === Number(req.body.password)) {
            res.json({ message: "OTP verified", UserId: UserDetails.UserId });
          } else {
            res.json({ message: "Invalid OTP" });
          }
        }
      } else {
        console.log(EmplyeeDetails);
        if (!EmplyeeDetails) {
          return res.json({ message: "Employee Not Found" });
        }

        const isPasswordValid = await bcrypt.compare(
          req.body.password,
          UserDetails.Password
        );
        if (!isPasswordValid) {
          return res.json({ message: "Invalid password" });
        } else {
          let Dashboard = "";
          if (RoleDetails.roleName === Admin) {
            Dashboard = "/Admindashboard";
          } else if (RoleDetails.roleName === Manager) {
            Dashboard = "/EmployeeDashboard";
          } else {
            Dashboard = "/EmployeeDashboard";
          }

          res.status(200).json({
            message: "SignedIn",
            UserRole: RoleDetails.roleName,
            UserId: UserDetails.UserId,
            EmployeeId: EmplyeeDetails.EmployeeId,
            Name: UserDetails.FirstName,
            dashboard: Dashboard,
          });
        }
      }
    }
  } catch (err) {
    res.json({ message: err.message });
    console.log(err);
  }
};

export const AddPassword = async (req, res) => {
  try {
    const UserData = await User.find({
      Username: req.body.Username,
      UserId: req.body.UserId,
    });
    console.log(req.body);
    if (UserData.length != 0) {
      const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      const numberRegex = /[0-9]/;
      if (req.body.Username === req.body.Password) {
        res.json({ message: "Username & Password Can't be same" });
      } else if (!specialCharRegex.test(req.body.Password)) {
        return res.json({
          message: "Password must contain at least one special character.",
        });
      } else if (!numberRegex.test(req.body.Password)) {
        return res.json({
          message: "Password must contain at least one number.",
        });
      } else if (req.body.Password.length < 8) {
        return res.json({
          message: "Password must be at least 8 characters long.",
        });
      } else {
        const name = req.body.username;
        let password = req.body.Password;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const Qry = { UserId: Number(req.body.UserId) };
        const vals = {
          Password: hashedPassword,
        };

        const data = await User.findOneAndUpdate(Qry, { $set: vals });
        res.status(200).json({ message: success });
      }
    } else {
      res.json({ message: "Inavalid Username" });
    }
  } catch (err) {
    res.json({ message: err.message });
    console.log(err);
  }
};

export const Forgotpswd = async (req, res) => {
  try {
    const UserData = await User.findOne({
      Username: req.body.Username,
    });
    console.log(UserData);

    if (UserData !== null) {
      const now = new Date();
      const otpExpiryTime = new Date(UserData.otpExpires);
      if (now < otpExpiryTime && UserData.otpAttempts >= 3) {
        return res
          .status(201)
          .json("Too many attempts. Please try again later.");
      }
      if (now > otpExpiryTime) {
        UserData.otpAttempts = 0;
      }

      if (UserData.otpAttempts < 3) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        const vals = {
          Password: "",
          OTP: otp,
          otpAttempts: UserData.otpAttempts + 1,
          otpExpires: otpExpiry,
        };

        await User.findOneAndUpdate(
          { Username: req.body.Username },
          { $set: vals }
        );

        const ManagerData = await positionData.findOne({
          employeeId: UserData.UserId,
        });

        let ManagerID = 0;
        let ManagerEmail = "";
        console.log(ManagerData);
        if (ManagerData && ManagerData.designation.length !== 0) {
          let LastIndex = ManagerData.designation.length - 1;
          ManagerID = ManagerData.designation[LastIndex].managerId;

          console.log("ManagerEmail");
          console.log(ManagerID);
          const Manager = await User.findOne({ UserId: ManagerID });
          ManagerEmail = Manager ? Manager.EmailId : "";
          console.log("Manager");
          console.log(Manager);
          ManagerEmail = Manager.EmailId;
        }

        console.log("ManagerEmail");
        console.log(ManagerEmail);

        jsonEmailNotification_toUser(UserData, otp, ManagerEmail);

        res.status(200).json(otp);
      } else {
        res.status(201).json("Too many attempts. Please try again later.");
      }
    } else {
      res.json({ message: "Invalid Username" });
    }
  } catch (err) {
    res.json({ message: err.message });
    console.log(err);
  }
};

function jsonEmailNotification_toUser(User, otp, ManagerEmail) {
  console.log(User.EmailId + "User.EmailId");

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
    to: User.EmailId,
    cc: ManagerEmail,
    subject: `Your OTP for Password Reset`,
    text: `Your OTP for password reset is ${otp}`,
    html: `<b>Good Day</b><br/><p>Your OTP for password reset is <b>${otp}</b></p><br/><b>Thank You</b>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error({ message: "Error Sending email:" + error });
    } else {
      console.log({ message: "Email sent:" + info.response });
    }
  });
}

export const GetAll = async (req, res) => {
  try {
    const data = await User.find({ UserId: { $ne: 1 } });
    res.json(data);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getManagers = async (req, res) => {
  try {
    const Managers = await User.find({ RoleName: "Manager" }, { FirstName: 1 });
    res.json(Managers);
  } catch (err) {
    res.json(err.message);
    console.log(err);
  }
};
