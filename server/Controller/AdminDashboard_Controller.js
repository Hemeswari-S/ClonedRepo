import moment from "moment";
import { Department } from "../Model/Department_Model.js";
import { DesignationInfo } from "../Model/Designation_model.js";
import { Role } from "../Model/Role_Model.js";
import { personal_info } from "../Model/EmpPersonal_model.js";
import { User } from "../Model/User_Model.js";
import { LeaveManager } from "../Model/LeaveManager_model.js";
import { EmpExitManagement } from "../Model/EmpExitManagement_model.js";
import { positionData } from "../Model/EmpPosition_model.js";

export const getEmpBadgesValue = async (req, res) => {
  try {
    const EmpCount = await personal_info.countDocuments();
    const InactiveEmpCount = await personal_info.countDocuments({
      status: "inactive",
    });
    const ActiveEmpCount = await personal_info.countDocuments({
      status: "active",
    });
    res.json({ EmpCount:EmpCount||0, InactiveEmpCount:InactiveEmpCount||0, ActiveEmpCount:ActiveEmpCount||0 });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getDepBadgesValue = async (req, res) => {
  try {
    const DepCount = await Department.countDocuments();
    const InactiveDepCount = await Department.countDocuments({
      status: "inactive",
    });
    const ActiveDepCount = await Department.countDocuments({
      status: "active",
    });
    res.json({ DepCount:DepCount||0, InactiveDepCount:InactiveDepCount||0, ActiveDepCount:ActiveDepCount||0 });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getDesBadgesValue = async (req, res) => {
  try {
    const DesCount = await DesignationInfo.countDocuments();
    const ActiveDesCount = await DesignationInfo.countDocuments({
      status: "active",
    });
    const InactiveDesCount = await DesignationInfo.countDocuments({
      status: "inactive",
    });
    res.json({ DesCount:DesCount||0, InactiveDesCount:InactiveDesCount||0, ActiveDesCount:ActiveDesCount||0 });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getRoleBadgesValue = async (req, res) => {
  try {
    const RoleCount = await Role.countDocuments();
    const InactiveRoleCount = await Role.countDocuments({ IsActive: false });
    const ActiveRoleCount = await Role.countDocuments({ IsActive: true });
    res.json({
      RoleCount: RoleCount || 0,
      InactiveRoleCount: InactiveRoleCount || 0,
      ActiveRoleCount: ActiveRoleCount || 0,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getRecentAddedEmployees = async (req, res) => {
  try {
    const GetEmployee = await User.find().sort({ createdAt: -1 }).limit(5);
    res.json(GetEmployee);
  } catch (err) {
    res.json({ message: err.message });
  }
};
export const getExitRequests = async (req, res) => {
  try {
    const GetExitRecords = await EmpExitManagement.find({
      resignationNoticeDate: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(GetExitRecords);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getRecentpromotions = async (req, res) => {
  try {
    const GetPromotions = await positionData
      .find({ "designation.0": { $exists: true } })
      .sort({ UpdatedAt: -1 })
      .limit(5);
    res.json(GetPromotions);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getCurrentWeekLeaves = async (req, res) => {
  try {
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    const currentWeekLeaves = await LeaveManager.find({
      $or: [
        { startDate: { $gte: startOfWeek, $lte: endOfWeek } },
        { endDate: { $gte: startOfWeek, $lte: endOfWeek } },
        { startDate: { $lte: startOfWeek }, endDate: { $gte: endOfWeek } },
      ],
    });

    res.json(currentWeekLeaves);
  } catch (error) {
    res.json({ message: error.message });
  }
};
