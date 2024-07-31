import React, { useEffect, useState } from "react";
import { Button, Card, List, Typography } from "antd";
import axios from "axios";
import { RestAPIURL } from "../../../Config/Settings";
import { sessionManager } from "../../../Config/sessionmanager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import dayjs from "dayjs";

const { Title, Text } = Typography;
const getdate=(date)=>{
    let EndDate='';
    if(date){
    
        EndDate= dayjs(date).format('MMM YYYY');
        return EndDate;
    }else{
        EndDate='Present';
        return EndDate
    }
    }
export const DesignationUser = () => {
  const [Data, setData] = useState([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [LastIndex, setLastIndex] = useState(0);
  const EmpId = sessionManager.getEmployeeId();
  const Get = () => {
    console.log(`${RestAPIURL}/EmpPositionInfo/positioninfo/${EmpId}`);
    axios
      .get(`${RestAPIURL}/EmpPositionInfo/positioninfo/${EmpId}`)
      .then((result) => {
        let DesigArray=[];
         DesigArray=result.data.singlePositionInfo[0].designation
        if (DesigArray.length !== 0) {
            console.log(result.data.singlePositionInfo[0].designation);
          setData(result.data.singlePositionInfo[0].designation);
           setLastIndex(DesigArray.length - 1);
        }
      });
  };
  useEffect(Get, []);


  return (
    <div style={{ padding: "20px" }}>
      <Card title="Current Position Information" bordered={false}>
        {Data.length!==0?(<>   <div style={{ width: "50%" }}>
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
          className="mt-5"
        >
          {historyVisible ? "Hide History" : "View  History"}
        </Button></>):(<></>)}
     
      </Card>

      {historyVisible && (

        
        <Card
          title="Position History"
          bordered={false}
          style={{ marginTop: "20px" }}
        >
          <List
            itemLayout="horizontal"
            dataSource={Data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={`${dayjs(item.startDate).format('MMM YYYY')} - ${getdate(item.endDate)}`} description={`${item.position} at ${item.department} Department`} />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

