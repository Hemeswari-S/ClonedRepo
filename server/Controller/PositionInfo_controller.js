import { Manager } from "../config/Variables.js";
import { positionData } from "../Model/EmpPosition_model.js";
import { Role } from "../Model/Role_Model.js";
import { User } from "../Model/User_Model.js";

//Create
export const CreatePositionInfo = async (req, res) => {
    
    try{
      const{
        employeeId,
        // designation,
         emailId,
         EmpName,
        }= req.body;
       
       let position = new positionData({
        employeeId,
        EmpName,
        // designation:[],
        emailId,
        
      })
      console.log(position);
      await position.save();
      res.status(201).send(position);
      
    }catch (err) {
      res.status(500).send(err.message);
    }
  
};

//GetAll
export const GetAllPostionInfo = async (req, res) => {
  try{
    let allPositionInfo = await positionData.find();

  res.status(201).json({
    success: true,
    message: "Successfully getall Position info",
    allPositionInfo,
  });
  }
  catch (err) {
    res.status(500).send(err.message);
  }
};

//getById
export const GetSinglePosition = async (req, res) => {
  try{
    let singlePositionInfo = await positionData.find({employeeId:Number(req.params.employeeId)});

  if (!singlePositionInfo) {
    res.status(404).json({
      success: false,
      message: "position is not found",
    });
  }

  res.status(201).json({
    success: true,
    message: "succesfully get the single position info",
    singlePositionInfo,
  });
  }
  catch (err) {
    res.status(500).send(err.message);
  }
};

///
// export const position= async (req,res) => {
//   try {
//     console.log(req.body);
//     const { employeeId } = req.params;
//     const { department,emailId,isFresher,payrollCode,workLocation,jobDescription,shift,isTrainee} = req.body;
     
//     const employee = await positionData.findOne({employeeId:Number(employeeId)});

//     if (!employee) {
//       return res.status(404).send('Employee not found');
//     }

//       if (department) employee.department = department;
//       if (emailId) employee. emailId = emailId;
//       if (typeof isFresher === 'boolean') employee. isFresher= isFresher;
//       if (payrollCode) employee.payrollCode = payrollCode;
//       if ( workLocation) employee. workLocation = workLocation;
//       if ( jobDescription) employee. jobDescription = jobDescription;
//       if ( shift) employee. shift = shift;
//       if (typeof isTrainee === 'boolean') employee. isTrainee= isTrainee;
      
    
//     await employee.save();
//     res.send(employee);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// }

export const manager = async (req,res) => {
  try {
  
    const managers = await User.find({RoleName:Manager},{UserId:1,FirstName:1});
    console.log(managers.roleId);
    res.json(managers);
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
  }
}

//update
export const positionUpdate = async (req,res) => {
  try {
    
    console.log(req.body);
    const { employeeId } = req.params;
    const {department,emailId,isFresher,payrollCode,workLocation,jobDescription,shift,isTrainee, Position, startDate,managerId,managerName} = req.body;
    const employee = await positionData.findOne({employeeId:Number(employeeId)});
    

    if (!employee) {
      return res.status(404).send('Employee not found');
    }
      
    // Fetch manager details
    const manager = await User.findOne({ UserId: managerId });
    if (!manager) {
      return res.status(404).send('Manager not found');
    }
   //  
    const currentPos = employee.designation.find(pos => !pos.endDate);
    if (currentPos) {
      currentPos.endDate = new Date();
    }
  
    employee.designation.push({
      department:department,
      emailId:emailId,
      isFresher:isFresher,
      payrollCode:payrollCode,
      workLocation:workLocation,
      jobDescription:jobDescription,
      shift:shift,
      isTrainee:isTrainee,
      position: Position,
      startDate: new Date(startDate),
      endDate: null,
      managerId:managerId,
      managerName:managerName,
    });
    await employee.save();
    res.send(employee);
  } catch (err) {
    res.status(500).send(err.message);
  }

} 


export const Delete = async (req, res) => {
  try {
      const updatedEmployee = await positionData.findOneAndUpdate(
          {employeeId: req.params.employeeId },
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
