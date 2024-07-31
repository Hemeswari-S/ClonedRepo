import mongoose from "mongoose";

const Contol_Schema = new mongoose.Schema({
  ControlId: { type: Number, require: true, Unique: true },
  ControlName: { type: String, require: true, Unique: true },
  IsActive: { type: Boolean, require: true ,default:true},
});

export const ControlModel=mongoose.model('Control',Contol_Schema)