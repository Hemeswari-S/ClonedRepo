import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RestAPIURL } from '../../../Config/Settings.js';
import { Badge } from 'antd';
import { Styles } from '../../../Config/Colors.js';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


export default function DepartmentBadge() {
  const [Data,setData]=useState({});
  const Get = () => {
    axios.get(`${RestAPIURL}/Dashboard/getdepbadge`).then((result) => {
      setData(result.data);
      console.log(result.data);
    });
  };
useEffect(Get,[])
  return (
<>    <div className={`card rounded card-xxl-stretch`} style={{ background: "#fcfab8"}}>
                {/* <div className='card-header border-0 mb-3 ms-5 mt-3 me-5'>
                    <h3 className='card-title text-gray-800 fw-bold'>
                    </h3>
                    <div className='card-toolbar'>

                    </div>
                </div> */}
             <div className="card-body">
          <div className="text-center">
            <div className=" d-flex flex-column p-4">
              <p className="card-label fw-bold fs-4 mb-1 ">Department</p>
              <p className="text-black fw-bold fs-1 mb-1">{Data.DepCount}</p>
            </div>

            <div className="d-flex justify-content-center gap-5 mb-4">
              <div className="">
                <p className="fw-bold text-gray-800  fs-8 mb-1">
                Active
                </p>
                <span className="badge badge-light-success fs-8 fw-bold rounded text-blue">
                  {/* <button
                    type="button"
                    className="btn btn-icon btn-sm h-auto btn-color-success justify-content-end me-1"
                  >
                  </button> */}
                                    <Badge style={{ backgroundColor: Styles.VarGreen2,borderRadius:2 }} count={Data.ActiveDepCount}/>

                </span>
              </div>
              <div className="">
                <p className="fw-bold text-gray-800 fs-8 mb-1">
                  InActive
                </p>
                <span className="badge badge-light-danger fs-8 fw-bold rounded text-blue">
                  {/* <button
                    type="button"
                    className="btn btn-icon btn-sm h-auto btn-color-danger justify-content-end me-1"
                  >
                  </button> */}
                                    <Badge style={{ backgroundColor: Styles.VarGreen2,borderRadius:2 }} count={Data.InactiveDepCount}/>

                </span>
              </div>
            </div>
          </div>
        </div>
            </div>

</>  )
}
