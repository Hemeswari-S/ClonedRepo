// ExperienceView.jsx

import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';

const APIUrl=`${RestAPIURL}/empexperienceinfos/`;

const ExperienceView = ({ experience, onClose }) => {
  return (
    <div>
      <h3>Experience Details</h3>
      <p>Position: {experience.position}</p>
      <p>Joining Date: {experience.joiningDate}</p>
      <p>Last Date: {experience.lastDate}</p>
      <p>Employment Type: {experience.employmentType}</p>
      <p>Achievements: {experience.achievements}</p>
      <p>Salary: {experience.salary}</p>
      <p>Company Name: {experience.companyName}</p>
      <p>Company Address: {experience.companyAddress}</p>
      <p>Contact Number: {experience.contactNumber}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ExperienceView;
