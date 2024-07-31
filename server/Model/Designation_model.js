import mongoose from "mongoose";
const Designation_Schema = new mongoose.Schema(
  {
    DesignationId: { type: String , required: true, unique:true, immutable:true },       
    Designation: {
      type: String,
      // required: true,
      // unique:true,      
      match: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/ // Allows alphabets and spaces, with at least one alphabet character
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export const DesignationInfo = mongoose.model(
  "Designation",
  Designation_Schema
);
