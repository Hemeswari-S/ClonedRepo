import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { RestAPIURL } from "../../../Config/Settings.js";
import Auth from "../../../Assets/Auth.jpg";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import {
  ButtonColor,
  Variables,
  getActiveColors,
  getHoverColors,
} from "../../../Config/Variables.js";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
} from "@mui/material";
import { Button, ConfigProvider, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sessionManager } from "../../../Config/sessionmanager.js";

const APIURL = RestAPIURL + "/user/";
export default function ForOtp() {
  const [UserId, SetUserId] = useState(0);
  const [username, Setusername] = useState("");
  const [password, SetPassword] = useState("");
  const [validateusername, SetValidateusername] = useState("");
  const [validatepassword, SetValidatePassword] = useState("");
  const [DesableUseranme, setDesableUseranme] = useState(true);
  const location = useLocation();
  const StateUsername = location.state?location.state.StateUsername:'';

  const [Data, SetData] = useState({});
  const [PswdData, SetPswdData] = useState({});
  const [open, setOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [newPswd, SetnewPswd] = useState("");
  const [newValidatePswd, SetValidatenewPswd] = useState("");
  const [ConfirmPswd, SetConfirmPswd] = useState("");
  const [ValidateConfirmPswd, SetValidateConfirmPswd] = useState("");

  const validate = () => {
    let valid = true;
    if (username === "") {
      SetValidateusername("*Username can't be empty...!");
      return (valid = false);
    } else {
      SetValidateusername("");
    }
    if (password === "") {
      SetValidatePassword("*Password can't be empty ...!");
      return (valid = false);
    } else {
      SetValidatePassword("");
    }
    return valid;
  };
  useEffect(() => {
    StateUsername===''? setDesableUseranme(false) : setDesableUseranme(true);
    Setusername(StateUsername)
  }, []);

  useEffect(() => {
    SetData({
      Username: username,
      password: password,
    });
  }, [username, password]);
  useEffect(() => {
    SetPswdData({
      Password: ConfirmPswd,
      UserId: UserId,
      Username: username,
    });
  }, [ConfirmPswd, username, UserId]);

  const Validatepswd = () => {
    let pswdvalid = true;
    if (newPswd === "") {
      SetValidatenewPswd("New Password Can't be Empty...!");
      return (pswdvalid = false);
    } else if (!/[A-Z]/.test(newPswd)) {
      SetValidatenewPswd(
        "Password must contain at least one uppercase letter."
      );
      return (pswdvalid = false);
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPswd)) {
      SetValidatenewPswd(
        "Password must contain at least one special character."
      );
      return (pswdvalid = false);
    } else if (!/\d/.test(newPswd)) {
      SetValidatenewPswd("Password must contain at least one digit.");
      return (pswdvalid = false);
    } else if (newPswd.length < 8) {
      SetValidatenewPswd("Password must be at least 8 characters long.");
      return (pswdvalid = false);
    } else {
      SetValidatenewPswd("");
    }
    if (newPswd === username) {
      SetValidatenewPswd("Username & Password Can't be same.");
      return (pswdvalid = false);
    } else if (ConfirmPswd === "") {
      SetValidateConfirmPswd("*Re-Enter Password can't be Empty ...!");
      return (pswdvalid = false);
    } else if (newPswd !== ConfirmPswd) {
      console.log(newPswd);
      console.log(ConfirmPswd);
      SetValidateConfirmPswd("Password doesn't Match");
      return (pswdvalid = false);
    } else {
      SetValidateConfirmPswd("");
    }
    return pswdvalid;
  };

  const handlepswdsubmit = (e) => {
    try {
      e.preventDefault();
      if (Validatepswd()) {
        axios.put(APIURL + "UpdatePwd", PswdData).then((res) => {
          if (res.data.message === Variables.SuccessMessage) {
              handleClose();
              SetnewPswd("");
              SetConfirmPswd("");
           
              setTimeout(() => {
                  toast.success("Password Updated Successfully");
           }, 100);
                nav("/", { state: { StateUsername: username } });
          } else {
            toast.error(res.data.message);
          }
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const HandleLogin = async (e) => {
    try {
      e.preventDefault();

      if (validate()) {
        axios.post(APIURL + "Signin", Data).then((res) => {
          console.log(res);
          if (res.status === 201) {
            toast.warning(res.data);
          } else {
            if (res.data.message === Variables.verfiedOTP) {
              toast.success("OTP Verified");
              setTimeout(() => {
                setOpen(true);
              }, 1000);

              console.log(res.data.UserId);
              SetUserId(res.data.UserId);
            } else if (res.data.message === Variables.SignedIn) {
                sessionStorage.setItem("Role", res.data.UserRole);
                sessionStorage.setItem("EmployeeId", res.data.EmployeeId);
                sessionStorage.setItem("Name", res.data.Name);
                sessionStorage.setItem("Dashboard", res.data.dashboard);
                nav(sessionManager.getDashboard());
                setTimeout(() => {
                    toast.success("Signed IN Successfully");
                }, 1000);
            } else {
              toast.error(res.data.message);
            }
          }
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const colorsButton = ButtonColor;

  const nav = useNavigate();
  return (
    <div>
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-6 col-xl-5 ">
              <img src={Auth} className="img-fluid" alt="logo" />
            </div>
            <div className=" col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-4">
              <form>
                <div className="divider d-flex justify-content-left my-4">
                  <p className="text-left fw-bold mx-3 mb-0">Welcome...!</p>
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label">Username</label>
             
                  <Input
                    placeholder="Enter your username"
                    prefix={
                      <UserOutlined
                        style={{
                          color: "rgba(0,0,0,.25)",
                        }}
                      />
                    }
                    value={username}
                    onChange={(e) => {
                      Setusername(e.target.value);
                      validate();
                    }}
                    onBlur={() => validate()}
                    size="large"
                  />
                  <span className="span">{validateusername}</span>
                </div>

                <div className="form-outline mb-3">
                  <label className="form-label">Enter Otp</label>

                  <Input.Password
                    placeholder="Enter Your Password"
                    visibilityToggle={{
                      visible: passwordVisible,
                      onVisibleChange: setPasswordVisible,
                    }}
                    size="large"
                    value={password}
                    onChange={(e) => {
                      SetPassword(e.target.value);
                      validate();
                    }}
                    onBlur={() => validate()}
                    prefix={
                      <LockOutlined
                        style={{
                          color: "rgba(0,0,0,.25)",
                        }}
                      />
                    }
                  />

                  <span className="span">{validatepassword}</span>
                </div>
                <br />
                <div className="d-flex justify-content-between align-items-center">
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
                      size="large"
                      style={{ alignSelf: "center" }}
                      onClick={HandleLogin}
                    >
                      Verify OTP
                    </Button>
                  </ConfigProvider>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Your Password Here</DialogTitle>
        <DialogContent>
          <form
            style={{ width: 500, minWidth: 500, maxWidth: 500, margin: "auto" }}
          >
            <InputLabel style={{ marginTop: 20 }} id="select-label">
              UserName
            </InputLabel>
            <Input
                    placeholder="Enter your username"
                    disabled={DesableUseranme}
                    prefix={
                      <UserOutlined
                        style={{
                          color: "rgba(0,0,0,.25)",
                        }}
                      />
                    }
                    value={username}
                    onChange={(e) => {
                      Setusername(e.target.value);
                      validate();
                    }}
                    onBlur={() => validate()}
                    size="large"
                  />
            <InputLabel style={{ marginTop: 20 }} id="select-label">
              Enter Password
            </InputLabel>
            <Input.Password
              placeholder="Enter Your Password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              size="large"
              value={newPswd}
              onChange={(e) => {
                SetnewPswd(e.target.value);
              }}
              onBlur={() => Validatepswd()}
            />

            <span className="span">{newValidatePswd}</span>
            <InputLabel style={{ marginTop: 20 }} id="select-label">
              Re-Enter Password
            </InputLabel>
            <Input.Password
              placeholder="Re-Enter Password"
              size="large"
              value={ConfirmPswd}
              onChange={(e) => {
                SetConfirmPswd(e.target.value);
              }}
              onBlur={() => Validatepswd()}
            />

            <span className="span">{ValidateConfirmPswd}</span>
            <br />

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
                variant="contained"
                onClick={handlepswdsubmit}
              >
                Submit
              </Button>
            </ConfigProvider>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}
