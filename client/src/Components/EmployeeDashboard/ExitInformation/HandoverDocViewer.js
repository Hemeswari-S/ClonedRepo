// HandoverDocViewer.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RestAPIURL } from '../../../Config/Settings';

const APIUrl=`${RestAPIURL}/empexitinfos/`;

const HandoverDocViewer = ({ employeeId }) => {
  const [handoverDocUrl, setHandoverDocUrl] = useState('');
  const [error, setError] = useState('');
  const [idProof1Blob, setIdProof1Blob] = useState('');


  useEffect(() => {
    const fetchHandoverDoc = async () => {
      try {
        const response = await axios.get(`${APIUrl}get/${employeeId}/handoverdocumentation`, {
          responseType: 'blob', // Specify the response type as blob for binary data
        });

        if (response.status === 200) {
          // Create a URL for the blob data
          const file = new Blob([response.data], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(file);
          setHandoverDocUrl(fileUrl);
          setError('');
        }
      } catch (error) {
        console.error('Error fetching handover documentation:', error);
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError('Failed to fetch handover documentation');
        }
      }
    };

    fetchHandoverDoc();
  }, [employeeId]);

  return (
    <div>
      {handoverDocUrl ? (
        <iframe title="Handover Documentation" src={handoverDocUrl} width="100%" height="600px" />
      ) : (
        <p>{error ? error : 'Loading handover documentation...'}</p>
      )}
    </div>
  );
};

export default HandoverDocViewer;
