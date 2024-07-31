import {
  Button,
  Card,
  ConfigProvider,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import React, { useEffect, useState } from "react";
import { Styles } from "../../Config/Colors.js";
import { RestAPIURL } from "../../Config/Settings.js";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import {
  ButtonColor,
  Variables,
  getActiveColors,
  getHoverColors,
} from "../../Config/Variables.js";
import { ToastContainer, toast } from "react-toastify";
import { DatePicker } from "antd";
import { CircularProgress, InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Nodata from "../../Assets/Nodata.png";
import TextArea from "antd/es/input/TextArea.js";
import dayjs from "dayjs";
import { sessionManager } from "../../Config/sessionmanager.js";

const ApiUrl = RestAPIURL + "/Leavemanager/";
export default function LeaveManageruser() {
  const [Data, SetData] = useState([]);
  const [TableData, SetTableData] = useState([]);
  const [LeaveTypeData, SetLeaveTypeData] = useState([]);
  const [Managers, SetManagers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [IsMedical, setIsmedical] = useState(false);
  const [LeaveDays, setLeaveDays] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [manager1, setManager1] = useState("");
  const [manager2, setManager2] = useState("");
  const [fileList, setFileList] = useState([]);

  const [validateLeaveType, setValidateLeaveType] = useState("");
  const [validateStartDate, setValidateStartDate] = useState("");
  const [validateEndDate, setValidateEndDate] = useState("");
  const [validateManager1, setValidateManager1] = useState("");
  const [validateManager2, setValidateManager2] = useState("");
  const [validateEvidence, setValidateEvidence] = useState("");

  const EMployeeId = sessionManager.getEmployeeId();
  const EMpName = sessionManager.getEmpName();
  const columns = [
    {
      field: "leaveType",
      headerName: "leave Type",
      type: "string",
      width: 150,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "string",
      width: 200,
    },
    {
      field: "endDate",
      headerName: "End Date",
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
      field: "pedingWith",
      headerName: "Pending With",
      type: "string",
      width: 200,
      sortable: false,
    },
    {
      field: "leaveStatus",
      headerName: "Request Status",
      type: "string",
      width: 200,
      sortable: false,
    },
  ];
  const getWorkingDaysCount = (startDate, endDate) => {
    let count = 0;
    let currentDate = dayjs(startDate);

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      const dayOfWeek = currentDate.day();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate = currentDate.add(1, "day");
    }

    return count;
  };
  const handleSubmit = () => {
    let isValid = true;

    if (leaveType.length === 0) {
      setValidateLeaveType("Leave Type Can't be Empty");
      isValid = false;
    } else {
      setValidateLeaveType("");
    }
    if (!startDate) {
      setValidateStartDate("Start Date Can't be Empty");
      isValid = false;
    } else {
      setValidateStartDate("");
    }
    if (!endDate) {
      setValidateEndDate("End Date Can't be Empty");
      isValid = false;
    } else if (endDate.isBefore(startDate)) {
      setValidateEndDate("End Date Can't be before Start Date");
      isValid = false;
    } else {
      setValidateEndDate("");
    }
    if (manager1 === "") {
      setValidateManager1("Manager 1 Can't be Empty");
      isValid = false;
    } else {
      setValidateManager1("");
    }
    if (manager2 === "") {
      setValidateManager2("Manager 2 Can't be Empty");
      isValid = false;
    } else {
      if (manager1 === manager2) {
        setValidateManager2(`Manager1 And Manager2 Can't Be Same`);
        isValid = false;
      } else {
        setValidateManager2("");
      }
    }

    if (leaveType === "Sick" && getWorkingDaysCount(startDate, endDate) > 2) {
      setLeaveType(Variables.MedicalText);
      // setStartDate(startDate);
      // setEndDate(endDate);
      toast.warning(
        "More than 2 days of Sick Leave Considered as Medical Leave Automatically And Upload The medical Evidence Please"
      );
      isValid = false;
    }
    if (leaveType === Variables.MedicalText && !fileList) {
      setValidateEvidence("Please Upload Evidence Here");
      isValid = false;
    } else {
      setValidateEvidence("");
    }
    if (isValid) {
      CreateRecord();
    }
  };
  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const getLeavetypes = () => {
    axios.get(RestAPIURL + "/LeaveType/get").then((result) => {
      let Data = result.data;
      console.log(Data);
      let mappedData = Data.map((item) => {
        return {
          value: item.typeOfLeave,
          label: item.typeOfLeave,
        };
      });
      SetLeaveTypeData(mappedData);
      console.log(result.data);
    });
  };
  const getManagers = () => {
    console.log("RestAPIURL");
    console.log(RestAPIURL + "/user/getManagers");
    axios.get(RestAPIURL + "/user/getManagers").then((result) => {
      let Data = result.data;
      console.log(Data);
      let mappedData = Data.map((item) => {
        return {
          value: item.FirstName,
          label: item.FirstName,
        };
      });
      SetManagers(mappedData);
      console.log(result.data);
    });
  };
  useEffect(() => {
    GetLEaveTypeDataBasedOnEMployee();
    getLeavetypes();
    GetPendingApprovalsLeaves();
    getManagers();
  }, []);
  const GetLEaveTypeDataBasedOnEMployee = () => {
    axios
      .get(
        ApiUrl +
          "displayleaveDetailsOfEmp/" +
          EMployeeId +
          "/" +
          new Date().getFullYear()
      )
      .then((result) => {
        SetData(result.data);
        console.log(result.data);
        setIsLoading(false);
      });
  };
  const GetPendingApprovalsLeaves = () => {
    axios
      .get(ApiUrl + "getbyUserPendingLeaves/" + EMployeeId)
      .then((result) => {
        SetTableData(result.data);
        setIsLoading(false);
        console.log(result.data);
      });
  };
  const GetApprovedsLeaves = () => {
    axios
      .get(ApiUrl + "getbyUserApprovedLeaves/" + EMployeeId)
      .then((result) => {
        SetTableData(result.data);
        setIsLoading(false);
        console.log(result.data);
      });
  };
  const CreateRecord = async () => {
    console.log("create");
    const employeeId = EMployeeId;
    const noOfDays = getWorkingDaysCount(startDate, endDate);
    const Evidence = fileList[0].orgf;
    console.log(Evidence);
    if (leaveType === Variables.MedicalText) {
      const formData = new FormData();
      formData.append("employeeId", employeeId);
      formData.append("leaveType", leaveType);
      formData.append("startDate",startDate);
      formData.append("endDate", endDate);
      formData.append("manager1", manager1);
      formData.append("manager2", manager2);
      formData.append("noOfDays", noOfDays);
      formData.append("pedingWith", manager1);
      formData.append("RequestedBY", EMpName);
      formData.append("year", dayjs().year());
      if (fileList.length > 0) {
        formData.append("Evidence", fileList[0].originFileObj);
      }

      await axios
        .post(ApiUrl + "createwithfile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        // console.log('result');
        // console.log(result);
        .then((result) => {
          if (result.data.message === Variables.SuccessMessage) {
            toast.success("Added Successfully");
            GetPendingApprovalsLeaves();
            GetApprovedsLeaves();
            GetLEaveTypeDataBasedOnEMployee();
            handleClose();
          } else {
            console.log(result + " result");
            toast.error(result.data.message);
          }
        });
    } else {
      const formData = {
        employeeId,
        leaveType,
        startDate: startDate,
        endDate,
        reason,
        manager1,
        manager2,
        noOfDays,
        pedingWith: manager1,
        RequestedBY: EMpName,
        year: dayjs().year(),
        Evidence: fileList,
      };
      await axios.post(ApiUrl + "create", formData).then((result) => {
        if (result.data.message === Variables.SuccessMessage) {
          toast.success("Added Successfully");
          GetPendingApprovalsLeaves();
          GetApprovedsLeaves();
          GetLEaveTypeDataBasedOnEMployee();
          handleClose();
        } else {
          console.log(result + " result");
          toast.error(result.data.message);
        }
      });
    }
  };
  const colorsButton = ButtonColor;
  const resetForm = () => {
    setLeaveType("");
    setEndDate(null);
    setReason(null);
    setManager1(null);
    setManager2(null);
    setFileList(null);
    setStartDate(null);

    setValidateLeaveType("");
    setValidateStartDate("");
    setValidateEndDate("");
    setValidateManager1("");
    setValidateManager2("");
    setValidateEvidence("");
    setLeaveDays("");
  };
  const getleavedays = () => {
    axios
      .get(`${ApiUrl}getLeavedays/${leaveType}/${EMployeeId}`)
      .then((res) => {
        setLeaveDays(res.data.LeaveDays?"Remaining Days : " + res.data.LeaveDays:'');
      });
  };

  useEffect(() => {
    getleavedays();
    if (leaveType === Variables.MedicalText) {
      setIsmedical(true);
    } else {
      setIsmedical(false);
    }
  }, [leaveType]);
  const beforeUpload = (file) => {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
      toast.error("You can only upload PDF file!");
    }
    return isPDF || Upload.LIST_IGNORE;
  };

  const handleChange = ({ fileList }) => {
    if (fileList.length > 1) {
      fileList = [fileList[fileList.length - 1]];
    }
    setFileList(fileList);
  };

  return (
    <div>
      <div className="row">
        {Data.map((data) => (
          <div className="col-lg-3 col-md-4 col-xs-6 ">
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
                <div className="col-lg-7 col-md-8 col-xs-8">Leave Type :</div>
                <div className="col-lg-5 col-md-4 col-xs-4">
                  {data.leaveType}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-7 col-md-10 col-xs-10">
                  Remaining Leave :
                </div>
                <div className="col-lg-5 col-md-2 col-xs-2">
                  {data.remainingLeaves}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-7 col-md-10 col-xs-10">
                  Availed Leaves :
                </div>
                <div className="col-lg-5 col-md-2 col-xs-2">
                  {data.AvaildLeavs}
                </div>
              </div>
            </Card>
          </div>
          // </div>
        ))}
      </div>
      <hr />
      <div className="row">
        <div className="col-lg-3 col-md-6 col-xs-6">
          <ButtonGroup aria-label="Basic example">
            <button
              className="btn btn-md btn1 "
              onClick={GetPendingApprovalsLeaves}
            >
              Pending Approvals
            </button>
            <button className="btn btn-md btn1" onClick={GetApprovedsLeaves}>
              Approved Leaves
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
            <Button size="large" type="primary" onClick={() => handleOpen()}>
              Request leave
            </Button>
          </ConfigProvider>
        </div>
        {/* <Col span={11}></Col> */}
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
              paginationModel: { page: 0, pageSize: 3 },
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
        title="Leave Request Form"
        centered
        open={open}
        onCancel={() => {
          handleClose();
        }}
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
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </ConfigProvider>
          </>,
        ]}
      >
        <form>
          <InputLabel style={{ marginTop: 20 }} id="select-label">
            Select LeaveType
          </InputLabel>
          <Select
            placeholder="Select LeaveType"
            value={leaveType}
            onChange={setLeaveType}
            style={{
              width: "100%",
            }}
            options={LeaveTypeData}
          />
          <span>{LeaveDays}</span>
          <span className="span">{validateLeaveType}</span>
          <div className="row">
            <div className="col-6">
              <InputLabel style={{ marginTop: 20 }}>From </InputLabel>
              {IsMedical ? (
                <>
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Start Date"
                    placement="topRight"
                    // showTime={false}
                    // disabledDate={(current) => {
                    //   return current && current < dayjs().startOf("day");
                    // }}
                    onChange={(dateString) => {
                      setStartDate(dateString);
                    }}
                  />
                </>
              ) : (
                <>
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Start Date"
                    placement="topRight"
                    // showTime={false}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                    onChange={(dateString) => {
                      setStartDate(dateString);
                    }}
                  />
                </>
              )}

              <br />
              <span className="span">{validateStartDate}</span>
            </div>
            <div className="col-6">
              <InputLabel style={{ marginTop: 20 }}> To </InputLabel>
              {IsMedical ? (
                <>
                  {" "}
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="End Date"
                    placement="topRight"
                    // showTime={false}
                    // disabledDate={(current) => {
                    //   return current && current < dayjs().startOf("day");
                    // }}
                    onChange={(dateString) => {
                      setEndDate(dateString);
                    }}
                  />
                </>
              ) : (
                <>
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="End Date"
                    placement="topRight"
                    showTime={false}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                    onChange={(dateString) => {
                      setEndDate(dateString);
                    }}
                  />
                </>
              )}

              <br />
              <span className="span">{validateEndDate}</span>
            </div>
          </div>
          {IsMedical ? (
            <>
              <InputLabel style={{ marginTop: 20 }}>Upload Evidence</InputLabel>
              <Upload
                accept=".pdf"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={fileList}
                maxCount={1}
              >
                <Button>Choose Evidence</Button> <span>** Pdf file Only</span>
              </Upload>
            </>
          ) : (
            <>
              <InputLabel style={{ marginTop: 20 }}>Reason</InputLabel>

              <TextArea
                rows={4}
                placeholder="Reason "
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              />
            </>
          )}

          <span className="span">{validateEvidence}</span>
          <div className="row">
            <div className="col-6">
              <InputLabel style={{ marginTop: 20 }} id="select-label">
                Select Manager1
              </InputLabel>
              <Select
                placeholder="Select Manager1"
                value={manager1}
                onChange={setManager1}
                style={{
                  width: "100%",
                }}
                options={Managers}
              />
              <span className="span">{validateManager1}</span>
            </div>

            <div className="col-6">
              <InputLabel style={{ marginTop: 20 }} id="select-label">
                Select Manager1
              </InputLabel>
              <Select
                placeholder="Select Manager1"
                value={manager2}
                onChange={setManager2}
                style={{
                  width: "100%",
                }}
                options={Managers}
              />
              <span className="span">{validateManager2}</span>
            </div>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
}
