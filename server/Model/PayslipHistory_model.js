import mongoose from "mongoose";
import { MaxValue } from "../config/Variables.js";

const employeePayslipSchema = new mongoose.Schema(
  {
    employeeId: { type: Number, required: true},
    payslipId: { type: Number, unique: true, required: true },
    payslipDate: { type: Date, required: true },
    PayPeriod:{ type: String ,required: true},
    generatedBy: { type: String ,required: true},
    Filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true }
  },
  { timestamps: true }
);

export const EmployeePayslip = mongoose.model(
  "EmployeePayslip",
  employeePayslipSchema
);
