import { personal_info } from "../Model/EmpPersonal_model.js";



// Create new personal information
export const createPersonalInfo = async (req, res) => {
  try {
    const newPersonalInfo = new personal_info({
      UserId: req.body.UserId,
      EmployeeId: req.body.EmployeeId,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      ProffessionalEmailId: req.body.ProffessionalEmailId,
      PersonalEmailId: req.body.PersonalEmailId,
      DateOfBirth: req.body.DateOfBirth,
      Gender: req.body.Gender,
      image: {
        contentType: req.files['image'][0].mimetype,
        fileData: req.files['image'][0].buffer,
      },
      idProof1: {
        contentType: req.files['idProof1'][0].mimetype,
        fileData: req.files['idProof1'][0].buffer,
      },
      idProof2: {
        contentType: req.files['idProof2'][0].mimetype,
        fileData: req.files['idProof2'][0].buffer,
      }
    });

    await newPersonalInfo.save();
    res.status(201).json(newPersonalInfo);
  } catch (error) {
    console.error('Error creating personal info:', error);
    res.status(500).json({ message: error.message });
  }
};

//Addnew
export const newAddPersonalInfo=async(req,res)=>{
  try{
    const data=await personal_info.create(req.body);
    console.log(req.body);
    res.json("success");
  }
  catch(error){
    console.error('Error adding personal info:', error);
    res.status(500).json({ error: 'Failed to add personal information' });
  }
}


//upload file

export const uploadFiles = async (req, res) => {
  const { employeeId } = req.params;
  const files = req.files;

  try {
    const updateData = {};

    if (files.image) {
      updateData.image = {
        contentType: files.image[0].mimetype,
        fileData: files.image[0].buffer
      };
    }

    if (files.idProof1) {
      updateData.idProof1 = {
        contentType: files.idProof1[0].mimetype,
        fileData: files.idProof1[0].buffer
      };
    }

    if (files.idProof2) {
      updateData.idProof2 = {
        contentType: files.idProof2[0].mimetype,
        fileData: files.idProof2[0].buffer
      };
    }

    const personalInfo = await personal_info.findOneAndUpdate(
      { EmployeeId: employeeId },
      { $set: updateData },
      { new: true }
    );

    if (!personalInfo) {
      return res.status(404).json({ message: 'Personal information not found' });
    }

    res.status(200).json(personalInfo);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



// Get all personal information
export const getAllPersonalInfo = async (req, res) => {
  try {
    const personalInfos = await personal_info.find().sort({EmployeeId:1});
    res.status(200).json(personalInfos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personal information by ID
export const getPersonalInfoById = async (req, res) => {
  const { eid } = req.params;

  try {
    const personalInfo = await personal_info.findOne({ EmployeeId: eid });

    if (!personalInfo) {
      return res.status(404).json({ message: `Personal info not found for EmployeeId: ${eid}` });
    }

    res.status(200).json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal info by Employee ID:', error);
    res.status(500).json({ message: 'Failed to fetch personal info', error: error.message });
  }
};


// Get personal information by proof type (image, idProof1, idProof2)
export const getPersonalInfoByIdProofone = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const personalInfo = await personal_info.findOne({ EmployeeId: employeeId });

    if (!personalInfo || !personalInfo.idProof1) {
      return res.status(404).json({ message: `ID Proof 1 not found for EmployeeId: ${employeeId}` });
    }

    const { contentType, fileData } = personalInfo.idProof1;
    res.set('Content-Type', contentType);
    res.status(200).send(fileData);
  } catch (error) {
    console.error('Error fetching ID Proof 1 by employee ID:', error);
    res.status(500).json({ message: 'Failed to fetch ID Proof 1', error: error.message });
  }
};

//idproof2
export const getPersonalInfoByIdProoftwo = async (req, res) => {
 
  const { employeeId } = req.params;
  console.log('Fetching ID Proof 2 for EmployeeId:', employeeId);

  try {
    const personalInfo = await personal_info.findOne({ EmployeeId: employeeId });
    console.log('Retrieved Personal Info:', personalInfo);

    if (!personalInfo || !personalInfo.idProof2) {
      return res.status(404).json({ message: `ID Proof 2 not found for EmployeeId: ${employeeId}` });
    }

    const { contentType, fileData } = personalInfo.idProof2;
    // console.log('ID Proof 2 Content-Type:', contentType);
    res.set('Content-Type', contentType);
    res.status(200).send(fileData);
  } catch (error) {
    console.error('Error fetching ID Proof 2 by employee ID:', error);
    res.status(500).json({ message: 'Failed to fetch ID Proof 2', error: error.message });
  }
};

//image
export const getPersonalInfoByIdimage = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const personalInfo = await personal_info.findOne({ EmployeeId: employeeId });

    if (!personalInfo || !personalInfo.image) {
      return res.status(404).json({ message: `Image not found for EmployeeId: ${employeeId}` });
    }

    const { contentType, fileData } = personalInfo.image;
    res.set('Content-Type', contentType);
    res.status(200).send(fileData);
  } catch (error) {
    console.error('Error fetching Image by employee ID:', error);
    res.status(500).json({ message: 'Failed to fetch Image', error: error.message });
  }
};



// Update personal information by ID

export const updatePersonalInfoById = async (req, res) => {
  try {
    const { EmployeeId } = req.params;
    const updateData = req.body;

    const updatedPersonalInfo = await personal_info.findOneAndUpdate(
      { EmployeeId },
      updateData,
      { new: true } // Return updated document
    );

    if (!updatedPersonalInfo) {
      return res.status(404).json({ error: 'Personal info not found' });
    }

    res.json(updatedPersonalInfo);
  } catch (error) {
    console.error('Error updating personal info:', error);
    res.status(500).json({ error: 'Failed to update personal info' });
  }
};




// Update personal information by EmployeeId
export const updatePersonalInfoByEmployeeId = async (req, res) => {

  console.log(req.body);
  console.log(req.files);
  const { EmployeeId } = req.params;
  const {
    PersonalEmailId,
    Gender,
    DateOfBirth
  } = req.body;

  const files = req.files;

  console.log('Received data:', { PersonalEmailId, Gender, DateOfBirth });
  console.log('Received files:', files);

  try {
    // Find the document by EmployeeId
    let personalInfo = await personal_info.findOne({ EmployeeId: EmployeeId });

    if (!personalInfo) {
      return res.status(404).json({ message: `Personal info not found for EmployeeId: ${EmployeeId}` });
    }

    // Update the fields
    if (PersonalEmailId) personalInfo.PersonalEmailId = PersonalEmailId;
    if (Gender) personalInfo.Gender = Gender;
    if (DateOfBirth) personalInfo.DateOfBirth = DateOfBirth;

    // Update idProof1 if provided
    if (files && files.idProof1) {
      personalInfo.idProof1 = {
        contentType: files.idProof1[0].mimetype,
        fileData: files.idProof1[0].buffer
      };
    }

    // Update idProof2 if provided
    if (files && files.idProof2) {
      personalInfo.idProof2 = {
        contentType: files.idProof2[0].mimetype,
        fileData: files.idProof2[0].buffer
      };
    }

    // Update image if provided
    if (files && files.image) {
      personalInfo.image = {
        contentType: files.image[0].mimetype,
        fileData: files.image[0].buffer
      };
    }

    console.log('Updated personalInfo:', personalInfo);

    // Save the updated document
    personalInfo = await personalInfo.save();

    res.status(200).json(personalInfo);
  } catch (error) {
    console.error('Error updating personal info by EmployeeId:', error);
    res.status(500).json({ message: 'Failed to update personal info', error: error.message });
  }
};

//Delete
export const deletePersonalInfoByEmployeeId = async (req, res) => {
  const { EmployeeId } = req.params;

  try {
    // Find the document by EmployeeId
    const personalInfo = await personal_info.findOne({ EmployeeId: EmployeeId });

    if (!personalInfo) {
      return res.status(404).json({ message: `Personal info not found for EmployeeId: ${EmployeeId}` });
    }

    // Set status to inactive
    personalInfo.status = 'inactive';
    await personalInfo.save();

    res.status(200).json({ message: 'Personal info set to inactive successfully' });
  } catch (error) {
    console.error('Error setting personal info to inactive:', error);
    res.status(500).json({ message: 'Failed to set personal info to inactive', error: error.message });
  }
};

