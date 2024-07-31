import express from 'express'
import { Create, GetAllUserData, GetAttendanceSummary, GetOneUserData, GetTodayCheckIn, UpdateLunchEndTime, UpdateLunchStartTime, UpdateCheckOutTime, GetByManager } from '../Controller/Attendance_controller.js'
export const Attendance_routes=express.Router()

Attendance_routes.post('/create',Create)
Attendance_routes.put('/LunchStartTime',UpdateLunchStartTime)
Attendance_routes.put('/lunchEndTime',UpdateLunchEndTime)
Attendance_routes.put('/checkOutTime',UpdateCheckOutTime)
Attendance_routes.get('/getsingle',GetOneUserData)
Attendance_routes.get('/getAttendanceSummary',GetAttendanceSummary)
Attendance_routes.get('/GetAllUserData/:year/:month',GetAllUserData)
Attendance_routes.get('/getCheckinData/:employeeId',GetTodayCheckIn)
Attendance_routes.get('/getCheckinData/:ManagerID/:year/:month',GetByManager)