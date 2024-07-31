import React, { useEffect, useState } from "react";
import { Button, List, Modal } from "antd";
import axios from "axios";
import { sessionManager } from "../../../Config/sessionmanager.js";
import { RestAPIURL } from "../../../Config/Settings.js";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


export default function EmpDocsUser() {
    const [documents, setDocuments] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewDocument, setPreviewDocument] = useState(null);
    const empId = sessionManager.getEmployeeId();
  
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${RestAPIURL}/Empdocument/singledocument/${empId}`
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
    const handlePreview = (document) => {
        setPreviewDocument(document);
        setPreviewVisible(true);
      };
    const handleCancelPreview = () => {
        setPreviewVisible(false);
        setPreviewDocument(null);
      };
  return (
    <>
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
              // <Button type="link" style={{color:'red'}} icon={<DeleteOutlined />}></Button>
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
   
    </>
  )
}
