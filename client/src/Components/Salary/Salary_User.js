import React, { useEffect, useState } from "react";
import axios from "axios";
import { RestAPIURL } from "../../Config/Settings";
import { sessionManager } from "../../Config/sessionmanager";
import {  toast } from "react-toastify";
import Nodata from "../../Assets/Nodata.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import { DatePicker } from "antd";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";

const ApiUrl = `${RestAPIURL}/Salary&Compensation/`;

export const SalaryUser = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [PayPeriod, setPayPeriod] = useState(dayjs().format("MMM-YY"));
  const empId = sessionManager.getEmployeeId();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const result = await axios.get(
          `${ApiUrl}getOneUser/${PayPeriod}/${empId}`
        );
        console.log(result);
        setData(result.data.SalInfo);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch data." + error);
      }
    };
    fetchAllData();
  }, [PayPeriod]);

  const onChange = (date) => {
    date
      ? setPayPeriod(dayjs(date).format("MMM-YY"))
      : setPayPeriod(dayjs().format("MMM-YY"));
  };
// const {Title}=Typography;
  return (
    <>
     {/* <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
        Salary Info
      </Title>
    <hr /> */}
      <div className="row">
        <div className="col-md-3">
          <lable className="col-form-label">Choose Month</lable>&nbsp;
          <DatePicker picker="month" onChange={onChange} placement="topRight" />
          <hr />
        </div>

        <div className="col-md-9">
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
              ) :data ? (
            <>
              <form>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-xs-6">
                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Employee Name
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.EmployeeName ? data.EmployeeName : ""}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Pay Period
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.payPeriod ? data.payPeriod : ""}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Base Salary
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.baseSalary ? data.baseSalary : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Pay Grade
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.payGrade ? data.payGrade : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Annual Salary
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.annualSalary ? data.annualSalary : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">Bonus</label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.bonus ? data.bonus : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Allowances
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.allowances ? data.allowances : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Overtime Pay
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.overtimePay ? data.overtimePay : 0}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-xs-6">
                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Deductions
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.deductions ? data.deductions : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Total Compensation
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={
                            data.totalCompensation ? data.totalCompensation : 0
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Reimbursements
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.reimbursements ? data.reimbursements : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Advances
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.advances ? data.advances : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">PF</label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.PF ? data.PF : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">ESI</label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.ESI ? data.ESI : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">TDS</label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={data.TDS ? data.TDS : 0}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Professional Tax
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control input-sm"
                          value={
                            data.ProfessionalTax ? data.ProfessionalTax : 0
                          }
                          disabled
                        />
                      </div>
                    </div>

                    {/* <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">
                      Tax Information
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control input-sm"
                        value={data.taxInformation ? data.taxInformation : 0}
                        disabled
                      />
                    </div>
                  </div> */}
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-center align-items-center">
                <img
                  src={Nodata}
                  alt="no data"
                  height={300}
                  className="img w-50"
                />
              </div>
            </>
          )}
        </div>

      </div>
      <hr/>
    </>
  );
};
