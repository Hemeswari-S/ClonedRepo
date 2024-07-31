import express from "express";
import { DisplayPermissioninfo, PermissionRequest, getall, getbyid, getfuterPermsiionsbyId } from "../Controller/PermissionManger_Controller.js";

export const Permissionmanager_routes = express.Router();

Permissionmanager_routes.post("/create", PermissionRequest);
Permissionmanager_routes.get("/get/:year/:month/:employeeId", getall);
Permissionmanager_routes.get("/get/:id", getbyid);
Permissionmanager_routes.get("/gerFuterpermissions/:id", getfuterPermsiionsbyId);
Permissionmanager_routes.get("/gerUsedpermissions/:id", getfuterPermsiionsbyId);
Permissionmanager_routes.get("/displayPermissionDetailsOfEmp/:id/:year/:month", DisplayPermissioninfo);
