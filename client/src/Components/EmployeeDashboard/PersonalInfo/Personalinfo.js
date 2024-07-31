import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sessionManager } from '../../../Config/sessionmanager';
import './PersonalInfo.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';


const APIUrl=`${RestAPIURL}/personalinfos/`;
const Card = ({
  label,
  value,
  isEditing,
  onChange,
  name,
  type = 'text',
  className,
  labelClassName,
  valueClassName,
  children,
  onFileChange
}) => (
  <div className={`info-card ${className}`}>
    <div className="card-content">
      <label className={labelClassName}>{label}</label>
      {isEditing ? (
        type === 'file' ? (
          <input
            type="file"
            name={name}
            onChange={onFileChange}
            className="card-input"
          />
        ) : (
          type === 'date' ? (
            <input
              type="date"
              name={name}
              value={value}
              onChange={onChange}
              className="card-input"
            />
          ) : (
            type === 'select' ? (
              <select
                name={name}
                value={value}
                onChange={onChange}
                className="card-input"
              >
                {children}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="card-input"
              />
            )
          )
        )
      ) : (
        type === 'file' ? (
          <p className={valueClassName}><a href={value} target="_blank" rel="noopener noreferrer">View {label}</a></p>
        ) : (
          <p className={valueClassName}>{value}</p>
        )
      )}
    </div>
  </div>
);


const PersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState({
    UserId: '',
    EmployeeId: '',
    FirstName: '',
    LastName: '',
    ProffessionalEmailId: '',
    PersonalEmailId: '',
    Gender: '',
    DateOfBirth: '',
    idProof1: '',
    idProof2: '',
    image: ''
  });

  const [idProof1Blob, setIdProof1Blob] = useState('');
  const [idProof2Blob, setIdProof2Blob] = useState('');
  const [imageBlob, setImageBlob] = useState('');
  const [editMode, setEditMode] = useState(false); // Start with edit mode disabled

  const employeeId = sessionManager.getEmployeeId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APIUrl}get/${employeeId}`);
        const data = response.data;

        if (data.DateOfBirth) {
          data.DateOfBirth = new Date(data.DateOfBirth).toISOString().split('T')[0];
        }

        setPersonalInfo(data);

        setIdProof1Blob(`${APIUrl}get/${employeeId}/idProof1`);
        setIdProof2Blob(`${APIUrl}get/${employeeId}/idProof2`);
        setImageBlob(`${APIUrl}get/${employeeId}/image`);
      } catch (error) {
        console.error('Error fetching personal information:', error);
      }
    };

    fetchData(); // Call fetchData function immediately when component mounts
  }, [employeeId]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    if (file.size > maxFileSize) {
      alert('File size is too large. Please upload a file smaller than 50MB.');
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    try {
      const response = await axios.put(`${APIUrl}upload/${employeeId}?type=${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        if (type === 'idProof1') {
          setIdProof1Blob(URL.createObjectURL(file));
        } else if (type === 'idProof2') {
          setIdProof2Blob(URL.createObjectURL(file));
        } else if (type === 'image') {
          setImageBlob(URL.createObjectURL(file));
        }
        alert(`${type} uploaded successfully!`);
      } else {
        alert('Failed to upload file. Server returned an error.');
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      if (error.response) {
        if (error.response.status === 413) {
          alert('Failed to upload file. The payload is too large. Please reduce the file size and try again.');
        } else {
          alert(`Failed to upload ${type}. Server returned an error.`);
        }
      } else {
        alert(`Failed to upload ${type}. Network error occurred.`);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // Validate date format
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setPersonalInfo({ ...personalInfo, [name]: value });
    } else {
      alert('Invalid date format. Please use yyyy-mm-dd.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Example update only for personal email, gender, and date of birth
      const { PersonalEmailId, Gender, DateOfBirth } = personalInfo;
      const updatedData = { PersonalEmailId, Gender, DateOfBirth };

      const response = await axios.put(`${APIUrl}update/${employeeId}`, updatedData);

      if (response.status === 200) {
        alert('Personal information updated successfully!');
        setEditMode(false); // Exit edit mode after successful update
      } else {
        alert('Failed to update personal information. Server returned an error.');
      }
    } catch (error) {
      console.error('Error updating personal information:', error);
      if (error.response) {
        alert('Failed to update personal information. Server returned an error.');
      } else {
        alert('Failed to update personal information. Network error occurred.');
      }
    }
  };

  return (
    <div className="personal-info-container">
      <div className="profile-header">
        <div className="profile-image">
          {editMode && (
            <label htmlFor="image" className="edit-image-label">
              <input
                type="file"
                id="image"
                name="image"
                onChange={(e) => handleFileUpload(e, 'image')}
                style={{ display: 'none' }}
              />
              <span className="camera-icon">📷</span>
            </label>
          )}
          {!editMode && imageBlob && <img src={imageBlob} alt="Profile" className="profile-image-round" />}
        </div>
        <div className="profile-name">
          <p>{personalInfo.FirstName} {personalInfo.LastName}</p>
          <p>{personalInfo.ProffessionalEmailId}</p>
        </div>
        {!editMode && (
          <div className="edit-icon" onClick={() => setEditMode(true)}>
            <i className="fas fa-edit"></i>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className={editMode ? 'edit-form' : 'hidden'}>
        <div className="info-card-row">
          <Card
            label="Personal Email"
            value={personalInfo.PersonalEmailId}
            onChange={handleChange}
            name="PersonalEmailId"
            type="text"
            isEditing={editMode}
            className="personalemail"
            labelClassName="personal-email-label"
            valueClassName="personal-email-value"
          />
        </div>
        <div className="info-card-row">
          <Card
            label="Date of Birth"
            value={personalInfo.DateOfBirth}
            onChange={handleDateChange}
            name="DateOfBirth"
            type="date"
            isEditing={editMode}
            className="dateofbirth"
            labelClassName="personal-dob-label"
            valueClassName="personal-dob-value"
          />
          <Card
            label="Gender"
            value={personalInfo.Gender}
            onChange={handleChange}
            name="Gender"
            type="select"
            isEditing={editMode}
            className="gender"
            labelClassName="personal-gender-label"
            valueClassName="personal-gender-value"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Card>
        </div>
        <div className="info-card-row" id='idproofs'>
          <Card
            label="ID Proof 1"
            value={idProof1Blob}
            type="file"
            onFileChange={(e) => handleFileUpload(e, 'idProof1')}
            isEditing={editMode}
            className="idproofone"
            labelClassName="personal-idone-label"
            valueClassName="personal-idone-value"
          />
          <Card
            label="ID Proof 2"
            value={idProof2Blob}
            type="file"
            onFileChange={(e) => handleFileUpload(e, 'idProof2')}
            isEditing={editMode}
            className="idprooftwo"
            labelClassName="personal-idtwo-label"
            valueClassName="personal-idtwo-value"
          />
        </div>
        {editMode && (
          <div className="form-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        )}
      </form>


    </div>
  );
};

export default PersonalInfo;
