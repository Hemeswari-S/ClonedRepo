import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import './Designation.css'
import { RestAPIURL } from '../../Config/Settings';

const APIUrl=`${RestAPIURL }/designationinfos/`;


//const APIURL = 'http://localhost:3030/api/designationinfos';

export default function Designation() {
  const [formData, setFormData] = useState({
    DesignationId: '',
    Designation: '',
    
  });
  const [designations, setDesignations] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await axios.get(`${APIUrl}get`);
      if (response.data.success) {
          // Filter out departments with status 'inactive'
          const activeDesignation = response.data.EmpDesignation.filter(desi => desi.status !== 'inactive');
          setDesignations(activeDesignation);      } else {
        toast.error(response.data.message || 'Failed to fetch designation');
      }
    } catch (error) {
      console.error('Error fetching designation:', error);
      toast.error('Failed to fetch designation. Please try again.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const errors = {};
    let valid = true;

    if (!formData.DesignationId) {
      errors.DesignationId = "* Designation ID can't be empty!";
      valid = false;
    }
    if (!formData.Designation) {
      errors.Designation = "* Designation Name can't be empty!";
      valid = false;
    }

    setValidationErrors(errors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (validate()) {
      try {
        let response;
        if (editIndex !== null) {
          response = await axios.put(`${APIUrl}update/${formData.DesignationId}`, formData);
        } else {
          response = await axios.post(`${APIUrl}create`, formData);
        }
  
        if (response.data.success) {
          toast.success(response.data.message);
          setFormData({
            DesignationId: '',
            Designation: ''
          });
          setShowForm(false);
          setEditIndex(null);
          fetchDesignations();
        } else {
          toast.error(response.data.message || 'Failed to update designation.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to submit form. Please try again.');
      }
    }
  };
  <button type="submit" className={`btn btn-success ${editIndex !== null ? 'btn-update' : ''}`}>
    {editIndex !== null ? 'Update' : 'Save'}
  </button>


  const handleAdd = () => {
    setShowForm(true);
    setEditIndex(null);
    setFormData({
      DesignationId: '',
      Designation: ''
    });
  };

  const handleEdit = (index) => {
    setShowForm(true);
    setEditIndex(index);
    setFormData(designations[index]);
  };

  const handleDelete = async (DesignationId, Designation) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the designation "${Designation}"?`);
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${APIUrl}/delete/${DesignationId}`);
        if (response.data.success) {
          toast.success(response.data.message);
          setDesignations(designations.filter(des => des.DesignationId !== DesignationId));
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting designation:', error.message); // Log detailed error message
        console.error('Error details:', error); // Log the complete error object
        toast.error('Failed to delete designation. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <Toaster />
      <button type="button" className="btn btn-primary mb-3" id='add-designation'   onClick={handleAdd}>
        Add Designation
        {/* style={{backgroundColor:"#00A36C",borderColor:"#00A36C"}} */}
      </button>

      {showForm && (
        <div className="popup-overlay" onClick={() => setShowForm(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h5 className="card-title" id='update-designation'>{editIndex !== null ? 'Update Designation' : 'Add Designation'}</h5>
            <form onSubmit={handleSubmit} >
              
              <div className="mb-3">
                <label htmlFor="DesignationId"  id='desi-updated' className="form-label">Designation ID</label>
                <input type="text" id="DesignationId" name="DesignationId" value={formData.DesignationId} onChange={handleInputChange} className={`form-control ${validationErrors.DesignationId ? 'is-invalid' : ''}`} required />
                {validationErrors.DesignationId && <div className="invalid-feedback">{validationErrors.DesignationId}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="Designation" id='desiid-updated' className="form-label">Designation </label>
                <input type="text" id="Designation"  name="Designation" value={formData.Designation} onChange={handleInputChange} className={`form-control ${validationErrors.Designation ? 'is-invalid' : ''}`} required />
                {validationErrors.Designation && <div className="invalid-feedback">{validationErrors.Designation}</div>}
              </div>
              <div className='container-updated'>
              <button type="submit" id='btn-updated' className="btn btn-success btn-update">{editIndex !== null ? 'Update' : 'Save'}</button>
              <button type="button" id='btn-cancel' className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className='dept'>Designation List</p>
      <div className="row">
        {designations.length > 0 ? (
          designations.map((designation, index) => (
            <div className="col-md-4 mb-4" key={designation.DesignationId}>
              <div className="card">
                <div className="card-body">
                  <p className="card-title" id='desi-id'>Designation ID: {designation.DesignationId}</p>
                  <p className="card-text" id='desi'>Designation : {designation.Designation}</p>
                  <button onClick={() => handleEdit(index)} id='edit-icon' className="btn btn-warning btn-sm me-4" ><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(designation.DesignationId, designation.Designation)} id='del-icon' className="btn btn-danger btn-sm me-3"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            {/* <div className="alert alert-warning text-center">No designations found</div> */}
          </div>
        )}
      </div>
    </div>
  );
}
