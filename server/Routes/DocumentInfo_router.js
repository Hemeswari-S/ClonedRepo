import express from  "express";
import { upload } from "../middleware/upload.js";
import {DeleteEmployee, GetSingleDocument, createDocument, update, updateEmployeeDocuments} from "../Controller/DocumentInfo_controller.js";
export const EmpDocumentRouter = express.Router();

// EmpDocumentRouter.post('/',upload.single("files"),createDocument);
// EmpDocumentRouter.get('/alldocument/:employeeID',upload.single("files"),GetSingleDocument);
EmpDocumentRouter.post('/',upload.array("files"),createDocument);
// EmpDocumentRouter.put('/update/:employeeID',upload.array("files"),update);
EmpDocumentRouter.put('/update/:employeeID',upload.array("files"),update);
EmpDocumentRouter.put('/updateDoc/:employeeID',upload.array("files"),updateEmployeeDocuments);
EmpDocumentRouter.get('/singledocument/:employeeID',GetSingleDocument);
// EmpDocumentRouter.delete('/delete/:id',DeleteEmployee);
EmpDocumentRouter.delete('/employee/:employeeId/file/:fileId',DeleteEmployee);