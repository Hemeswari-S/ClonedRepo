import express from 'express';
import { CreateDepartment, DeleteDepartment, GetDepartment, GetDepartment_by_id, UpdateDepartment } from '../Controller/Department_controller.js';


const Department_routers=express.Router();

Department_routers.post("/create",CreateDepartment);
Department_routers.get("/get",GetDepartment);
Department_routers.get("/get/:id",GetDepartment_by_id);
Department_routers.put("/update/:id",UpdateDepartment);
Department_routers.delete("/delete/:id", DeleteDepartment);


export default Department_routers;