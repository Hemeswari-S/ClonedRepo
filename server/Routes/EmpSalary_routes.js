import express from 'express'
import { Create, GetbyUser, getallbymanager } from '../Controller/EmpSalary_controller.js'
import { uploadFile } from '../middleware/upload.js'
export const Salary_routes=express.Router()

Salary_routes.post('/create',uploadFile.single('file'),Create)
Salary_routes.get('/get/:role/:Id',getallbymanager)
Salary_routes.get('/getOneUser/:PayPeriod/:Id',GetbyUser)