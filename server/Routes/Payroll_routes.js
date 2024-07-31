import express from 'express'
import { AfterDownload, UploadCSVAndSave, getPayslip, getall, getallPayslip, getforsingleuser } from '../Controller/Payroll_controller.js'
import { uploadFile } from '../middleware/upload.js';
export const payroll_routes=express.Router()


// payroll_routes.post('/create',uploadFile.single('file'), Create);
payroll_routes.post('/SavefromCSV',uploadFile.single('file'), UploadCSVAndSave);
payroll_routes.get('/get',getall)
payroll_routes.get('/getallpayslip',getallPayslip)
payroll_routes.get('/getsingleuser/:employeeId',getforsingleuser)
payroll_routes.post('/afterdownload/:employeeId/:date',uploadFile.single('file'),AfterDownload)
payroll_routes.get('/getPayslip/:employeeId/:payperiod',getPayslip)