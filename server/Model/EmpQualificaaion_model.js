import mongoose from "mongoose";
const withoutCer = new mongoose.Schema({
  qualificationType: {
    type: String,
    // required: true,
  },
  qualificationTitle: {
    type: String,
    // required: true,
    match: /^[a-zA-Z\s]+$/,
  },
  MajorFeildOfStudy: {
    type: String,
    // required: true,
    match: /^[a-zA-Z\s]+$/,
  },
  percentageOrcgba: {
    type: Number,
    min: 0,
    max: 100,
  },
  instituteOrCollegeName: {
    type: String,
    // required: true,
    match: /^[a-zA-Z\s]+$/,
  },
  Address: {
    type: String,
    // required: true,
    trim: true,
  },
});

const withCer = new mongoose.Schema({
  qualificationType: {
    type: String,
    // required: true,
  },
  qualificationTitle: {
    type: String,
    // required: true,
    match: /^[a-zA-Z\s]+$/,
  },

  instituteOrCollegeName: {
    type: String,
    // required: true,
    match: /^[a-zA-Z\s]+$/,
  },
  Address: {
    type: String,
    // required: true,
    trim: true,
  },
  File: {
    originalname: { type: String },
    mimetype: { type: String },
    buffer: { type: Buffer },
  },
});
const employeeQualificationInfo_schema = new mongoose.Schema(
  {
    employeeId: {
      type: Number,
      // required: true,
      unique: true,
    },
    
    document: [withCer],
    withoutcertificate: [withoutCer],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const empQualiInfo = mongoose.model(
  "EmployeeQualificationInfo",
  employeeQualificationInfo_schema
);
