import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  department: {
    type: String,
    // required: true,
  },
  // emailId: {
  //   type: String,
  //   // required: true,
  //   unique: true,
  //   lowercase: true,
  //   trim: true,
  // },
  isFresher: {
    type: Boolean,
    // required: true,
  },
  payrollCode: {
    type: Number,
    // required: true,
    // unique: true,
  },
  workLocation: {
    type: String,
    // required: true,
  },
  jobDescription: {
    type: String,
    // required: true,
  },
  shift: {
    type: String,
    // required: true,
  },
  isTrainee: {
    type: Boolean,
    // required: true,
  },
  managerName: {
    type: String,
    // required: true,
  },
  managerId: {
    type: Number,
    // required: true,
  },
  position: {type:String, 
    // required: true,
  },
  startDate: {type:Date,},
  endDate: {type:Date,},
});

const positionInfo_Schema = new mongoose.Schema(
  {
    employeeId: {
      type: Number,
      unique: true,
      required: true,
    },
    EmpName: {
      type: String,
      required: true,
    },
    // department: {
    //   type: String,
    //   // required: true,
    // },
    designation:[positionSchema],
    emailId: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // isFresher: {
    //   type: Boolean,
    //   // required: true,
    // },
    // payrollCode: {
    //   type: Number,
    //   // required: true,
    //   // unique: true,
    // },
    // workLocation: {
    //   type: String,
    //   // required: true,
    // },
    // jobDescription: {
    //   type: String,
    //   // required: true,
    // },
    // shift: {
    //   type: String,
    //   // required: true,
    // },
    // isTrainee: {
    //   type: Boolean,
    //   // required: true,
    // },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
  },
  { timestamps: true }
);

export const positionData = mongoose.model(
  "employeePositionInfo",
  positionInfo_Schema
);
