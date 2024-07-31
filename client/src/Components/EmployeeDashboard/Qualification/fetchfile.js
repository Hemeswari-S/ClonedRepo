import React from 'react'



export default function fetchfile({ employeeId, qualificationId, fileName }) {

    const fetchFileData = async (employeeId, qualificationId, fileName) => {
        const response = await fetch(`/api/employees/${employeeId}/qualification/${qualificationId}/file/${fileName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const fileData = await response.json();
        return fileData;
    };

        const [file, setFile] = useState(null);

        useEffect(() => {
            const getFileData = async () => {
                try {
                    const fileData = await fetchFileData(employeeId, qualificationId, fileName);
                    setFile(fileData);
                } catch (error) {
                    console.error('Error fetching file data:', error);
                }
            };

            getFileData();
        }, [employeeId, qualificationId, fileName]);

        if (!file) {
            return <p>Loading file...</p>;
        }
        return (
            <div>
                <p><strong>File Name:</strong> {file.fileName}</p>
                <p><strong>Content Type:</strong> {file.contentType}</p>
                <a href={`data:${file.contentType};base64,${file.data}`} download={file.fileName}>
                    Download File
                </a>
                <embed src={`data:${file.contentType};base64,${file.data}`} width="500" height="600" />
            </div>
        );
    
}
