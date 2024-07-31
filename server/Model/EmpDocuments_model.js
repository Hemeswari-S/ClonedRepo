import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    originalname: { type: String 
      // required: true,
      //  unique: true,
      },
    mimetype: { type: String,
      //  required: true,
      //  unique: true 
      },
    buffer: { type: Buffer,
      //  required: true,
      //  unique: true 
      }
  });
const documentdetails_schema = new mongoose.Schema(
  {
    employeeID: {
      type: Number,
      required:true,
      unique: true,
    },
    files:[documentSchema],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  
  { timestamps: true }
);

export const employeedocument = mongoose.model(
  "EmployeeDocumentDetails",
  documentdetails_schema
);
