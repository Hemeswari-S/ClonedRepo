import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Card, Col, Row, Typography, Input, Upload, notification } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { sessionManager } from '../../../Config/sessionmanager';
import styles from './PlansandGoals.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { RestAPIURL } from '../../../Config/Settings';

const APIUrl = `${RestAPIURL}/PlansandGoals/`;
console.log('API URL:', APIUrl);

const { confirm } = Modal;
const { Text } = Typography;
const { TextArea } = Input;

const PlansAndGoalsInfo = () => {
    const [plansAndGoals, setPlansAndGoals] = useState([]);
    const [newGoal, setNewGoal] = useState('');
    const [file, setFile] = useState(null);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [viewGoal, setViewGoal] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchPlansAndGoals();
    }, []);

    useEffect(() => {
        document.body.style.overflow = showFormModal || showViewModal ? 'hidden' : 'auto';
    }, [showFormModal, showViewModal]);

    const fetchPlansAndGoals = async () => {
        try {
            const EmployeeId = sessionManager.getEmployeeId();
            const response = await axios.get(`${APIUrl}get/${EmployeeId}`);
            setPlansAndGoals(response.data);
        } catch (error) {
            console.error('Error fetching plans and goals:', error);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleAddGoal = () => {
        setSelectedGoalId(null); // Reset the selectedGoalId to null when adding a new goal
        setNewGoal('');
        setFile(null);
        setShowFormModal(true);
    };

    const handleCloseFormModal = () => {
        setShowFormModal(false);
    };

    const handleSubmitGoal = async () => {
        try {
            const EmployeeId = sessionManager.getEmployeeId();
            const formData = new FormData();
            formData.append('Goal', newGoal);
            if (file) {
                formData.append('Plan', file);
            }

            console.log('Submitting formData:', ...formData); // Debug: log the FormData to check its contents

            if (selectedGoalId) {
                await axios.put(`${APIUrl}update/${selectedGoalId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post(`${APIUrl}add/${EmployeeId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            setNewGoal('');
            setFile(null);
            setSelectedGoalId(null);
            setShowFormModal(false);
            fetchPlansAndGoals();
            notification.success({
                message: 'Success',
                description: 'Goal has been added/updated successfully.',
            });
        } catch (error) {
            console.error('Error submitting goal:', error.response || error.message || error); // Improved error logging
            notification.error({
                message: 'Error',
                description: 'There was an error submitting the goal. Please try again.',
            });
        }
    };

    const handleEditGoal = (goalId) => {
        setSelectedGoalId(goalId);
        const goal = plansAndGoals.find(goal => goal._id === goalId);
        setNewGoal(goal.Goal);
        setFile(null);
        setShowFormModal(true);
    };

    const handleDeleteGoal = (goalId) => {
        confirm({
            title: 'Are you sure you want to delete this goal?',
            icon: <DeleteOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                markGoalAsDeleted(goalId);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const markGoalAsDeleted = async (goalId) => {
        try {
            const response = await axios.delete(`${APIUrl}delete/${goalId}`);
            console.log('Delete response:', response.data);
            fetchPlansAndGoals();
            notification.success({
                message: 'Success',
                description: 'Goal has been marked as deleted successfully.',
            });
        } catch (error) {
            console.error('Error marking goal as deleted:', error.response || error.message || error);
            notification.error({
                message: 'Error',
                description: 'There was an error marking the goal as deleted. Please try again.',
            });
        }
    };

    const handleViewFile = async (employeeId, goalId) => {
        try {
            const url = `${APIUrl}get/file/${employeeId}/${goalId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const blob = await response.blob();
            const fileURL = URL.createObjectURL(blob);

            window.open(fileURL);
        } catch (error) {
            console.error('Error viewing file:', error);
        }
    };

    const handleViewGoal = (goal) => {
        setViewGoal(goal);
        setShowViewModal(true);
    };

    const handleCloseViewGoal = () => {
        setShowViewModal(false);
        setViewGoal(null);
    };

    const truncateGoal = (goal, length = 100) => {
        if (goal.length > length) {
            return goal.substring(0, length) + '...';
        }
        return goal;
    };

    return (
        <div className={styles.plansAndGoals}>
            <p style={{color:"#000080",fontFamily:"Times New Roman",fontSize:"20px",textAlign:"center"}}>Plans and Goals Management</p>
            <div className={styles.container}>
                <Button
                    className={styles.addGoalButton}
                    type="primary"
                    size="middle"
                    onClick={handleAddGoal}
                >
                     Add Goal
                </Button>

                <Row gutter={[16, 16]}>
                    {plansAndGoals.map((goal, index) => (
                        <Col span={8} key={goal._id}>
                            <Card
                                className={`${styles.goalCard} ${goal.isDeleted ? styles.deletedCard : ''}`}
                                title={<Text strong>Goal {index + 1}</Text>}
                                extra={
                                    <div>
                                        <Button
                                            icon={<EyeOutlined />}
                                            onClick={() => handleViewGoal(goal)}
                                            style={{ marginRight: 8 }}
                                            className={styles.viewButton}
                                        />
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={() => handleEditGoal(goal._id)}
                                            style={{ marginRight: 8 }}
                                            disabled={goal.isDeleted}
                                            className={styles.editButton}
                                        />
                                        <Button
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDeleteGoal(goal._id)}
                                            style={{ marginRight: 8 }}
                                            disabled={goal.isDeleted}
                                            className={styles.deleteButton}
                                        />
                                    </div>
                                }
                                style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                            >
                                <Text>{truncateGoal(goal.Goal)}</Text>
                                <div className={styles.fileLinkWrapper}>
                                    <Button
                                        onClick={() => handleViewFile(sessionManager.getEmployeeId(), goal._id)}
                                        className={styles.viewFileLink}
                                        disabled={goal.isDeleted}
                                        type="link"
                                    >
                                        View Plan
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <Modal
                title={selectedGoalId ? 'Edit Goal' : 'Add New Goal'}
                visible={showFormModal}
                onOk={handleSubmitGoal}
                onCancel={handleCloseFormModal}
                okText="Submit"
                cancelText="Cancel"
                className={styles.formModal}
            >
                <div>
                    <label htmlFor="goal">Goal:</label>
                    <TextArea
                        id="goal"
                        rows={4}
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                    />
                    <Upload
                        showUploadList={false}
                        beforeUpload={(file) => {
                            setFile(file);
                            return false;
                        }}
                    >
                        <Button
                            icon={<UploadOutlined />}
                            style={{ marginTop: 16 }}
                        >
                            Upload File
                        </Button>
                    </Upload>
                </div>
            </Modal>

            <Modal
                title="View Goal"
                visible={showViewModal}
                onCancel={handleCloseViewGoal}
                footer={null}
                width={800}
            >
                {viewGoal && (
                    <div>
                        <Typography.Title level={2}>Goal</Typography.Title>
                        <Text>{viewGoal.Goal}</Text>
                        <Button
                            onClick={() => handleViewFile(sessionManager.getEmployeeId(), viewGoal._id)}
                            style={{ marginTop: 16 }}
                            type="link"
                        >
                            View Plan
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PlansAndGoalsInfo;
