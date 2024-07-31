import { EmployeePayroll } from "../Model/Payroll_model.js";
// import csvParser from "csv-parser";
import csv from "csvtojson";
import { Readable } from "stream";
import { personal_info } from "../Model/EmpPersonal_model.js";
import { EmployeeSalary } from "../Model/EmpSalary_model.js";
import { positionData } from "../Model/EmpPosition_model.js";
import { EmployeePayslip } from "../Model/PayslipHistory_model.js";
import {
  AdressLine1,
  AdressLine2,
  CompanyName,
  location,
  success,
} from "../config/Variables.js";
import { log } from "console";
import moment from "moment";
import { BankInfo } from "../Model/EmpBankInfo_model.js";
import { EmployeeAttendance } from "../Model/EmpAttendance_model.js";
import { GetOneUserData } from "./Attendance_controller.js";
import { LeaveManager } from "../Model/LeaveManager_model.js";
import { EmpLeaveInfo } from "../Model/EmpLeaveInfo_model.js";
import { LeaveTypeSchema } from "../Model/Leavetype_model.js";

// export const UploadCSVAndSave = async (req, res) => {
//   try {
//     if (!req.file) {
//       res.json("Please Upload File")
//     }
//     const bufferStream = new Readable();
//     bufferStream.push(req.file.buffer);
//     bufferStream.push(null);

//     const results = await csv().fromStream(bufferStream);
//     try {
//       log(results);

//       await EmployeePayroll.insertMany(results);
//       res.json({message:'Data successfully inserted into database'});
//     } catch (insertError) {
//       res.json({message:'Error inserting data into database: '});
//     }
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// }

export const UploadCSVAndSave = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("Please Upload File");
    }

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const results = await csv().fromStream(bufferStream);

    if (results.length === 0) {
      return res.json({ message: "CSV file is empty." });
    }

    const currentMonthYear = moment().format("MMM-YY");

    if (
      !results[0].hasOwnProperty("payPeriod") ||
      !results.some((row) => row.payPeriod === currentMonthYear)
    ) {
      return res.json({
        message: `CSV file must contain the "payPeriod" column with the current month and year (${currentMonthYear}).`,
      });
    }

    try {
      log(results);

      await EmployeePayroll.insertMany(results);
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

export const getall = async (req, res) => {
  try {
    const data = await EmployeePayroll.find();
    res.json(data);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getforsingleuser = async (req, res) => {
  try {
    const data = await EmployeePayroll.find({
      employeeId: req.params.employeeId,
    });
    if (data.length === 0) {
      return res.json("Invalid Id");
    } else {
      res.json(data);
    }
  } catch (err) {
    res.json(err.message);
  }
};
export const AfterDownload = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const PayPeriod = req.params.date;
    if (!req.file) {
      return res.json("Can't find File");
    }
    if (req.params.employeeId || PayPeriod) {
      const DocumentData = await EmployeePayslip.findOne({
        employeeId: employeeId,
        PayPeriod: PayPeriod,
      });
      if (!DocumentData) {
        const UserData = await personal_info.findOne({
          EmployeeId: req.params.employeeId,
        });
        if (!UserData) {
          return res.json("Invalid Id or Invalid Payperiod");
        } else {
          const lastModifiedItem = await EmployeePayslip.findOne()
            .sort({ updatedAt: -1 })
            .exec();
          let payslipId = 0;
          if (!lastModifiedItem) {
            payslipId += 1;
          } else {
            payslipId = lastModifiedItem.payslipId + 1;
          }
          const generatedBy = UserData.FirstName + " " + UserData.LastName;
          const payslipDate = new Date();
          const data = req.file.buffer;
          const contentType = req.file.mimetype;
          const Filename = req.file.originalname;
          const Payslipdata = {
            employeeId,
            payslipId,
            Filename,
            generatedBy,
            payslipDate,
            data,
            contentType,
            PayPeriod,
          };
          const result = await EmployeePayslip.create(Payslipdata);
          res.json(success);
        }
      } else {
        res.json(success);
      }
    } else {
      res.json("please check you payperiod and employeeId");
    }
  } catch (err) {
    res.json(err.message);
    console.log(err);
  }
};

export const getPayslip = async (req, res) => {
  try {
    const payperiod = req.params.payperiod;
    if (req.params.employeeId || payperiod) {
      const Payrolldata = await EmployeePayroll.findOne({
        employeeId: req.params.employeeId,
        payPeriod: moment(payperiod).format("MMM-YY"),
      });
      const BankDeatils = await BankInfo.findOne({
        EmployeeId: req.params.employeeId,
      });
      // if (Payrolldata) {
      const UserData = await personal_info.findOne({
        EmployeeId: req.params.employeeId,
      });
      const SalaryData = await EmployeeSalary.findOne({
        employeeId: req.params.employeeId,
      });
      const PositionInfo = await positionData.findOne({
        employeeId: req.params.employeeId,
      });
      const SalaryNet =
        SalaryData.baseSalary +
        SalaryData.allowances +
        SalaryData.overtimePay -
        (SalaryData.PF + SalaryData.ProfessinalTax + SalaryData.deductions);
      const SalaryInWords = numberToWords(SalaryNet);

      const EMpLeaveInfo = await LeavedaysFunc(
        req.params.employeeId,
        new Date(payperiod).getFullYear()
      );

      let lastIndex = PositionInfo.designation.length - 1;
      res.json({
        companyName: CompanyName,
        addressline1: AdressLine1,
        addressline2: AdressLine2,
        employeeDetails: {
          employeeName: UserData.FirstName + " " + UserData.LastName,
          employeeNumber: UserData.EmployeeId,
          dateJoined: new Date(
            PositionInfo.designation[lastIndex].startDate
          ).toLocaleDateString(),
          designation: PositionInfo.designation[lastIndex].position,
          location: location,
          paymentMode: Payrolldata.paymentMethod,
          bank: BankDeatils.BankName,
          ifsc: BankDeatils.IFSCCode,
          account: BankDeatils.AccountNumber,
          pan: BankDeatils.PANnumber,
          uan: SalaryData.UAN,
          pfNumber: SalaryData.PF_AC_no,
        },
        salaryDetails: await AttendacedataforPayslip(
          new Date(payperiod).getFullYear(),
          new Date(payperiod).getMonth(),
          req.params.employeeId
        ),
        earnings: [
          { type: "Basic + DA", amount: SalaryData.baseSalary },
          { type: "HRA", amount: SalaryData.allowances },
          { type: "OverTime", amount: SalaryData.overtimePay },
        ],
        contributions: [{ type: "PF", amount: SalaryData.PF }],
        taxes: [
          { type: "professional Tax", amount: SalaryData.ProfessinalTax },
          { type: "Deductions", amount: SalaryData.deductions },
        ],
        netSalary: SalaryNet,
        netSalaryWords: SalaryInWords,
        leaveDetails: EMpLeaveInfo,
      });
    }
    // } else {
    //   res.json({ message: "Data Not Found" });
    // }
    // }
    //  else {
    //   res.json(Payslipdata)
    // }
    // } else {
    //   res.json({ message: "please check you payperiod and employeeId" });
    // }
  } catch (err) {
    res.json({ message: err.message });
    console.log(err);
  }
};

export const getallPayslip = async (req, res) => {
  try {
    const data = await EmployeePayslip.find();
    res.json(data);
  } catch (err) {
    res.json({ message: err.message });
  }
};

const AttendacedataforPayslip = async (year, month, empId) => {
  const StartDate = moment([year, month]).startOf("month").toDate();
  const EndDate = moment(StartDate).endOf("month").toDate();
  const data = await EmployeeAttendance.find({
    employeeId: empId,
    checkInTime: { $gte: StartDate, $lte: EndDate },
  });

  const PresentDays = data.length;
  const daysInMonth = new Date(year, month, 0).getDate();
  let WeekendDaysCount = 0;
  for (
    let date = StartDate;
    date <= EndDate;
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() === 0 || date.getDay() === 6) {
      WeekendDaysCount++;
    }
  }
  const totalLeaveDays = await CalculateLeaveDays(empId, year, month + 1);

  const Data = {
    actualPayableDays: daysInMonth,
    totalWorkingDays: daysInMonth,
    lossOfPayDays: totalLeaveDays,
    daysPayable: PresentDays,
  };
  return Data;
};

const units = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const thousands = ["", "Thousand", "Million", "Billion"];

function numberToWords(num) {
  if (num === 0) return "Zero";
  let word = "";
  let thousandCounter = 0;

  while (num > 0) {
    let chunk = num % 1000;
    if (chunk !== 0) {
      word = chunkToWords(chunk) + thousands[thousandCounter] + " " + word;
    }
    num = Math.floor(num / 1000);
    thousandCounter++;
  }

  return word.trim();
}

function chunkToWords(num) {
  let word = "";

  if (num > 99) {
    word += units[Math.floor(num / 100)] + " Hundred ";
    num = num % 100;
  }

  if (num > 19) {
    word += tens[Math.floor(num / 10)] + " ";
    num = num % 10;
  }

  if (num > 0) {
    word += num < 10 ? units[num] : teens[num - 10];
  }

  return word.trim() + " ";
}

async function CalculateLeaveDays(EmpId, year, month) {
  let LeaveDays = 0;
  let leaveDuration = 0;

  const StartDate1 = moment([year, month - 1])
    .startOf("month")
    .toDate();
  const EndDate1 = moment(StartDate1).endOf("month").toDate();

  // const StartDate1 = moment([req.body.year, req.body.month - 1]).startOf('month').toDate();
  // const EndDate1 = moment(StartDate1).endOf('month').toDate();

  const leaveRecords = await LeaveManager.find({
    employeeId: EmpId,
    $or: [
      { startDate: { $gte: StartDate1, $lte: EndDate1 } },
      { endDate: { $gte: StartDate1, $lte: EndDate1 } },
      {
        startDate: { $gte: StartDate1, $lte: EndDate1 },
        endDate: { $gte: StartDate1, $lte: EndDate1 },
      },
    ],
  });
  leaveRecords.map((leaveRecord) => {
    if (
      new Date(leaveRecord.startDate).getDate() ===
        new Date(EndDate1).getDate() ||
      new Date(leaveRecord.endDate).getDate() === new Date(StartDate1).getDate()
    ) {
      leaveDuration = 1;
      LeaveDays += leaveDuration;
    } else {
      leaveDuration = leaveRecord.noOfDays;
      LeaveDays += leaveDuration;
    }
  });

  // })
  return LeaveDays;
}

const LeavedaysFunc = async (Empid, year) => {
  let LEaveInfodata = await EmpLeaveInfo.find({
    employeeId: Empid,
    year: year,
  });
  let leaveTypesToOmit = LEaveInfodata.map((d) => d.leaveType);
  let LeavetypeData = await LeaveTypeSchema.find({
    typeOfLeave: { $nin: leaveTypesToOmit },
  });

  let filteredLeaveInfo = LEaveInfodata.map((d) => ({
    type: d.leaveType,
    opening: d.balanceLeave,
    availed: d.numOfDaysLeaveTaken,
    closing: d.numOfDaysLeaveTaken + d.balanceLeave,
  }));
  let combinedData = [
    ...filteredLeaveInfo,
    ...LeavetypeData.map((d) => ({
      type: d.typeOfLeave,
      opening: d.availableForAYear,
      availed: 0,
      closing: d.availableForAYear,
    })),
  ];
  return combinedData;
};
