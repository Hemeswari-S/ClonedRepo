import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Input, Select } from 'antd';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';

const APIUrl = `${RestAPIURL}/empdependentinfos/`;

const AddDependent = ({ employeeId, onDependentAdded, onCancel, visible }) => {
    const [dependent, setDependent] = useState({
        EmployeeId: employeeId,
        FirstName: '',
        LastName: '',
        RelationType: '',
        DateOfBirth: '',
        ContactNumber: '',
        Gender: 'Male',
    });

    const handleChange = (e) => {
        setDependent({ ...dependent, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${APIUrl}add/${employeeId}`, dependent);
            onDependentAdded(response.data);
            setDependent({
                EmployeeId: employeeId,
                FirstName: '',
                LastName: '',
                RelationType: '',
                DateOfBirth: '',
                ContactNumber: '',
                Gender: 'Male',
            });
            onCancel(); // Close the modal after successful addition
        } catch (error) {
            console.error('Error adding dependent:', error);
        }
    };

    return (
        <Modal
            title="Add Dependent"
            visible={visible}
            onCancel={onCancel} 
            footer={null}
        >
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="First Name" name="FirstName" rules={[{ required: true, message: 'Please enter first name' }]}>
                    <Input name="FirstName" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Last Name" name="LastName" rules={[{ required: true, message: 'Please enter last name' }]}>
                    <Input name="LastName" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Relation Type" name="RelationType" rules={[{ required: true, message: 'Please enter relation type' }]}>
                    <Input name="RelationType" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Date of Birth" name="DateOfBirth" rules={[{ required: true, message: 'Please select date of birth' }]}>
                    <Input type="date" name="DateOfBirth" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Contact Number" name="ContactNumber" rules={[{ required: true, message: 'Please enter contact number' }]}>
                    <Input name="ContactNumber" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Gender" name="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
                    <Select name="Gender" onChange={(value) => handleChange({ target: { name: 'Gender', value } })}>
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                        <Select.Option value="Other">Other</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Dependent
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddDependent;
