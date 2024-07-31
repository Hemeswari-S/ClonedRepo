import { EmpdependentInfo } from "../Model/EmpDependent_model.js";

//Add Depenndent

export const AddDependentInfo = async (req,res)=>{
  const { EmployeeId } = req.params;
  const newDependent = req.body;

  try {
    // Find the employee by EmployeeId
    let employee = await EmpdependentInfo.findOne({ EmployeeId });
    if (!employee) {
      // If employee does not exist, create a new employee with the provided EmployeeId and the new dependent
      employee = new EmpdependentInfo({
        EmployeeId,
        Dependents: [newDependent]
      });
    } else {
      // If employee exists, add the new dependent to the Dependents array
      employee.Dependents.push(newDependent);
    }

    // Save the employee document
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error adding dependent', error: error.message });
  }
}

//get  (ID)
export const GetDependentInfo =async(req,res)=>{
    const { EmployeeId } = req.params;
  
    try {
      const employee = await EmpdependentInfo.findOne({ EmployeeId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json(employee.Dependents);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dependents', error: error.message });
    }
    
}

//get by Id

export const GetDependentInfo_by_id = async(req,res)=>{
  const { id } = req.params;

  try {
    const employee = await EmpdependentInfo.findOne({ "Dependents._id": id });
    if (!employee) {
      return res.status(404).json({ message: 'Dependent not found' });
    }

    const dependent = employee.Dependents.id(id);
    res.status(200).json(dependent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dependent', error: error.message });
  }
}

//Update

export const UpdateEmpDependentInfo =async(req,res)=>{
  const { EmployeeId, dependentId } = req.params;
  const updatedDependent = req.body;

  try {
    const employee = await EmpdependentInfo.findOne({ EmployeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const dependent = employee.Dependents.id(dependentId);
    if (!dependent) {
      return res.status(404).json({ message: 'Dependent not found' });
    }

    Object.assign(dependent, updatedDependent);
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating dependent', error: error.message });
  }
};


//Delete

export const DeleteEmpDependentInfo=async(req,res)=>{
  const { EmployeeId, dependentId } = req.params;

    console.log(`Received delete request for EmployeeId: ${EmployeeId}, dependentId: ${dependentId}`);

    try {
        const employee = await EmpdependentInfo.findOne({ EmployeeId });
        if (!employee) {
            console.error(`Employee with ID ${EmployeeId} not found`);
            return res.status(404).json({ message: 'Employee not found' });
        }

        const dependentIndex = employee.Dependents.findIndex(dep => dep._id.toString() === dependentId);
        if (dependentIndex === -1) {
            console.error(`Dependent with ID ${dependentId} not found in employee ${EmployeeId}`);
            return res.status(404).json({ message: 'Dependent not found' });
        }

        employee.Dependents.splice(dependentIndex, 1); // Remove the dependent

        await employee.save();

        console.log(`Dependent with ID ${dependentId} deleted successfully`);
        res.status(200).json({ message: 'Dependent deleted successfully' });
    } catch (error) {
        console.error(`Error deleting dependent: ${error.message}`, error);
        res.status(500).json({ message: 'Error deleting dependent', error: error.message });
    }
};