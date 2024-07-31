import React from "react";
import {  Route, Routes } from "react-router-dom";
import SignIN from "../Components/User/SignIn/SignIn.js";
import {Admindashboard} from "../Components/ADminDashbod/Admindashboard.js";
import Leavetype from "../Components/LeaveType/Leavetype.js";
import RoleComp from "../Components/Role/Role.js";
import Manageuser from "../Components/User/ManageUser/Manageuser.js";
import LeaveManageruser from "../Components/LeaveManger/LeaveManager_user.js";
import Department from "../Components/Department/Department.js";
import Designation from "../Components/Designation/Designation.js";
import PermissionManageruser from "../Components/PermissionManger/PermissionManager.js";
import LeavemanagerForManager from "../Components/LeaveManger/Leavemanager_manager.js";
import { UpoadPyarollData } from "../Components/Payroll/UpoadPyarollData.js";
import { SalaryfileUpload } from "../Components/Salary/SalaryfileUpload.js";
import Permission from "../Components/PermissionManger/Permission.js";
import LeaveManagerAdmin from "../Components/LeaveManger/LeaveManagerAdmin.js";
import PayslipHistory from "../Components/Payroll/PayslipHistory.js";
import PermissionAdmin from "../Components/PermissionManger/PermissionAdmin.js";
import AttendanceAdmin from "../Components/Attendance/AttendanceAdmin.js";
import AttendanceManager from "../Components/Attendance/AttendanceManager.js";
import { SalaryManger } from "../Components/Salary/SalaryForManger.js";
import { EmployeeDashboard } from "../Components/EmployeeDashboard/Employee Dashboard.js";
import EmpCards from "../Components/EMpDEetailsCards/EmpCards.js";
import EmployeeDetails from "../Components/EMpDEetailsCards/SingleEmpInfo.js";
import ForOtp from "../Components/User/SignIn/ForOtp.js";





export const RouteComp = () => {
  return (
    <div>
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<SignIN/>}/>
        {/* <Route path="/personalinfo" element={<PersonalInfo/>}/> */}
        <Route path="/Admindashboard" element={<Admindashboard/>}/>
        <Route path="/LeaveType" element={<Leavetype/>}/>
        <Route path="/Role" element={<RoleComp/>}/>
        <Route path="/User" element={<Manageuser/>}/>
        <Route path="/LeaveManager" element={<LeaveManageruser/>}/>
        <Route path="EmployeeDashboard" element={<EmployeeDashboard/>}/>
        <Route path="/Department" element={<Department/>}/>
        <Route path="/Designation" element={<Designation/>}/>
        <Route path="/PermissionManager" element={<PermissionManageruser/>}/>
        <Route path="/LeaveManagerforManager" element={<LeavemanagerForManager/>}/>
        <Route path="/PayROllManager" element={<UpoadPyarollData/>}/>
        <Route path="/SalaryManager" element={<SalaryfileUpload/>}/>
        <Route path="/PermissionforManager" element={<Permission/>}/>
        <Route path="/LeaveManagerAdmin" element={<LeaveManagerAdmin/>}/>
        <Route path="/PayslipHistory" element={<PayslipHistory/>}/>
        <Route path="/PermissionAdmin" element={<PermissionAdmin/>}/>
        <Route path="/AttendenceHistory" element={<AttendanceAdmin/>}/>
        <Route path="/AttendenceforManager" element={<AttendanceManager/>}/>
        <Route path="/SalaryforManager" element={<SalaryManger/>}/>
        <Route path="/EmpDetails" element={<EmpCards/>}/>
        <Route path="/employee/:id" element={<EmployeeDetails/>}/>
        <Route path="/OTP" element={<ForOtp/>}/>
        </Routes>
        {/* </BrowserRouter> */}
    </div>
  );
};
