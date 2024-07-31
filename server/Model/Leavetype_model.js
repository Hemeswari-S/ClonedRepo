import mongoose from "mongoose";
import { LeaveTypeIdMaxValue } from "../config/Variables.js";

const leaveTypeSchema = new mongoose.Schema(
  {
    leaveType_Id: { type: Number, unique: true, required: true, max:LeaveTypeIdMaxValue },
    typeOfLeave: { type: String, required: true, unique: true },
    availableForAYear: { type: Number, required: true },
    IsActive: { type: Boolean, default: true },

  },
  { timestamps: true }
);

export const LeaveTypeSchema = mongoose.model("LeaveType", leaveTypeSchema);
