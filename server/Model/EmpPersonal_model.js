import mongoose from "mongoose";

// const idProofSchema = new mongoose.Schema({
//   ProofName: { type: String },
//   ContentType: { type: String},
//   Type: { type: String},
//   FileName: { type: String },
//   FileData: { type: Buffer }
// });

// const imageDataSchema = new mongoose.Schema({
//   Image: { type: String },
//   ContentType: { type: String},
//   Type: { type: String},
//   Filename: { type: String },
//   Filedata: { type: Buffer }
// });

const PersonalInfo_Schema = new mongoose.Schema({
  UserId: { type: Number,
    //  required: true,
      // index: { unique: true } ,
      immutable:true},
  EmployeeId: { type: Number,
     
    //  index: { unique: true },
     immutable:true },
  FirstName: {
    type: String,
    // required: true,
    match: /^[a-zA-Z]+$/, 
  },
  LastName: {
    type: String,
    // required: true,
    match: /^[a-zA-Z]+$/, 
  },
  ProffessionalEmailId: {
    type: String,
    unique: true,
    // required: true,
    match: [/.+\@.+\..+/, "Invalid email format"]
  },
  PersonalEmailId: {
    type: String,
    match: [/.+\@.+\..+/, "Invalid email format"]
  },
  DateOfBirth: { type: Date },
  Gender: { type: String },
//   ImageData: imageDataSchema,
//   IdProof1: idProofSchema,
//   IdProof2: idProofSchema,
image:{
  contentType: { type: String },
  fileData: { type: Buffer }
},
idProof1: {
  contentType: { type: String },
  fileData: { type: Buffer }
},
idProof2: {
  contentType: { type: String },
  fileData: { type: Buffer }
},

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
 });

export const personal_info = mongoose.model(
  "EmpPersonalInfo",
  PersonalInfo_Schema
);