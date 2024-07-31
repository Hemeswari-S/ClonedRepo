import mongoose from "mongoose";

const employeeAttendanceSchema = new mongoose.Schema({
  employeeId: { type: Number, required: true },
  shiftId: { type: Number, required: true ,default:1},
  checkInTime: {
    type: Date, required: true, validate: {
      validator: function (value) {
        return isToday(value);
      },
      message: props => `Date (${props.value}) is not today. Please provide today's date.`
    }
  },
  lunchStartTime: {
    type: Date, validate: {
      validator: function (value) {
        return isToday(value);
      },
      message: props => `Date (${props.value}) is not today. Please provide today's date.`
    }
  },
  lunchEndTime: {
    type: Date, validate: {
      validator: function (value) {
        return isToday(value);
      },
      message: props => `Date (${props.value}) is not today. Please provide today's date.`
    }
  },
  checkOutTime: {
    type: Date, validate: {
      validator: function (value) {
        return isToday(value);
      },
      message: props => `Date (${props.value}) is not today. Please provide today's date.`
    }
  },
  attendanceStatus: { type: String,default:'present' },
  totalHoursWorked: { type: Number },
  overtimeHours: { type: Number }
}, { timestamps: true });



export const EmployeeAttendance = mongoose.model('EmployeeAttendance', employeeAttendanceSchema);

function isToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of the day
  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0); // Set to start of the day
  return givenDate.getTime() === today.getTime();
}