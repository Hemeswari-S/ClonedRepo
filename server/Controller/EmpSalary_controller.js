import { EmployeeSalary } from "../Model/EmpSalary_model.js";
import csv from "csvtojson";
import { Readable } from "stream";
import { positionData } from "../Model/EmpPosition_model.js";
import { Admin, Employee, Manager } from "../config/Variables.js";
import moment from "moment";

export const Create = async (req, res) => {
  try {
    if (!req.file) {
      res.json({ error: "Upload File" });
    }
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const results = await csv().fromStream(bufferStream);
    const currentMonthYear = moment().format("MMM-YY");

    if (
      !results[0].hasOwnProperty("payPeriod") ||
      !results.some((row) => row.payPeriod === currentMonthYear)
    ) {
      return res.json({
        message: `CSV file must contain the "payPeriod" column with the current month and year ${currentMonthYear}`,
      });
    }

    try {
      await EmployeeSalary.insertMany(results);
      res.json({ message: "Data successfully inserted into database" });
    } catch (insertError) {
      res.json({
        message: "Error inserting data into database: " + insertError.message,
      });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

//for admin
const getall = async (res) => {
  try {
    const data = await EmployeeSalary.find();
    res.json(data);
  } catch (err) {
    res;
    res.json(err.message);
  }
};

//for manager
export const getallbymanager = async (req, res) => {
  try {
    console.log("Log");
    const UserRole = req.params.role;

    if (UserRole === Admin) {
      await getall(res);
    } else if (UserRole === Manager) {
      const DesignationData = await positionData.find();
      const filteredData = [];
      await Promise.all(
        DesignationData.map(async (d) => {
          if (d.designation.length !== 0) {
            let lastIndex = d.designation.length - 1;
            if (
              Number(d.designation[lastIndex].managerId) ===
              Number(req.params.Id)
            ) {
              filteredData.push(d.employeeId);
            }
          }
        })
      );
      console.log(filteredData);

      let SalaryInfo = [];
      let Info = [];
      for (let i = 0; i < filteredData.length; i++) {
        Info = await EmployeeSalary.find({ employeeId: filteredData[i] });
        if (Info.length === 0) {
          return res.json({ message: "Info Not Found" });
        }
        for (let j = 0; j < Info.length; j++) {
          SalaryInfo.push(Info[j]);
        }
      }
      res.json(SalaryInfo);
    } else if (UserRole === Employee) {
      let SalInfo = await EmployeeSalary.findOne({ employeeId: req.params.Id });
      console.log(req.params.Id);
      console.log(SalInfo);
      if (!SalInfo) {
        return res.json({ message: "Info Not Found" });
      } else {
        return res.json({ SalInfo });
      }
    } else {
      return res.json({ message: "Role not found" });
    }
  } catch (err) {
    res;
    res.json({ message: err.message });
  }
};

export const GetbyUser = async (req, res) => {
  try {
    let SalInfo = await EmployeeSalary.findOne({
      employeeId: req.params.Id,
      payPeriod: req.params.PayPeriod,
    });
    console.log(req.params.Id);
    console.log(SalInfo);
    if (!SalInfo) {
      return res.json({ message: "Info Not Found" });
    } else {
      return res.json({ SalInfo });
    }
  } catch (err) {
    res.json({ message: err.meassage });
  }
};
