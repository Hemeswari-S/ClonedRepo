import express from  "express";
import { uploadFile } from "../middleware/upload.js";
import { getFilesForEmployee, uploadFiles } from "../Controller/Document_controller.js";
export const Document_routes = express.Router();

Document_routes.post('/upload',uploadFile.array('files'),uploadFiles);
Document_routes.get('/getsingleEmployeeDocs/:employeeID',getFilesForEmployee);
