// import PlansandGoals from "../Model/Achivement_Model.js";

import PlansandGoals from "../Model/PlansandGoals_Model.js";

// Add a new PlansandGoals
export const addPlansandGoals = async (req, res) => {
   
        const { EmployeeId } = req.params;
        const { Goal } = req.body;

        console.log('Received request:', { EmployeeId, Goal, file: req.file });

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const newPlansandGoals = {
                Goal: Goal,
                Plan: {
                    contentType: req.file.mimetype,
                    fileData: req.file.buffer,
                },
            };

            let employee = await PlansandGoals.findOne({ EmployeeId });

            if (!employee) {
                employee = new PlansandGoals({
                    EmployeeId,
                    EmployeePlansandGoals: [newPlansandGoals],
                });
            } else {
                employee.EmployeePlansandGoals.push(newPlansandGoals);
            }

            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            console.error('Error Adding PlansandGoals:', error);
            res.status(500).json({ message: 'Error Adding PlansandGoals', error: error.message });
        }
    }

//Add New
export const newaddPlansandGoals=async(req,res)=>{
    try{
      const data=await PlansandGoals.create(req.body);
      console.log(req.body);
      res.json("success");
    }
    catch(error){
      console.error('Error adding plans and goals info:', error);
      res.status(500).json({ error: 'Failed to add plans and goals' });
    }
  }

// Get All Plans and Goals
export const GetPersonalandGoalsInfo = async (req, res) => {
    const { EmployeeId } = req.params;

    try {
        const employee = await PlansandGoals.findOne({ EmployeeId });
        if (!employee) {
            return res.status(404).json({ message: "Employee Not Found" });
        }

        res.status(200).json(employee.EmployeePlansandGoals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Plans and Goals", error: error.message });
    }
}

// Get Plans and Goals by id
export const getPlansandGoalsByEmployeeId = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await PlansandGoals.findOne({ "EmployeePlansandGoals._id": id });
        if (!employee) {
            return res.status(404).json({ message: "Plans and Goals not found" });
        }

        const PlansandGoals = employee.EmployeePlansandGoals.id(id);
        res.status(200).json(PlansandGoals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Plans and Goals', error: error.message });
    }
}

// Update Plans and Goals
// Update Plans and Goals
export const UpdatePersonalandGoals = async (req, res) => {
    const { PlansandGoalsId } = req.params;
    const { Goal } = req.body;

    try {
        const updateData = {
            "EmployeePlansandGoals.$.Goal": Goal
        };

        if (req.files && req.files['Plan']) {
            updateData["EmployeePlansandGoals.$.Plan"] = {
                contentType: req.files['Plan'][0].mimetype,
                fileData: req.files['Plan'][0].buffer
            };
        }

        const plansAndGoals = await PlansandGoals.findOneAndUpdate(
            { "EmployeePlansandGoals._id": PlansandGoalsId },
            {
                $set: updateData
            },
            { new: true }
        );

        if (!plansAndGoals) {
            return res.status(404).json({ message: "Plans and Goals not found" });
        }

        res.status(200).json(plansAndGoals);
    } catch (error) {
        console.error('Error updating Plans and Goals:', error);
        res.status(500).json({ message: 'Error updating Plans and Goals', error: error.message });
    }
};

// View file
export const viewPlansandGoalsFile = async (req, res) => {
    const { employeeId, PlansandGoalsId } = req.params;

    try {
        // Find the employee by EmployeeId
        const employee = await PlansandGoals.findOne({ EmployeeId: employeeId });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Find the specific PlansandGoals by its ID
        const plansAndGoals = employee.EmployeePlansandGoals.id(PlansandGoalsId);
        if (!plansAndGoals) {
            return res.status(404).json({ message: "Plans and Goals not found" });
        }

        // Check if the PlansandGoals has a file
        if (!plansAndGoals.Plan || !plansAndGoals.Plan.fileData) {
            return res.status(404).json({ message: "Plans and Goals file not found" });
        }

        // Set the content type and send the file data
        res.contentType(plansAndGoals.Plan.contentType);
        res.send(plansAndGoals.Plan.fileData);
    } catch (error) {
        console.error('Error fetching Plans and Goals file:', error);
        res.status(500).json({ message: 'Error fetching Plans and Goals file', error: error.message });
    }
};

export const getPlansandGoalsById = async (PlansandGoalsId) => {
    try {
        // Assuming you're finding the PlansandGoals by its _id
        const PlansandGoals = await PlansandGoals.findOne({ "EmployeePlansandGoals._id": PlansandGoalsId });

        if (!PlansandGoals) {
            throw new Error('Plans and Goals not found');
        }

        return PlansandGoals.EmployeePlansandGoals.id(PlansandGoalsId);
    } catch (error) {
        console.error('Error fetching Plans and Goals:', error);
        throw error;
    }
};

//delete
export const softDeletePlansandGoals = async (req, res) => {
    const { goalId } = req.params;

    try {
        const result = await PlansandGoals.findOneAndUpdate(
            { "EmployeePlansandGoals._id": goalId },
            { $set: { "EmployeePlansandGoals.$.isDeleted": true } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Plans and Goals not found" });
        }

        res.status(200).json({ message: "Plans and Goals marked as deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error marking Plans and Goals as deleted', error: error.message });
    }
};