import express from "express";
import {
  AddExperienceInfo,
  GetExperienceInfo,
  GetExperienceInfoById,
  newAddExperienceInfo,
  UpdateExperienceInfo,
  viewExperienceFile,  

} from "../Controller/ExperienceInfo_controller.js";
import { multiDocUpload } from "../middleware/upload.js";


const ExperienceInfo_routers = express.Router();

ExperienceInfo_routers.post('/add/:EmployeeId', multiDocUpload,AddExperienceInfo);

ExperienceInfo_routers.post('/create', newAddExperienceInfo);
ExperienceInfo_routers.get('/get/:EmployeeId',GetExperienceInfo);
ExperienceInfo_routers.get('/get/experiences/:id',GetExperienceInfoById);
ExperienceInfo_routers.put('/update/:EmployeeId',UpdateExperienceInfo);
ExperienceInfo_routers.delete('/delete/:EmployeeId',UpdateExperienceInfo);

//get file
ExperienceInfo_routers.get("/view/:employeeId/:experienceId/:fileType",viewExperienceFile)

// ExperienceInfo_routers.get('/experience/:EmployeeId/:experienceId/experienceLetter', getExperienceLetterById);
// ExperienceInfo_routers.get('/experience/:EmployeeId/:experienceId/offerLetter', getOfferLetterById);
// ExperienceInfo_routers.get('/experience/:EmployeeId/:experienceId/relievingLetter', getRelievingLetterById);


// ExperienceInfo_routers.put("/update/:id",multiDocUpload,UpdateEmpExperienceInfo)

export default ExperienceInfo_routers;
