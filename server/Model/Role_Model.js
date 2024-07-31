import mongoose from "mongoose";
import { MaxValue } from "../config/Variables.js";

const roleSchema = new mongoose.Schema(
  {
    roleId: { type: Number, unique: true, required: true, max: MaxValue },
    roleName: { type: String, required: true,  validate: {
      validator: function (value) {
        return /^[a-zA-Z]+$/.test(value);
      },
      message: (props) =>
        `Role Name "${props.value}" contains special characters or numbers. Only letters are allowed.`,
    }, },
  
    permissions: [{ type: String }], // Array of strings representing permissions
    IsActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
