import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Bankinfo.css'; // Assuming this is your custom CSS file
import { sessionManager } from '../../../Config/sessionmanager';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';

// import BankInfoModel from '../../../models/BankInfo';

const APIUrl=`${RestAPIURL}/empbankinfos/`;

function BankInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [bankDetails, setBankDetails] = useState({});
  const [originalDetails, setOriginalDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankInfo = async () => {
      const employeeId = sessionManager.getEmployeeId();
      if (employeeId) {
        try {
          setLoading(true);
          const response = await axios.get(`${APIUrl}get/${employeeId}`);
          console.log('Response:', response.data);
          setBankDetails(response.data);
          setOriginalDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching bank information:', error);
          setError({ general: 'Failed to fetch bank information' });
          setLoading(false);
        }
      }
    };

    fetchBankInfo();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const employeeId = sessionManager.getEmployeeId();
      console.log('Submitting data:', bankDetails); // Log the data being sent

      const { _id, createdAt, updatedAt, ...updateData } = bankDetails;

      const response = await axios.put(`${APIUrl}update/${employeeId}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Update response:', response.data); // Log server response for debugging

      setIsEditing(false);
      setOriginalDetails(bankDetails);
      setSuccessMessage('Bank information updated successfully.');
      setError({}); // Clear any previous errors

      // Optionally, navigate to another page or show a success message
      // navigate('/dashboard');
    } catch (error) {
      console.error('Error updating bank information:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        // Handle validation errors from the server
        setError(error.response.data.errors);
      } else {
        setError({ general: 'Failed to update bank information' });
      }
    }
  };

  const handleReset = () => {
    setBankDetails({ ...originalDetails }); // Reset to original details
    setError({});
  };

  const handleDismissSuccess = () => {
    setSuccessMessage('');
  };

  return (
    <div className="container mt-5">
      <p className="card-title" style={{ color: 'blue' }}>Bank Information</p>
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={handleDismissSuccess}></button>
        </div>
      )}
      <form onSubmit={handleSubmit}
      //  style={{ width: "800px" }}
       >
        <div className=" container d-flex flex-wrap justify-content-center">
          <div className="card mb-3" style={{width:'50%'}}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center edit">
                <button type="button" className="btn btn-outline-primary" onClick={handleEditClick}>
                  <i className="fas fa-edit"></i>
                </button>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <p>
                    <strong>Employee ID:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="EmployeeId"
                        value={bankDetails.EmployeeId || ''}
                        onChange={handleInputChange}
                        disabled
                      />
                    ) : (
                      bankDetails.EmployeeId
                    )}
                  </p>
                  <p>
                    <strong>Bank Name:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className={`form-control ${error.BankName ? 'is-invalid' : ''}`}
                        name="BankName"
                        value={bankDetails.BankName || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      bankDetails.BankName
                    )}
                    {error.BankName && (
                      <div className="invalid-feedback">{error.BankName.message}</div>
                    )}
                  </p>
                  <p>
                    <strong>Branch Name:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className={`form-control ${error.BranchName ? 'is-invalid' : ''}`}
                        name="BranchName"
                        value={bankDetails.BranchName || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      bankDetails.BranchName
                    )}
                    {error.BranchName && (
                      <div className="invalid-feedback">{error.BranchName.message}</div>
                    )}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className={`form-control ${error.AccountNumber ? 'is-invalid' : ''}`}
                        name="AccountNumber"
                        value={bankDetails.AccountNumber || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      bankDetails.AccountNumber
                    )}
                    {error.AccountNumber && (
                      <div className="invalid-feedback">{error.AccountNumber.message}</div>
                    )}
                  </p>
                  <p>
                    <strong>Account Type:</strong>{' '}
                    {isEditing ? (
                      <select
                        className={`form-control ${error.AccountType ? 'is-invalid' : ''}`}
                        name="AccountType"
                        value={bankDetails.AccountType || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Account Type</option>
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                        <option value="Fixed Deposit">Fixed Deposit</option>
                        <option value="Recurring Deposit">Recurring Deposit</option>
                      </select>
                    ) : (
                      bankDetails.AccountType
                    )}
                    {error.AccountType && (
                      <div className="invalid-feedback">{error.AccountType.message}</div>
                    )}
                  </p>
                  <p>
                    <strong>Account Holder Name:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className={`form-control ${error.AccountHolderName ? 'is-invalid' : ''}`}
                        name="AccountHolderName"
                        value={bankDetails.AccountHolderName || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      bankDetails.AccountHolderName
                    )}
                    {error.AccountHolderName && (
                      <div className="invalid-feedback">{error.AccountHolderName.message}</div>
                    )}
                  </p>
                  <p>
                    <strong>IFSC Code:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className={`form-control ${error.IFSCCode ? 'is-invalid' : ''}`}
                        name="IFSCCode"
                        value={bankDetails.IFSCCode || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      bankDetails.IFSCCode
                    )}
                    {error.IFSCCode && (
                      <div className="invalid-feedback">{error.IFSCCode.message}</div>
                    )}
                  </p>
                  <p>
                    <strong>PAN Number:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className={`form-control ${error.PANnumber ? 'is-invalid' : ''}`}
                        name="PANnumber"
                        value={bankDetails.PANnumber || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      bankDetails.PANnumber
                    )}
                    {error.PANnumber && (
                      <div className="invalid-feedback">{error.PANnumber.message}</div>
                    )}
                  </p>
                </div>
              </div>
              {isEditing && (
                <div className="modal-footer modal-footer-custom">
                  <button type="button" className="btn btn-custom-close" style={{ backgroundColor: "#FF4433", color: "white" }} onClick={() => setIsEditing(false)}>
                    Close
                  </button>                             

                  <button type="submit" className="btn btn-custom-save" style={{ backgroundColor: "#00A36C", color: "white" }}>
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BankInfo;
