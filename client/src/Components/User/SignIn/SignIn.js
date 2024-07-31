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

import { Button, ConfigProvider, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sessionManager } from "../../../Config/sessionmanager.js";

const APIURL = RestAPIURL + "/user/";
const API = RestAPIURL + "/user/forgotpswd";
export default function SignIN() {
  const [username, Setusername] = useState("");
  const [password, SetPassword] = useState("");
  const [validateusername, SetValidateusername] = useState("");
  const [validatepassword, SetValidatePassword] = useState("");
  const [Data, SetData] = useState({});
  const [DesableUseranme, setDesableUseranme] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const location = useLocation();
  console.log(location.state !== null);
  // console.log(location.state.StateUsername);
  const StateUsername =
    location.state !== null ? location.state.StateUsername : "";
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
    StateUsername === "" ? setDesableUseranme(false) : setDesableUseranme(true);
    Setusername(StateUsername);
  }, []);

  useEffect(() => {
    SetData({
      Username: username,
      password: password,
    });
  }, [username, password]);

  const HandleLogin = async (e) => {
    console.log("login");
    try {
      e.preventDefault();

      if (validate()) {
        axios.post(APIURL + "Signin", Data).then((res) => {
          console.log(res);
          if (res.status === 201) {
            toast.warning("Incorrect Password");
          } else {
            if (res.data.message === Variables.verfiedOTP) {
              toast.error("Incorrect Password");
            } else if (res.data.message === Variables.SignedIn) {
              toast.success("Signed In Successfully");
              sessionStorage.setItem("Role", res.data.UserRole);
              sessionStorage.setItem("EmployeeId", res.data.EmployeeId);
              sessionStorage.setItem("Name", res.data.Name);
              sessionStorage.setItem("Dashboard", res.data.dashboard);
              setTimeout(() => {
                nav(sessionManager.getDashboard());
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

  const handleSub = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(API, { Username: username });
      if (response.data.message === "Invalid Username") {
        toast.error("Please Check Your Username");
      } else {
        if (response.status === 200) {
          nav("/OTP", { state: { StateUsername: username } });
          setTimeout(() => {
            toast.success("OTP has been sent to your email.");
          }, 100);
        }
        if (response.status === 201) {
          toast.warning(response.data);
        }
      }
    } catch (error) {
      console.error("There was an error sending the request!", error);
      toast.error(error);
    }
  };

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
                  {/* <input
                    type="text"
                    
                    className="form-control form-control-lg"
                    placeholder="Enter a valid Username"
                  /> */}
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
                  <span className="span">{validateusername}</span>
                </div>

                <div className="form-outline mb-3">
                  <label className="form-label">Password</label>

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
                      Login
                    </Button>
                  </ConfigProvider>

                  <p className="text-body text-center" onClick={handleSub}>
                    Forgot password?
                  </p>

                  {/* {message && <p>{message}</p>}
                  {otp && <p>Your OTP is: {otp}</p>} */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
}

