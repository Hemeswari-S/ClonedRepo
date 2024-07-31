import mongoose from "mongoose";

// Bank account schema
const EmpBankInfoSchema = new mongoose.Schema({
  BankName: { 
    type: String, 
    match: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/ 
  },
  BranchName: { 
    type: String, 
    match: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/ 
  },
  AccountNumber: {
    type: String,
    match: /^\d{9,18}$/ 
  },
  AccountType: { 
    type: String, 
    enum: ['Savings', 'Current', 'Fixed Deposit', 'Recurring Deposit'] 
  },
  AccountHolderName: {
    type: String,
    match: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/ 
  },
  IFSCCode: {
    type: String,
    match: /^[A-Z]{4}0[A-Z0-9]{6}$/ 
  },
  PANnumber: {
    type: String,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ 
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  }
}, { timestamps: true });

// Employee schema
const BankInfoSchema = new mongoose.Schema({
  name: { 
    type: String, 
    
  },
  EmployeeId: { 
    type: Number, 
   
  },
  bankAccounts: [EmpBankInfoSchema],
  defaultAccount: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BankInfo' 
  }
});

// Middleware to ensure only one default account
BankInfoSchema.pre('save', async function (next) {
  const emp = this;
  if (emp.bankAccounts.length > 0) {
    const defaultAccounts = emp.bankAccounts.filter(account => account.status === 'active');
    if (defaultAccounts.length > 1) {
      throw new Error('Only one bank account can be marked as default.');
    }
  }
  next();
});

export const BankInfo = mongoose.model('BankInfo', BankInfoSchema);
