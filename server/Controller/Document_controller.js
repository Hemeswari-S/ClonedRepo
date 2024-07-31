import { employeedocument } from '../Model/EmpDocuments_model.js';

export const uploadFiles = async (req, res) => {
    try {
        const EmpId = req.body.employeeID
        const files = req.files.map(file => ({
            employeeID: EmpId,
            filename: file.originalname,
            conentType: file.mimetype,
            data: file.buffer
        }));

        const savedFiles = await employeedocument.create(files);

        res.json(savedFiles);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export const getFilesForEmployee = async (req, res) => {
    try {
        const employeeID = req.params;
        const files = await employeedocument.find(employeeID);
        res.send(files);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

