import express from "express";
import { upload } from "../middleware/upload.js";
import { GetSingleInfo,retriveAllInfo, DeleteEmployee, create, updateWithoutCertificate, updateWithCertificate, editQualificationByIdWithCertificate, editQualificationById } from "../Controller/QualificationInfo_controller.js";
export const EmpQualificationRouter = express.Router();

EmpQualificationRouter.get('/newemployeeinfo/:employeeId',GetSingleInfo);
EmpQualificationRouter.get('/empqualiinfo',retriveAllInfo);
EmpQualificationRouter.delete('/empqualiinfo/:id',DeleteEmployee);
EmpQualificationRouter.post('/quali',upload.single("certificate"),create);
EmpQualificationRouter.put('/without/:id',updateWithoutCertificate);
EmpQualificationRouter.put('/with/:id',upload.single("certificate"),updateWithCertificate);
EmpQualificationRouter.put('/editwith/:qualificationId/:employeeId',upload.single("certificate"),editQualificationByIdWithCertificate);
EmpQualificationRouter.put('/editwithoutcer/:qualificationId/:employeeId',editQualificationById);





