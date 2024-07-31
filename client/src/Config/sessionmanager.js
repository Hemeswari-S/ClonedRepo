import axios from "axios";
import { RestAPIURL } from "./Settings";

export const sessionManager = {
    getEmployeeId: () => {
      const EmployeeId = sessionStorage.getItem("EmployeeId");
      return EmployeeId;
    },
    getRole: () => {
      const role = sessionStorage.getItem("Role");
      return role; 
    },
    getEmpName: () => {
      const name = sessionStorage.getItem("Name"); 
      return name; 
    },
    getDashboard: () => {
      const Dashboard = sessionStorage.getItem("Dashboard"); 
      return Dashboard; 
    },
    getPermissionStatus: () => {
      const Status = sessionStorage.getItem("PermissionStatus");
       
      return Status; 
    },
    getOvertimeStatus: () => {
      const Status = sessionStorage.getItem("OverTimeStatus"); 
      return Status; 
    },
  };

  export const handleControls =() => {
    console.log("log");
    axios.get(`${RestAPIURL}/AdminControl/getall`).then((result) => {
      if(result.data.length!==0){
      sessionStorage.setItem('PermissionStatus',result.data[0].IsActive);
      sessionStorage.setItem('OverTimeStatus',result.data[1].IsActive);
      }
    });

  };