import mongoose from "mongoose";

const employeePayrollSchema = new mongoose.Schema(
  {
    employeeId: { type: Number, required: true },
    EmployeeName: { type: String, required: true },
    payPeriod: { type: String, required: true },
    grossSalary: { type: Number,default:0},
    netSalary: { type: Number,default:0},
    baseSalary: { type: Number},
    bonuses: { type: Number,default:0 },
    allowances: { type: Number,default:0 },
    overtimePay: { type: Number,default:0 },
    deductions: { type: Number,default:0 },
    tax: { type: Number,default:0 },
    totalHoursWorked: { type: Number},
    attendanceInfo: { type: String },
    paymentMethod: { type: String,default:'bank Transfer'},
    currency: { type: String, default:'INR' },
  },
  { timestamps: true }
);

export const EmployeePayroll = mongoose.model(
  "EmployeePayroll",
  employeePayrollSchema
);
