import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, ConfigProvider, Typography } from "antd";
import { RestAPIURL } from "../../../Config/Settings.js";
import { toast } from "react-toastify";
import { sessionManager } from "../../../Config/sessionmanager.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import {
  ButtonColor,
  getActiveColors,
  getHoverColors,
} from "../../../Config/Variables.js";

const ApiUrl = `${RestAPIURL}/Attendance/`;

export const Attendance = () => {
  const [CheckinData, setCheckinData] = useState([]);
  const [ShowButtons, setShowButtons] = useState(true);
  const [isCheckOutClicked, setIsCheckOutClicked] = useState(false);
  const employeeId = sessionManager.getEmployeeId();

  const determineShift = (checkInTime) => {
    const checkInDate = new Date(checkInTime);
    const dayShiftStart = new Date(checkInDate);
    dayShiftStart.setHours(9, 0, 0, 0);
    const dayShiftEnd = new Date(checkInDate);
    dayShiftEnd.setHours(17, 0, 0, 0);

    return checkInDate >= dayShiftStart && checkInDate < dayShiftEnd ? 1 : 2;
  };

  const shiftId = determineShift();

  const handleCheckIn = () => {
    try {
      axios
        .post(`${ApiUrl}create`, {
          employeeId: employeeId,
          shiftId: shiftId,
          checkInTime: new Date(),
        })
        .then((res) => {
          toast.success(res.data.message);
          setCheckinData(res.data.Checkindata);
          setShowButtons(false);
        });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update check-in time." + err);
    }
  };

  const handleLunchStart = () => {
    try {
      axios
        .put(`${ApiUrl}LunchStartTime`, {
          _id: CheckinData._id,
          lunchStartTime: new Date(),
        })
        .then((res) => {
          toast.success(res.data.message);
          handleGetCheckInData();
        });
    } catch (err) {
      console.error(err);
      alert("Failed to update lunch start time.");
    }
  };

  const handleLunchEnd = async () => {
    try {
      axios
        .put(`${ApiUrl}LunchEndTime`, {
          _id: CheckinData._id,
          lunchEndTime: new Date(),
        })
        .then((res) => {
          toast.success(res.data.message);
          handleGetCheckInData();
        });
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      axios
        .put(`${ApiUrl}checkOutTime`, {
          _id: CheckinData._id,
          checkOutTime: new Date(),
        })
        .then((res) => {
          toast.success(res.data.message);
          handleGetCheckInData();
          setIsCheckOutClicked(true);
        });
    } catch (err) {
      console.error(err);
      alert("Failed to update check-out time.");
    }
  };

  const handleGetCheckInData = () => {
    try {
      axios.get(`${ApiUrl}getCheckInData/${employeeId}`).then((res) => {
        if (res.data.checkInRecord) {
          setCheckinData(res.data.checkInRecord);
          setShowButtons(false);
          if (res.data.checkInRecord.checkOutTime) {
            setIsCheckOutClicked(true);
          }
        }
      });
      console.log(
        `sessionManager.getOvertimeStatus()&&CheckinData.overtimeHours`
      );
      console.log(sessionManager.getOvertimeStatus());
      console.log(CheckinData.overtimeHours);
      console.log(
        sessionManager.getOvertimeStatus() && CheckinData.overtimeHours
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch check-in data.");
    }
  };

  useEffect(() => {
    handleGetCheckInData();
  }, []);

  const { Title } = Typography;
  const colorsButton = ButtonColor;

  return (
    <>
      {/* <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
            Attendance
          </Title>
          <hr /> */}
      <Card
        title="Attendance"
        style={{
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          margin: "auto",
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: `linear-gradient(90deg, ${colorsButton.join(
                  ", "
                )})`,
                colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(
                  colorsButton
                ).join(", ")})`,
                colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(
                  colorsButton
                ).join(", ")})`,
                lineWidth: 0,
              },
            },
          }}
        >
          <div className="row">
            <div className="col-lg-6">
              {" "}
              <Button
                type="primary"
                style={{ width: "50%" }}
                onClick={handleCheckIn}
                disabled={!ShowButtons || isCheckOutClicked}
              >
                Check In
              </Button>
            </div>
            <div className="col-lg-6">
              <span>
                {CheckinData.checkInTime
                  ? " At " +
                    new Date(CheckinData.checkInTime).toLocaleTimeString()
                  : ""}
              </span>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              {" "}
              <Button
                type="primary"
                style={{ width: "50%" }}
                onClick={handleLunchStart}
                disabled={ShowButtons || isCheckOutClicked}
              >
                Lunch Start
              </Button>
            </div>
            <div className="col-lg-6">
              <span>
                {CheckinData.lunchStartTime
                  ? " At " +
                    new Date(CheckinData.lunchStartTime).toLocaleTimeString()
                  : ""}
              </span>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              {" "}
              <Button
                type="primary"
                style={{ width: "50%" }}
                onClick={handleLunchEnd}
                disabled={ShowButtons || isCheckOutClicked}
              >
                Lunch End
              </Button>
            </div>
            <div className="col-lg-6">
              {" "}
              <span>
                {CheckinData.lunchEndTime
                  ? " At " +
                    new Date(CheckinData.lunchEndTime).toLocaleTimeString()
                  : ""}
              </span>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              {" "}
              <Button
                type="primary"
                style={{ width: "50%" }}
                onClick={handleCheckOut}
                disabled={ShowButtons || isCheckOutClicked}
              >
                Check Out
              </Button>{" "}
            </div>
            <div className="col-lg-6">
              <span>
                {CheckinData.checkOutTime
                  ? " At " +
                    new Date(CheckinData.checkOutTime).toLocaleTimeString()
                  : ""}
              </span>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6"></div>
            <div className="col-lg-6">
              <span>
                {CheckinData.totalHoursWorked ? (
                  <>
                    Today Worked Hours : <b>{CheckinData.totalHoursWorked}</b>
                  </>
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6"></div>
            <div className="col-lg-6">
              <span>
                {sessionManager.getOvertimeStatus()==='true' ? (
                  CheckinData.overtimeHours ? (
                    <>
                      Over Time: <b>{CheckinData.overtimeHours}</b>
                    </>
                  ) : (
                    ""
                  )
                ) : (
                  <></>
                )}
              </span>

              {/* ):""}  */}
            </div>
          </div>
          {/* <hr /> */}
        </ConfigProvider>
      </Card>

      {/* <br /> */}
    </>
  );
};
