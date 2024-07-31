import { Department } from "../Model/Department_Model.js";

//create
const CreateDepartment=async(req,res)=>{
    try {
        const{
            DepartmentId,
            DepartmentName,
            
        }=req.body

        const NewDepartment=new Department({
            DepartmentId,
            DepartmentName,
            
        })
        await NewDepartment.save();
        res.status(200)
        .json({
          success: true,
          message: "Department Info Created Successfully",
          NewDepartment
        })
    } catch (error) {
        console.log(error);
    res
      .status(500)
      .json({ success: false, message: error.message});
    }
}

//Read

const GetDepartment = async (req, res) => {
    try {
      const EmpDepartment= await Department.find();
      if (!EmpDepartment) {
        return res
          .status(404)
          .json({ success: false, message: "Employee Department Not Found" });
      }
      res.status(200).json({ success: true, EmpDepartment});
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: error.message });
    }
  };

//Get By Id

const GetDepartment_by_id = async (req, res) => {
    try {
      const Department_Id = await Department.findOne({ DepartmentId: req.params.id });
      res.send(Department_Id);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message:error.message });
    }
  };

  //Update
//   const UpdateDepartment = async (req, res) => {
//   try {
//     const { DepartmentId, DepartmentName, ...rest } = req.body;

//     // Check if DepartmentId or DepartmentName is present in the request body
//     if (DepartmentId !== undefined || DepartmentName !== undefined) {
//       return res.status(400).json({ success: false, message: "Cannot update DepartmentId or DepartmentName." });
//     }

//     // Find the department by DepartmentId and update other fields
//     const updatedDepartment = await Department.findOneAndUpdate(
//       { DepartmentId: req.params.id }, // Find the department by DepartmentId
//       { $set: rest }, // Update other fields specified in the request body
//       { new: true, runValidators: true }
//     );

//     if (!updatedDepartment) {
//       return res.status(404).json({ success: false, message: "Department not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Department details updated successfully",
//       updatedDepartment,
//     });
//   } catch (error) {
//     console.error("Error updating department:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };
const UpdateDepartment = async (req, res) => {
  try {
    const { DepartmentName } = req.body;

    const updatedDepartment = await Department.findOneAndUpdate(
      { DepartmentId: req.params.id }, // Filter by DepartmentId
      { $set: { DepartmentName } },    // Update DepartmentName
      { new: true }                    // Return updated document
    );

    if (!updatedDepartment) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Department details updated successfully",
      updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




//Delete Dept Info


const DeleteDepartment = async (req, res) => {
  try {
    const updatedEmployee = await Department.findOneAndUpdate(
      { DepartmentId: req.params.id },
      { status: 'inactive' },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Employee Information Not Found' });
    }

    res.status(200).json({ success: true, message: 'Employee status set to inactive', updatedEmployee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export{CreateDepartment , GetDepartment, GetDepartment_by_id, UpdateDepartment, DeleteDepartment}