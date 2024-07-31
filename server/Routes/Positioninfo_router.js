import express from "express";
import {
  CreatePositionInfo,
  GetAllPostionInfo,
  GetSinglePosition,
  positionUpdate,
  Delete,
  // position,
  manager,
} from "../Controller/PositionInfo_controller.js";
export const EmpPositionRouter = express.Router();

EmpPositionRouter.post("/newpositioninfo", CreatePositionInfo);
EmpPositionRouter.get("/newpositioninfo", GetAllPostionInfo);
EmpPositionRouter.get("/positioninfo/:employeeId", GetSinglePosition);
EmpPositionRouter.put("/positioninfoo/:employeeId",  positionUpdate);
// EmpPositionRouter.put("/position/:employeeId",  position);
EmpPositionRouter.delete("/designation/:employeeId", Delete);
// 
EmpPositionRouter.get("/manager",manager);
