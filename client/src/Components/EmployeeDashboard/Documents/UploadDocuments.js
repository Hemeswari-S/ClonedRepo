import React, { useEffect, useState } from "react";
import { Button, Upload, List, Modal } from "antd";
import { DeleteOutlined, DragOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { sessionManager } from "../../../Config/sessionmanager.js";
import { Styles } from "../../../Config/Colors.js";
import { RestAPIURL } from "../../../Config/Settings.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


export const UploadDocuments = ({employeeId}) => {
  const [fileList, setFileList] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${RestAPIURL}/Empdocument/singledocument/${employeeId}`
      );
      setDocuments(response.data.singleEmpdocument[0].files);
      console.log(response.data.singleEmpdocument[0].files);
    } catch (error) {
      toast.error(`Failed to fetch documents: ${error.message}`);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const beforeUpload = (file) => {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
      toast.error("You can only upload PDF files!");
    }
    return isPDF || Upload.LIST_IGNORE;
  };

  const handleChange = ({ fileList }) => {
    debugger
    if (fileList.length > 5) {
      toast.error("You can only upload up to 5 files!");
      setFileList(fileList.slice(0, 5));
    } else {
      setFileList(fileList);
    }
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const response = await axios.put(
        `${RestAPIURL}/Empdocument/updateDoc/${employeeId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast(response.data.message);
      setFileList([]);
      fetchData(); 
    } catch (error) {
      toast.error(`File upload failed: ${error.message}`);
    }
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
    setPreviewDocument(null);
  };
  const deleteFile = async (fileId) => {
    try {
      console.log('delete');
      console.log(fileId);
      await axios.delete(`${RestAPIURL}/Empdocument/employee/${employeeId}/file/${fileId}`);
      toast.success('File deleted successfully');
      fetchData();
      
    } catch (error) {
      console.error('Failed to delete file', error);
      toast.error('Failed to delete file');
    }
  };
  return (
    <div style={{width:'70%',margin:'auto'}}>
      <div
        style={{
          border: `${Styles.VarGreen2} dashed 2px`,
          borderRadius: "4px",
          backgroundColor: Styles.VarlightGreen3,
          textAlign: "center",
        }}
      >
        <Dragger
          accept=".pdf"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          fileList={fileList}
          multiple
        >
          <p className="ant-upload-drag-icon">
            <DragOutlined twoToneColor={Styles.VarGreen2} />
          </p>
          <p className="ant-upload-text">
            Click or drag your files to this area to upload
          </p>
          <p className="ant-upload-hint">Support for up to 5 PDF files only.</p>
        </Dragger>
        {fileList.length > 0 && (
          <Button
            type="primary"
            onClick={handleUpload}
            style={{ marginTop: "16px" }}
          >
            Upload Files
          </Button>
        )}
      </div>

      <hr />

      <List
        header={<b>Employee Documents</b>}
        bordered
        dataSource={documents}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handlePreview(item)}>
                Preview
              </Button>,
              <Button type="text" style={{color:'red'}} onClick={()=>{deleteFile(item._id)}} icon={<DeleteOutlined />}></Button>
            ]}
          >
            {item.originalname}
          </List.Item>
        )}
      />

      <Modal
        open={previewVisible}
        title="Document Preview"
        footer={null}
        onCancel={handleCancelPreview}
      >
        {previewDocument && (
          <embed
            src={`data:${previewDocument.mimetype};base64,${btoa(
              new Uint8Array(previewDocument.buffer.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )}`}
            type={previewDocument.mimetype}
            width="100%"
            height="500px"
          />
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};
