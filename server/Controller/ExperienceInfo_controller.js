import EmpExperienceInfo from "../Model/EmpExperienceInfo_model.js";

export const AddExperienceInfo = async (req, res) => {
  const { EmployeeId } = req.params;
    const {
        position,
        joiningDate,
        lastDate,
        employmentType,
        salary,
        companyName,
        companyAddress,
        contactNumber,
    } = req.body;

    try {
        // Prepare new experience object
        const newExperience = {
            position,
            joiningDate,
            lastDate,
            employmentType,
            salary,
            companyName,
            companyAddress,
            contactNumber,
            experienceLetter: req.files.experienceLetter ? {
                contentType: req.files.experienceLetter[0].mimetype,
                fileData: req.files.experienceLetter[0].buffer,
            } : undefined,
            offerLetter: req.files.offerLetter ? {
                contentType: req.files.offerLetter[0].mimetype,
                fileData: req.files.offerLetter[0].buffer,
            } : undefined,
            relievingLetter: req.files.relievingLetter ? {
                contentType: req.files.relievingLetter[0].mimetype,
                fileData: req.files.relievingLetter[0].buffer,
            } : undefined,
        };

        // Find the employee by EmployeeId
        let employee = await EmpExperienceInfo.findOne({ EmployeeId });

        if (!employee) {
            // If employee does not exist, create a new employee with the provided EmployeeId and the new experience
            employee = new EmpExperienceInfo({
                EmployeeId,
                Experiences: [newExperience],
            });
        } else {
            // If employee exists, add the new experience to the Experiences array
            employee.Experiences.push(newExperience);
        }

        // Save the employee document
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        console.error('Error adding experience:', error);
        res.status(500).json({ message: 'Error adding experience', error: error.message });
    }
};


//Addnew
export const newAddExperienceInfo=async(req,res)=>{
  try{
    const data=await EmpExperienceInfo.create(req.body);
    console.log(req.body);
    res.json("success");
  }
  catch(error){
    console.error('Error adding Exp Info:', error);
    res.status(500).json({ error: 'Failed to add exp information' });
  }
}

// Get All Experience Info
export const GetExperienceInfo = async (req, res) => {
  const { EmployeeId } = req.params;

  try {
    const employee = await EmpExperienceInfo.findOne({ EmployeeId });
    if (!employee) {
      return res.json({ message: 'Employee not found' });
    }

    res.status(200).json(employee.Experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiences', error: error.message });
  }
}

// Get Experience Info by ID
export const GetExperienceInfoById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await EmpExperienceInfo.findOne({ "Experiences._id": id });
    if (!employee) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const experience = employee.Experiences.id(id);
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experience', error: error.message });
  }
}

// Update Experience Info
export const UpdateExperienceInfo = async (req, res) => {
  const { EmployeeId } = req.params;
  const updatedExperience = req.body;

  try {
    const experience = await EmpExperienceInfo.findOneAndUpdate(
      { EmployeeId, "Experiences._id": updatedExperience._id },
      { $set: { "Experiences.$": updatedExperience } },
      { new: true }
    );
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error updating experience', error: error.message });
  }
}

//view file
export const viewExperienceFile = async (req, res) => {
  const { employeeId, experienceId, fileType } = req.params;

  try {
      const employee = await EmpExperienceInfo.findOne({ EmployeeId: employeeId });
      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      const experience = employee.Experiences.id(experienceId);
      if (!experience) {
          return res.status(404).json({ message: "Experience not found" });
      }

      let file;
      switch (fileType) {
          case 'experienceLetter':
              file = experience.experienceLetter;
              break;
          case 'offerLetter':
              file = experience.offerLetter;
              break;
          case 'relievingLetter':
              file = experience.relievingLetter;
              break;
          default:
              return res.status(400).json({ message: "Invalid file type" });
      }

      if (!file || !file.fileData) {
          return res.status(404).json({ message: "File not found" });
      }

      res.contentType(file.contentType);
      res.send(file.fileData);
  } catch (error) {
      console.error('Error fetching experience file:', error);
      res.status(500).json({ message: 'Error fetching experience file', error: error.message });
  }
};


// Delete Experience Info
export const DeleteExperienceInfo = async (req, res) => {
  const { EmployeeId, id } = req.params;

  try {
    const experience = await EmpExperienceInfo.findOneAndUpdate(
      { EmployeeId },
      { $pull: { Experiences: { _id: id } } },
      { new: true }
    );
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting experience', error: error.message });
  }
}
