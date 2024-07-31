import { Button, Card, ConfigProvider, Modal, DatePicker } from "antd";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import React, { useEffect, useState } from "react";
import { Styles } from "../../Config/Colors.js";
import { RestAPIURL } from "../../Config/Settings.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import axios from "axios";
import {
  ButtonColor,
  Variables,
  getActiveColors,
  getHoverColors,
} from "../../Config/Variables.js";
import { ToastContainer, toast } from "react-toastify";
import { CircularProgress, InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Nodata from "../../Assets/Nodata.png";
import TextArea from "antd/es/input/TextArea.js";
import dayjs from "dayjs";
import { sessionManager } from "../../Config/sessionmanager.js";

const ApiUrl = RestAPIURL + "/Permissionmanager/";

export default function PermissionManageruser() {
  const [Data, SetData] = useState([]);
  const [TableData, SetTableData] = useState([]);
  const [startTime, SetstartTime] = useState(null);
  const [EndTime, SetEndTime] = useState(null);
  const [Reason, SetReason] = useState("");
  const [validateStarttime, SetValidateStartTim] = useState("");
  const [validateEndtime, SetValidateEndTim] = useState("");
  const [validateReason, SetValidateReason] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const EmployeeId = sessionManager.getEmployeeId();
  const EmployeeName = sessionManager.getEmpName();

  const columns = [
    {
      field: "startTime",
      headerName: "Start Time",
      type: "string",
      width: 200,
    },
    {
      field: "endTime",
      headerName: "End Time",
      type: "string",
      width: 200,
    },
    {
      field: "reason",
      headerName: "Reason",
      type: "text",
      width: 200,
      sortable: false,
    },
    {
      field: "RequestedHours",
      headerName: "Requested Hours",
      type: "string",
      width: 200,
      sortable: false,
    },
    {
      field: "PermissionStatus",
      headerName: "Permission Status",
      type: "string",
      width: 200,
      sortable: false,
    },
  ];

  const handleOpen = () => {
    setOpen(true);
    resetForm();
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    GetPermissionDataBasedOnEMployee();
    GetPendingApprovalsPermissions();
  }, []);

  const GetPermissionDataBasedOnEMployee = () => {
    axios
      .get(
        ApiUrl +
          "displayPermissionDetailsOfEmp/" +
          EmployeeId +
          "/" +
          new Date().getFullYear() +
          "/" +
          new Date().getMonth()
      )
      .then((result) => {
        SetData(result.data);
        setIsLoading(false);
        console.log(result.data);
      });
  };
  const GetPendingApprovalsPermissions = () => {
    axios.get(ApiUrl + "gerFuterpermissions/" + EmployeeId).then((result) => {
      SetTableData(result.data);
      setIsLoading(false);
      console.log(result.data);
    });
  };
  const GetApprovedsPermissions = () => {
    axios.get(ApiUrl + "gerUsedpermissions/" + EmployeeId).then((result) => {
      SetTableData(result.data);
      console.log(result.data);
    });
  };
  const colorsButton = ButtonColor;
  const CreateRecord = () => {
    if (startTime === null) {
      SetValidateStartTim("Start Time Can't be Empty");
      return false;
    } else {
      SetValidateStartTim("");
    }
    if (EndTime === null) {
      SetValidateEndTim("End Time Can't be Empty");
      return false;
    }
    if (EndTime === startTime) {
      SetValidateEndTim("End Time & Start Time Can't be Same");
      return false;
    } else {
      SetValidateEndTim("");
    }

    if (Reason === "") {
      SetValidateReason("Reason Can't be Empty");
      return false;
    }

    if (/^(.)\1+$/.test(Reason)) {
      SetValidateReason("Reason should not be a repeated character sequence.");
      return false;
    } else {
      SetValidateReason("");
    }

    let time1 = new Date(startTime);
    let time2 = new Date(EndTime);

    if (time2 <= time1) {
      SetValidateEndTim("End Time must be after Start Time");
      return false;
    }

    if (TImeDifference(startTime, EndTime) > 2) {
      SetValidateEndTim("You Cannot Request More than 2 Hours At a time");
      return false;
    }

    console.log("TImeDifference(startTime, EndTime)");

    console.log(TImeDifference(startTime, EndTime));

    axios
      .post(ApiUrl + "create", {
        employeeId: EmployeeId,
        EmployeeName: EmployeeName,
        startTime: startTime,
        endTime: EndTime,
        year: dayjs(startTime).year(),
        month: dayjs(startTime).month(),
        RequestedHours: TImeDifference(startTime, EndTime),
        reason: Reason,
      })
      .then((result) => {
        console.log(result);
        if (result.data.message === Variables.SuccessMessage) {
          toast.success("Added Successfully");
          handleClose();
          GetPendingApprovalsPermissions();
          GetApprovedsPermissions();
          GetPermissionDataBasedOnEMployee();
        } else {
          toast.error(result.data.message);
        }
      });
  };
  const resetForm = () => {
    SetstartTime(null);
    SetEndTime(null);
    SetReason("");
    SetValidateEndTim("");
    SetValidateStartTim("");
    SetValidateReason("");
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-4 col-md-4 col-xs-6"></div>
        <div className="col-lg-4 col-md-4 col-xs-6 ">
          {Data.length !== 0 ? (
            <Card
              bordered
              hoverable
              style={{
                background:
                  `linear-gradient(` +
                  Styles.VarlightGreen2 +
                  `,` +
                  Styles.VarlightGreen3 +
                  `,` +
                  Styles.VarlightGreen2 +
                  `)`,
                color: Styles.VarDarkGreen1,
                width: "100%",
                boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`,
                marginBottom: "13px",
              }}
            >
              <div className="row">
                <div className="col-lg-6 col-md-6 col-xs-6">Month :</div>
                <div className="col-lg-6 col-md-6 col-xs-6">
                  {dayjs().format("MMMM") + "/" + dayjs().year()}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-xs-6">
                  Remaining Hours :
                </div>
                <div className="col-lg-6 col-md-6 col-xs-6">
                  {Data[0].balancePermissionhours}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-xs-6">
                  Availed Hours :
                </div>
                <div className="col-lg-6 col-md-6 col-xs-6">
                  {Data[0].totalHoursPermissionTaken}
                </div>
              </div>
            </Card>
          ) : (
            <></>
          )}
        </div>
        <div className="col-lg-4 col-md-4 col-xs-6"></div>
      </div>
      <hr />
      <div className="row">
        <div className="col-lg-3 col-md-6 col-xs-6">
          <ButtonGroup aria-label="Basic example">
            <button
              className="btn btn-md btn1"
              onClick={GetPendingApprovalsPermissions}
            >
              Future Permissions
            </button>
            <button
              className="btn btn-md btn1"
              onClick={GetApprovedsPermissions}
            >
              Used Permissions
            </button>
          </ButtonGroup>
        </div>
        <div className="col-lg-7 col-md-6 col-xs-6"></div>
        <div className="col-lg-2 col-md-6 col-xs-6">
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
            <Button size="large" type="primary" onClick={handleOpen}>
              Request Permission
            </Button>
          </ConfigProvider>
        </div>
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
      ) : TableData.length !== 0 ? (
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
          getRowId={(TableData) => TableData._id}
          rows={TableData}
          columns={columns}
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

      <Modal
        title="Permission Request Form"
        centered
        open={open}
        onCancel={handleClose}
        okButtonProps={{ style: { display: "none" } }}
        footer={[
          <>
            <Button type="text" onClick={resetForm}>
              Reset
            </Button>

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
              <Button type="primary" onClick={CreateRecord}>
                Submit
              </Button>
            </ConfigProvider>
          </>,
        ]}
      >
        <form>
          <div className="row">
            <div className="col-6">
              <InputLabel style={{ marginTop: 20 }} id="select-label">
                Start Time
              </InputLabel>
              <DatePicker
                placeholder="Select Date And Start Time"
                disabledDate={(current) => {
                  return current && current < dayjs().startOf("day");
                }}
                showTime
                placement="topRight"
                value={startTime ? dayjs(startTime) : null}
                onChange={(date, dateString) => {
                  SetstartTime(dateString);
                  console.log(date);
                  console.log(dateString);
                }}
              />
              <span className="span">{validateStarttime}</span>
            </div>
            <div className="col-6">
              <InputLabel style={{ marginTop: 20 }} id="select-label">
                End Time
              </InputLabel>
              <DatePicker
                showTime
                placeholder="Select Date And End Time"
                disabledDate={(current) => {
                  return current && current < dayjs().startOf("day");
                }}
                placement="topRight"
                value={EndTime ? dayjs(EndTime) : null}
                onChange={(date, dateString) => {
                  SetEndTime(dateString);
                  console.log(date);
                  console.log(dateString);
                }}
              />
              <span className="span">{validateEndtime}</span>
            </div>
          </div>

          <InputLabel style={{ marginTop: 20 }}>Reason</InputLabel>

          <TextArea
            rows={4}
            placeholder="Reason"
            value={Reason}
            onChange={(e) => {
              SetReason(e.target.value);
            }}
          />
          <span className="span">{validateReason}</span>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
}

const TImeDifference = (Start, End) => {
  let time1 = new Date(Start);
  let time2 = new Date(End);

  let timeDifference = time2 - time1;

  let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  let hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  let RequestedTime = hours + minutes / 60;
  return RequestedTime;
};
