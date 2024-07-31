import mongoose from "mongoose";

const leaveManagerSchema = new mongoose.Schema(
  {
    employeeId: { type: Number, required: true,  },
    leaveType: { type: String, required: true },
    startDate: {
      type: Date, required: true,set: stripTime, 
      // validate: {
      //   validator: function (value) {
      //     return value >= new Date();
      //   },
      //   message: props => `${props.value} is a past date. Please select a future date.`
      // }
    },
    endDate: {
      type: Date,
       required: true,
      set: stripTime,
      // validate: {
      //   validator: function(value) {
      //     return value >=this.startDate;
      //   },
      //   message: props => `End date (${props.value}) must be after start date.`
      // }
    },
    noOfDays: { type: Number, required: true },
    reason: { type: String },
    RequestedBY: { type: String, required: true },
    manager1: { type: String, required: true },
    manager2: { type: String, required: true },
    pedingWith: { type: String, required: true },
    year: { type: Number, required: true },
    leaveStatus: { type: String, default:'Pending'},
    Evidence:{
      originalname: { type: String 
        },
      mimetype: { type: String,
        },
      buffer: { type: Buffer,
        }
    },
    actionBy: { type: String },
  },
  { timestamps: true }
);

export const LeaveManager = mongoose.model("LeaveManager", leaveManagerSchema);


function stripTime(date) {
  if (date instanceof Date) {
    return new Date(date.toISOString().split('T')[0]);
  }
  return date;
}