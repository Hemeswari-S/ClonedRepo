import React, { useEffect, useState } from "react";
import {
  CalendarOutlined,
  DesktopOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  FileOutlined,
  LoginOutlined,
  MoneyCollectOutlined,
  PieChartOutlined,
  UserOutlined,
  UserSwitchOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, theme } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import { Link, useNavigate } from "react-router-dom";
import { RouteComp } from "../../Routes/Routes";
import { Styles } from "../../Config/Colors";
import LANlogo from "../../Assets/LANLogo.png";
import { Footer } from "antd/es/layout/layout";
import { Variables } from "../../Config/Variables";
import { sessionManager } from "../../Config/sessionmanager";
import { Calendar2Check } from "react-bootstrap-icons";
import User from "../../Assets/User.jpeg";
import { useMediaQuery } from 'react-responsive';

const { Header, Sider, Content } = Layout;

export const LayoutComp = () => {
  const [ISAdmin, setISAdmin] = useState(false);
  const [ISManager, setISManager] = useState(false);
  const [PermissionStatus, setPermissionStatus] = useState(false);
  const [OvertimeStatus, setOvertimeStatus] = useState(false);
  const userName = sessionManager.getEmpName();
  const Role = sessionManager.getRole();

  useEffect(() => {
    const setrole = () => {
      if (Role === Variables.AdminRole) {
        setISAdmin(true);
      } else if (Role === Variables.ManagerRole) {
        setISManager(true);
      }
    };
    setPermissionStatus(sessionManager.getPermissionStatus());
    setrole();
  }, []);

  const nav = useNavigate();
  const HandleSignout = () => {
    sessionStorage.clear();
    nav("/");
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  function getItem(label, key, icon, path, children) {
    return {
      key,
      icon,
      children,
      label,
      path,
    };
  }
  const getAdminMenu = () => {
    if (PermissionStatus === "true") {
      return [
        getItem("Dashboard", "1", <PieChartOutlined />, "/AdminDashboard"),
        getItem("User Manger", "2", <UserOutlined />, "/User"),
        {
          key: "sub1",
          icon: <DesktopOutlined />,
          label: "Managers",
          children: [
            getItem("Role ", "3", null, "/Role"),
            getItem("Leave Type", "4", null, "/LeaveType"),
            getItem("Designation", "5", null, "/Designation"),
            getItem("Department", "6", null, "/Department"),
          ],
        },
        getItem("Leave Manager", "7", <Calendar2Check />, "/LeaveManagerAdmin"),
        getItem("Payroll Manager", "9", <DollarOutlined />, "/PayRollManager"),
        getItem(
          "Salary Manager",
          "10",
          <MoneyCollectOutlined />,
          "/SalaryManager"
        ),
        getItem("Payslip History", "11", <FileOutlined />, "/PayslipHistory"),
        getItem(
          "Attendence ",
          "12",
          <FieldTimeOutlined />,
          "/AttendenceHistory"
        ),
        getItem(
          "permission Manager",
          "8",
          <CalendarOutlined />,
          "/PermissionAdmin"
        ),
        getItem(
          "Employee Details",
          "13",
          <UsergroupAddOutlined />,
          "/EmpDetails"
        ),
      ];
    } else {
      return [
        getItem("Dashboard", "1", <PieChartOutlined />, "/AdminDashboard"),
        getItem("User Manger", "2", <UserOutlined />, "/User"),
        {
          key: "sub1",
          icon: <DesktopOutlined />,
          label: "Managers",
          children: [
            getItem("Role ", "3", null, "/Role"),
            getItem("Leave Type", "4", null, "/LeaveType"),
            getItem("Designation", "5", null, "/Designation"),
            getItem("Department", "6", null, "/Department"),
          ],
        },
        getItem("Leave Manager", "7", <Calendar2Check />, "/LeaveManagerAdmin"),
        getItem("Payroll Manager", "9", <DollarOutlined />, "/PayRollManager"),
        getItem(
          "Salary Manager",
          "10",
          <MoneyCollectOutlined />,
          "/SalaryManager"
        ),
        getItem("Payslip History", "11", <FileOutlined />, "/PayslipHistory"),
        getItem(
          "Attendence ",
          "12",
          <FieldTimeOutlined />,
          "/AttendenceHistory"
        ),
        getItem(
          "Employee Details",
          "13",
          <UsergroupAddOutlined />,
          "/EmpDetails"
        ),
      ];
    }
  };
  const getManagerMenu = () => {
    if (PermissionStatus === "true") {
      return [
        getItem("Dashboard", "1", <PieChartOutlined />, "/EmployeeDashboard"),

        getItem("Leave ", "3", <Calendar2Check />, "/LeaveManagerforManager"),
        getItem(
          "Attendence ",
          "4",
          <FieldTimeOutlined />,
          "/AttendenceforManager"
        ),
        getItem("Salary ", "5", <MoneyCollectOutlined />, "/SalaryforManager"),

        getItem(
          "Permission",
          "2",
          <CalendarOutlined />,
          "/PermissionforManager"
        ),
      ];
    } else {
      return [
        getItem("Dashboard", "1", <PieChartOutlined />, "/EmployeeDashboard"),

        getItem("Leave ", "3", <Calendar2Check />, "/LeaveManagerforManager"),
        getItem(
          "Attendence ",
          "4",
          <FieldTimeOutlined />,
          "/AttendenceforManager"
        ),
        getItem("Salary ", "5", <MoneyCollectOutlined />, "/SalaryforManager"),
      ];
    }
  };
  const getEmployeeMenu = () => {
    if (PermissionStatus === "true") {
      return [
        getItem("Dashboard", "1", <PieChartOutlined />, "/EmployeeDashboard"),

        getItem("LeaveManager", "9", <Calendar2Check />, "/LeaveManager"),
        getItem(
          "Permission Manager",
          "2",
          <CalendarOutlined />,
          "/PermissionManager"
        ),
      ];
    } else {
      return [
        getItem("Dashboard", "1", <PieChartOutlined />, "/EmployeeDashboard"),
        getItem("LeaveManager", "9", <Calendar2Check />, "/LeaveManager"),
      ];
    }
  };
  const AdminMenu = getAdminMenu();

  const ManagerMenu = getManagerMenu();

  const EmployeeMenu = getEmployeeMenu();
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span>
          <UserOutlined />
          &nbsp;User: {userName}
        </span>
      </Menu.Item>
      <Menu.Item key="2">
        <span>
          <UserSwitchOutlined />
          &nbsp;Role: {Role}
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={HandleSignout}>
        <LoginOutlined />
        &nbsp; Sign Out
      </Menu.Item>
    </Menu>
  );

  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#F5F5F5",
          height: "80px",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={LANlogo} alt="logo" width={"40%"} />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", paddingRight: 10 }}
        >
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <div style={{ cursor: "pointer", marginLeft: "10px" }}>
              <img
                src={User}
                alt="user"
                className="img rounded-circle"
                width={60}
                style={{ border: "gray 1px solid" }}
              />
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout style={{ marginTop: "80px" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            position: "fixed",
            zIndex: 1,
            height: "100vh",
            left: 0,
            top: "80px",
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            defaultSelectedKeys={["1"]}
            mode="inline"
            inlineCollapsed={collapsed}
            style={{
              borderRight: 0,
              listStyle: "none",
              textDecoration: "none",
              padding: 0,
            }}
          >
            {ISAdmin
              ? AdminMenu.map((item) =>
                  item.children ? (
                    <Menu.SubMenu
                      key={item.key}
                      icon={item.icon}
                      title={item.label}
                    >
                      {item.children.map((subItem) => (
                        <Menu.Item key={subItem.key}>
                          <Link
                            style={{
                              listStyle: "none",
                              textDecoration: "none",
                            }}
                            to={subItem.path}
                          >
                            {subItem.label}
                          </Link>
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  ) : (
                    <Menu.Item key={item.key} icon={item.icon}>
                      <Link
                        style={{
                          borderRight: 0,
                          listStyle: "none",
                          textDecoration: "none",
                          padding: 0,
                        }}
                        to={item.path}
                      >
                        {item.label}
                      </Link>
                    </Menu.Item>
                  )
                )
              : ISManager
              ? ManagerMenu.map((item) =>
                  item.children ? (
                    <Menu.SubMenu
                      key={item.key}
                      icon={item.icon}
                      title={item.label}
                    >
                      {item.children.map((subItem) => (
                        <Menu.Item
                          style={{
                            borderRight: 0,
                            listStyle: "none",
                            textDecoration: "none",
                            padding: 0,
                          }}
                          key={subItem.key}
                        >
                          <Link
                            style={{
                              borderRight: 0,
                              listStyle: "none",
                              textDecoration: "none",
                              padding: 0,
                            }}
                            to={subItem.path}
                          >
                            {subItem.label}
                          </Link>
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  ) : (
                    <Menu.Item key={item.key} icon={item.icon}>
                      <Link
                        style={{
                          borderRight: 0,
                          listStyle: "none",
                          textDecoration: "none",
                          padding: 0,
                        }}
                        to={item.path}
                      >
                        {item.label}
                      </Link>
                    </Menu.Item>
                  )
                )
              : EmployeeMenu.map((item) =>
                  item.children ? (
                    <Menu.SubMenu
                      key={item.key}
                      icon={item.icon}
                      title={item.label}
                    >
                      {item.children.map((subItem) => (
                        <Menu.Item key={subItem.key}>
                          <Link
                            style={{
                              borderRight: 0,
                              listStyle: "none",
                              textDecoration: "none",
                              padding: 0,
                            }}
                            to={subItem.path}
                          >
                            {subItem.label}
                          </Link>
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  ) : (
                    <Menu.Item key={item.key} icon={item.icon}>
                      <Link
                        style={{
                          borderRight: 0,
                          listStyle: "none",
                          textDecoration: "none",
                          padding: 0,
                        }}
                        to={item.path}
                      >
                        {item.label}
                      </Link>
                    </Menu.Item>
                  )
                )}
          </Menu>
        </Sider>
        <Layout
          style={{
            marginLeft: isMobile ? 0 : collapsed ? "80px" : "200px",
            transition: "margin-left 0.2s",
          }}
        >
          <Content
            style={{
              // margin: "24px 16px",
              paddingLeft: isMobile ? '80px' :0 ,
              paddingRight:'5px',
              paddingTop:'5px',
              paddingBottom:'5px',
              background: Styles.VarlightGreen4,
              borderRadius: borderRadiusLG,
              minHeight: "calc(100vh - 100px - 100px)",
            }}
          >
            <RouteComp />
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: "center" }}>
        {new Date().getFullYear()}&copy; Lan Innovations
      </Footer>
    </Layout>
  );
};
