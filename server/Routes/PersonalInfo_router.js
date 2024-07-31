import express from 'express';
import { createPersonalInfo, deletePersonalInfoByEmployeeId, getAllPersonalInfo, getPersonalInfoById, getPersonalInfoByIdProofone, getPersonalInfoByIdProoftwo, getPersonalInfoByIdimage, newAddPersonalInfo, updatePersonalInfoByEmployeeId, uploadFiles } from '../Controller/PersonalInfo_controller.js';
import { multiUpload } from '../middleware/upload.js';

const PersonalInfoRoutes = express.Router();

PersonalInfoRoutes.post('/create', multiUpload, createPersonalInfo);
PersonalInfoRoutes.post('/add', newAddPersonalInfo);
//
PersonalInfoRoutes.get('/get', getAllPersonalInfo);
PersonalInfoRoutes.get('/get/:eid', getPersonalInfoById);
PersonalInfoRoutes.get('/get/:employeeId/idProof1', getPersonalInfoByIdProofone);
PersonalInfoRoutes.get('/get/:employeeId/idProof2', getPersonalInfoByIdProoftwo);
PersonalInfoRoutes.get('/get/:employeeId/image', getPersonalInfoByIdimage);

PersonalInfoRoutes.put('/update/:EmployeeId', multiUpload, updatePersonalInfoByEmployeeId);
PersonalInfoRoutes.put('/upload/:employeeId', multiUpload, uploadFiles);

PersonalInfoRoutes.delete('/delete/:EmployeeId', deletePersonalInfoByEmployeeId);

export default PersonalInfoRoutes;


// PersonalInfoRoutes.post('/create', multiUpload, CreateEmployee);
// PersonalInfoRoutes.get('/get', GetEmployee);
// PersonalInfoRoutes.get('/get/:id', GetEmployeeById);
// PersonalInfoRoutes.get('/getfile1byId/:EmpId', getfile1Id);
// PersonalInfoRoutes.put('/update/:id', multiUpload, UpdateEmployee);
// PersonalInfoRoutes.delete('/delete/:id', DeleteEmployee);

// PersonalInfoRoutes.get('/files/:id', GetEmployeeFiles);
// PersonalInfoRoutes.get('/file/:id/:fileType', GetFile); // New route for fetching individual files

// export default PersonalInfoRoutes;
