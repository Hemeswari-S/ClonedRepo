import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Card, Col, Row } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import './Dependent.css';
import { RestAPIURL } from '../../../Config/Settings';

const { confirm } = Modal;
const APIUrl = `${RestAPIURL}/empdependentinfos/`;

const DependentList = ({ dependents, employeeId, onEditDependent, onDeleteDependent }) => {
    const [visible, setVisible] = useState(false);
    const [selectedDependent, setSelectedDependent] = useState(null);

    const showModal = (dependent) => {
        setSelectedDependent(dependent);
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
        setSelectedDependent(null);
    };

    const handleCancel = () => {
        setVisible(false);
        setSelectedDependent(null);
    };

    const showDeleteConfirm = (dependent) => {
        confirm({
            title: 'Are you sure you want to delete this dependent?',
            icon: <ExclamationCircleOutlined />,
            content: `${dependent.FirstName} ${dependent.LastName}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDelete(dependent);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleDelete = async (dependent) => {
        try {
            const response = await axios.delete(`${APIUrl}delete/${employeeId}/${dependent._id}`);
            console.log('Dependent deleted:', response.data);
            onDeleteDependent(dependent._id);
            Modal.success({
                title: 'Success',
                content: 'Dependent has been deleted successfully.',
            });
        } catch (error) {
            console.error('Error deleting dependent:', error);
            Modal.error({
                title: 'Error',
                content: 'There was an error deleting the dependent. Please try again.',
            });
        }
    };

    return (
        <div>
            <Row gutter={16}>
                {dependents.map((dependent) => (
                    <Col span={8} key={dependent._id}>
                        <Card
                            title={`${dependent.FirstName} ${dependent.LastName}`}
                            extra={
                                <div>
                                    <Button id='view-dependent'
                                        icon={<EyeOutlined />}
                                        onClick={() => showModal(dependent)}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Button id='edit-dependent'
                                        icon={<EditOutlined />}
                                        onClick={() => onEditDependent(dependent)}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Button id='del-dependent'
                                        icon={<DeleteOutlined />}
                                        onClick={() => showDeleteConfirm(dependent)}
                                        danger
                                    />
                                </div>
                            }
                        >
                            <p><strong>Relation Type:</strong> {dependent.RelationType}</p>
                            <p><strong>Date of Birth:</strong> {new Date(dependent.DateOfBirth).toLocaleDateString()}</p>
                            <p><strong>Contact Number:</strong> {dependent.ContactNumber}</p>
                            <p><strong>Gender:</strong> {dependent.Gender}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title="Dependent Details"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Close
                    </Button>
                ]}
            >
                {selectedDependent && (
                    <div>
                        <p><strong>First Name:</strong> {selectedDependent.FirstName}</p>
                        <p><strong>Last Name:</strong> {selectedDependent.LastName}</p>
                        <p><strong>Relation Type:</strong> {selectedDependent.RelationType}</p>
                        <p><strong>Date of Birth:</strong> {new Date(selectedDependent.DateOfBirth).toLocaleDateString()}</p>
                        <p><strong>Contact Number:</strong> {selectedDependent.ContactNumber}</p>
                        <p><strong>Gender:</strong> {selectedDependent.Gender}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DependentList;
