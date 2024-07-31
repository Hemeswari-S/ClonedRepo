import mongoose from "mongoose";


const PermissionManagerSchema = new mongoose.Schema(
  {
    employeeId: { type: Number, required: true },
    EmployeeName: { type: String, required: true },
    startTime: {
      type: Date, required: true, validate: {
        validator: function (value) {
          console.log('Validating date:', value);
          return value >= new Date();
        },
        message: props => `${props.value} is a past date. Please select a future date.`
      }
    },
    endTime: {
      type: Date, required: true, validate: {
        validator: function (value) {
          return value > this.startTime;
        },
        message: props => `End date (${props.value}) must be after start date.`
      }
    },
    RequestedHours: { type: Number, required: true },
    reason: { type: String},
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    PermissionStatus: { type: String },
  },
  { timestamps: true }
);

export const PermissionManager = mongoose.model("PermissionManager", PermissionManagerSchema);
