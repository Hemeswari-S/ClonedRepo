import { Card, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Styles } from "../../Config/Colors";
import { RestAPIURL } from "../../Config/Settings";
import axios from "axios";
import { toast } from "react-toastify";
import { handleControls } from "../../Config/sessionmanager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


const ApiUrl = `${RestAPIURL}/AdminControl/`;

export default function Controls() {
  const [data, setData] = useState([]);

  const getAll = () => {
    axios.get(`${ApiUrl}getall`).then((result) => {
      setData(result.data);
      console.log(result.data);
    });
  };

  const handleUpdate = (id, isActive) => {
    axios.put(`${ApiUrl}Update/${id}`, { Status: isActive }).then((result) => {
      if (result.data.message === 'success') {
        toast.success("Control Action Updated");
      }
      console.log(result.data);
      getAll(); 
      handleControls();
      window.location.reload();

    });
  };

  const { Title } = Typography;

  useEffect(() => {
    getAll();
  }, []);

  const handleSwitchChange = (id, currentStatus) => {
    const newStatus = !currentStatus;
    handleUpdate(id, newStatus);

  };

  return (
    <>
      <Card 
        title={
          <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
            Control
          </Title>
        }
      >
        <div className="row">
          {data.map((d) => (
            <div
              key={d._id}
              className="col-lg-6 d-flex justify-content-center align-items-center p-2 bg-light rounded"
            >
              <label className="form-label mt-2">
                <b>{d.ControlName}</b>
              </label>
              &nbsp;&nbsp;
              <div className="form-check form-switch">
                <input
                  name="isActive"
                  type="checkbox"
                  className="form-check-input"
                  checked={d.IsActive}
                  onChange={() => handleSwitchChange(d._id, d.IsActive)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
