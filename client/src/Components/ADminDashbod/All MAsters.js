import { Button, Card, Col, ConfigProvider, Row, Typography } from 'antd';
import React from 'react'
import { Styles } from '../../Config/Colors.js';
import { ButtonColor, getActiveColors, getHoverColors } from '../../Config/Variables.js';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


export default function AllMAsters() {
    const { Title } = Typography;
    const nav=useNavigate()
    return (
      <>
        <Card
        className='p-2 '
          title={
            <Title level={4} style={{ color: Styles.VarDarkGreen2 }}>
              All Masters
            </Title>
          }
          
        >  <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: `linear-gradient(90deg,  ${ButtonColor.join(
                ", "
              )})`,
              colorPrimaryHover: `linear-gradient(360deg, ${getHoverColors(
                ButtonColor
              ).join(", ")})`,
              colorPrimaryActive: `linear-gradient(0deg, ${getActiveColors(
                ButtonColor
              ).join(", ")})`,
              lineWidth: 0,
            },
          },
        }}
      >
            <Row justify="center" gutter={[16, 16]}>
    <Col>
      <Button type="primary" onClick={()=>nav('/User')}>Add User</Button>
    </Col>
    <Col>
      <Button type="primary" onClick={()=>nav('/Role')}>Add Role</Button>
    </Col>
    <Col>
      <Button type="primary" onClick={()=>nav('/LeaveType')}>Add LeaveType</Button>
    </Col>
    <Col>
      <Button type="primary" onClick={()=>nav('/Department')}>Add Department</Button>
    </Col>
    <Col>
      <Button type="primary" onClick={()=>nav('/Designation')}>Add Designation</Button>
    </Col>
    {/* <Col>
      <Button type="primary">Button 4</Button>
    </Col> */}
   
  </Row></ConfigProvider>
   </Card>
      </>
    );
}
