import express from "express";
import {
  AddDependentInfo,
  DeleteEmpDependentInfo,  
  GetDependentInfo,
  GetDependentInfo_by_id,
  UpdateEmpDependentInfo,
} from "../Controller/DependentInfo_controller.js";

const DependentInfo_routers = express.Router();

DependentInfo_routers.post("/add/:EmployeeId", AddDependentInfo); // Add dependent to specific employee
DependentInfo_routers.get("/get/:EmployeeId", GetDependentInfo); // Get dependents for specific employee
DependentInfo_routers.get("/get/dependent/:id", GetDependentInfo_by_id); // Get specific dependent by dependent ID
DependentInfo_routers.put("/update/:EmployeeId/:dependentId", UpdateEmpDependentInfo); // Update dependent info
DependentInfo_routers.delete("/delete/:EmployeeId/:dependentId", DeleteEmpDependentInfo); // Delete dependent info

export default DependentInfo_routers;
