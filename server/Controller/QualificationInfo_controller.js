import { empQualiInfo } from "../Model/EmpQualificaaion_model.js";
import { Certification } from "../config/Variables.js";

export const create = async (req, res) => {
  try {
    const {
      employeeId,
      qualificationType,
      qualificationTitle,
      instituteOrCollegeName,
      address,
      MajorFeildOfStudy,
      percentageOrcgba,
    } = req.body;
    let newQualification;

    if (qualificationType === "Certification") {
      newQualification = new empQualiInfo({
        employeeId,
        qualificationType,
        qualificationTitle,
        instituteOrCollegeName,
        address,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
      });
    } else {
      newQualification = new empQualiInfo({
        employeeId,
        qualificationType,
        qualificationTitle,
        MajorFeildOfStudy,
        percentageOrcgba,
        instituteOrCollegeName,
        address,
      });
    }
    console.log(newQualification);

    await newQualification.save();
    res.status(201).send("Qualification saved successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//GetById
export const GetSingleInfo = async (req, res) => {
  try {
    const SingleEmpQualificationInfo = await empQualiInfo.findOne({
      employeeId: Number(req.params.employeeId),
    });
    console.log(SingleEmpQualificationInfo);
    if (!SingleEmpQualificationInfo) {
      return res.json({
        success: false,
        message: "Employee Not Found",
      });
    }

    res.json(SingleEmpQualificationInfo);
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
};

//getAll

export const retriveAllInfo = async (req, res) => {
  try {
    const AllEmpQualificationInfo = await empQualiInfo.find();
    res.status(200).json({
      success: true,
      message: "Successfully getall employees",
      AllEmpQualificationInfo,
    });
  } catch (err) {
    res.json(err.message);
    console.error(err);
  }
};

//delete

export const DeleteEmployee = async (req, res) => {
  try {
    const updatedEmployee = await empQualiInfo.findOneAndUpdate(
      { employeeId: req.params.id },
      { status: "inactive" },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.json({
        success: false,
        message: "Employee Information Not Found",
      });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Employee status set to inactive",
        updatedEmployee,
      });
  } catch (error) {
    console.error("Error in DeleteEmployee:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//

export const updateWithoutCertificate = async (req, res) => {
  console.log(req.params);

  const { id } = req.params;

  console.log(req.body);
  const {
    qualificationType,
    qualificationTitle,
    MajorFeildOfStudy,
    percentageOrcgba,
    instituteOrCollegeName,
    Address,
  } = req.body;

  try {
    // Find the employee by employeeId
    let employee = await empQualiInfo.findOne({ employeeId: Number(id) });

    if (!employee) {
      return res.json({ error: "Employee not found" });
    }
    const titleExists = employee.withoutcertificate.some(
      (doc) => doc.qualificationTitle === qualificationTitle
    );

    if (titleExists) {
      return res.json({ error: "Qualification title already exists" });
    }
    if (qualificationType !== Certification) {
      employee.withoutcertificate.push({
        qualificationType: qualificationType,
        qualificationTitle: qualificationTitle,
        MajorFeildOfStudy: MajorFeildOfStudy,
        percentageOrcgba: percentageOrcgba,
        instituteOrCollegeName: instituteOrCollegeName,
        Address: Address,
      });
    } else {
      return res.json({
        error: "Certification cannot be updated using this endpoint",
      });
    }

    await employee.save();
    res.send(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateWithCertificate = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  console.log(req.body);
  const {
    qualificationType,
    qualificationTitle,
    instituteOrCollegeName,
    Address,
  } = req.body;

  try {
    let employee = await empQualiInfo.findOne({ employeeId: Number(id) });

    if (!employee) {
      return res.json({ error: "Employee not found" });
    }

    if (!req.file) {
      return res.json({ error: "No file found" });
    }

    
    const filename = req.file.originalname;
    const DocumentData = req.file.buffer;
    const ContentType = req.file.mimetype;
    

    const isDuplicateFile = employee.document.some((doc) =>
      doc.File && doc.File.originalname === filename
    );
    if (isDuplicateFile) {
      return res.json({ error: "Duplicate file" });
    }

    const titleExists = employee.document.some(
      (doc) => doc.qualificationTitle === qualificationTitle
    );

    if (titleExists) {
      return res.json({ error: "Qualification title already exists" });
    }

    if (qualificationType === Certification) {
      employee.document.push({
        qualificationType: qualificationType,
        qualificationTitle: qualificationTitle,
        instituteOrCollegeName: instituteOrCollegeName,
        Address: Address,
        File: {
          originalname: filename,
          mimetype: ContentType,
          buffer: DocumentData,
        },
      });
    } else {
      return res.json({
        error: "Certification only updated using this endpoint",
      });
    }

    await employee.save();
    res.send(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const editQualificationById = async (req, res) => {
  const { employeeId, qualificationId } = req.params;
  const {
    qualificationType,
    qualificationTitle,
    MajorFeildOfStudy,
    percentageOrcgba,
    instituteOrCollegeName,
    Address,
  } = req.body;

  try {
    // Find the employee by employeeId
    let employeee = await empQualiInfo.findOne({
      employeeId: Number(employeeId),
    });

    if (!employeee) {
      return res.json({ error: "Employee not found" });
    }

    // Find the qualification by its ID in the withoutcertificate array
    let qualification = employeee.withoutcertificate.id(qualificationId);

    if (!qualification) {
      return res.json({ error: "Qualification not found" });
    }

    const titleExists = employeee.withoutcertificate.some(
      (doc) =>
        doc.qualificationTitle === qualificationTitle &&
        doc._id.toString() !== qualificationId
    );

    if (titleExists) {
      return res.json({ error: "Qualification title already exists" });
    }
    // Update the fields
    if (qualificationType !== Certification) {
      qualification.qualificationType = qualificationType;
      qualification.qualificationTitle = qualificationTitle;
      qualification.MajorFeildOfStudy = MajorFeildOfStudy;
      qualification.percentageOrcgba = percentageOrcgba;
      qualification.instituteOrCollegeName = instituteOrCollegeName;
      qualification.Address = Address;
    }

    await employeee.save();
    res.send(employeee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const editQualificationByIdWithCertificate = async (req, res) => {
  const { employeeId, qualificationId } = req.params;
  console.log(req.body);
  const {
    qualificationType,
    qualificationTitle,
    instituteOrCollegeName,
    Address,
  } = req.body;

  try {
    // Find the employee by employeeId
    let employee = await empQualiInfo.findOne({
      employeeId: Number(employeeId),
    });

    if (!employee) {
      return res.json({ error: "Employee not found" });
    }

    // Find the qualification by its ID in the document array
    let qualification = employee.document.id(qualificationId);

    if (!qualification) {
      return res.json({ error: "Qualification not found" });
    }

    const titleExists = employee.document.some(
      (doc) =>
        doc.qualificationTitle === qualificationTitle &&
        doc._id.toString() !== qualificationId
    );

    if (titleExists) {
      return res.json({ error: "Qualification title already exists" });
    }

    // Update the fields
    if (qualificationType === Certification) {
      qualification.qualificationType = qualificationType;
      qualification.qualificationTitle = qualificationTitle;
      qualification.instituteOrCollegeName = instituteOrCollegeName;
      qualification.Address = Address;

      if (req.file) {
        const filename = req.file.originalname;
        console.log(req.file)
        // Check if the filename already exists in the employee's documents
        // const fileExists = employee.document.some((doc) =>
        //   doc.File.some(
        //     (file) =>
        //       file.fileName === filename &&
        //       doc._id.toString() !== qualificationId
        //   )
        // );

        const fileExists = employee.document.some((doc) =>
          doc.File && doc.File.originalname === filename &&
          doc._id.toString() !== qualificationId
        );

        if (fileExists) {
          return res.json({
            error: "File name already exists for this employee",
          });
        }

        const DocumentData = req.file.buffer;
        const ContentType = req.file.mimetype;

        // Update the existing file data
        qualification.File = 
          {
            originalname: filename,
            mimetype: ContentType,
            buffer: DocumentData,
          }
      }
    }

    await employee.save();
    res.json({employee,message:"updated successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


