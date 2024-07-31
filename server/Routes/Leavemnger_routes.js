import express from "express";
import {
  ActionUpdate,
  DisplayLeaveinfo,
  GetEmployeesByManager,
  GetLeavedays,
  LeaveRequest,
  getApprovedLeavesbyId,
  getallApproved,
  getallRejected,
  getalltoApprove,
  getbyid,
  getpendingLeavesbyId,
} from "../Controller/Leavemanager_controller.js";
import { upload } from "../middleware/upload.js";

export const Leavemanager_routes = express.Router();

Leavemanager_routes.post("/create", LeaveRequest);
Leavemanager_routes.post("/createwithfile",upload.single('Evidence'), LeaveRequest);
Leavemanager_routes.get("/get/:name", getalltoApprove);
Leavemanager_routes.get("/getallapproved/:year/:month/:employeeId", getallApproved);
Leavemanager_routes.get("/GetEmployeesByManager/:employeeId/:role", GetEmployeesByManager);
// Leavemanager_routes.get("/getallrejected", getallRejected);
Leavemanager_routes.put("/ActionUpdate", ActionUpdate);
Leavemanager_routes.get("/getbyID/:_id", getbyid);
Leavemanager_routes.get("/getbyUserApprovedLeaves/:id", getApprovedLeavesbyId);
Leavemanager_routes.get("/getbyUserPendingLeaves/:id", getpendingLeavesbyId);
Leavemanager_routes.get("/displayleaveDetailsOfEmp/:id/:year", DisplayLeaveinfo);
Leavemanager_routes.get("/getLeavedays/:Leavetype/:EmpId", GetLeavedays);
