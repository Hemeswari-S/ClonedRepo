import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { RestAPIURL } from "../../Config/Settings.js";
import { Styles } from "../../Config/Colors.js";
import Nodata from "../../Assets/Nodata.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import { Typography } from "antd";
import { CircularProgress } from "@mui/material";

const ApiUrl = RestAPIURL + "/Payroll/";
export default function PayslipHistory() {
  const [Data, SetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { field: "employeeId", headerName: "Employee Id", width: 250 },
    { field: "payslipId", headerName: "Payslip Id", width: 180 },
    {
      field: "generatedBy",
      headerName: "Generated By",
      type: "string",
      width: 300,
    },
    {
      field: "PayPeriod",
      headerName: "PayPeriod",
      type: "string",
      width: 200,
      sortable: false,
    },
    {
      field: "Filename",
      headerName: "Filename",
      type: "string",
      width: 300,
      sortable: false,
    },
  ];

  const Getall = () => {
    axios.get(ApiUrl + "getallpayslip").then((result) => {
      SetData(result.data);
      setIsLoading(false);
      console.log(result.data);
    });
  };

  useEffect(Getall, []);

  const {Title}=Typography;
  return (
    <>
     <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
        Payslip History
      </Title>
      <hr/>
    <div className="row ">
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
              ) :Data.length !== 0 ? (
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
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <img src={Nodata} alt="no data" height={300} className="img w-50" />
        </div>
      )}
    </div>
    </>
  )
}
