import mongoose from 'mongoose';

const ExperienceInfoSchema = new mongoose.Schema({
  position: { type: String },
  joiningDate: { type: String },
  lastDate: { type: String },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
  },
  salary: { type: Number },
  companyName: { type: String },
  companyAddress: { type: String },
  contactNumber: { type: String },
  experienceLetter: {
    contentType: { type: String },
    fileData: { type: Buffer },
  },
  offerLetter: {
    contentType: { type: String },
    fileData: { type: Buffer },
  },
  relievingLetter: {
    contentType: { type: String },
    fileData: { type: Buffer },
  },
});

const EmployeeExperienceSchema = new mongoose.Schema({
  EmployeeId: { type: String },
  Experiences: [ExperienceInfoSchema],
});

const EmpExperienceInfo = mongoose.model('EmpExperienceInfo', EmployeeExperienceSchema);

export default EmpExperienceInfo;
