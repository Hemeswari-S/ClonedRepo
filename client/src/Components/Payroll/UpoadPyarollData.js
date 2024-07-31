import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Upload } from "antd";
import { DragOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import { Styles } from "../../Config/Colors";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { RestAPIURL } from "../../Config/Settings";
import Nodata from "../../Assets/Nodata.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import {
  ButtonColor,
  getActiveColors,
  getHoverColors,
} from "../../Config/Variables";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";

const ApiUrl = RestAPIURL + "/Payroll/";

export const UpoadPyarollData = () => {
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Data, SetData] = useState([]);
  useEffect(() => {
    Getall();
  }, []);
  const Getall = () => {
    axios.get(ApiUrl + "get").then((result) => {
      SetData(result.data);
      setIsLoading(false);
      console.log(result.data);
    });
  };
  const beforeUpload = (file) => {
    const isCSV = file.type === "text/csv";
    if (!isCSV) {
      toast.error("You can only upload CSV files!");
    }
    return isCSV || Upload.LIST_IGNORE;
  };

  const handleChange = ({ fileList }) => {
    if (fileList.length > 1) {
      fileList = [fileList[fileList.length - 1]];
    }
    setFileList(fileList);
  };
  const handleUpload = async () => {
    if (fileList.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);

    try {
      const response = await axios.post(ApiUrl + "SavefromCSV", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      Getall();
      setFileList([]);
    } catch (error) {
      toast.error("File upload failed.");
    }
  };
  const colorsButton = ButtonColor;
  const columns = [
    {
      field: "EmployeeName",
      headerName: "Employee Name",
      type: "String",
      width: 250,
    },
    { field: "payPeriod", headerName: "Pay Period", width: 100 },
    {
      field: "grossSalary",
      headerName: "grossSalary",
      type: "number",
      width: 100,
      sortable: false,
    },
    {
      field: "netSalary",
      headerName: "netSalary",
      type: "number",
      width: 100,
      sortable: false,
    },
    {
      field: "baseSalary",
      headerName: "baseSalary",
      type: "number",
      width: 150,
      sortable: false,
    },
    {
      field: "bonuses",
      headerName: "bonuses",
      type: "number",
      width: 100,
      sortable: false,
    },
    {
      field: "allowances",
      headerName: "allowances",
      type: "number",
      width: 100,
      sortable: false,
    },
    {
      field: "overtimePay",
      headerName: "overtimePay",
      type: "number",
      width: 100,
      sortable: false,
    },
    {
      field: "deductions",
      headerName: "deductions",
      type: "number",
      width: 100,
      sortable: false,
    },
    {
      field: "paymentMethod",
      headerName: "payment Method",
      type: "string",
      width: 150,
      sortable: false,
    },
    {
      field: "currency",
      headerName: "currency",
      type: "string",
      width: 150,
      sortable: false,
    },
  ];
  return (
    <>
      <div
        style={{
          border: Styles.VarGreen2 + " dashed 2px",
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
            Click Here or drag your payroll CSV file to this area to upload
          </p>
          <p className="ant-upload-hint">Support for a single CSV file only.</p>
        </Dragger>
        {fileList.length > 0 && (
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: `linear-gradient(116deg,  ${colorsButton.join(
                    ", "
                  )})`,
                  colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(
                    colorsButton
                  ).join(", ")})`,
                  colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(
                    colorsButton
                  ).join(", ")})`,
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
      ) : Data.length !== 0 ? (
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
          getRowId={(Data) => Data._id}
          rows={Data}
          columns={columns}
          // onRowClick={(Data) => {
          //   HandleRowClick(Data.row.roleId);
          //   console.log(Data.row.roleId);
          // }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 4 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <img src={Nodata} alt="no data" height={300} className="img w-50" />
        </div>
      )}
      <ToastContainer />
    </>
  );
};
