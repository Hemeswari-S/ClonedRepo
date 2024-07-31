import mongoose from "mongoose";
const Department_Schema = new mongoose.Schema(
  {
    DepartmentId: { type: String , required: true, },  
    // unique:true,immutable:true    
    DepartmentName:  {
      type: String,
      // required: true,
      // unique:true,
      // immutable:true,
      // match: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/ // Allows alphabets and spaces, with at least one alphabet character
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
    
  },
  { timestamps: true }
);
export const Department = mongoose.model("Department", Department_Schema);
