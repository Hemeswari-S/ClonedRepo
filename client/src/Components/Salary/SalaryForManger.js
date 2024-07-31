import React, { useEffect, useState } from "react";
import { Styles } from "../../Config/Colors";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { RestAPIURL } from "../../Config/Settings";
import Nodata from "../../Assets/Nodata.png";
import { DataGrid } from "@mui/x-data-grid";
import { sessionManager } from "../../Config/sessionmanager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import { Typography } from "antd";
import { CircularProgress } from "@mui/material";

const ApiUrl = `${RestAPIURL}/Salary&Compensation/`;


export const SalaryManger = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = sessionManager.getRole();
  const empId = sessionManager.getEmployeeId();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const result = await axios.get(`${ApiUrl}get/${role}/${empId}`);
      setData(result.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  };

 



   
 

  const columns = [
    { field: "EmployeeName", headerName: "Employee Name", width: 150 },
    { field: "payPeriod", headerName: "Pay Period", width: 100 },
    { field: "baseSalary", headerName: "Base Salary", type: "number", width: 80, sortable: false },
    { field: "payGrade", headerName: "Pay Grade", type: "number", width: 80, sortable: false },
    { field: "annualSalary", headerName: "Annual Salary", type: "number", width: 80, sortable: false },
    { field: "bonus", headerName: "Bonus", type: "number", width: 80, sortable: false },
    { field: "allowances", headerName: "Allowances", type: "number", width: 80, sortable: false },
    { field: "overtimePay", headerName: "Overtime Pay", type: "number", width: 80, sortable: false },
    { field: "deductions", headerName: "Deductions", type: "number", width: 80, sortable: false },
    { field: "totalCompensation", headerName: "Total Compensation", type: "number", width: 80, sortable: false },
    { field: "reimbursements", headerName: "Reimbursements", type: "number", width: 80, sortable: false },
    { field: "advances", headerName: "Advances", type: "number", width: 80, sortable: false },
    { field: "PF", headerName: "PF", type: "number", width: 80, sortable: false },
    { field: "ESI", headerName: "ESI", type: "number", width: 80, sortable: false },
    { field: "TDS", headerName: "TDS", type: "number", width: 80, sortable: false },
    { field: "ProfessionalTax", headerName: "Professional Tax", type: "number", width: 80, sortable: false },
    { field: "taxInformation", headerName: "Tax Information", type: "number", width: 80, sortable: false },
  ];
  const {Title}=Typography;
  return (
    <>
     <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
        Salary Data
      </Title>
      <hr/>
      {isLoading ? (
                <div
                  className="container"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "calc(100vh - 285px)",
                  }}
                >
                  <CircularProgress color="success" />
                </div>
              ) :data.length!== 0 ? (<>
         <DataGrid
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: Styles.VarDarkGreen1,
              color: "white",
              fontWeight: 800,
            },
            "& .MuiDataGrid-cell": {
              color: Styles.VarDarkGreen1,
            },
          }}
          getRowId={(data) => data.employeeId}
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 4 },
            },
          }}
          pageSizeOptions={[5, 10]}
        /> 
       </>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <img src={Nodata} alt="no data" height={300} className="img w-50" />
        </div>
      )}
      <ToastContainer />
    </>
  );
};

