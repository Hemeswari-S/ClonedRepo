import mongoose from 'mongoose';

const PlansandGoalsSchema = new mongoose.Schema({
    Goal: { type: String },
    Plan: {
        contentType: { type: String },
        fileData: { type: Buffer }
    },
    isDeleted: { type: Boolean, default: false }  
});

const EmployeePlansandGoalsSchema = new mongoose.Schema({
    EmployeeId: { type: String },
    EmployeePlansandGoals: [PlansandGoalsSchema]
});

const PlansandGoals = mongoose.model('PlansandGoals', EmployeePlansandGoalsSchema);

export default PlansandGoals;
