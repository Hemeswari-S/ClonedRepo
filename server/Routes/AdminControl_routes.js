import express from "express";
import { CreateControl, Getall, UpdateControl } from "../Controller/AdminControl_Controller.js";
export const Control_routes = express.Router();

Control_routes.post("/create", CreateControl);
Control_routes.put("/Update/:id", UpdateControl);
Control_routes.get("/getall", Getall);
