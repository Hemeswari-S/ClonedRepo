import express from "express";
import {
  Create,
  GetAll,
  GetById,
  Update,
} from "../Controller/Role_controller.js";
export const Role_route = express.Router();

Role_route.get("/Get", GetAll);
Role_route.get("/Get/:id", GetById);
Role_route.post("/create", Create);
Role_route.put("/update/:id", Update);
