import express from "express";
import { getCurrentWeekLeaves, getDepBadgesValue, getDesBadgesValue, getEmpBadgesValue, getExitRequests, getRecentAddedEmployees, getRecentpromotions, getRoleBadgesValue } from "../Controller/AdminDashboard_Controller.js";
export const Dashboard_routes = express.Router();

Dashboard_routes.get("/GetEmpBadge", getEmpBadgesValue);
Dashboard_routes.get("/getrolebadge", getRoleBadgesValue);
Dashboard_routes.get("/getdepbadge", getDepBadgesValue);
Dashboard_routes.get("/getDesBadge", getDesBadgesValue);
Dashboard_routes.get("/GetEmployees", getRecentAddedEmployees);
Dashboard_routes.get("/getleaves", getCurrentWeekLeaves);
Dashboard_routes.get("/Recentpromtion", getRecentpromotions);
Dashboard_routes.get("/RecentExits", getExitRequests);
