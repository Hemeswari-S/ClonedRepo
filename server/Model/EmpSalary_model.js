import mongoose from "mongoose";
import { MaxValue } from "../config/Variables.js";

const employeeSalarySchema = new mongoose.Schema(
  {
    employeeId: { type: Number, required: true, max:MaxValue },
    EmployeeName: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    payGrade: { type: String },
    payPeriod: { type: String, required: true },
    annualSalary: { type: Number },
    bonus: { type: Number,default:0 },
    allowances: { type: Number,default:0 },
    deductions: { type: Number,default:0 },
    overtimePay: { type: Number ,default:0},
    totalCompensation: { type: Number ,default:0},
    taxInformation: { type: String },
    reimbursements: { type: Number,default:0 },
    advances: { type: Number,default:0 },
    PF: { type: Number,default:0 },
    ESI: { type: Number,default:0},
    TDS: { type: Number ,default:0},
    ProfessinalTax: { type: Number,default:0},
    LabourWelfareFund: { type: Number,default:0 },
    PF_AC_no: { type: Number,default:0 },
    UAN: { type: Number,default:0 },
    currency: { type: String ,default:'INR'},
  },
  { timestamps: true }
);

export const EmployeeSalary = mongoose.model(
  "EmployeeSalary",
  employeeSalarySchema
);
