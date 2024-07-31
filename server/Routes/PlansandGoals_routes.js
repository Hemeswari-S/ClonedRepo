import express from 'express';
import { PlansandGoalsFiles, upload } from '../middleware/upload.js';
import { addPlansandGoals, GetPersonalandGoalsInfo, getPlansandGoalsByEmployeeId, getPlansandGoalsById, newaddPlansandGoals, softDeletePlansandGoals, UpdatePersonalandGoals, viewPlansandGoalsFile } from '../Controller/PlansandGoals_Controller.js';

const PlansandGoals_Router = express.Router();

PlansandGoals_Router.post("/create", PlansandGoalsFiles, newaddPlansandGoals);
PlansandGoals_Router.post("/add/:EmployeeId", upload.single('Plan'), addPlansandGoals);
PlansandGoals_Router.get("/get/:EmployeeId", GetPersonalandGoalsInfo);
PlansandGoals_Router.get("/get/PlansandGoals/:id", getPlansandGoalsByEmployeeId);
PlansandGoals_Router.put("/update/:PlansandGoalsId", PlansandGoalsFiles, UpdatePersonalandGoals);

// Get file
PlansandGoals_Router.get("/get/file/:employeeId/:PlansandGoalsId", viewPlansandGoalsFile);
PlansandGoals_Router.get("/get/PlansandGoals/:PlansandGoalsId", getPlansandGoalsById);

//delete
PlansandGoals_Router.delete('/delete/:goalId', softDeletePlansandGoals);

export default PlansandGoals_Router;
