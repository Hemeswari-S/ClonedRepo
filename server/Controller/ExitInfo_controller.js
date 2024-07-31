import { EmpExitManagement } from '../Model/EmpExitManagement_model.js';

// Add Exit Management
const AddExitInfo = async (req, res) => {
  try {
    const {
      EmployeeId, EmpName, exitDate, reasonForExit, resignationNoticeDate,
      exitInterviewDate, lastWorkingDay, finalSettlementdetails, feedBack,
      exitProcessManager, exitType
    } = req.body;

    const newExitManagement = new EmpExitManagement({
      EmployeeId, EmpName, exitDate, reasonForExit, resignationNoticeDate,
      exitInterviewDate, lastWorkingDay, finalSettlementdetails, feedBack,
      exitProcessManager, exitType,
      UploadDocumentation: req.files ? req.files.map(file => ({
        contentType: file.mimetype,
        fileData: file.buffer
      })) : [],
    });

    await newExitManagement.save();
    res.status(201).json(newExitManagement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new exit info
export const newAddExitInfo = async (req, res) => {
  try {
    const data = await EmpExitManagement.create(req.body);
    console.log(req.body);
    res.json("success");
  }
  catch (error) {
    console.error('Error adding exit info:', error);
    res.status(500).json({ error: 'Failed to add exit information' });
  }
}

// Upload File (Update handover documentation)
const uploadFileexit = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Handle handover documentation file upload
    if (req.files && req.files.length > 0) {
      const UploadDocumentation = req.files.map(file => ({
        contentType: file.mimetype,
        fileData: file.buffer,
      }));

      await EmpExitManagement.findByIdAndUpdate(employeeId, { $push: { UploadDocumentation: { $each: UploadDocumentation } } });

      const updatedExitInfo = await EmpExitManagement.findById(employeeId);
      return res.json(updatedExitInfo);
    }

    return res.status(400).json({ error: "No handover documentation file found" });
  } catch (error) {
    console.error('Error uploading Upload documentation:', error);
    res.status(500).send('Failed to upload Upload Documentation.');
  }
};

// Get all exit info
const GetExitInfo = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const exitManagement = await EmpExitManagement.findOne({ EmployeeId: employeeId });

    if (!exitManagement) {
      return res.status(404).json({ error: "Exit management entry not found" });
    }

    res.status(200).json(exitManagement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get exit info by employee ID
const GetEmpExitInfo_by_id = async (req, res) => {
  try {
    const exitInfo = await EmpExitManagement.findOne({ EmployeeId: req.params.employeeId });
    res.json(exitInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exit info' });
  }
};

// Get handover document by employee ID
const GetHandOverDoc = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const exitInfo = await EmpExitManagement.findOne({ EmployeeId: employeeId });

    if (!exitInfo) {
      return res.status(404).json({ message: `Exit info not found for EmployeeId: ${employeeId}` });
    }

    // Assuming UploadDocumentation is an array of { contentType: 'application/pdf', fileData: Buffer }
    if (exitInfo.UploadDocumentation && exitInfo.UploadDocumentation.length > 0) {
      const file = exitInfo.UploadDocumentation[0]; // Here you can adjust to send a specific file if needed
      res.setHeader('Content-Type', file.contentType);
      return res.send(file.fileData);
    }

    res.status(404).json({ message: 'No handover documentation found' });
  } catch (error) {
    console.error('Error fetching handover documentation:', error);
    res.status(500).json({ message: 'Error fetching handover documentation' });
  }
};

//get by fileid
const GetHandOverDocById = async (req, res) => {
    const { employeeId, fileId } = req.params;
  
    try {
      const exitInfo = await EmpExitManagement.findOne({ EmployeeId: employeeId });
  
      if (!exitInfo) {
        return res.status(404).json({ message: `Exit info not found for EmployeeId: ${employeeId}` });
      }
  
      const file = exitInfo.UploadDocumentation.id(fileId);
      if (!file) {
        return res.status(404).json({ message: `File not found for FileId: ${fileId}` });
      }
  
      res.setHeader('Content-Type', file.contentType);
      res.setHeader('Content-Disposition', 'inline');
      res.send(file.fileData);
    } catch (error) {
      console.error('Error fetching handover documentation:', error);
      res.status(500).json({ message: 'Error fetching handover documentation' });
    }
  };
  

// Update exit info
const updateExitInfo = async (req, res) => {
  const { employeeId } = req.params;
  const {
    exitDate,
    reasonForExit,
    resignationNoticeDate,
    exitInterviewDate,
    lastWorkingDay,
    finalSettlementdetails,
    feedBack,
    exitProcessManager,
    exitType,
  } = req.body;

  try {
    let updateData = {
      exitDate,
      reasonForExit,
      resignationNoticeDate,
      exitInterviewDate,
      lastWorkingDay,
      finalSettlementdetails,
      feedBack,
      exitProcessManager,
      exitType,
    };

    if (req.files && req.files.length > 0) {
      updateData.UploadDocumentation = req.files.map(file => ({
        contentType: file.mimetype,
        fileData: file.buffer
      }));
    }

    const updatedExitInfo = await EmpExitManagement.findOneAndUpdate(
      { EmployeeId: employeeId },
      updateData,
      { new: true }
    );

    if (!updatedExitInfo) {
      return res.status(404).json({ message: `Exit info not found for EmployeeId: ${employeeId}` });
    }

    res.status(200).json(updatedExitInfo);
  } catch (error) {
    console.error('Error updating exit info:', error);
    res.status(500).json({ message: 'Failed to update exit info', error: error.message });
  }
};

// Update exit info by ID
const updateExitInfoById = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      exitDate, reasonForExit, resignationNoticeDate, exitInterviewDate,
      lastWorkingDay, finalSettlementdetails, feedBack, exitProcessManager, exitType,
    } = req.body;

    let updatedData = {
      exitDate, reasonForExit, resignationNoticeDate, exitInterviewDate,
      lastWorkingDay, finalSettlementdetails, feedBack, exitProcessManager, exitType,
    };

    if (req.files && req.files.length > 0) {
      updatedData.UploadDocumentation = req.files.map(file => ({
        contentType: file.mimetype,
        fileData: file.buffer
      }));
    }

    const exitInfo = await EmpExitManagement.findOneAndUpdate(
      { EmployeeId: employeeId },
      updatedData,
      { new: true }
    );

    if (!exitInfo) {
      return res.status(404).json({ message: `Exit info not found for EmployeeId: ${employeeId}` });
    }

    res.json(exitInfo);
  } catch (error) {
    console.error('Error updating exit info:', error);
    res.status(500).json({ message: 'Error updating exit info' });
  }
};

// Delete exit management by employee ID
const deleteExitManagementByEmployeeId = async (req, res) => {
  try {
    const updatedEmployee = await EmpExitManagement.findOneAndUpdate(
      { EmployeeId: req.params.id },
      { status: 'inactive' },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Employee Exit Information Not Found' });
    }

    res.status(200).json({ success: true, message: 'Employee status set to inactive', updatedEmployee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  AddExitInfo, GetExitInfo, GetEmpExitInfo_by_id, uploadFileexit, GetHandOverDoc, updateExitInfo, updateExitInfoById,
  deleteExitManagementByEmployeeId,GetHandOverDocById
};
