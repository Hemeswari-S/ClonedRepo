import React, { useEffect, useState } from "react";
import { RestAPIURL } from "../../Config/Settings";
import axios from "axios";
import { Styles } from "../../Config/Colors";
import { Card } from "antd";
import Nodata from "../../Assets/Nodata.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { CircularProgress } from "@mui/material";


const ApiUrl = RestAPIURL + "/Permissionmanager/";

export default function PermissionManagerforManager() {
  const [Data, SetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ApprovedPermissions();
  }, []);
  const ApprovedPermissions = () => {
    axios.get(ApiUrl + "get").then((result) => {
      SetData(result.data);
      setIsLoading(false);
      console.log(result.data);
    });
  };
 
  return (
    <>
      <div className="row ">
        <div className="col-lg-2 col-md-2 col-xs-2"></div>
        <div className="col-lg-8 col-md-8 col-xs-8">
          <center>Permissions</center>
          <hr/>
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
            <>
              {Data.map((data, index) => {
                if (
                  new Date(data.startDate).toLocaleDateString() ===
                  new Date(data.endDate).toLocaleDateString()
                ) {
                  return (
                    <Card
                      key={index}
                      bordered
                      hoverable
                      style={{
                        background: `linear-gradient(${Styles.VarlightGreen2}, ${Styles.VarlightGreen1}, ${Styles.VarlightGreen2})`,
                        color: Styles.VarDarkGreen1,
                        width: "100%",
                        boxShadow:
                          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        marginBottom: "13px",
                      }}
                    >
                      <center>
                        {data.EmployeeName} took Permission on  {new Date(data.endTime).toLocaleDateString()} from {new Date(data.startTime).toLocaleTimeString()} to {new Date(data.endTime).toLocaleTimeString()}
                      </center>
                    </Card>
                  );
                } else {
                  return (
                    <Card
                      key={index}
                      bordered
                      hoverable
                      style={{
                        background: `linear-gradient(${Styles.VarlightGreen2}, ${Styles.VarlightGreen1}, ${Styles.VarlightGreen2})`,
                        color: Styles.VarDarkGreen1,
                        width: "100%",
                        boxShadow:
                          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        marginBottom: "13px",
                      }}
                    >
                      <center>
                        {data.RequestedBY} took Leave for {data.noOfDays} Day(s)
                         from
                        {new Date(data.startDate).toLocaleDateString()} to{" "}
                        {new Date(data.endDate).toLocaleDateString()}
                      </center>
                    </Card>
                  );
                }
              })}
            </>
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
        <div className="col-lg-2 col-md-2 col-xs-2"></div>

      </div>
      <hr />
   
    </>
  );
}
