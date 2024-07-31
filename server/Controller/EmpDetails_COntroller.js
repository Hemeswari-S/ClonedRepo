import { personal_info } from "../Model/EmpPersonal_model.js";
import { positionData } from "../Model/EmpPosition_model.js";

export const GridDetails = async (req, res) => {
  try {
    const personalDetails = await personal_info
      .find({EmployeeId:{$ne:1}})
      .sort({ EmployeeId: 1 });
    const positionDetails = await positionData.find();

    const mergedData = personalDetails.map((personal) => {
      const position = positionDetails.find(
        (pos) => pos.employeeId === personal.EmployeeId
      );
      console.log(position);
      if (position.designation.length !== 0) {
        const array = position.designation;
        let lastIndex = array.length - 1;

        return {
          employeeId: personal.EmployeeId,
          image: personal.image,
          firstName: personal.FirstName,
          lastName: personal.LastName,
          designation: position.designation[lastIndex].position,
        };
      } else {
        console.log("position else" + personal.EmployeeId);

        return {
          employeeId: personal.EmployeeId,
          image: personal.image,
          firstName: personal.FirstName,
          lastName: personal.LastName,
          designation: "",
        };
      }
    });

    res.json(mergedData);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error);
  }
};
