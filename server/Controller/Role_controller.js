import { Role } from "../Model/Role_Model.js";
import { success } from "../config/Variables.js";

export const GetAll = async (req, res) => {
  try {
    const data = await Role.find();
    res.send(data);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const GetById = async (req, res) => {
  try {
    const RoleId = req.params.id;
    const Roledata = await Role.findOne({
      roleId: RoleId,
    });
    res.json(Roledata);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const Create = async (req, res) => {
  try {
    const data = req.body;
    const Roledata = await Role.create(data);

    res.json({ message: success });
  } catch (err) {
    res.json({ message: err.message });
    console.log(err);
  }
};

export const Update = async (req, res) => {
  try {
    console.log(req.body);
    const Qry = { roleId: Number(req.params.id) };
    const vals = {
      roleName: req.body.roleName,
      permissions: req.body.permissions,
      IsActive: req.body.IsActive,
    };
    const data = await Role.findOneAndUpdate(Qry, { $set: vals });
    res.json({ message: success });
  } catch (err) {
    res.json({ message: err.message });
  }
};
