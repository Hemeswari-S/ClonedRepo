import mongoose from "mongoose";
import { MaxValue } from "../config/Variables.js";

const User_Scheama = new mongoose.Schema(
  {
    UserId: { type: Number, required: true, unique: true, max: MaxValue },
    FirstName: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z]+$/.test(value);
        },
        message: (props) =>
          `Name "${props.value}" contains special characters or numbers. Only letters are allowed.`,
      },
    },
    LastName: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z]+$/.test(value);
        },
        message: (props) =>
          `Name "${props.value}" contains special characters or numbers. Only letters are allowed.`,
      },
    },
    EmailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(
            value
          );
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },
    Username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).{8,}$/.test(
            value
          );
        },
        message: (props) =>
          `Username must contain at least one special character and one number, and be at least 8 characters long.`,
      },
    },
    OTP: { type: Number, required: true },

    otpAttempts: { type: Number, default: 0 },
    otpExpires: { type: Date },

    Password: {
      type: String,
      default: "",
    },
    RoleId: { type: Number, required: true },
    RoleName:{type:String,required:true},
    IsActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", User_Scheama);
