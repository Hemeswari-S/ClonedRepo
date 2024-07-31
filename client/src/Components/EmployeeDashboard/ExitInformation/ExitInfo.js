import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sessionManager } from '../../../Config/sessionmanager';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';
import './ExitInfo.css'

const APIUrl = `${RestAPIURL}/empexitinfos/`;

const ExitInfo = () => {
  const [exitInfo, setExitInfo] = useState({
    EmployeeId: '',
    EmpName: '',
    exitDate: '',
    reasonForExit: '',
    resignationNoticeDate: '',
    exitInterviewDate: '',
    lastWorkingDay: '',
    finalSettlementdetails: '',
    feedBack: '',
    exitProcessManager: '',
    exitType: '',
  });
  const [handoverDocFiles, setHandoverDocFiles] = useState([]);
  const [handoverDocs, setHandoverDocs] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    const fetchExitInfo = async () => {
      try {
        const employeeId = sessionManager.getEmployeeId();
        const response = await axios.get(`${APIUrl}get/${employeeId}`);
        const data = response.data;

        if (data) {
          setExitInfo({
            EmployeeId: data.EmployeeId || '',
            EmpName: data.EmpName || '',
            exitDate: data.exitDate ? new Date(data.exitDate).toISOString().split('T')[0] : '',
            reasonForExit: data.reasonForExit || '',
            resignationNoticeDate: data.resignationNoticeDate ? new Date(data.resignationNoticeDate).toISOString().split('T')[0] : '',
            exitInterviewDate: data.exitInterviewDate ? new Date(data.exitInterviewDate).toISOString().split('T')[0] : '',
            lastWorkingDay: data.lastWorkingDay ? new Date(data.lastWorkingDay).toISOString().split('T')[0] : '',
            finalSettlementdetails: data.finalSettlementdetails || '',
            feedBack: data.feedBack || '',
            exitProcessManager: data.exitProcessManager || '',
            exitType: data.exitType || '',
          });

          setHandoverDocs(data.UploadDocumentation || []);
          localStorage.setItem('exitDate', data.exitDate || '');
        }
      } catch (error) {
        console.error('Error fetching exit info:', error);
      }
    };

    fetchExitInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExitInfo({
      ...exitInfo,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setHandoverDocFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('EmployeeId', exitInfo.EmployeeId);
    formData.append('EmpName', exitInfo.EmpName);
    formData.append('exitDate', exitInfo.exitDate);
    formData.append('reasonForExit', exitInfo.reasonForExit);
    formData.append('resignationNoticeDate', exitInfo.resignationNoticeDate);
    formData.append('exitInterviewDate', exitInfo.exitInterviewDate);
    formData.append('lastWorkingDay', exitInfo.lastWorkingDay);
    formData.append('finalSettlementdetails', exitInfo.finalSettlementdetails);
    formData.append('feedBack', exitInfo.feedBack);
    formData.append('exitProcessManager', exitInfo.exitProcessManager);
    formData.append('exitType', exitInfo.exitType);
    for (let i = 0; i < handoverDocFiles.length; i++) {
      formData.append('UploadDocumentation', handoverDocFiles[i]);
    }

    try {
      const response = await axios.put(`${APIUrl}update/${exitInfo.EmployeeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update state with the new data
      const data = response.data;
      setExitInfo({
        EmployeeId: data.EmployeeId || '',
        EmpName: data.EmpName || '',
        exitDate: data.exitDate ? new Date(data.exitDate).toISOString().split('T')[0] : '',
        reasonForExit: data.reasonForExit || '',
        resignationNoticeDate: data.resignationNoticeDate ? new Date(data.resignationNoticeDate).toISOString().split('T')[0] : '',
        exitInterviewDate: data.exitInterviewDate ? new Date(data.exitInterviewDate).toISOString().split('T')[0] : '',
        lastWorkingDay: data.lastWorkingDay ? new Date(data.lastWorkingDay).toISOString().split('T')[0] : '',
        finalSettlementdetails: data.finalSettlementdetails || '',
        feedBack: data.feedBack || '',
        exitProcessManager: data.exitProcessManager || '',
        exitType: data.exitType || '',
      });
      setHandoverDocs(data.UploadDocumentation);
      setFormVisible(false); // Hide the form after submission
      setDetailsVisible(true); // Show the details after submission
      setHandoverDocFiles([]); // Clear the file input after submission
    } catch (error) {
      console.error('Error updating exit information:', error);
    }
  };

  const openHandoverDoc = (fileId) => {
    window.open(`${APIUrl}get/${exitInfo.EmployeeId}/${fileId}`, '_blank');
  };

  const showDetails = () => {
    setDetailsVisible(true);
    setFormVisible(false);
  };

  return (
    <div className="container mt-4">
      <p className='exit-info'>Exit Information</p>
      {!formVisible && !detailsVisible && (
        <div>
          <button className="btn btn-primary mb-4" onClick={() => setFormVisible(true)}>
            Add Exit Info
          </button>
          <button id='show-details' className="btn btn-secondary mb-4" onClick={showDetails}>
            Show Details
          </button>
        </div>
      )}
      {formVisible && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Exit Info</h5>
                <button type="button" className="btn-close" onClick={() => setFormVisible(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* <div className="form-group">
                    <label>Employee ID:</label>
                    <input
                      type="text"
                      name="EmployeeId"
                      value={exitInfo.EmployeeId}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Employee Name:</label>
                    <input
                      type="text"
                      name="EmpName"
                      value={exitInfo.EmpName}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled
                    />
                  </div> */}
                  <div className="form-group">
                    <label>Exit Date:</label>
                    <input
                      type="date"
                      name="exitDate"
                      value={exitInfo.exitDate}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Reason for Exit:</label>
                    <input
                      type="text"
                      name="reasonForExit"
                      value={exitInfo.reasonForExit}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Resignation Notice Date:</label>
                    <input
                      type="date"
                      name="resignationNoticeDate"
                      value={exitInfo.resignationNoticeDate}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Exit Interview Date:</label>
                    <input
                      type="date"
                      name="exitInterviewDate"
                      value={exitInfo.exitInterviewDate}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Working Day:</label>
                    <input
                      type="date"
                      name="lastWorkingDay"
                      value={exitInfo.lastWorkingDay}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Final Settlement Details:</label>
                    <input
                      type="text"
                      name="finalSettlementdetails"
                      value={exitInfo.finalSettlementdetails}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Feedback:</label>
                    <input
                      type="text"
                      name="feedBack"
                      value={exitInfo.feedBack}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Exit Process Manager:</label>
                    <input
                      type="text"
                      name="exitProcessManager"
                      value={exitInfo.exitProcessManager}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Exit Type:</label>
                    <input
                      type="text"
                      name="exitType"
                      value={exitInfo.exitType}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Upload Documentation:</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Add
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setFormVisible(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {detailsVisible && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Exit Details</h5>
                <button type="button" className="btn-close" onClick={() => setDetailsVisible(false)}></button>
              </div>
              <div className="modal-body">
                {/* <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Employee ID:</strong> {exitInfo.EmployeeId}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Employee Name:</strong> {exitInfo.EmpName}</p>
                  </div>
                </div> */}
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Exit Date:</strong> {exitInfo.exitDate}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Reason for Exit:</strong> {exitInfo.reasonForExit}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Resignation Notice Date:</strong> {exitInfo.resignationNoticeDate}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Exit Interview Date:</strong> {exitInfo.exitInterviewDate}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Last Working Day:</strong> {exitInfo.lastWorkingDay}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Final Settlement Details:</strong> {exitInfo.finalSettlementdetails}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Feedback:</strong> {exitInfo.feedBack}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Exit Process Manager:</strong> {exitInfo.exitProcessManager}</p>
                  </div>
                </div>
                <div className="card mb-2">
                  <div className="card-body">
                    <p><strong>Exit Type:</strong> {exitInfo.exitType}</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <p>Uploaded Documents</p>
                    <ul>
                      {handoverDocs.map((doc, index) => (
                        <li key={index}>
                          <button className="btn btn-link" onClick={() => openHandoverDoc(doc._id)}>
                            View Document {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDetailsVisible(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitInfo;
