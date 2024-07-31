import React, { useState } from "react";
import { styled } from "@mui/system";
import { Tabs } from "@mui/base/Tabs";
import { TabsList as BaseTabsList } from "@mui/base/TabsList";
import { TabPanel as BaseTabPanel } from "@mui/base/TabPanel";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import { buttonClasses } from "@mui/base/Button";
import { Tab as BaseTab, tabClasses } from "@mui/base/Tab";
import { Styles } from "../../Config/Colors.js";
import { ContactInfo } from "./ConatctInfo/contact.js";
import BankInfo from "./BankInformation/BankInfo.js";
import { Basicinfo } from "./Qualification/qualification.js";
// import { PayrollUser } from "../Payroll/Payroll_User.js";
import { SalaryUser } from "../Salary/Salary_User.js";
import { Attendance } from "./Work/Attendence.js";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { DesignationUser } from "./Work/DesignationUser.js";
import DependentInfo from "./DependentInfo/ParentDependent.js";
import ExperienceInfo from "./ExperienceInformation/ExperienceInfo.js";
import PersonalInfo from "./PersonalInfo/Personalinfo.js";
import EmpDocsUser from "./Documents/EmpDocs_User.js";
import ExitInfo from "./ExitInformation/ExitInfo.js";
import { PayrollUser } from "../Payroll/Payroll_User.js";
import PlansAndGoalsInfo from "./PlansandGoals/PlansandGoals.js";
export function EmployeeDashboard() {
  const [VisbleAttendance, setVisibleAttenadance] = useState(true);
  const [VisbleSalary, setVisibleSalary] = useState(false);
  const [VisblePayslip, setVisiblePayslip] = useState(false);
  const [VisblePosition, setVisiblePosition] = useState(false);

  const [VisiblePersonal, setVisiblePersonal] = useState(true);
  const [VisibleDEpendent, setVisibleDEpendent] = useState(false);
  const [VisibleExperience, setVisibleExperience] = useState(false);
  const [VisiblePlansandGoals, setVisiblePlansandGoals] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          setVisibleAttenadance(true);
          setVisiblePayslip(false);
          setVisibleSalary(false);
          setVisiblePosition(false);
        }}
      >
        <span>
          {/* <UserOutlined /> */}
          Attendance
        </span>
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          setVisibleSalary(true);
          setVisibleAttenadance(false);
          setVisiblePayslip(false);
          setVisiblePosition(false);
        }}
      >
        <span>
          {/* <UserSwitchOutlined /> */}
          Salary Details
        </span>
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() => {
          setVisiblePayslip(true);
          setVisibleSalary(false);
          setVisibleAttenadance(false);
          setVisiblePosition(false);
        }}
      >
        {/* <LoginOutlined /> */}
        Payslip Details
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          setVisiblePayslip(false);
          setVisibleSalary(false);
          setVisibleAttenadance(false);
          setVisiblePosition(true);
        }}
      >
        {/* <LoginOutlined /> */}
        Position Details
      </Menu.Item>
    </Menu>
  );
  const personalmenu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          setVisiblePersonal(true);
          setVisibleDEpendent(false);
          setVisibleExperience(false);
          setVisiblePlansandGoals(false);
        }}
      >
        <span>
          {/* <UserOutlined /> */}
          Personal Details
        </span>
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          setVisiblePersonal(false);
          setVisibleDEpendent(true);
          setVisibleExperience(false);
          setVisiblePlansandGoals(false);
        }}
      >
        <span>
          {/* <UserSwitchOutlined /> */}
          Dependent Details
        </span>
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() => {
          setVisiblePersonal(false);
          setVisibleDEpendent(false);
          setVisibleExperience(true);
          setVisiblePlansandGoals(false);
        }}
      >
        {/* <LoginOutlined /> */}
        Experience Details
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          setVisiblePersonal(false);
          setVisibleDEpendent(false);
          setVisibleExperience(false);
          setVisiblePlansandGoals(true);
        }}
      >
        {/* <LoginOutlined /> */}
        Plans and Goals
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <Tabs defaultValue={1}>
        <TabsList>
          <Tab value={1}>
            {" "}
            <Dropdown overlay={personalmenu} arrow>
              <div
                style={{
                  cursor: "pointer",
                  marginLeft: "10px",
                  width: "100px",
                }}
              >
                Personal &nbsp;&nbsp;
                <DownOutlined />
              </div>
            </Dropdown>
          </Tab>
          <Tab value={2}>
            <Dropdown overlay={menu} arrow>
              <div
                style={{
                  cursor: "pointer",
                  marginLeft: "10px",
                  width: "100px",
                }}
              >
                Work &nbsp;&nbsp;
                <DownOutlined />
              </div>
            </Dropdown>
          </Tab>

          <Tab value={3}>Qualification </Tab>
          <Tab value={4}>Contact </Tab>
          <Tab value={5}>Bank </Tab>
          <Tab value={6}>Document </Tab>
          <Tab value={7}>Exit </Tab>
        </TabsList>
        <TabPanel value={1}>
          {VisiblePersonal && <PersonalInfo />}
          {VisibleDEpendent && <DependentInfo />}
          {VisibleExperience && <ExperienceInfo />}
          {VisiblePlansandGoals && <PlansAndGoalsInfo/>}
        </TabPanel>
        <TabPanel value={2}>
          {VisbleAttendance && <Attendance />}
          {VisbleSalary && <SalaryUser />}
          {VisblePayslip && <PayrollUser />}
          {VisblePosition && <DesignationUser />}
        </TabPanel>
        <TabPanel value={3}>
          <Basicinfo />
        </TabPanel>
        <TabPanel value={7}>
          <ExitInfo />
        </TabPanel>
        <TabPanel value={4}>
          <ContactInfo />
        </TabPanel>
        <TabPanel value={5}>
          <BankInfo />
        </TabPanel>
        <TabPanel value={6}>
          <EmpDocsUser />
        </TabPanel>
      </Tabs>
    </div>
  );
}

const Tab = styled(BaseTab)`
  font-family: "IBM Plex Sans", sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  line-height: 1.5;
  padding: 8px 12px;
  margin: 6px;
  border: none;
  border-radius: 8px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${Styles.VarGreen2};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${Styles.VarlightGreen2};
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${Styles.VarDarkGreen2};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(BaseTabPanel)`
  width: 100%;
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 0.875rem;
`;

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: ${Styles.VarDarkGreen2};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 6px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.4)" : "rgba(0,0,0, 0.2)"
  };
`
);
