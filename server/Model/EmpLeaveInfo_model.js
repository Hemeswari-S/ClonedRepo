import mongoose from "mongoose";

const empLeaveInfoSchema = new mongoose.Schema(
  {
    employeeId: { type: Number, required: true },
    leaveType: { type: String, required: true },
    numOfDaysLeaveTaken: { type: Number, required: true },
    balanceLeave: { type: Number, required: true },
    year:{type:Number,required: true}
  },
  { timestamps: true }
);

export const EmpLeaveInfo = mongoose.model("EmpLeaveInfo", empLeaveInfoSchema);
