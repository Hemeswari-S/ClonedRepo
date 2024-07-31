import React, { useEffect } from "react";
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { Styles } from "../../Config/Colors";
import LeaveManageruser from "./LeaveManager_user";
import LEaveApprovalMnager from "./LEaveApprovalMnager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import TakenLeaves from "./TakenLeaves";

export default function LeavemanagerForManager() {

useEffect(()=>{

})


  return (
    <div>
      <Tabs defaultValue={1}>
      <TabsList>
        <Tab value={1}>Manage Your Leave</Tab>
        <Tab value={2}>Manage Leave Requests</Tab>
        <Tab value={3}>Leave History</Tab>
      </TabsList>
      <TabPanel value={1}><LeaveManageruser/></TabPanel>
      <TabPanel value={2}><LEaveApprovalMnager/></TabPanel>
      <TabPanel value={3}><TakenLeaves/></TabPanel>
    </Tabs>
    </div>
  );
}
// const blue = {
//   50: '#F0F7FF',
//   100: '#C2E0FF',
//   200: '#80BFFF',
//   300: '#66B2FF',
//   400: '#3399FF',
//   500: '#007FFF',
//   600: '#0072E5',
//   700: '#0059B2',
//   800: '#004C99',
//   900: '#003A75',
// };

const Tab = styled(BaseTab)`
  font-family: 'IBM Plex Sans', sans-serif;
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
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: ${Styles.VarGreen1};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 6px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.4)' : 'rgba(0,0,0, 0.2)'
  };
  `,
);