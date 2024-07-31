import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Input, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import styles from './ExperienceList.module.css'; 
import { RestAPIURL } from '../../../Config/Settings';

const APIUrl = `${RestAPIURL}/empexperienceinfos/`;

const AddExperience = ({ employeeId, onExperienceAdded, onCancel, visible }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (key !== 'experienceLetter' && key !== 'offerLetter' && key !== 'relievingLetter') {
                    formData.append(key, values[key]);
                }
            });

            // Append files to formData
            const files = form.getFieldsValue(['experienceLetter', 'offerLetter', 'relievingLetter']);

            if (files.experienceLetter && files.experienceLetter.fileList[0]) {
                formData.append('experienceLetter', files.experienceLetter.fileList[0].originFileObj);
            }
            if (files.offerLetter && files.offerLetter.fileList[0]) {
                formData.append('offerLetter', files.offerLetter.fileList[0].originFileObj);
            }
            if (files.relievingLetter && files.relievingLetter.fileList[0]) {
                formData.append('relievingLetter', files.relievingLetter.fileList[0].originFileObj);
            }

            console.log('Submitting form data:', formData);
            const response = await axios.post(`${APIUrl}add/${employeeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onExperienceAdded(response.data);
            form.resetFields();
            onCancel();
        } catch (error) {
            console.error('Error adding experience:', error);
        }
    };

    return (
        <Modal
            title="Add Experience" 
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Position" name="position" rules={[{ required: true, message: 'Please enter position' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: 'Please enter company name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Joining Date" name="joiningDate" rules={[{ required: true, message: 'Please select joining date' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="Last Date" name="lastDate" rules={[{ required: true, message: 'Please select last date' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="Employment Type" name="employmentType" rules={[{ required: true, message: 'Please enter employment type' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Salary" name="salary" rules={[{ required: true, message: 'Please enter salary' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Company Address" name="companyAddress" rules={[{ required: true, message: 'Please enter company address' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Contact Number" name="contactNumber" rules={[{ required: true, message: 'Please enter contact number' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Experience Letter" name="experienceLetter">
                    <Upload beforeUpload={() => false} listType="text">
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="Offer Letter" name="offerLetter">
                    <Upload beforeUpload={() => false} listType="text">
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="Relieving Letter" name="relievingLetter">
                    <Upload beforeUpload={() => false} listType="text">
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary" 
                        htmlType="submit" 
                    >
                        Add Experience
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddExperience;
