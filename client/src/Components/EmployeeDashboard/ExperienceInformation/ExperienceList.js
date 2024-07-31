import React, { useState } from 'react';
import { Modal, Button, Card, Col, Row } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';
import styles from './ExperienceList.module.css';

const APIUrl = `${RestAPIURL}/empexperienceinfos/`;

const ExperienceList = ({ experiences, employeeId }) => {
    const [visible, setVisible] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState(null);

    const showModal = (experience) => {
        setSelectedExperience(experience);
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
        setSelectedExperience(null);
    };

    const handleCancel = () => {
        setVisible(false);
        setSelectedExperience(null);
    };

    const openFile = (type, experienceId) => {
        const url = `${APIUrl}view/${employeeId}/${experienceId}/${type}`;
        console.log("Opening URL:", url);  // Log the URL
        window.open(url, '_blank');
    };

    return (
        <div>
            <Row gutter={16}>
                {experiences.map((experience) => (
                    <Col span={8} key={experience._id}>
                        <Card
                            className={styles.experienceCard}
                            title={<span className={styles.cardTitle}>{experience.companyName}</span>}
                            extra={
                                <Button
                                    className={styles.experienceButton}
                                    icon={<EyeOutlined />}
                                    onClick={() => showModal(experience)}
                                />
                            }
                        >
                            <Button
                                className={styles.expbtn}
                                onClick={() => openFile('experienceLetter', experience._id)}
                                block
                            >
                                Experience Letter
                            </Button>
                            <Button
                                className={styles.offerbtn}
                                onClick={() => openFile('offerLetter', experience._id)}
                                block
                            >
                                Offer Letter
                            </Button>
                            <Button
                                className={styles.relivingbtn}
                                onClick={() => openFile('relievingLetter', experience._id)}
                                block
                            >
                                Relieving Letter
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title={<span className={styles.modalTitle}>Experience Details</span>}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Close
                    </Button>
                ]}
            >
                {selectedExperience && (
                    <div className={styles.modalContent}>
                        <p><strong>Position:</strong> {selectedExperience.position}</p>
                        <p><strong>Company Name:</strong> {selectedExperience.companyName}</p>
                        <p><strong>Joining Date:</strong> {new Date(selectedExperience.joiningDate).toLocaleDateString()}</p>
                        <p><strong>Last Date:</strong> {new Date(selectedExperience.lastDate).toLocaleDateString()}</p>
                        <p><strong>Employment Type:</strong> {selectedExperience.employmentType}</p>
                        <p><strong>Salary:</strong> {selectedExperience.salary}</p>
                        <p><strong>Company Address:</strong> {selectedExperience.companyAddress}</p>
                        <p><strong>Contact Number:</strong> {selectedExperience.contactNumber}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ExperienceList;
