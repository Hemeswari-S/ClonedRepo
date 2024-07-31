import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";


const FileDisplayComponent = ({ fileData }) => {
  if (!fileData) return null; // Handle case where fileData is not present or loading

  const { contentType, fileData: file } = fileData;

  if (!file) return null; // Handle case where file is not present or loading

  // Assuming fileData is base64 encoded string
  const url = `data:${contentType};base64,${file}`;

  return (
    <div>
      <a href={url} download="filename">Download File</a>
      <embed src={url} type={contentType} />
    </div>
  );
};

export default FileDisplayComponent;
