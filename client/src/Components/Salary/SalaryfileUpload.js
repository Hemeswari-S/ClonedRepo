import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Upload } from "antd";
import { DragOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import { Styles } from "../../Config/Colors";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { RestAPIURL } from "../../Config/Settings";
import Nodata from "../../Assets/Nodata.png";
import { ButtonColor, getActiveColors, getHoverColors } from "../../Config/Variables";
import { DataGrid } from "@mui/x-data-grid";
import { sessionManager } from "../../Config/sessionmanager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { CircularProgress } from "@mui/material";


const ApiUrl = `${RestAPIURL}/Salary&Compensation/`;


export const SalaryfileUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
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

  const beforeUpload = (file) => {
    const isCSV = file.type === "text/csv";
    if (!isCSV) {
      toast.error("You can only upload CSV files!");
    }
    return isCSV || Upload.LIST_IGNORE;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList.slice(-1));
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);

    try {
      const response = await axios.post(`${ApiUrl}create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      fetchAllData();
      setFileList([]);
    } catch (error) {
      toast.error(`File upload failed: ${error.message}`);
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

  return (
    <>
      <div
        style={{
          border: `${Styles.VarGreen2} dashed 2px`,
          borderRadius: "4px",
          backgroundColor: Styles.VarlightGreen3,
          textAlign: "center",
        }}
      >
        <Dragger
          accept=".csv"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          fileList={fileList}
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <DragOutlined twoToneColor={Styles.VarGreen2} />
          </p>
          <p className="ant-upload-text">
            Click or drag your Salary CSV file to this area to upload
          </p>
          <p className="ant-upload-hint">Support for a single CSV file only.</p>
        </Dragger>
        {fileList.length > 0 && (
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: `linear-gradient(116deg, ${ButtonColor.join(", ")})`,
                  colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(ButtonColor).join(", ")})`,
                  colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(ButtonColor).join(", ")})`,
                  lineWidth: 0,
                },
              },
            }}
          >
            <Button
              type="primary"
              onClick={handleUpload}
              style={{ marginTop: "16px" }}
            >
              Upload CSV
            </Button>
          </ConfigProvider>
        )}
      </div>

      <hr />
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

