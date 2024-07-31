import { Card, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Styles } from "../../Config/Colors.js";
import { RestAPIURL } from "../../Config/Settings.js";
import axios from "axios";
import Nodata from "../../Assets/Nodata.png";
import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


export default function ExitRequests() {
  const [Data, setData] = useState([]);
  const Get = () => {
    axios.get(`${RestAPIURL}/Dashboard/RecentExits`).then((result) => {
      setData(result.data);
      console.log(result.data);
    });
  };
  useEffect(Get, []);
  const { Title } = Typography;
  return (
    <>
      <Card
        title={
          <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
            Exit Requests
          </Title>
        }
      >
        <div style={{ minHeight: 270 }}>
          {Data.length> 0 ? (
            Data.map((d, i) => (
              <div className="d-flex mb-3" key={i}>
                <div
                  className="flex-grow-1 text-truncate"
                  style={{ maxWidth: 400 }}
                >
                  <span className="bullet"></span>
                  <span className="fw-bold d-block">
                    {`${d.EmpName} was requested for Resignation`}
                    <span className="text-muted fw-semibold d-block text-left">
                      {dayjs(d.createdAt).format("DD-MM-YYYY")}
                    </span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="text-center text-dark">
                <h6>No Exit Requests</h6>
                <img
                  style={{ height: 200 }}
                  className=""
                  alt="metronic"
                  src={Nodata}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </>
  );
}
