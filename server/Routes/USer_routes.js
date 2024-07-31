import express from "express";
import { AddPassword, Forgotpswd, GetAll, Sigin, createUser, getManagers } from "../Controller/User_contoller.js";
export const User_route = express.Router();

User_route.post("/create", createUser);
User_route.post("/Signin", Sigin);
User_route.put("/UpdatePwd", AddPassword);
User_route.put("/forgotpswd", Forgotpswd);
User_route.get("/get", GetAll);
User_route.get("/getManagers", getManagers);
