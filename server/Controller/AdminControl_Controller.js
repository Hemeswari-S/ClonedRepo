import { ControlModel } from "../Model/AdminContols_Model.js";
import { success } from "../config/Variables.js";

export const CreateControl = async (req, res) => {
  try {
    const Data = await ControlModel.create(req.body);
    if (Data) {
      res.json({ message: success });
    } else {
      res, json({ message: "Failed" });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const Getall = async (req, res) => {
  const Data = await ControlModel.find();
  res.json(Data);
};

export const UpdateControl = async (req, res) => {
  try {
    const id = req.params.id;
    const Status = req.body.Status;
    console.log(req.body);
    console.log(Status);

    const Qry = { _id: id };
    const vals = {
      IsActive: Status,
    };
    const updatedata = await ControlModel.findByIdAndUpdate(Qry, {
      $set: vals,
    });
    res.json({ message: success });
  } catch (err) {
    res.json({ message: err.message });
  }
};

