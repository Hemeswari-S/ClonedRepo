import express from "express";
import {
  createContact,
  GetAllContactInfo,
  GetSingleContact,
  updateContact,
  DeleteEmployee,
} from "../Controller/ContactInfo_controller.js";
export const EmpContactInfo = express.Router();

EmpContactInfo.post("/newcontactinfo", createContact);
EmpContactInfo.get("/newcontactinfo", GetAllContactInfo);
EmpContactInfo.get("/newcontactinfo/:employeeId", GetSingleContact);
EmpContactInfo.put("/newcontactinfooo/:employeeId", updateContact);
EmpContactInfo.delete("/newcontactinfo/:employeeId", DeleteEmployee);
