import express from "express";
import { GridDetails } from "../Controller/EmpDetails_COntroller.js";
export const EmpGrid_routes = express.Router();

EmpGrid_routes.get("/getall", GridDetails);
