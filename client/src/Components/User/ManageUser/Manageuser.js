import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, ConfigProvider, Modal, Select, Typography } from "antd";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import axios from "axios";
import { CircularProgress, InputLabel, TextField } from "@mui/material";
import { RestAPIURL } from "../../../Config/Settings.js";
import { Styles } from "../../../Config/Colors.js";
import {
  ButtonColor,
  Variables,
  getActiveColors,
  getHoverColors,
} from "../../../Config/Variables.js";
import { ToastContainer, toast } from "react-toastify";
import Nodata from "../../../Assets/Nodata.png";

// const OPTIONS = ["Create", "Edit", "view", "Delete"];

const ApiUrl = RestAPIURL + "/user/";
export default function Manageuser() {
  const [Data, SetData] = useState([]);
  const [Data_1, SetDat_1] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const [UserId, SetUserId] = useState(0);
  const [FirstName, SetFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [Username, setUsername] = useState("");
  const [RoleID, setRoleID] = useState([]);
  const [RoleName, setRoleName] = useState([]);
  const [RoleData, setRoleData] = useState([]);

  const [ValidateUserId, SetValidateUserId] = useState("");
  const [ValidateFirstName, SetValidateFirstName] = useState("");
  const [ValidateLastName, setValidateLastName] = useState("");
  const [ValidateEmailId, setValidateEmailId] = useState("");
  const [ValidateUsername, setValidateUsername] = useState("");
  const [ValidateRoleID, setValidateRoleID] = useState("");
  useEffect(() => {
    SetDat_1({
      UserId: UserId,
      FirstName: FirstName,
      LastName: LastName,
      EmailId: EmailId,
      Username: Username,
      RoleID: RoleID,
      RoleName: RoleName,
    });
  }, [UserId, FirstName, LastName, EmailId, Username, RoleID, RoleName]);

  const columns = [
    { field: "UserId", headerName: "User Id", type: "UserId", width: 100 },
    { field: "FirstName", headerName: "First Name", width: 200 },
    {
      field: "LastName",
      headerName: "Last Name",
      type: "string",
      width: 200,
    },
    {
      field: "EmailId",
      headerName: "Email ID",
      type: "string",
      width: 250,
    },
    {
      field: "Username",
      headerName: "Username",
      type: "string",
      width: 200,
      sortable: false,
    },
    {
      field: "RoleName",
      headerName: "Role",
      width: 100,
    },
    {
      headerName: "Action",
      sortable: false,
      width: 150,

      renderCell: () => {
        return (
          <button
            className="btn btn-success text-white"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            Update Position
          </button>
        );
      },
    },
  ];

  const getallrolls = () => {
    axios.get(RestAPIURL + "/Role/get").then((result) => {
      let Data = result.data;
      console.log(result.data);
      let mappedData = Data.map((item) => {
        return {
          value: item.roleId,
          label: item.roleName,
        };
      });
      setRoleData(mappedData);
    });
  };

  const CreateRecord = () => {
    console.log(Data_1);
    axios.post(ApiUrl + "create", Data_1).then((result) => {
      if (result.data.message === Variables.SuccessMessage) {
        console.log(result.data);
        toast.success(
          "Username :" +
            result.data.Username +
            "           OTP :" +
            result.data.OTP
        );
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

    if (UserId === "" || UserId <= 0) {
      SetValidateUserId("Please Enter Valid User Id");
      return false;
    } else {
      SetValidateUserId("");
    }
    if (FirstName === "") {
      SetValidateFirstName("Please Fill the First Name");
      return false;
    } else if (
      /[!@#$%^&*(),.?":{}|<>]/.test(FirstName) ||
      /\d/.test(FirstName)
    ) {
      SetValidateFirstName("Only Letters Are Allowed");
      return false;
    } else {
      SetValidateFirstName(" ");
    }
    if (LastName === "") {
      setValidateLastName("Please Fill the Last Name");
      return false;
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(LastName) || /\d/.test(LastName)) {
      setValidateLastName("Only Letters Are Allowed");
      return false;
    } else {
      setValidateLastName("");
    }
    if (EmailId === "") {
      setValidateEmailId("Email Id Can't be Empty");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EmailId)) {
      setValidateEmailId("Enter Valid Email Id");
      return false;
    } else {
      setValidateEmailId("");
    }
    if (Username === "") {
      setValidateUsername("Please Fill the Last Name");
      return false;
    } else if (
      !/[!@#$%^&*(),.?":{}|<>]/.test(Username) ||
      !/\d/.test(Username)
    ) {
      setValidateUsername(
        "Must contain Atleast one number and special character"
      );
      return false;
    } else {
      setValidateUsername(" ");
    }
    if (RoleID === 0) {
      setValidateRoleID("Please slect RoleID");
    }
    if (RoleID !== 0) {
      setValidateRoleID("");
    }
    CreateRecord();
  };
  const reset = () => {
    SetUserId(0);
    SetFirstName("");
    setLastName("");
    setEmailId("");
    setUsername("");
    setRoleID(0);
    SetValidateUserId("");
    SetValidateFirstName("");
    setValidateRoleID("");
  };
  const Getall = () => {
    axios.get(ApiUrl + "get").then((result) => {
      SetData(result.data);
      setIsLoading(false);
      console.log(result.data);
    });
  };

  useEffect(() => {
    Getall();
    getallrolls();
  }, []);
  const colorsButton = ButtonColor;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [designations, setDesignations] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [validDepartment, setvalidDepartment] = useState("");
  const [payrollCode, setPayrolcode] = useState("");
  const [workLocation, setWorklocation] = useState("");
  const [jobdescription, setJobdescription] = useState("");
  const [shift, setShift] = useState("");
  const [position, setPosition] = useState("");
  const [startdate, setstartdate] = useState("");
  const [managerName, setManagername] = useState("");

  //
  const [managers, setManagers] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    department: "",
    emailId: "",
    isFresher: false,
    payrollCode: "",
    workLocation: "",
    jobDescription: "",
    shift: "",
    isTrainee: false,
    Position: "",
    startDate: "",
    managerId: "",
    managerName: "",
  });

  const initialFormData = {
    emailId: "",
    isFresher: false,
    payrollCode: "",
    workLocation: "",
    jobDescription: "",
    shift: "",
    isTrainee: false,
    startDate: "",
    managerId: "",
    managerName: "",
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(RestAPIURL + "/departmentinfos/get");
        if (response.data.success) {
          setDepartments(response.data.EmpDepartment || []);
          console.log(response.data);
        } else {
          console.error("Failed to fetch departments:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching departments:", error.message);
      }
    };

    fetchDepartments();
    /////
    const fetchDesignations = async () => {
      try {
        const response = await axios.get(RestAPIURL + "/designationinfos/get");
        if (response.data.success) {
          setDesignations(response.data.EmpDesignation || []);
          console.log(response.data); // Ensure EmpDesignation is an array
        } else {
          console.error("Failed to fetch designations:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching designations:", error.message);
      }
    };

    fetchDesignations();
    //
    const fetchManagers = async () => {
      try {
        const response = await axios.get(
          RestAPIURL + "/EmpPositionInfo/manager"
        );
        setManagers(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching managers:", error.message);
      }
    };
    //

    fetchManagers();
    // ///
  }, []);
  //
  const handleManagerSelect = (e) => {
    const selectedManagerId = e.target.value;
    const selectedManager = managers.find(
      (manager) => manager.UserId === parseInt(selectedManagerId)
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      managerId: selectedManager ? selectedManager.UserId : "",
      managerName: selectedManager ? `${selectedManager.FirstName}` : "",
    }));
  };
  //
  const handleDepartmentChange = (e) => {
    const { value } = e.target;
    setSelectedDepartment(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      department: value,
    }));
  };

  const handleDesignationChange = (e) => {
    // setSelectedDesignation(e.target.value);
    console.log(e.target.value);
    const { value } = e.target;
    setSelectedDesignation(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      Position: value,
    }));
  };

  const handleRowClick = (params) => {
    const { UserId, EmailId } = params.row;

    console.log(`Employee ID: ${UserId}, Email ID: ${EmailId}`);
    setFormData((prevFormData) => ({
      ...prevFormData,
      employeeId: UserId,
      emailId: EmailId,
    }));
    setSelectedEmployeeId(UserId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log('sub')
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    console.log(formData);
    let valid = true;
    if (!formData.department) {
      setvalidDepartment("Department is required");
      return (valid = false);
    } else {
      setvalidDepartment("");
    }

    if (!formData.payrollCode) {
      setPayrolcode("Payroll Code is required");
      return (valid = false);
    } else if (isNaN(formData.payrollCode)) {
      setPayrolcode("Payroll Code must be a number");
      return (valid = false);
    } else {
      setPayrolcode("");
    }

    if (!formData.workLocation) {
      setWorklocation("Work Location is required");
      return (valid = false);
    } else if (!/^[A-Za-z\s]+$/.test(formData.workLocation)) {
      setWorklocation("Work Location must contain only letters");
      return (valid = false);
    } else {
      setWorklocation("");
    }

    if (!formData.jobDescription) {
      setJobdescription("Job Description is required");
      return (valid = false);
    } else if (!/^[A-Za-z\s]+$/.test(formData.jobDescription)) {
      setJobdescription("Job Description must contain only letters");
      return (valid = false);
    } else {
      setJobdescription("");
    }

    if (!formData.shift) {
      setShift("Shift is required");
      return (valid = false);
    } else {
      setShift("");
    }
    console.log(formData.Position);
    if (!formData.Position) {
      setPosition("Position is required");
      return (valid = false);
    } else {
      setPosition("");
    }

    if (!formData.startDate) {
      setstartdate("Start Date is required");
      return (valid = false);
    } else {
      setstartdate("");
    }

    if (!formData.managerId) {
      setManagername("Manager ID is required");
      return (valid = false);
    } else {
      setManagername("");
    }

    return valid;
  };

  const handleupdate = async (e) => {
    e.preventDefault();
    console.log("sub");
    console.log(selectedDesignation);
    const positionUpdateData = {
      department: selectedDepartment,
      emailId: formData.emailId,
      isFresher: formData.isFresher,
      payrollCode: formData.payrollCode,
      workLocation: formData.workLocation,
      jobDescription: formData.jobDescription,
      shift: formData.shift,
      isTrainee: formData.isTrainee,
      Position: selectedDesignation,
      startDate: formData.startDate,
      managerId: formData.managerId,
      managerName: formData.managerName,
    };
    console.log(formData);

    if (validateForm()) {
      console.log("sub2");
      try {
        //
        console.log(positionUpdateData);
        const response2 = await axios.put(
          RestAPIURL + `/EmpPositionInfo/positioninfoo/${selectedEmployeeId}`,
          positionUpdateData
        );

        console.log(response2.data);
        alert("Employee updated successfully!");
        setFormData({
          department: "",
          emailId: "",
          isFresher: false,
          payrollCode: "",
          workLocation: "",
          jobDescription: "",
          shift: "",
          isTrainee: false,
          Position: "",
          startDate: "",
          managerId: "",
          managerName: "",
        });

        setSelectedDepartment("");
        setSelectedDesignation("");
      } catch (err) {
        console.error(err);
        alert("Error updating employee");
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedDepartment("");
    setSelectedDesignation("");
    setvalidDepartment("");
    setPayrolcode("");
    setWorklocation("");
    setJobdescription("");
    setShift("");
    setPosition("");
    setstartdate("");
    setManagername("");
  };

  const { Title } = Typography;

  useEffect(()=>{
    const role = RoleData.find((role) => role.value === RoleID);
    setRoleName(role ? role.label : "");
  },[RoleID])

  return (
    <>
      <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
        User
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
                    Add New User
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
                  getRowId={(Data) => Data.UserId}
                  rows={Data}
                  columns={columns}
                  onRowClick={handleRowClick}
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
            title="Add User"
            centered
            open={open}
            onCancel={() => {
              handleClose();
            }}
            okButtonProps={{ style: { display: "none" } }}
            footer={[
              <>
                <Button type="text" onClick={reset}>
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
                  <Button type="primary" onClick={handlesubmit}>
                    Submit
                  </Button>
                </ConfigProvider>
              </>,
            ]}
          >
            <form>
              <TextField
                autoFocus
                margin="dense"
                required
                id="UserId"
                name="UserId"
                label="User Id "
                type="number"
                fullWidth
                variant="standard"
                value={UserId}
                onChange={(e) => {
                  SetUserId(e.target.value);
                }}
              />
              <span className="span">{ValidateUserId}</span>
              <TextField
                autoFocus
                required
                margin="dense"
                id="FirstName"
                name="FirstName"
                label="First Name "
                type="text"
                fullWidth
                variant="standard"
                value={FirstName}
                onChange={(e) => {
                  SetFirstName(e.target.value);
                }}
              />
              <span className="span">{ValidateFirstName}</span>
              <TextField
                autoFocus
                required
                margin="dense"
                id="LastName"
                name="LastName"
                label="Last Name "
                type="text"
                fullWidth
                variant="standard"
                value={LastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
              <span className="span">{ValidateLastName}</span>
              <TextField
                autoFocus
                required
                margin="dense"
                id="EmailId"
                name="EmailId"
                label="Email Id "
                type="text"
                fullWidth
                variant="standard"
                value={EmailId}
                onChange={(e) => {
                  setEmailId(e.target.value);
                }}
              />
              <span className="span">{ValidateEmailId}</span>
              <TextField
                autoFocus
                required
                margin="dense"
                id="Username"
                name="Username"
                label="User Name "
                type="text"
                fullWidth
                variant="standard"
                value={Username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <span className="span">{ValidateUsername}</span>

              <InputLabel style={{ marginTop: 20 }} id="select-label">
                Select Role
              </InputLabel>
              <Select
                value={RoleID}
                onChange={setRoleID}
                style={{
                  width: "100%",
                }}
                options={RoleData}
              />
              <span className="span">{ValidateRoleID}</span>
            </form>
          </Modal>
          <ToastContainer />

          {/*  */}

          <div
            class="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div class="modal-content">
                <div
                  class="modal-header"
                  style={{ backgroundColor: Styles.VarDarkGreen1 }}
                >
                  <h4 class="modal-title text-white" id="staticBackdropLabel">
                    Position Update
                  </h4>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    onClick={resetForm}
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="departmentDropdown">
                        Select Department:
                      </label>
                      <select
                        id="departmentDropdown"
                        className="form-control"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept.DepartmentName}>
                            {dept.DepartmentName}
                          </option>
                        ))}
                      </select>
                      <span className="text-danger">{validDepartment}</span>
                    </div>

                    <div className="form-group">
                      <label>Email ID</label>
                      <input
                        type="email"
                        className="form-control"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className="form-group form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isFresher"
                        checked={formData.isFresher}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Is Fresher</label>
                    </div>
                    <div className="form-group">
                      <label>Payroll Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="payrollCode"
                        value={formData.payrollCode}
                        onChange={handleChange}
                      />
                      <span className="text-danger">{payrollCode}</span>
                    </div>
                    <div className="form-group">
                      <label>Work Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleChange}
                      />
                      <span className="text-danger">{workLocation}</span>
                    </div>
                    <div className="form-group">
                      <label>Job Description</label>
                      <input
                        type="text"
                        className="form-control"
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleChange}
                      />
                      <span className="text-danger">{jobdescription}</span>
                    </div>
                    <div className="form-group">
                      <label>Shift</label>
                      <input
                        type="text"
                        className="form-control"
                        name="shift"
                        value={formData.shift}
                        onChange={handleChange}
                      />
                      <span className="text-danger">{shift}</span>
                    </div>
                    <div className="form-group form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isTrainee"
                        checked={formData.isTrainee}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Is Trainee</label>
                    </div>

                    <div className="form-group">
                      <label htmlFor="designationDropdown">
                        Select Designation:
                      </label>
                      <select
                        id="designationDropdown"
                        className="form-control"
                        name="Position"
                        value={selectedDesignation}
                        onChange={handleDesignationChange}
                      >
                        <option value="">Select Designation</option>
                        {designations.map((designation) => (
                          <option
                            key={designation._id}
                            value={designation.Designation}
                          >
                            {designation.Designation}
                          </option>
                        ))}
                      </select>
                      <span className="text-danger">{position}</span>
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                      <span className="text-danger">{startdate}</span>
                    </div>

                    <div className="form-group">
                      <label>Manager Name</label>
                      <select
                        className="form-control"
                        value={formData.managerId}
                        onChange={handleManagerSelect}
                      >
                        <option value="">Select Manager</option>
                        {managers.map((manager) => (
                          <option key={manager.UserId} value={manager.UserId}>
                            {manager.FirstName}
                          </option>
                        ))}
                      </select>
                      <span className="text-danger">{managerName}</span>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={resetForm}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary "
                    onClick={handleupdate}
                    style={{
                      backgroundColor: Styles.VarGreen1,
                      borderColor: Styles.VarGreen1,
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
