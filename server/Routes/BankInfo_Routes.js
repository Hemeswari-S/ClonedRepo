import express from 'express';
import { CreateEmployeewithBankAccount, addBankAccount, setDefaultBankAccount } from '../Controller/BankInfo_controller.js';

const BankInfo_routers = express.Router();

BankInfo_routers.post("/employees", CreateEmployeewithBankAccount);
BankInfo_routers.put("/employee/:id/add-account", addBankAccount);
BankInfo_routers.put("/employee/:id/select-account/:accountId", setDefaultBankAccount);

export default BankInfo_routers;
