import React from 'react'
import TakenLeaves from './TakenLeaves.js'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { Typography } from 'antd';


export default function LeaveManagerAdmin() {
  const {Title}=Typography;
  return (<>
<Title level={4}>Leave History</Title>
<hr/>
<TakenLeaves/>
  </>
  )
}
