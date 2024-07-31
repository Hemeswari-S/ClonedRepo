import express from "express";
import {
  Create,
  DeleteRecord,
  GetAll,
  GetById,
  Update,
} from "../Controller/LeaveType_controller.js";
export const Leavetype_route = express.Router();

Leavetype_route.get("/Get", GetAll);
Leavetype_route.get("/Get/:id", GetById);
Leavetype_route.post("/create", Create);
Leavetype_route.put("/update/:id", Update);
Leavetype_route.delete("/delete:id", DeleteRecord);
