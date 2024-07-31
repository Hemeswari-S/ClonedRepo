import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tabs,
  Card,
  Typography,
  List,
  Avatar,
  Descriptions,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { RestAPIURL } from "../../Config/Settings";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CircularProgress } from "@mui/material";
import { UploadDocuments } from "../EmployeeDashboard/Documents/UploadDocuments";
import "./EmployeeDetails.css"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


const { TabPane } = Tabs;

const EmployeeDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [dependents, setDependents] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [Data, setpositionData] = useState([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [LastIndex, setLastIndex] = useState(0);

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        setLoading(true);
        const [
          employeeRes,
          dependentsRes,
          bankDetailsRes,
          qualificationsRes,
          contactsRes,
          experiencesRes,
          PositionRes,
        ] = await Promise.all([
          axios.get(`${RestAPIURL}/personalinfos/get/${id}`),
          axios.get(`${RestAPIURL}/empdependentinfos/get/${id}`),
          axios.get(`${RestAPIURL}/empbankinfos/get/${id}`),
          axios.get(`${RestAPIURL}/EmpQualiInfo/newemployeeinfo/${id}`),
          axios.get(`${RestAPIURL}/EmpContactInfo/newcontactinfo/${id}`),
          axios.get(`${RestAPIURL}/empexperienceinfos/get/${id}`),
          axios.get(`${RestAPIURL}/EmpPositionInfo/positioninfo/${id}`),
        ]);
        setEmployee(employeeRes.data);
        setDependents(dependentsRes.data);
        setBankDetails(bankDetailsRes.data);
        setQualifications(qualificationsRes.data);
        setContacts(contactsRes.data);
        // setExperiences(experiencesRes.data.Experiences);
        setExperiences(experiencesRes.data);
        console.log("experiencesRes.data");
        console.log(experiencesRes.data);
        let DesigArray = [];
        DesigArray = PositionRes.data.singlePositionInfo[0].designation;
        if (DesigArray.length !== 0) {
          setpositionData(PositionRes.data.singlePositionInfo[0].designation);
          setLastIndex(DesigArray.length - 1);
        }
        console.log(Data);
      } catch (error) {
        setError(`Failed to fetch details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [id]);
  const { Title, Text } = Typography;
  const getdate = (date) => {
    let EndDate = "";
    if (date) {
      EndDate = dayjs(date).format("MMM YYYY");
      return EndDate;
    } else {
      EndDate = "Present";
      return EndDate;
    }
  };

  if (loading)
    return (
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
    );

  return (<>
     {/* <Card className="container-fluid"> */}
      <Button
        className="header-button"
        onClick={() => nav("/EmpDetails")}
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>
      <Title level={3}>Employee Details</Title>
      <Tabs defaultActiveKey="1" className="tabs-content">
        <TabPane tab="Personal Details" key="1">
          {/* <div className="row"> */}
            {/* <div className="col-md-8"> */}
              {employee ? (
                <>
                  <div className="row">
                    <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
                      <Avatar
                        src={
                          employee.image
                            ? `${RestAPIURL}/personalinfos/get/${id}/image`
                            : null
                        }
                        size={200}
                      />
                    </div>
                    <div className="col-md-9 col-lg-9 col-sm-12 col-xs-12">
                      <Descriptions
                        title="Personal Details"
                        
                        // column={2}
                        className="card-content"
                      >
                        <Descriptions.Item label="Employee ID">
                          {employee.EmployeeId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Name">{`${employee.FirstName} ${employee.LastName}`}</Descriptions.Item>
                        <Descriptions.Item label="Work Email">
                          {employee.ProffessionalEmailId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                          {employee.PersonalEmailId}
                        </Descriptions.Item>
                        <Descriptions.Item label="DOB">
                          {dayjs(employee.DateOfBirth).format("DD-MM-YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Gender">
                          {employee.Gender}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  </div>
                </>
              ) : (
                <p>No Personal Details Found</p>
              )}
            {/* </div> */}
            {/* <div className="col-md-4"> */}
              <Card
                className="mt-3 card-title"
                title={<b>Dependent Details</b>}
              >
                {dependents ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={dependents}
                    renderItem={(dependent) => (
                      <List.Item className="list-item">
                        <List.Item.Meta
                          // avatar={<Avatar icon="" />}
                          title={`${dependent.FirstName} ${dependent.LastName}`}
                          description={`Relation: ${dependent.RelationType}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <p className="text-muted text-center">No Data</p>
                )}
              </Card>
            {/* </div> */}
          {/* </div> */}

          <div style={{ padding: "24px" }}>
            {experiences.length !== 0 ? (
              <>
                <Title level={5}> Experience Information</Title>
                <Row gutter={[16, 16]}>
                  {experiences.map((experience, index) => (
                    <Col span={8} key={index}>
                      <Card
                        title={experience.position}
                        // bordered={false}
                        className="card-content"
                      >
                        <List
                          size="small"
                          dataSource={[
                            { label: "Company", value: experience.companyName },
                            {
                              label: "Joining Date",
                              value: experience.joiningDate,
                            },
                            { label: "Last Date", value: experience.lastDate },
                            {
                              label: "Employment Type",
                              value: experience.employmentType,
                            },
                            {
                              label: "Achievements",
                              value: experience.achievements,
                            },
                            { label: "Salary", value: `$${experience.salary}` },
                            {
                              label: "Company Address",
                              value: experience.companyAddress,
                            },
                            {
                              label: "Contact Number",
                              value: experience.contactNumber,
                            },
                          ]}
                          renderItem={(item) => (
                            <List.Item>
                              <Space>
                                <strong>{item.label}:</strong> {item.value}
                              </Space>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <p>No experiences found for this employee</p>
            )}
          </div>
        </TabPane>

        <TabPane tab="Bank Details" key="3">
          {bankDetails ? (
            <Descriptions
              title="Bank Details"
              // bordered
              // column={2}
              className="card-content"
              style={{width:'70%',margin:'auto'}}
            >
              <Descriptions.Item label="Account Holder">
                {bankDetails.AccountHolderName}
              </Descriptions.Item>
              <Descriptions.Item label="Bank Name">
                {bankDetails.BankName}
              </Descriptions.Item>
              <Descriptions.Item label="Account Number">
                {bankDetails.AccountNumber}
              </Descriptions.Item>
              <Descriptions.Item label="IFSC Code">
                {bankDetails.IFSCCode}
              </Descriptions.Item>
              <Descriptions.Item label="PAN No">
                {bankDetails.PANnumber}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <p>No Bank details Found</p>
          )}
        </TabPane>
        <TabPane tab="Qualification Details" key="4">
          <div className="row">
            <div className="col-md-6 col-lg-3 col-sm-12 col-xs-12">
              <Card
                title="Qualifications with Certificate"
                // className="card-title"
              >
                {qualifications.document ? (
                  qualifications.document.map((doc, index) => (
                    <Card
                      key={index}
                      type="inner"
                      title={`Qualification ${index + 1}`}
                      className="card-content"
                    >
                      <Descriptions
                      //  column={1}  
                       >
                        <Descriptions.Item label="Qualification Type">
                          {doc.qualificationType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Qualification Title">
                          {doc.qualificationTitle}
                        </Descriptions.Item>
                        <Descriptions.Item label="Institute/College Name">
                          {doc.instituteOrCollegeName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">
                          {doc.Address}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  ))
                ) : (
                  <p>No qualifications with certificate</p>
                )}
              </Card>
            </div>
            <div className="col-md-6">
              <Card
                title="Qualifications without Certificate"
                // className="card-title"
              >
                {qualifications.withoutcertificate ? (
                  qualifications.withoutcertificate.map((doc, index) => (
                    <Card
                      key={index}
                      type="inner"
                      title={`Qualification ${index + 1}`}
                      className="card-content"
                    >
                      <Descriptions
                      // column={1} 
                      >
                        <Descriptions.Item label="Qualification Type">
                          {doc.qualificationType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Qualification Title">
                          {doc.qualificationTitle}
                        </Descriptions.Item>
                        <Descriptions.Item label="Major Field Of Study">
                          {doc.MajorFeildOfStudy}
                        </Descriptions.Item>
                        <Descriptions.Item label="Percentage/CGPA">
                          {doc.percentageOrcgba}
                        </Descriptions.Item>
                        <Descriptions.Item label="Institute/College Name">
                          {doc.instituteOrCollegeName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">
                          {doc.Address}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  ))
                ) : (
                  <p>No qualifications without certificate</p>
                )}
              </Card>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Position Details" key="5">
          <div  style={{width:'70%',margin:'auto',padding:'5px'}}>
            <Card
              title="Current Position Information"
              // bordered={false}
              className="card-title"
            >
              {Data.length !== 0 ? (
                <>
                  <div >
                    <div className="row mt-2">
                      <div className="col-lg-4">
                        <Text strong>Department :</Text>{" "}
                      </div>
                      <div className="col-lg-8">
                        <Text>{Data[LastIndex].department}</Text>{" "}
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-4">
                        <Text strong>Designation :</Text>{" "}
                      </div>
                      <div className="col-lg-8">
                        <Text>{Data[LastIndex].position}</Text>{" "}
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-4">
                        <Text strong>Job Description :</Text>{" "}
                      </div>
                      <div className="col-lg-8">
                        <Text>{Data[LastIndex].jobDescription}</Text>{" "}
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-4">
                        <Text strong>Manager :</Text>{" "}
                      </div>
                      <div className="col-lg-8">
                        <Text>{Data[LastIndex].managerName}</Text>{" "}
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-4">
                        <Text strong>Work Location :</Text>{" "}
                      </div>
                      <div className="col-lg-8">
                        <Text>{Data[LastIndex].workLocation}</Text>{" "}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => setHistoryVisible(!historyVisible)}
                    className="mt-5 header-button"
                  >
                    {historyVisible ? "Hide History" : "View  History"}
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Card>

            {historyVisible && (
              <Card
                title="Position History"
                // bordered={false}
                style={{ marginTop: "20px" }}
                className="card-title"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={Data}
                  renderItem={(item) => (
                    <List.Item className="list-item">
                      <List.Item.Meta
                        title={`${dayjs(item.startDate).format(
                          "MMM YYYY"
                        )} - ${getdate(item.endDate)}`}
                        description={`${item.position} at ${item.department} Department`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        </TabPane>
        <TabPane tab="Employee Documents " key="6">
          <UploadDocuments employeeId={id} />
        </TabPane>
      </Tabs>
     {/* </Card> */}
  </>
  );
};

export default EmployeeDetails;
