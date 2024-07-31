import React from "react";
import { sessionManager } from "../../Config/sessionmanager.js";
import AllMAsters from "./All MAsters.js";
import { Styles } from "../../Config/Colors.js";
import { Typography } from "antd";
import RecentNewUsers from "./RecentNew Users.js";
import LeaveOfWeek from "./LeaveOfWeek.js";
import RecentPromotions from "./RecentPromotions.js";
import ExitRequests from "./ExitRequests.js";
import Controlls from "./Controlls.js";
import EmployeeBadge from "./Bdges/EmployeeBadge.js";
import DepartmentBadge from "./Bdges/DepartmentBadge.js";
import RoleBadge from "./Bdges/RoleBadge.js";
import DesignationBadge from "./Bdges/DesignationBadge.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";



export function Admindashboard() {
  const Empname = sessionManager.getEmpName();
  const { Title } = Typography;

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
            Welcome {Empname}
          </Title>
          <div className="row">
            <div className="col-md-3 col-lg-3 col-xs-12 col-sm-12 mt-3">
              <EmployeeBadge className="m-2"/>
            </div>

            <div className="col-md-3 col-lg-3 col-xs-12 col-sm-12 mt-3">
              <RoleBadge className="m-2"/>
            </div>
            <div className="col-md-3 col-lg-3 col-xs-12 col-sm-12 mt-3">
              <DepartmentBadge className="m-2" />
            </div>

            <div className="col-md-3 col-lg-3 col-xs-12 col-sm-12 mt-3">
              <DesignationBadge className="m-2" />
            </div>

          </div>

          <div className="row  ">
            <div className="col-lg-7 col-md-7  col-xs-12 col-sm-12 mt-3">
              <AllMAsters />
              
              
            </div>
            <div className="col-lg-5 col-md-5  col-xs-12 col-sm-12 mt-3">
              <Controlls />
              
              
            </div>
          </div>
          <div className="row ">
            <div className="col-lg-5 col-md-5  col-xs-12 col-sm-12 mt-3">
              <RecentNewUsers />
              
            </div>
            <div className="col-lg-7 col-md-7  col-xs-12 col-sm-12 mt-3">
              <LeaveOfWeek />
              
            </div>
          </div>
          
          <div className="row ">
            <div className="col-lg-7 col-md-7  col-xs-12 col-sm-12 mt-3">
              <RecentPromotions />
              
              
            </div>
            <div className="col-lg-5 col-md-5  col-xs-12 col-sm-12 mt-3">
              <ExitRequests />
              
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
