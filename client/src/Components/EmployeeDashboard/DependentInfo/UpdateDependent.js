import React, { useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Input, Select } from 'antd';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';

const APIUrl = `${RestAPIURL}/empdependentinfos/`;

const UpdateDependent = ({ employeeId, dependent, onDependentUpdated, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (dependent) {
            const formattedDependent = {
                ...dependent,
                DateOfBirth: dependent.DateOfBirth ? dependent.DateOfBirth.split('T')[0] : null, // Format the date correctly
            };
            form.setFieldsValue(formattedDependent);
        } else {
            form.resetFields();
        }
    }, [dependent, form]);

    const handleSubmit = async (values) => {
        try {
            const response = await axios.put(`${APIUrl}update/${employeeId}/${dependent._id}`, values);
            onDependentUpdated(response.data);
        } catch (error) {
            console.error('Error updating dependent:', error);
        }
    };

    return (
        <Modal
            title="Update Dependent"
            visible={!!dependent}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="First Name"
                    name="FirstName"
                    rules={[{ required: true, message: 'Please enter first name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="LastName"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Relation Type"
                    name="RelationType"
                    rules={[{ required: true, message: 'Please enter relation type' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Date of Birth"
                    name="DateOfBirth"
                    rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                    <Input type="date" />
                </Form.Item>
                <Form.Item
                    label="Contact Number"
                    name="ContactNumber"
                    rules={[{ required: true, message: 'Please enter contact number' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Gender"
                    name="Gender"
                    rules={[{ required: true, message: 'Please select gender' }]}
                >
                    <Select>
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                        <Select.Option value="Other">Other</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Dependent
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateDependent;
