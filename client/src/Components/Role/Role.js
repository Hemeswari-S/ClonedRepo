import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  ConfigProvider,
  Modal,
  Select,
  Typography,
} from "antd";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


import axios from "axios";
import { CircularProgress, InputLabel, TextField } from "@mui/material";
import { RestAPIURL } from "../../Config/Settings.js";
import { Styles } from "../../Config/Colors.js";
import { ButtonColor, OPTIONS, STATUSOPTIONS, Variables, getActiveColors, getHoverColors } from "../../Config/Variables.js";
import { ToastContainer, toast } from "react-toastify";
import Nodata from '../../Assets/Nodata.png'

// const OPTIONS = ["Create", "Edit", "view", "Delete"];

const ApiUrl = RestAPIURL + "/Role/";
export default function RoleComp() {
  const [Data, SetData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    SetIsEditMode(false);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const [roleId, SetroleId] = useState(0);
  const [roleName, SetroleName] = useState("");
  const [permissions, setpermissions] = useState([]);
  const [ValidateroleId, SetValidateroleId] = useState("");
  const [ValidateroleName, SetValidateroleName] = useState("");
  const [Validatepermissions, setValidatepermissions] = useState('');
  const [IsActive, SetIsActive] = useState(true);
  const [IsEditMode, SetIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [Data_1, SetData_1] = useState();

  const columns = [
    { field: "roleId", headerName: "Role Id", type: "roleId", width: 250 },
    { field: "roleName", headerName: "Role Name", width: 250 },
    {
      field: "permissions",
      headerName: "Permissions",
      type: "string",
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
        roleId: Number(roleId),
        roleName: roleName,
        permissions: permissions,
        IsActive:IsActive
      },
      [roleId, roleName, permissions,IsActive]
    );
  });
  const CreateRecord = () => {
    axios.post(ApiUrl + "create", Data_1).then((result) => {
      if (result.data.message === Variables.SuccessMessage) {
        toast.success('Added Successfully');
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
    console.log(permissions);
    if (roleId === "" || roleId <= 0) {
      SetValidateroleId("Please Enter Valid Role Id");
      return false;
    }
     else {
      SetValidateroleId("");
    }
    if (roleName === "") {
      SetValidateroleName("Please Fill the Role Name");
      return false;
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(roleName) || /\d/.test(roleName)) {
      SetValidateroleName("Only Letters Are Allowed");
      return false;
    } else {
      SetValidateroleName(" ");
    }
    if (permissions.length === 0) {
      setValidatepermissions("Please slect permissions");
    }
    if (permissions.length !== 0) {
      setValidatepermissions(" ");
    }
    if (IsEditMode) {
      console.log("Updat");
      Updaterecord(roleId);
      SetIsEditMode(false);
    } else {
      console.log("create");
      CreateRecord();
    }
  };
  const reset = () => {
    SetroleId("");
    SetroleName("");
    setpermissions([]);
    SetValidateroleId("");
    SetValidateroleName("");
    setValidatepermissions("");
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
      SetroleId(result.data.roleId);
      SetroleName(result.data.roleName);
      setpermissions(result.data.permissions);
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
  const colorsButton =ButtonColor;

 

  const {Title}=Typography;
  return (
    <>
     <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
       Role
      </Title>
      <hr/>
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
                  Add New Role
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
              ) :
              Data.length!==0?( <DataGrid
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
              
                getRowId={(Data) => Data.roleId}
                rows={Data}
                columns={columns}
                onRowClick={(Data) => {
                  HandleRowClick(Data.row.roleId);
                  console.log(Data.row.roleId);
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />):(<div className="d-flex justify-content-center align-items-center"><img src={Nodata} alt="no data" height={300} className="img w-50" /></div>)
            }
           
          </div>
        </div>
        <Modal
          title={IsEditMode ? "Edit Role" : "Add Role"}
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
              id="roleId"
              name="roleId"
              label="Role Id "
              type="number"
              fullWidth
              variant="standard"
              value={roleId}
              onChange={(e) => {
                SetroleId(e.target.value);
              }}
              disabled={IsEditMode}
            />
            <span className="span">{ValidateroleId}</span>
            <TextField
              autoFocus
              required
              margin="dense"
              id="roleName"
              name="roleName"
              label="Role Name "
              type="text"
              fullWidth
              variant="standard"
              value={roleName}
              onChange={(e) => {
                SetroleName(e.target.value);
              }}
            />
            <span className="span">{ValidateroleName}</span>

            <InputLabel style={{ marginTop: 20 }} id="select-label">
              Permissions
            </InputLabel>
            <Select
              mode="multiple"
              placeholder="Select Permssions"
              value={permissions}
              onChange={setpermissions}
              style={{
                width: "100%",
              }}
              options={OPTIONS}
              />
            <span className="span">{Validatepermissions}</span>
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
