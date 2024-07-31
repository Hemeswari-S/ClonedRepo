import { EmpPermissionInfo } from "../Model/EmpPermissionInfo_model.js";
import { PermissionManager } from "../Model/PermissionManger_model.js";
import { ApprovedText, NotAvailable, success } from "../config/Variables.js";
import nodemailer from "nodemailer";

export const PermissionRequest = async (req, res) => {
  try {
    const { year, month, employeeId, startTime, endTime, RequestedHours } =
      req.body;

    if (
      !year ||
      !month ||
      !employeeId ||
      !startTime ||
      !endTime ||
      !RequestedHours
    ) {
      return res.status(400).json({
        message:
          "Invalid request. Please check your inputs. EmployeeId, month, year, start time, end time, and requested hours cannot be empty.",
      });
    }

    let time1 = new Date(startTime);
    let time2 = new Date(endTime);
    let timeDifference = time2 - time1;

    if (timeDifference <= 0) {
      return res
        .status(400)
        .json({ message: "End time must be after start time." });
    }

    let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    let hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);

    let requestedTime = hours + minutes / 60;
    let requestedHoursFloat = parseFloat(RequestedHours);

    if (Math.abs(requestedTime - requestedHoursFloat) > 0.01) {
      return res.json({
        message: "Check your start time, end time, or requested hours.",
      });
    }

    const TotalHoursPerMonth = 4;

    const permissionInfo = await EmpPermissionInfo.findOne({
      employeeId,
      year: Number(year),
      month: Number(month),
    });

    if (permissionInfo) {
      if (Number(permissionInfo.balancePermissionhours) < requestedHoursFloat) {
        return res.json({ message: NotAvailable });
      } else {
        const data = await PermissionManager.create(req.body);
        jsonEmailNotification_toManager(data);

        await EmpPermissionInfo.findOneAndUpdate(
          { employeeId, year: Number(year), month: Number(month) },
          {
            $inc: {
              balancePermissionhours: -requestedHoursFloat,
              totalHoursPermissionTaken: requestedHoursFloat,
            },
          }
        );

        await PermissionManager.findOneAndUpdate(
          { _id: data._id },
          { $set: { PermissionStatus: ApprovedText } }
        );

        return res.json({ message: success });
      }
    } else {
      const data = await PermissionManager.create(req.body);
      jsonEmailNotification_toManager(data);

      const newPermissionInfo = await EmpPermissionInfo.create({
        employeeId,
        totalHoursPermissionTaken: requestedHoursFloat,
        balancePermissionhours: TotalHoursPerMonth - requestedHoursFloat,
        year: Number(year),
        month: Number(month),
      });

      await PermissionManager.findOneAndUpdate(
        { _id: data._id },
        { $set: { PermissionStatus: ApprovedText } }
      );

      return res.json({ message: success });
    }
  } catch (err) {
    res.json({ message: err.message });
    console.log(err);
  }
};

export const getall = async (req, res) => {
  try {
    const { year, month, employeeId } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
  
    console.log(startDate);
    console.log(endDate);
  
    const permissionData = await PermissionManager.find({
      employeeId: Number(employeeId),
      startTime: { $gte: startDate, $lte: endDate },  
    });
  console.log(permissionData);
    res.json(permissionData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  
};

export const getbyid = async (req, res) => {
  try {
    const data = await PermissionManager.findOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    res.json(err.message);
  }
};

export const DisplayPermissioninfo = async (req, res) => {
  try {
    const data = await EmpPermissionInfo.find({
      employeeId: req.params.id,
      year: Number(req.params.year),
      month: Number(req.params.month),
    });
    if (data.length !== 0) {
      res.json(data);
    } else {
      let DuplicateData = [
        {
          totalHoursPermissionTaken: 0,
          balancePermissionhours: 4,
          year: req.params.year,
          month: req.params.month,
        },
      ];
      res.json(DuplicateData);
    }
  } catch (err) {
    res.json(err.message);
  }
};

export let getfuterPermsiionsbyId = async (req, res) => {
  try {
    let data = await PermissionManager.find({
      employeeId: req.params.id,
      startTime: { $gt: new Date() },
    });
    res.json(data);
  } catch (err) {
    res.json({ message: err.message });
  }
};
export let getfUsedPermsiionsbyId = async (req, res) => {
  try {
    let data = await PermissionManager.find({
      employeeId: req.params.id,
      startTime: { $lt: new Date() },
    });
    res.json(data);
  } catch (err) {
    res.json(err.message);
  }
};

// Email Sending function------to manager
function jsonEmailNotification_toManager(PermissionInfo) {
  console.log(PermissionInfo + "UserInfo.FirstName");

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
      to: "hemeswari.sekar@laninnovations.com",
      subject: `Permission Request from ${PermissionInfo.EmployeeName}`,

      html: `<b>Good Day <b/><br/><p>${
        PermissionInfo.EmployeeName
      } took permision on ${new Date(
        PermissionInfo.startTime
      ).toLocaleDateString()} from ${new Date(
        PermissionInfo.startTime
      ).toLocaleTimeString()} to ${new Date(
        PermissionInfo.endTime
      ).toLocaleTimeString()}  <p/><br/><b>Thank You<b/>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error({ message: "Error sending email:" + error });
      } else {
        console.log({ mesage: "Email sent:" + info.response });
      }
    });
  } catch (err) {
    console.log({ messge: err.message });
  }
}
