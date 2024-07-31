import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'antd';
import DependentList from './DependentList';
import UpdateDependent from './UpdateDependent';
import AddDependent from './AddDependent';
import { sessionManager } from '../../../Config/sessionmanager';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';
import './Dependent.css'; 

const APIUrl = `${RestAPIURL}/empdependentinfos/`;

const DependentInfo = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [selectedDependent, setSelectedDependent] = useState(null);
    const [dependents, setDependents] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    useEffect(() => {
        const fetchEmployeeId = () => {
            const employeeId = sessionManager.getEmployeeId();
            if (employeeId) {
                setEmployeeId(employeeId);
                fetchDependents(employeeId);
            } else {
                console.error('Error fetching employee ID from session');
            }
        };

        fetchEmployeeId();
    }, []);

    const fetchDependents = async (employeeId) => {
        try {
            const response = await axios.get(`${APIUrl}get/${employeeId}`);
            setDependents(response.data);
        } catch (error) {
            console.error('Error fetching dependents:', error);
        }
    };

    const handleDependentAdded = (newDependent) => {
        setDependents([...dependents, newDependent]);
        setIsAddModalVisible(false);
    };

    const handleDependentUpdated = (updatedDependent) => {
        setDependents(dependents.map(dep => dep._id === updatedDependent._id ? updatedDependent : dep));
        setSelectedDependent(null);
        setIsEditModalVisible(false);
    };

    const handleDependentDeleted = (deletedDependentId) => {
        setDependents(dependents.filter(dep => dep._id !== deletedDependentId));
    };

    const handleEditDependent = (dependent) => {
        setSelectedDependent(dependent);
        setIsEditModalVisible(true);
    };

    const handleCancelEdit = () => {
        setSelectedDependent(null);
        setIsEditModalVisible(false);
    };

    return (
        <div className="dependent-info">
            <p id='emp-dep'>Employee Dependents</p>
            {employeeId ? (
                <>
                    {dependents.length < 3 && (
                        <div className="add-dependent-button">
                            <Button id='add-dep'
                                type="primary"
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Dependent
                            </Button>
                        </div>
                    )}
                    <DependentList
                        dependents={dependents}
                        employeeId={employeeId}
                        onEditDependent={handleEditDependent}
                        onDeleteDependent={handleDependentDeleted}
                    />
                    <AddDependent
                        employeeId={employeeId}
                        onDependentAdded={handleDependentAdded}
                        onCancel={() => setIsAddModalVisible(false)}
                        visible={isAddModalVisible}
                    />
                    <UpdateDependent
                        employeeId={employeeId}
                        dependent={selectedDependent}
                        onDependentUpdated={handleDependentUpdated}
                        onCancel={handleCancelEdit}
                        visible={isEditModalVisible}
                    />
                </>
            ) : (
                <div>Loading employee information...</div>
            )}
        </div>
    );
};

export default DependentInfo;
