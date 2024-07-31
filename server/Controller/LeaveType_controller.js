import {  LeaveTypeSchema } from "../Model/Leavetype_model.js";
import { success } from "../config/Variables.js";

export const GetAll = async (req, res) => {
  try {
    const Levetype = await LeaveTypeSchema.find();
    res.json(Levetype);
  } catch (err) {
    res.json({message:err.message});
  }
};

export const GetById = async (req, res) => {
  try {
    const leaveTypeId = req.params.id;
    const LeaveTypedata = await LeaveTypeSchema.findOne({
      leaveType_Id: leaveTypeId,
    });
    res.json(LeaveTypedata);
  } catch (err) {
    res.json({message:err.message});
  }
};

export const Create = async (req, res) => {
  try {
    const data = req.body;
    const LeaveTypedata = await LeaveTypeSchema.create(data);

    res.json({message:success});
  } catch (err) {
    res.json({message:err.message});
    console.log(err);
  }
};

export const Update = async (req, res) => {
  
  try {
    const Qry = { leaveType_Id: Number(req.params.id) };
    const vals = {
      typeOfLeave: req.body.typeOfLeave,
      availableForAYear: req.body.availableForAYear,
      IsActive:req.body.IsActive
    };

    const Leavetype = await LeaveTypeSchema.findOneAndUpdate(Qry, { $set: vals });

    res.json({message:success});
  } catch (err) {
   
    res.json({message:err.message});
  }
};

//-------------------------- Currently no need for delete-----------------------------

export const DeleteRecord = async (req, res) => {
  try {
    const LeaveTypeID = Number(req.params.id);
    await LeaveType.deleteOne({ LeaveTypeSchema: LeaveTypeID });
    res.json(success);
  } catch (err) {
    res.json({message:err.message});
  }
};
