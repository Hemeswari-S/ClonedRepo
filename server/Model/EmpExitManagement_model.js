import mongoose from "mongoose";

const EmpExitManagement_Schema = new mongoose.Schema(
  {
    EmployeeId: {
      type: Number,
      // required: true,
      // unique: true,
    },
    EmpName: {
      type: String,
      // required: true,
    },
    exitDate: {
      type: Date,
      // required: true,
    },
    reasonForExit: {
      type: String,
      // required: true,
    },
    resignationNoticeDate: {
      type: Date,
      // required: true,
    },
    exitInterviewDate: {
      type: Date,
      // required: true,
    },
    lastWorkingDay: {
      type: Date,
      // required: true,
    },
    finalSettlementdetails: {
      type: String,
      // required: true,
    },
    feedBack: {
      type: String,
    },
    exitProcessManager: {
      type: String,
      // required: true,
    },
    exitType: {
      type: String,
      // required: true,
    },
    UploadDocumentation: [
      {
        contentType: { type: String },
        fileData: { type: Buffer },
      },
    ],
  },
  { timestamps: true }
);

export const EmpExitManagement = mongoose.model(
  "EmpExitManagement",
  EmpExitManagement_Schema
);
