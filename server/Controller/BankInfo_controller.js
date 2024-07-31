import { BankInfo,  } from "../Model/EmpBankInfo_model.js";

// Create a new employee with bank accounts
export const CreateEmployeewithBankAccount = async (req, res) => {
  console.log("Request received to create employee with bank account");
  console.log("Request body:", req.body);

  try {
    const newEmployee = new BankInfo(req.body);
    await newEmployee.save();
    console.log("New employee created successfully:", newEmployee);
    res.status(201).send(newEmployee);
  } catch (error) {
    console.error("Error creating new employee:", error);
    res.status(400).send({ message: "Error creating new employee", error: error.message });
  }
};

// Add a bank account to an employee
export const addBankAccount = async (req, res) => {
  try {
    const employee = await BankInfo.findById(req.params.id);
    if (!employee) return res.status(404).send('Employee not found');

    employee.bankAccounts.push(req.body);

    // If this is the first account, set it as the default
    if (employee.bankAccounts.length === 1) {
      employee.bankAccounts[0].status = 'active';
      employee.defaultAccount = employee.bankAccounts[0]._id;
    }

    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    console.error("Error adding bank account:", error);
    res.status(400).send({ message: "Error adding bank account", error: error.message });
  }
};

// Set a default bank account
export const setDefaultBankAccount = async (req, res) => {
  try {
    const employee = await BankInfo.findById(req.params.id);
    if (!employee) return res.status(404).send('Employee not found');

    const accountId = req.params.accountId;
    let accountFound = false;

    employee.bankAccounts.forEach(account => {
      if (account._id.toString() === accountId) {
        account.status = 'active';
        employee.defaultAccount = account._id;
        accountFound = true;
      } else {
        account.status = 'inactive';
      }
    });

    if (!accountFound) return res.status(404).send('Bank account not found');

    await employee.save();
    res.send(employee);
  } catch (error) {
    console.error("Error setting default bank account:", error);
    res.status(400).send({ message: "Error setting default bank account", error: error.message });
  }
};
