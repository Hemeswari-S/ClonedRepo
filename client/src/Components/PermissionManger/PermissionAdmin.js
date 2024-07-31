import React, { useEffect, useState } from "react";
import { RestAPIURL } from "../../Config/Settings";
import axios from "axios";
import { Styles } from "../../Config/Colors";
import { Card, DatePicker, Select, Table } from "antd";
import Nodata from "../../Assets/Nodata.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { sessionManager } from "../../Config/sessionmanager";

const ApiUrl = RestAPIURL + "/Permissionmanager/";

export default function PermissionAdmin() {
  const [Data, SetData] = useState([]);
  const [empId, setEmpId] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [period, setPeriod] = useState(dayjs().format("YYYY/MM"));

  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      width: 200,
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      width: 200,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      type: "reason",
      width: 200,
    },
    {
      title: "Requested Hours",
      dataIndex: "RequestedHours",
      key: "RequestedHours",
      width: 200,
    },
  ];

  const getEmployeesByManager = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${RestAPIURL}/Leavemanager/GetEmployeesByManager/${sessionManager.getEmployeeId()}/${sessionManager.getRole()}`
      );
      const mappedData = result.data.map((item) => ({
        value: item.UserId,
        label: `${item.FirstName} ${item.LastName}`,
      }));
      setEmployees(mappedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  
  const handleDateChange = (date) => {
    setPeriod(date ? dayjs(date).format("YYYY/MM") : dayjs().format("YYYY/MM"));
  };

  useEffect(() => {
    ApprovedLeaves();
  }, [empId,period]);
  useEffect(() => {
    getEmployeesByManager();
  }, []);
  const ApprovedLeaves = () => {
    axios.get(`${ApiUrl}get/${period}/${empId}`).then((result) => {
      SetData('result.data');
      SetData(result.data);
      setIsLoading(false);
      console.log(result.data);
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xs-12">
          <div className="row">
            <div className="col-lg-1 col-md-1" />
            <div className="col-lg-4 col-md-2 col-xs-12">
              Select Month & Year:
              <DatePicker
                picker="month"
                onChange={handleDateChange}
                placement="topRight"
              />
            </div>
            <div className="col-lg-4 col-md-2 col-xs-12">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-xs-12">
                  Select Employee:
                </div>
                <div className="col-lg-8 col-md-8 col-xs-12">
                  <Select
                    placeholder="Select Employee"
                    value={empId}
                    onChange={setEmpId}
                    style={{ width: "100%" }}
                    options={employees}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-1" />
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
            <Table
              columns={columns}
              dataSource={Data}
              pagination={{ pageSize: 7 }}
              rowKey={(record) => record._id}
              className="P-10"
            />
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              <img
                src={Nodata}
                alt="no data"
                height={300}
                className="img w-50"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
