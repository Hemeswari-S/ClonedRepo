import { DesignationInfo } from "../Model/Designation_model.js";

//Create
const CreateDesignation=async(req,res)=>{
    try {
        const{
            DesignationId,
            Designation,
            
        }=req.body

        const NewDesignation=new DesignationInfo({
            DesignationId,
            Designation,
            
        })
        
        await NewDesignation.save();
        res.status(200)
        .json({
          success: true,
          message: "Designation Info Created Successfully",
          NewDesignation
        })
    } catch (error) {
        console.log(error);
    res
      .status(500)
      .json({ success: false, message: error.message});
    }
}

//Read

const GetDesignation = async (req, res) => {
    try {
      const EmpDesignation= await DesignationInfo.find();
      if (!EmpDesignation) {
        return res
          .status(404)
          .json({ success: false, message: "Employee Designation Not Found" });
      }
      res.status(200).json({ success: true, EmpDesignation});
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message:error.message });
    }
  };

  //Get By Id

  const GetDesignation_by_id = async (req, res) => {
    try {
      const Designation_Id = await DesignationInfo.findOne({ DesignationId: req.params.id });
  
      // Check if the designation ID is not found
      if (!Designation_Id) {
        return res.status(404).json({ success: false, message: "Invalid designation ID " });
      }
  
      res.send(Designation_Id);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  //Update
  const updateDesignation = async (req, res) => {
    try {
      const { DesignationId, Designation } = req.body;
  
      const updatedDesignation = await DesignationInfo.findOneAndUpdate(
        { DesignationId: req.params.id }, // Filter by DesignationId
        { Designation },                   // Update Designation field
        { new: true }                      // Return updated document
      );
  
      if (!updatedDesignation) {
        return res.status(404).json({ success: false, message: "Designation not found" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Designation details updated successfully",
        updatedDesignation,
      });
    } catch (error) {
      console.error("Error updating designation:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };  
  

  //Delete Dept Info

const DeleteDesignation = async (req, res) => {
  try {
    const updatedEmployee = await DesignationInfo.findOneAndUpdate(
      { DesignationId: req.params.id },
      { status: 'inactive' },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Desigation Info Found' });
    }

    res.status(200).json({ success: true, message: 'Designation status set to inactive', updatedEmployee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {CreateDesignation,GetDesignation,GetDesignation_by_id, updateDesignation, DeleteDesignation}



