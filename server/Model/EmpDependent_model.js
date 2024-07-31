import mongoose from "mongoose";
// import { Schema } from "mongoose";


// const DependentInfoSchema = new mongoose.Schema(
//   {
//     EmployeeId: { 
//       type: Number, 
//       required: true 
//     },
//     Dependents: [{ // Array to store details of each dependent
//       FirstName: {
//         type: String,
//         required: true,
//         match: /^[a-zA-Z]+$/
//       },
//       LastName: {
//         type: String,
//         required: true,
//         match: /^[a-zA-Z]+$/
//       },
//       RelationType: { 
//         type: String, 
//         required: true, 
//         match: /^[a-zA-Z]+$/
//       },
//       DateOfBirth: { 
//         type: Date, 
//         required: true 
//       },
//       ContactNumber: {
//         type: String,
//         required: true,
//         match: /^(?:\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
//       }, 
//       Gender: { 
//         type: String, 
//         required: true,
//         enum: ['Male', 'Female', 'Others'] 
//       }
//     }],
//     status: {
//       type: String,
//       enum: ['active', 'inactive'],
//       default: 'active'
//     }
//   },
//   { timestamps: true }
// );

// DependentInfoSchema.index({ EmployeeId: 1, 'Dependents.ContactNumber': 1 }, { unique: true }); // Compound index on EmployeeId and ContactNumber within the Dependents array

// export const EmpdependentInfo = mongoose.model("EmpDependentInfo", DependentInfoSchema);


const DependentInfoSchema = new mongoose.Schema({
  EmployeeId: { type: String} ,
  FirstName: { type: String,},
  LastName: { type: String, },
  RelationType: { type: String, },
  DateOfBirth: { type: Date,  },
  ContactNumber: { type: String, },
  Gender: { type: String, enum: ['Male', 'Female', 'Other'], },
});

const EmployeeDependentSchema = new mongoose.Schema({
  EmployeeId: { type: String, required: true },
  Dependents: [DependentInfoSchema],
});

export const  EmpdependentInfo = mongoose.model('EmpdependentInfo',EmployeeDependentSchema)

// DependentInfoSchema.index({ EmployeeId: 1 }, { unique: true });
// Create the Mongoose model
// export const EmpdependentInfo = mongoose.model("EmpdependentInfo", DependentInfoSchema);

