import mongoose from "mongoose";

const empPermissionInfoSchema = new mongoose.Schema(
  {
    employeeId: { type: Number, required: true, },
    totalHoursPermissionTaken: { type: Number, required: true },
    balancePermissionhours: { type: Number, required: true },
    year:{type:Number,required: true},
    month:{type:Number,required: true},
  },
  { timestamps: true }
);

export const EmpPermissionInfo = mongoose.model("EmpPermissionInfo", empPermissionInfoSchema);
