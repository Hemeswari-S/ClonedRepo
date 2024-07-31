import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { RestAPIURL } from "../../Config/Settings";
import { sessionManager } from "../../Config/sessionmanager";
import { ToastContainer, toast } from "react-toastify";
import Nodata from "../../Assets/Nodata.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Row,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  ButtonColor,
  getActiveColors,
  getHoverColors,
} from "../../Config/Variables";
import { useReactToPrint } from "react-to-print";
import { CircularProgress } from "@mui/material";
import './Payroll.css'

const ApiUrl = `${RestAPIURL}/Payroll/`;

export const PayrollUser = () => {
  const [payslipData, setpayslipData] = useState([]);
  const [PayPeriod, setPayPeriod] = useState(dayjs().format("MMM-YYYY"));
  const empId = sessionManager.getEmployeeId();
  const conponentPDF = useRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [PayPeriod]);

  const fetchAllData = async () => {
    try {
      const result = await axios.get(
        `${ApiUrl}getPayslip/${empId}/${PayPeriod}`
      );
      console.log(`${ApiUrl}getPayslip/${empId}/${PayPeriod}`);
      console.log(result);
      console.log(result.data);
      if (result.data.message) {
        console.log(result.data.message);
      } else {
        setpayslipData(result.data);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to fetch data." + error);
    }
  };

  const onChange = (date) => {
    setpayslipData([]);
    date
      ? setPayPeriod(dayjs(date).format("MMM-YYYY"))
      : setPayPeriod(dayjs().format("MMM-YYYY"));
  };
  const colorsButton = ButtonColor;
  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: `Payslip_${payslipData.Employee_Name ? payslipData.Employee_Name : " "}_${
      payslipData.payperiod ? payslipData.payperiod : " "
    }`,
    onAfterPrint: () => {
      generateAndUploadPDF();
    },
  });
  const generateAndUploadPDF = () => {
    const content = conponentPDF.current;

    htmlToBlob(content).then((blob) => {
      const formData = new FormData();
      formData.append(
        "file",
        blob,
        `Payslip_${payslipData.Employee_Name ? payslipData.Employee_Name : " "}_${
          payslipData.payperiod ? payslipData.payperiod : " "
        }.pdf`
      );

      axios
        .post(`${ApiUrl}/afterdownload/${empId}/${PayPeriod}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
          } else {
            throw new Error("Failed to upload file");
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload Payslip.");
        });
    });
  };

  const htmlToBlob = (htmlContent) => {
    return new Promise((resolve) => {
      const blob = new Blob([htmlContent], { type: "application/pdf" });
      resolve(blob);
    });
  };
  const { Title } = Typography;

  return (
    <>

      <div className="row">
        <div className="col-md-3 col-sm-3 col-lg-3 col-xs-3">
          <lable className="col-form-label">Choose Month</lable>&nbsp;
          <DatePicker picker="month" onChange={onChange} placement="topRight" />
          <hr/>
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
              onClick={() => {
                generatePDF();
              }}
            >
              Download Payslip
            </Button>
          </ConfigProvider>
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
          ) : payslipData && Object.keys(payslipData).length > 0 ? (
            <>
              <div
                className="container mt-4 print-content"
                ref={conponentPDF}
                style={{ backgroundColor: "white" }}
                
              >
                <Title level={3} className="text-start">
                  PAYSLIP {PayPeriod}
                </Title>
                <span className="text-start">{payslipData.companyName}</span><br/>
                <span className="text-start">{payslipData.addressline1}</span><br/>
                <span className="text-start">{payslipData.addressline2}</span>

                
                <Row gutter={24} className="mt-2">
                  <Col span={6}>
                    <p>
                      Employee Name:
                      <br />
                    <strong>{payslipData.employeeDetails.employeeName}</strong>
                    </p>
                    <p>
                      Employee Number:
                      <br />
                      <strong>
                        {payslipData.employeeDetails.employeeNumber}
                      </strong>
                    </p>
                    <p>
                      Date Joined:
                      <br />
                      <strong>{payslipData.employeeDetails.dateJoined}</strong>
                    </p>
                  </Col>
                  <Col span={6}>
                    <p>
                      Designation:
                      <br />
                      <strong>{payslipData.employeeDetails.designation}</strong>
                    </p>
                   
                    <p>
                      Payment Mode:
                      <br />
                      <strong>{payslipData.employeeDetails.paymentMode}</strong>
                    </p>
                    <p>
                      PAN: <br />
                      <strong>{payslipData.employeeDetails.pan}</strong>
                    </p>
                  </Col>
                  <Col span={6}>
                    <p>
                      Bank:
                      <br /> <strong>{payslipData.employeeDetails.bank}</strong>
                    </p>
                    <p>
                      Bank IFSC:
                      <br />
                      <strong>{payslipData.employeeDetails.ifsc}</strong>
                    </p>
                    <p>
                      Bank Account:
                      <br />
                      <strong>{payslipData.employeeDetails.account}</strong>
                    </p>
                  </Col>
                  <Col span={6}>
                   
                    <p>
                      UAN: <br />
                      <strong>{payslipData.employeeDetails.uan}</strong>
                    </p>
                    <p>
                      PF Number:
                      <br />
                      <strong>{payslipData.employeeDetails.pfNumber}</strong>
                    </p>
                    <p>
                      Location:
                      <br />
                      <strong>{payslipData.employeeDetails.location}</strong>
                    </p>
                  </Col>
                </Row>

        
                <div className="mt-1">
                  
                  <Title level={4}>Salary Details</Title>
                  <Row gutter={24}>
                    <Col span={6}>
                      <p>
                        Actual Payable Days:
                        <br />
                        <strong>
                          {payslipData.salaryDetails.actualPayableDays}
                        </strong>
                      </p>
                    </Col>
                    <Col span={6}>
                      <p>
                        Total Working Days:
                        <br />
                        <strong>
                          {payslipData.salaryDetails.totalWorkingDays}
                        </strong>
                      </p>
                    </Col>
                    <Col span={6}>
                      <p>
                        Leave Days:
                        <br />
                        <strong>
                          {payslipData.salaryDetails.lossOfPayDays}
                        </strong>
                      </p>
                    </Col>
                    <Col span={6}>
                      <p>
                        Days Payable:
                        <br />
                        <strong>{payslipData.salaryDetails.daysPayable}</strong>
                      </p>
                    </Col>
                  </Row>
                </div>

              
                <Row gutter={24} className="mt-2">
                  <Col span={12}>
                    <Title level={5}>Earnings</Title>
                    <Table
                      dataSource={payslipData.earnings}
                      pagination={false}
                      summary={() => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell>
                            Total Earnings
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            {payslipData.earnings
                              .reduce(
                                (total, earning) =>
                                  total + earning.amount,
                                0
                              )
                              .toFixed(2)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                    >
                      <Table.Column title="Type" dataIndex="type" key="type" />
                      <Table.Column
                        title="Amount (INR)"
                        dataIndex="amount"
                        key="amount"
                        render={(text) => text.toFixed(2)}
                      />
                      
                    </Table>
                  </Col>

                  <Col span={12}>
                    {/* <Title level={5}>Contributions</Title> */}
                    <Table
                      bordered={false}
                      dataSource={payslipData.contributions}
                      pagination={false}
                      summary={() => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell>
                            Total Contributions
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            {payslipData.contributions
                              .reduce(
                                (total, contribution) =>
                                  total + contribution.amount,
                                0
                              )
                              .toFixed(2)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                    >
                      <Table.Column title="Contributions" dataIndex="type" key="type" />
                      <Table.Column
                        // title="Amount (INR)"
                        dataIndex="amount"
                        key="amount"
                        render={(text) => text.toFixed(2)}
                      />
                    </Table>

                    {/* <Title level={5}>Taxes & Deductions</Title> */}
                    <Table
                      bordered={false}
                      dataSource={payslipData.taxes}
                      pagination={false}
                      summary={() => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell>
                            Total Deductions
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            {payslipData.taxes
                              .reduce((total, tax) => total + tax.amount, 0)
                              .toFixed(2)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                    >
                      <Table.Column title="Taxes & Deductions" dataIndex="type" key="type" />
                      <Table.Column
                        // title="Amount (INR)"
                        dataIndex="amount"
                        key="amount"
                        render={(text) => text.toFixed(2)}
                      />
                    </Table>
                  </Col>
                </Row>

                <Card className="mb-3">
                  <p>
                    Net Salary Payable (A - B - C):
                    <strong>{payslipData.netSalary} /-</strong>
                  </p>
                  <p>
                    Net Salary in words:
                    <strong>  {payslipData.netSalaryWords} only</strong>
                  </p>
                </Card>

         

                <p className="text-muted text-center">
                  **Note: All amounts displayed in this payslip are in INR
                </p>
              </div>
              <Title level={4}>Leave Details</Title>
                <Table dataSource={payslipData.leaveDetails} pagination={false}>
                  <Table.Column
                    title="Leave Type"
                    dataIndex="type"
                    key="type"
                  />
                  <Table.Column
                    title="Opening"
                    dataIndex="opening"
                    key="opening"
                  />
                {/*  <Table.Column
                    title="Accrued"
                    dataIndex="accrued"
                    key="accrued"
                  />
                  <Table.Column
                    title="Credit"
                    dataIndex="credit"
                    key="credit"
                  />*/}
                  <Table.Column
                    title="Availed"
                    dataIndex="availed"
                    key="availed"
                  />
                 {/* <Table.Column
                    title="Expired/Encashed"
                    dataIndex="expired"
                    key="expired"
                  />*/}
                <Table.Column
                    title="Closing"
                    dataIndex="closing"
                    key="closing"
                  />
                </Table>
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
        <ToastContainer />
      </div>
      
    </>
  );
};
