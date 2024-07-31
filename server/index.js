import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// import https from "https";
// import fs from "fs";
import { connectToDB } from "./config/DB_Connection.js";
import { Leavetype_route } from "./Routes/LeaveType_routes.js";
import { Leavemanager_routes } from "./Routes/Leavemnger_routes.js";
import { EmpQualificationRouter } from "./Routes/EmpQualiInfo_Router.js";
// import BankInfo_routers from "./Routes/BankInfo_Routes.js";
import Personalinfo_routers from "./Routes/PersonalInfo_router.js";
import { EmpContactInfo } from "./Routes/Contactinfo_router.js";
import { EmpPositionRouter } from "./Routes/Positioninfo_router.js";
import DependentInfo_routers from "./Routes/DependentInfo_Routes.js";
import ExperienceInfo_routers from "./Routes/ExperienceInfo_Routes.js";
import { Salary_routes } from "./Routes/EmpSalary_routes.js";
import { payroll_routes } from "./Routes/Payroll_routes.js";
import { Attendance_routes } from "./Routes/Attendance_routes.js";
import { Role_route } from "./Routes/Role_routes.js";
import { User_route } from "./Routes/USer_routes.js";
import { EmpDocumentRouter } from "./Routes/DocumentInfo_router.js";
import { Permissionmanager_routes } from "./Routes/Permission_routes.js";
import EmpExitInfo_routers from "./Routes/ExitInfo_Routes.js";
import Department_routers from "./Routes/Department_Routes.js";
import Designation_routers from "./Routes/Designation_Routes.js";
import { Document_routes } from "./Routes/Document_routes.js";
import { Control_routes } from "./Routes/AdminControl_routes.js";
import { Dashboard_routes } from "./Routes/AdminDashboard_Routes.js";
import { EmpGrid_routes } from "./Routes/EmpDetails_routes.js";
import PlansandGoals_Router from "./Routes/PlansandGoals_routes.js";
import BankInfo_routers from "./Routes/BankInfo_Routes.js";




const app = express();
const port = process.env.PORT || 8000;

// const options = {
//   key: fs.readFileSync("server.key"),
//   cert: fs.readFileSync("server.crt"),
// };
// const options = {
//   key: fs.readFileSync('localhost.key'),
//   cert: fs.readFileSync('localhost.crt')
// };
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// 
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const endTime = getHrTime();
    const duration = endTime - startTime;
    console.log(`Request to ${req.method} ${req.url} handled in ${duration.toFixed(2)}ms`);
  });

  next();
});

connectToDB();


app.use("/api/EmpQualiInfo",EmpQualificationRouter);
app.use("/api/EmpContactInfo",EmpContactInfo);
app.use("/api/LeaveType", Leavetype_route);
app.use('/api/empbankinfos',BankInfo_routers);
app.use('/api/personalinfos',Personalinfo_routers);
app.use('/api/empdependentinfos',DependentInfo_routers)
app.use('/api/empexperienceinfos',ExperienceInfo_routers)
app.use('/api/empexitinfos',EmpExitInfo_routers);
app.use('/api/departmentinfos',Department_routers);
app.use('/api/designationinfos',Designation_routers);
app.use("/api/EmpPositionInfo",EmpPositionRouter);
app.use("/api/Leavemanager",Leavemanager_routes)
app.use("/api/Salary&Compensation",Salary_routes)
app.use("/api/attendance",Attendance_routes)
app.use("/api/user",User_route)
app.use("/api/role",Role_route)
app.use("/api/permissionManager",Permissionmanager_routes)
app.use("/api/Payroll",payroll_routes)
app.use("/api/Document",Document_routes)
app.use("/api/Empdocument",EmpDocumentRouter)
app.use("/api/AdminControl",Control_routes)
app.use("/api/Dashboard",Dashboard_routes)
app.use("/api/Grid",EmpGrid_routes)
app.use("/api/PlansandGoals",PlansandGoals_Router);

function getHrTime() {
  const hrTime = process.hrtime();
  return hrTime[0] * 1000 + hrTime[1] / 1e6; // Convert to milliseconds
}

app.all("*", (req, res) => {
  res.send("invalid URL..!");
});
app.listen(port,()=>{
  console.log(`Backend server running on http://localhost:${port}`);
})

// https.createServer(options, app).listen(port, () => {
//   console.log(`Backend server running on https://localhost:${port}`);
// });
