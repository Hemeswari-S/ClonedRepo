import { employeedocument } from "../Model/EmpDocuments_model.js";
//multiple
export const createDocument = async (req, res) => {
  try {
    if (req.files.size > 1024 * 1024 * 5) {
      return res.status(400).send("File size exceeds limit");
    }
    if (req.files.length === 0) {
      return res.status(500).json({ error: "No file found" });
    }

    const { employeeID } = req.body;

    const employeeFile = new employeedocument({ employeeID, files: req.files });
    const savedEmployeeFile = await employeeFile.save();
    res.status(200).json(savedEmployeeFile);
  } catch (err) {
    res.status(500);
    res.json(err.message);
    console.error(err);
  }
};

export const update = async (req, res) => {
  try {
    console.log(req.files);
    const { employeeID } = req.params;

    const employee = await employeedocument.findOne({
      employeeID: Number(employeeID),
    });

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    if (req.files && req.files.length > 0) {
      if (req.files[0].size > 1024 * 1024 * 5) {
        return res.status(400).send("File size exceeds limit");
      }

      employee.files = req.files.map((file) => ({
        originalname: file.originalname,
        buffer: file.buffer,
        mimetype: file.mimetype,
      }));
    }

    const updatedEmployeeFile = await employee.save();
    res.status(200).json(updatedEmployeeFile);
  } catch (err) {
    res.status(500);
    res.json(err.message);
    console.error(err);
  }
};

export const updateEmployeeDocuments = async (req, res) => {
  try {
    console.log(req.files);
    const { employeeID } = req.params;

    const employee = await employeedocument.findOne({
      employeeID: Number(employeeID),
    });

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    if (req.files && req.files.length > 0) {
      if (req.files.some((file) => file.size > 1024 * 1024 * 5)) {
        return res.status(400).send("One or more files exceed size limit");
      }

      const newFiles = req.files.map((file) => ({
        originalname: file.originalname,
        buffer: file.buffer,
        mimetype: file.mimetype,
      }));

      employee.files = [...employee.files, ...newFiles];
    }

    const updatedEmployeeFile = await employee.save();
    res.status(200).json(updatedEmployeeFile);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

// single
// export const createDocument = async (req,res) => {
//     try{
//         if(!req.file){
//             return res.status(500).json({error: "No file found"});
//         }

//         if (req.file.size > (1024 * 1024 * 6)) {
//             return res.status(400).send('File size exceeds limit');
//         }

//         const imageFile = employeedocument({
//             employeeID:req.body.employeeID,
//             filename:req.file.originalname,
//             data:req.file.buffer.toString('base64'),
//             conentType:req.file.mimetype,
//         })
//         const saveImage = await imageFile.save();

//         res.status(200).json({
//             message :"successfully saved",
//             saveImage,

//      } );
//     }
//     catch(error){
//         console.log(error);
//     }
// }

// // getById
export const GetSingleDocument = async (req, res) => {
  try {
    const singleEmpdocument = await employeedocument.find({
      employeeID: Number(req.params.employeeID),
    });

    if (!singleEmpdocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "successfully get the document",
      singleEmpdocument,
    });
  } catch (err) {
    res.status(500);
    res.json(err.message);
    console.error(err);
  }
};

export const DeleteEmployee = async (req, res) => {
  const { employeeId, fileId } = req.params;
  try {
    const updatedDocument = await employeedocument.findOneAndUpdate(
      { employeeID:employeeId },
      { $pull: { files: { _id: fileId } } },
      { new: true }
    );

    if (!updatedDocument) {
      throw new Error("Employee document not found");
    }

    res.json({message:`File deleted successfully`});
  }catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
};

// export const DeleteEmployee = async (req, res) => {
//     try {
//         const updatedEmployee = await employeedocument.findOneAndUpdate(
//             { employeeID: req.params.id },
//             { status: 'inactive' },
//             { new: true }
//         );

//         if (!updatedEmployee) {
//             return res.status(404).json({ success: false, message: 'Employee Information Not Found' });
//         }

//         res.status(200).json({ success: true, message: 'Employee status set to inactive', updatedEmployee });
//     } catch (error) {
//         console.error('Error in DeleteEmployee:', error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
//   };
