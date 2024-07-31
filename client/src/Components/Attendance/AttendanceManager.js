import React, { useEffect, useState } from "react";
import { Styles } from "../../Config/Colors";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { RestAPIURL } from "../../Config/Settings";
import Nodata from "../../Assets/Nodata.png";
import dayjs from "dayjs";
import { DatePicker, Typography } from "antd";
import { sessionManager } from "../../Config/sessionmanager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { CircularProgress } from "@mui/material";


const ApiUrl = `${RestAPIURL}/Attendance/`;

export default function AttendanceManager() {
  const [Data, SetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [year, Setyear] = useState(dayjs().format("YYYY"));
  const [month, Setmonth] = useState(dayjs().format("MM"));
  const managerId = sessionManager.getEmployeeId();
  const Getall = () => {
    axios
      .get(`${ApiUrl}getCheckinData/${managerId}/${year}/${month}`)
      .then((result) => {
        SetData(result.data);
        setIsLoading(false);
        console.log(result.data);
      });
  };
  useEffect(Getall, [year, month]);
  const columns = [
    {
      field: "employeeId",
      headerName: "employee Id",
      width: 250,
    },
    { field: "PresentDays", headerName: "Present Days", width: 250 },
    {
      field: "daysInMonth",
      headerName: "daysInMonth",
      width: 300,
      sortable: false,
    },
    {
      field: "totalLeaveDays",
      headerName: "totalLeaveDays",
      width: 250,
    },
  ];
  const onChange = (date) => {
    SetData([]);
    if (date) {
      Setyear(dayjs(date).format("YYYY"));
      Setmonth(dayjs(date).format("MM"));
    } else {
      Setyear(dayjs().format("YYYY"));
      Setmonth(dayjs().format("MM"));
    }
  };

  const {Title}=Typography;
  return (
    <>
     <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
        Attendence Data
      </Title>
      <hr/>
      <lable className="col-form-label">Choose Month</lable>&nbsp;
      <DatePicker picker="month" onChange={onChange} placement="topRight" />
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
          getRowId={(Data) => Data.employeeId}
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
    </>
  );
}
