import React, { useEffect, useState } from "react";
import { RestAPIURL } from "../../../Config/Settings";
import axios from "axios";
import { Badge } from "antd";
import { Styles } from "../../../Config/Colors";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


export default function EmployeeBadge() {
  const [Data,setData]=useState({});
  const Get = () => {
    axios.get(`${RestAPIURL}/Dashboard/GetEmpBadge`).then((result) => {
      setData(result.data);
      console.log(result.data);
    });
  };
useEffect(Get,[])
  return (
    <>
     
      <div
        className="card rounded "
        style={{ background: "#AFEEEE" }}
      >
        {/* <div className="card-header border-0 mb-3 ms-5 mt-3 me-5">
          <div className="card-toolbar"></div>
        </div> */}
        <div className="card-body">
          <div className="text-center">
            <div className=" d-flex flex-column p-4">
              <p className="card-label fw-bold fs-4 mb-1 ">Employee</p>
              <p className="text-black fw-bold fs-1 mb-1">{Data.EmpCount}</p>
            </div>

            <div className="d-flex justify-content-center gap-5 mb-4">
              <div className="">
                <p className="fw-bold text-gray-800  fs-8 mb-1">
                Active
                </p>
                <span className="badge badge-dark-success fs-8 fw-bold rounded">
                  {/* <button
                    type="button"
                    className="btn btn-icon btn-sm h-auto btn-color-success justify-content-end me-1"
                  >
                  </button> */}
                  <Badge style={{ backgroundColor: Styles.VarGreen2,borderRadius:2 }} count={Data.ActiveEmpCount}/>
                  
                </span>
              </div>
              <div className="">
                <p className="fw-bold text-gray-800 fs-8 mb-1">
                  InActive
                </p>
                <span className="badge badge-dark-success fs-8 fw-bold rounded">
                  {/* <button
                    type="button"
                    className="btn btn-icon btn-sm h-auto btn-color-danger justify-content-end me-1"
                  >
                  </button> */}
                  <Badge style={{ backgroundColor: Styles.VarGreen2,borderRadius:2 }} count={Data.InactiveEmpCount}/>
                  
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
