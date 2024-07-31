import express from 'express';
import { CreateDesignation, DeleteDesignation, GetDesignation, GetDesignation_by_id, updateDesignation } from '../Controller/Designation_controller.js';


const Designation_routers=express.Router();

Designation_routers.post("/create",CreateDesignation);
Designation_routers.get("/get",GetDesignation);
Designation_routers.get("/get/:id",GetDesignation_by_id);
Designation_routers.put("/update/:id",updateDesignation);
Designation_routers.delete("/delete/:id",DeleteDesignation);


export default Designation_routers;

