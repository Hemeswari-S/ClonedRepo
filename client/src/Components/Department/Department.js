import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Department/Department.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import './Department.css'
import { RestAPIURL } from '../../Config/Settings';

const APIUrl=`${RestAPIURL}/departmentinfos/`;

// const APIURL = 'http://localhost:3030/api/departmentinfos'; 

export default function Department() {
  const [formData, setFormData] = useState({
    DepartmentId: '',
    DepartmentName: ''
  });
  const [departments, setDepartments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${APIUrl}/get`);
      if (response.data.success) {
        // Filter out departments with status 'inactive'
        const activeDepartments = response.data.EmpDepartment.filter(dept => dept.status !== 'inactive');
        setDepartments(activeDepartments);
      } else {
        toast.error(response.data.message || 'Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments. Please try again.');
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

    if (!formData.DepartmentId) {
      errors.DepartmentId = "* Department ID can't be empty!";
      valid = false;
    }
    if (!formData.DepartmentName) {
      errors.DepartmentName = "* Department Name can't be empty!";
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
          response = await axios.put(`${APIUrl}/update/${formData.DepartmentId}`, formData);
        } else {
          response = await axios.post(`${APIUrl}/create`, formData);
        }
  
        if (response.data.success) {
          toast.success(response.data.message);
          setFormData({
            DepartmentId: '',
            DepartmentName: ''
          });
          setShowForm(false);
          setEditIndex(null);
          fetchDepartments();
        } else {
          toast.error(response.data.message || 'Failed to update department.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to submit form. Please try again.');
      }
    }
  };
  
  // Inside render method
  <button type="submit" className={`btn btn-success ${editIndex !== null ? 'btn-update' : ''}`}>
    {editIndex !== null ? 'Update' : 'Save'}
  </button>
  

  const handleAdd = () => {
    setShowForm(true);
    setEditIndex(null);
    setFormData({
      DepartmentId: '',
      DepartmentName: ''
    });
  };

  const handleEdit = (index) => {
    setShowForm(true);
    setEditIndex(index);
    setFormData(departments[index]);
  };

  const handleDelete = async (DepartmentId, DepartmentName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the department "${DepartmentName}"?`);
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${APIUrl}/delete/${DepartmentId}`);
        if (response.data.success) {
          toast.success(response.data.message);
          setDepartments(departments.filter(dept => dept.DepartmentId !== DepartmentId));
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error('Failed to delete department. Please try again.');
      }
    }
  };

  return (  
    <div className="container mt-5">
      <Toaster />
      <button type="button" className="btn btn-primary mb-3"  onClick={handleAdd}>
        Add Department
        {/* style={{backgroundColor:"#00A36C",borderColor:"#00A36C"}} */}
      </button>

      {showForm && (
        <div className="popup-overlay" onClick={() => setShowForm(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h5 className="card-title" id='card-tit'>{editIndex !== null ? 'Update Department' : 'Add Department'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="DepartmentId" className="form-label">Department ID</label>
                <input type="text" id="DepartmentId" name="DepartmentId" value={formData.DepartmentId} onChange={handleInputChange} className="form-control" required />
                {validationErrors.DepartmentId && <span className="text-danger">{validationErrors.DepartmentId}</span>}
              </div>
              <div className="mb-3">
                <label htmlFor="DepartmentName" className="form-label">Department Name</label>
                <input type="text" id="DepartmentName" name="DepartmentName" value={formData.DepartmentName} onChange={handleInputChange} className="form-control" required />
                {validationErrors.DepartmentName && <span className="text-danger">{validationErrors.DepartmentName}</span>}
              </div>
              <div className='Container-updated'>
              <button type="submit" className="btn btn-success btn-update">{editIndex !== null ? 'Update' : 'Save'}</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className='dept'>Department List</p>
      <div className="row">
        {departments.length > 0 ? (
          departments.map((department, index) => (
            <div className="col-md-4 mb-4" key={department.DepartmentId}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Department ID: {department.DepartmentId}</h5>
                  <p className="card-text">Department Name: {department.DepartmentName}</p>
                  <button onClick={() => handleEdit(index)} className="btn btn-warning btn-sm me-2"><i class="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(department.DepartmentId, department.DepartmentName)} className="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            {/* <div className="alert alert-warning text-center">No departments found</div> */}
          </div>
        )}
      </div>
    </div>
  );
}
