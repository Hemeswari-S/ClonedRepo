import { contactdata } from "../Model/EMpContact_Model.js";

//Create
export const createContact = async (req, res) => {
  try {
    const newContactInfo = await contactdata.create(req.body);

    res.status(202).json({
      success: true,
      message: "Successfully created Contact info",
      newContactInfo,
    });
  } catch (err) {
    res.status(404).json(err.message);
    console.error(err);
  }
};

//getAll

export const GetAllContactInfo = async (req, res) => {
  try {
    const allContactInfo = await contactdata.find();
    res.status(201).json({
      success: true,
      message: "Successfully getall Caontact Info",
      allContactInfo,
    });
  }
  catch (err) {
    res.status(404).json(err.message);
    console.error(err);
  }
};

//getbyid

export const GetSingleContact = async (req, res) => {
  try {
    const singleContactInfo = await contactdata.findOne({ employeeId: Number(req.params.employeeId) });

    if (!singleContactInfo) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.send(singleContactInfo);
  }
  catch (err) {
    res.status(404).json(err.message);
    console.error(err);
  }
};

//update

export const updateContact = async (req, res) => {
  try {
    let updateContactInfo = await contactdata.findOne({ employeeId: Number(req.params.employeeId) });

    if (!updateContactInfo) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    updateContactInfo = await contactdata.findOneAndUpdate({ employeeId: Number(req.params.employeeId) },req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    

    res.send(updateContactInfo);
  } catch (err) {
    res.status(404).json(err.message);
    console.error(err);
  }
};



export const DeleteEmployee = async (req, res) => {
  try {
    const updatedEmployee = await contactdata.findOneAndUpdate(
      { employeeId: req.params.id },
      { status: 'inactive' },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Employee Information Not Found' });
    }

    res.status(200).json({ success: true, message: 'Employee status set to inactive', updatedEmployee });
  } catch (error) {
    console.error('Error in DeleteEmployee:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
