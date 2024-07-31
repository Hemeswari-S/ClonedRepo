import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import ExperienceList from './ExperienceList';
import AddExperience from './AddExperience';
import { sessionManager } from '../../../Config/sessionmanager';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';
import styles from './ExperienceList.module.css';
const APIUrl = `${RestAPIURL}/empexperienceinfos/`;

const ExperienceInfo = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [experiences, setExperiences] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState(null);

    useEffect(() => {
        const fetchEmployeeId = () => {
            const employeeId = sessionManager.getEmployeeId();
            if (employeeId) {
                setEmployeeId(employeeId);
                fetchExperiences(employeeId);
            } else {
                console.error('Error fetching employee ID from session');
            }
        };

        fetchEmployeeId();
    }, []);

    const fetchExperiences = async (employeeId) => {
        try {
            const response = await axios.get(`${APIUrl}get/${employeeId}`);
            setExperiences(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            setExperiences([]); // Ensure experiences is an array on error
        }
    };

    const handleExperienceAdded = (newExperience) => {
        setExperiences([...experiences, newExperience]);
        setIsAddModalVisible(false);
    };

    const handleExperienceUpdated = (updatedExperience) => {
        setExperiences(experiences.map(exp => exp._id === updatedExperience._id ? updatedExperience : exp));
        setIsEditModalVisible(false);
    };

    const handleExperienceDeleted = (deletedExperienceId) => {
        setExperiences(experiences.filter(exp => exp._id !== deletedExperienceId));
    };

    const handleEditExperience = (experience) => {
        setSelectedExperience(experience);
        setIsEditModalVisible(true);
    };

    return (
        <div className="experience-info">
            <p style={{fontSize:"30px",fontFamily:"Times New Roman",textAlign:"center"}}>Employee Experiences</p>
            {employeeId ? (
                <>
                    <div className={styles.addexpbtn}>
                        <Button className={styles.addExperienceButton} 
                            type="primary"
                            onClick={() => setIsAddModalVisible(true)}
                        >
                            Add Experience
                        </Button>
                    </div>
                    <ExperienceList
                        experiences={experiences}
                        employeeId={employeeId}
                        onEditExperience={handleEditExperience}
                        onDeleteExperience={handleExperienceDeleted}
                    />
                    <AddExperience
                        employeeId={employeeId}
                        onExperienceAdded={handleExperienceAdded}
                        onCancel={() => setIsAddModalVisible(false)}
                        visible={isAddModalVisible}
                    />
                    
                </>
            ) : (
                <div>Loading employee information...</div>
            )}
        </div>
    );
};

export default ExperienceInfo;
