import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, ConfigProvider, Modal, Select, Typography } from "antd";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import axios from "axios";
import { CircularProgress, InputLabel, TextField } from "@mui/material";
import { RestAPIURL } from "../../Config/Settings.js";
import { Styles } from "../../Config/Colors.js";
import {
  ButtonColor,
  STATUSOPTIONS,
  Variables,
  getActiveColors,
  getHoverColors,
} from "../../Config/Variables.js";
import { ToastContainer, toast } from "react-toastify";
import Nodata from "../../Assets/Nodata.png";

// const OPTIONS = ["Create", "Edit", "view", "Delete"];

const ApiUrl = RestAPIURL + "/LeaveType/";
export default function Leavetype() {
  const [Data, SetData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleOpen = () => {
    setOpen(true);
    SetIsEditMode(false);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const [leaveType_Id, SetleaveType_Id] = useState(0);
  const [typeOfLeave, SettypeOfLeave] = useState("");
  const [availableForAYear, setavailableForAYear] = useState(0);
  const [ValidateleaveType_Id, SetValidateleaveType_Id] = useState("");
  const [ValidatetypeOfLeave, SetValidatetypeOfLeave] = useState("");
  const [ValidateavailableForAYear, setValidateavailableForAYear] =
    useState("");
  const [IsActive, SetIsActive] = useState(true);
  const [IsEditMode, SetIsEditMode] = useState(false);
  const [Data_1, SetData_1] = useState();

  const columns = [
    {
      field: "leaveType_Id",
      headerName: "LeaveType Id",
      type: "leaveType_Id",
      width: 250,
    },
    { field: "typeOfLeave", headerName: " Type of Leave", width: 250 },
    {
      field: "availableForAYear",
      headerName: "Available For an Year",
      type: "number",
      width: 300,
    },
    {
      field: "IsActive",
      headerName: "IsActive",
      type: "Boolean",
      width: 250,
      sortable: false,
    },
  ];

  useEffect(() => {
    SetData_1(
      {
        leaveType_Id: Number(leaveType_Id),
        typeOfLeave: typeOfLeave,
        availableForAYear: availableForAYear,
        IsActive: IsActive,
      },
      [leaveType_Id, typeOfLeave, availableForAYear, IsActive]
    );
  });
  const CreateRecord = () => {
    axios.post(ApiUrl + "create", Data_1).then((result) => {
      if (result.data.message === Variables.SuccessMessage) {
        toast.success("Added Successfully");
        handleClose();
        reset();
        Getall();
      } else {
        toast.error(result.data.message);
      }
    });
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(availableForAYear);
    if (leaveType_Id === "" || leaveType_Id <= 0) {
      SetValidateleaveType_Id("Please Enter Valid LeaveType Id");
      return false;
    } else {
      SetValidateleaveType_Id("");
    }
    if (typeOfLeave === "") {
      SetValidatetypeOfLeave("Please Fill the Type of Leave");
      return false;
    } else if (
      /[!@#$%^&*(),.?":{}|<>]/.test(typeOfLeave) ||
      /\d/.test(typeOfLeave)
    ) {
      SetValidatetypeOfLeave("Only Letters Are Allowed");
      return false;
    } else {
      SetValidatetypeOfLeave(" ");
    }
    if (availableForAYear === "" || availableForAYear <= 0) {
      setValidateavailableForAYear("Please Enter  available For an Year");
      return false;
    } else {
      setValidateavailableForAYear(" ");
    }
    if (IsEditMode) {
      console.log("Updat");
      Updaterecord(leaveType_Id);
      SetIsEditMode(false);
    } else {
      console.log("create");
      CreateRecord();
    }
  };
  const reset = () => {
    SetleaveType_Id("");
    SettypeOfLeave("");
    setavailableForAYear([]);
    SetValidateleaveType_Id("");
    SetValidatetypeOfLeave("");
    setValidateavailableForAYear("");
  };
  const Getall = () => {
    axios.get(ApiUrl + "get").then((result) => {
      SetData(result.data);
      setIsLoading(false);
      console.log(result.data);
    });
  };
  const GetbyId = (id) => {
    axios.get(ApiUrl + "get/" + id).then((result) => {
      console.log(result);
      SetleaveType_Id(result.data.leaveType_Id);
      SettypeOfLeave(result.data.typeOfLeave);
      setavailableForAYear(result.data.availableForAYear);
      SetIsActive(result.data.IsActive);
      console.log(result.data.IsActive);
    });
  };
  const Updaterecord = (id) => {
    axios.put(ApiUrl + "update/" + id, Data_1).then((result) => {
      if (result.data.message === Variables.SuccessMessage) {
        toast.success("Updated successfully");
        handleClose();
        reset();
        Getall();
      } else {
        toast.error(result.data.message);
      }
    });
  };

  useEffect(Getall, []);
  const HandleRowClick = (id) => {
    console.log(id);
    SetIsEditMode(true);
    GetbyId(id);

    setOpen(true);
  };
  const colorsButton = ButtonColor;

  const { Title } = Typography;
  return (
    <>
      <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
        Leave Type
      </Title>
      <hr />
      <div>
        <div className="row d-flex justify-content-center align-items-center">
          {/* <div className="col-lg-2 col-md-3 col-xs-2"></div> */}
          <div className="col-lg-12 col-md-12 col-xs-12">
            <div className="row">
              <div style={{ height: "50px" }}></div>
              <div className="col-lg-10"></div>
              <div className="col-lg-2 .float-lg-right">
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
                  <Button type="primary" onClick={() => handleOpen()}>
                    Add New LeaveType
                  </Button>
                </ConfigProvider>
              </div>
            </div>
            <hr />
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
                  getRowId={(Data) => Data.leaveType_Id}
                  rows={Data}
                  columns={columns}
                  onRowClick={(Data) => {
                    HandleRowClick(Data.row.leaveType_Id);
                    console.log(Data.row.leaveType_Id);
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
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
          <Modal
            title={IsEditMode ? "Edit LeaveType" : "Add LeaveType"}
            centered
            open={open}
            onCancel={() => {
              handleClose();
            }}
            okButtonProps={{ style: { display: "none" } }}
            footer={[
              IsEditMode ? (
                <></>
              ) : (
                <Button type="text" onClick={reset}>
                  Reset
                </Button>
              ),

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
                <Button type="primary" onClick={handlesubmit}>
                  Submit
                </Button>
              </ConfigProvider>,
            ]}
          >
            <form>
              <TextField
                autoFocus
                margin="dense"
                required
                id="leaveType_Id"
                name="leaveType_Id"
                label="Leave Type Id "
                type="number"
                fullWidth
                variant="standard"
                value={leaveType_Id}
                onChange={(e) => {
                  SetleaveType_Id(e.target.value);
                }}
                disabled={IsEditMode}
              />
              <span className="span">{ValidateleaveType_Id}</span>
              <TextField
                autoFocus
                required
                margin="dense"
                id="typeOfLeave"
                name="typeOfLeave"
                label="Type of Leave"
                type="text"
                fullWidth
                variant="standard"
                value={typeOfLeave}
                onChange={(e) => {
                  SettypeOfLeave(e.target.value);
                }}
              />
              <span className="span">{ValidatetypeOfLeave}</span>
              <TextField
                autoFocus
                required
                margin="dense"
                id="availableForAYear"
                name="availableForAYear"
                label="Available For an Year "
                type="number"
                fullWidth
                variant="standard"
                value={availableForAYear}
                onChange={(e) => {
                  setavailableForAYear(e.target.value);
                }}
              />
              <span className="span">{ValidateavailableForAYear}</span>

              {IsEditMode ? (
                <>
                  <InputLabel style={{ marginTop: 20 }} id="select-label">
                    IS Active
                  </InputLabel>
                  <Select
                    value={IsActive}
                    onChange={SetIsActive}
                    style={{
                      width: "100%",
                    }}
                    options={STATUSOPTIONS}
                  />
                </>
              ) : (
                <></>
              )}
            </form>
          </Modal>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
