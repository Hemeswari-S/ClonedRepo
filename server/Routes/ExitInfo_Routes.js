
import express from "express";
import { AddExitInfo, deleteExitManagementByEmployeeId, GetEmpExitInfo_by_id, GetExitInfo, GetHandOverDoc, GetHandOverDocById, newAddExitInfo, updateExitInfo, updateExitInfoById, uploadFileexit } from "../Controller/ExitInfo_controller.js";
import { multipleUploadFiles } from "../middleware/upload.js";

const EmpExitInfo_routers = express.Router();

// Route to add exit information with handover documentation
EmpExitInfo_routers.post("/add", multipleUploadFiles, AddExitInfo);

EmpExitInfo_routers.post("/add/:employeeId", multipleUploadFiles, AddExitInfo);

EmpExitInfo_routers.post("/new" , newAddExitInfo);

// Route to upload handover documentation for an existing exit info entry
EmpExitInfo_routers.put("/upload/:employeeId", multipleUploadFiles, uploadFileexit);

// Route to get all exit information
EmpExitInfo_routers.get("/get", GetExitInfo);

// Route to get exit information by employee ID
EmpExitInfo_routers.get("/get/:employeeId", GetEmpExitInfo_by_id);

// Route to get handover documentation by employee ID
EmpExitInfo_routers.get('/get/:employeeId/UploadDocumentation', GetHandOverDoc);

EmpExitInfo_routers.get('/get/:employeeId/:fileId', GetHandOverDocById);



EmpExitInfo_routers.put('/update/:employeeId',multipleUploadFiles, updateExitInfoById);

//EmpExitInfo_routers.put('/update/:employeeId',singleUploadFile, updateExitInfoById);

EmpExitInfo_routers.delete('/delete/:employeeId',deleteExitManagementByEmployeeId);



export default EmpExitInfo_routers;