import { EmployeeAttendance } from "../Model/EmpAttendance_model.js";
import { personal_info } from "../Model/EmpPersonal_model.js";
import { positionData } from "../Model/EmpPosition_model.js";
import { LeaveManager } from "../Model/LeaveManager_model.js";
import moment from "moment";

export const Create = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
      999
    );
    const existingRecord = await EmployeeAttendance.findOne({
      employeeId: req.body.employeeId,
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    });
    if (existingRecord) {
      return res.json({ message: "Check-in already recorded for today" });
    }

    const data = await EmployeeAttendance.create(req.body);

    res.json({ Checkindata: data, message: "Checked-in recorded" });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const UpdateLunchStartTime = async (req, res) => {
  try {
    const finddata = await EmployeeAttendance.findById(req.body._id);
    if (finddata) {
      const currentDate = new Date();
      const lunchStartDate = new Date(req.body.lunchStartTime);

      const isSameDay =
        lunchStartDate.toLocaleDateString() ===
        currentDate.toLocaleDateString();

      if (isSameDay) {
        const existingEntry = await EmployeeAttendance.findOne({
          _id: req.body._id,
          lunchStartTime: {
            $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
            $lt: new Date(currentDate.setHours(23, 59, 59, 999)),
          },
        });

        if (existingEntry && existingEntry.lunchStartTime) {
          res.json({
            message: "Lunch start time has already been recorded for today.",
          });
        } else {
          const Qry = { _id: req.body._id };
          const vals = {
            lunchStartTime: req.body.lunchStartTime,
          };
          const data = await EmployeeAttendance.findByIdAndUpdate(Qry, {
            $set: vals,
          });
          res.json({ message: "Lunch start Time Recorded", Checkindata: data });
        }
      } else {
        res.json({
          message:
            "Please select today's date and provide the lunch start time properly.",
        });
      }
    } else {
      res.json({ message: "Invalid Id" });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};
export const UpdateLunchEndTime = async (req, res) => {
  try {
    const finddata = await EmployeeAttendance.findById(req.body._id);
    if (finddata) {
      const currentDate = new Date();
      const lunchEndDate = new Date(req.body.lunchEndTime);
      const isSameDay =
        lunchEndDate.toLocaleDateString() === currentDate.toLocaleDateString();

      console.log(
        lunchEndDate.toLocaleDateString() + currentDate.toLocaleDateString()
      );
      if (isSameDay) {
        const existingEntry = await EmployeeAttendance.findOne({
          _id: req.body._id,
          lunchEndTime: {
            $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
            $lt: new Date(currentDate.setHours(23, 59, 59, 999)),
          },
        });

        if (existingEntry && existingEntry.lunchEndTime) {
          res.json({
            message: "Lunch end time has already been recorded for today.",
          });
        } else {
          const Qry = { _id: req.body._id };
          const vals = {
            lunchEndTime: req.body.lunchEndTime,
          };
          const data = await EmployeeAttendance.findByIdAndUpdate(Qry, {
            $set: vals,
          });
          res.json({
            message: "Lunch end time recorded successfully.",
            Checkindata: data,
          });
        }
      } else {
        res.json({
          message:
            "Please select today's date and provide the lunch end time properly.",
        });
      }
    } else {
      res.json({ message: "Invalid Id" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const UpdateCheckOutTime = async (req, res) => {
  try {
    const finddata = await EmployeeAttendance.findById(req.body._id);
    if (finddata) {
      const currentDate = new Date();
      const checkOutDate = new Date(req.body.checkOutTime);

      const isSameDay =
        checkOutDate.getDate() === currentDate.getDate() &&
        checkOutDate.getMonth() === currentDate.getMonth() &&
        checkOutDate.getFullYear() === currentDate.getFullYear();

      if (isSameDay) {
        const existingEntry = await EmployeeAttendance.findOne({
          _id: req.body._id,
          checkOutTime: {
            $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
            $lt: new Date(currentDate.setHours(23, 59, 59, 999)),
          },
        });

        if (existingEntry && existingEntry.checkOutTime) {
          res.json({
            message: "Check out time has already been recorded for today.",
          });
        } else {
          const checkInTime = new Date(finddata.checkInTime);
          const workTimeDiff = checkOutDate.getTime() - checkInTime.getTime();
          let totalTime = workTimeDiff / (1000 * 60 * 60);
          totalTime = Math.max(totalTime, 0);

          let totalHoursWorked = 0;
          if (finddata.lunchStartTime && finddata.lunchEndTime) {
            const lunchStartTime = new Date(finddata.lunchStartTime);
            const lunchEndTime = new Date(finddata.lunchEndTime);
            const lunchTimeDiff =
              lunchEndTime.getTime() - lunchStartTime.getTime();
            const lunchDuration = lunchTimeDiff / (1000 * 60 * 60);
            totalHoursWorked = totalTime - lunchDuration;
            totalHoursWorked = Math.max(totalHoursWorked, 0);
          } else {
            totalHoursWorked = totalTime;
          }

          const regularWorkingHours = 8;
          let overtimeHours = totalHoursWorked - regularWorkingHours;
          overtimeHours = Math.max(overtimeHours, 0);

          const Qry = { _id: req.body._id };
          const vals = {
            checkOutTime: req.body.checkOutTime,
            totalHoursWorked: Number(totalHoursWorked),
            overtimeHours: Math.floor(overtimeHours),
          };
          const data = await EmployeeAttendance.findByIdAndUpdate(Qry, {
            $set: vals,
          });
          res.json({
            message: "Check out time recorded successfully.",
            Checkindata: data,
          });
        }
      } else {
        res.json({
          message:
            "Please select today's date and provide the check out time properly.",
        });
      }
    } else {
      res.json({ message: "Invalid Id" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const GetTodayCheckIn = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
      999
    );

    const checkInRecord = await EmployeeAttendance.findOne({
      employeeId: employeeId,
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    if (checkInRecord) {
      res.json({ checkInRecord });
    } else {
      res.json({ message: "No check-in data found for today" });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};
export const GetOneUserData = async (req, res) => {
  try {
    if (!req.body.year || !req.body.month || !req.body.employeeId) {
      return res
        .status(500)
        .json(
          "Invalid request .. please check your inputs...month , year and employee Id cant be empty"
        );
    } else {
      const StartDate = moment([req.body.year, req.body.month - 1])
        .startOf("month")
        .toDate();
      const EndDate = moment(StartDate).endOf("month").toDate();
      const data = await EmployeeAttendance.find({
        employeeId: req.body.employeeId,
        checkInTime: { $gte: StartDate, $lte: EndDate },
      });
      const PresentDays = data.length;
      const daysInMonth = new Date(req.body.year, req.body.month, 0).getDate();
      let WeekendDaysCount = 0;
      for (
        let date = StartDate;
        date <= EndDate;
        date.setDate(date.getDate() + 1)
      ) {
        if (date.getDay() === 0 || date.getDay() === 6) {
          WeekendDaysCount++;
        }
      }
      const StartDate1 = moment([req.body.year, req.body.month - 1])
        .startOf("month")
        .toDate();
      const EndDate1 = moment(StartDate1).endOf("month").toDate();
      console.log(StartDate1 +"startdate");
      console.log(EndDate1+"enddate");
    
      const leaveRecords = await LeaveManager.find({
        employeeId: req.body.employeeId,
        $or: [
          { startDate: { $gte: StartDate1, $lte: EndDate1 } },
          { endDate: { $gte: StartDate1, $lte: EndDate1 } },
          {
            startDate: { $gte: StartDate1, $lte: EndDate1 },
            endDate: { $gte: StartDate1, $lte: EndDate1 },
          },
        ],
      });

      let totalLeaveDays = 0;
      let leaveDuration = 0;
      leaveRecords.forEach((leaveRecord) => {
        if (
          new Date(leaveRecord.startDate).getDate() ===
            new Date(EndDate).getDate() ||
          new Date(leaveRecord.endDate).getDate() ===
            new Date(StartDate1).getDate()
        ) {
          leaveDuration = 1;
          totalLeaveDays += leaveDuration;
        } else {
          leaveDuration = leaveRecord.noOfDays;
          totalLeaveDays += leaveDuration;
        }
      });
      return res.json({
        actualPayableDays: daysInMonth - WeekendDaysCount,
        totalWorkingDays: daysInMonth,
        lossOfPayDays: totalLeaveDays,
        daysPayable: PresentDays,
      });
    }
  } catch (err) {
    res.json(err.message);
  }
};

export const GetAttendanceSummary = async (req, res) => {
  try {
    if (isNaN(req.body.year)) {
      return res.json("Enter valid year");
    }
    if (isNaN(req.body.month)) {
      return res.json("Enter valid month");
    }
    if (!req.body.year || !req.body.month) {
      return res
        .status(500)
        .json(
          "Invalid request .. please check your inputs ...month and year cant be empty"
        );
    }
    const StartDate = moment([req.body.year, req.body.month - 1])
      .startOf("month")
      .toDate();
    const EndDate = moment(StartDate).endOf("month").toDate();

    const attendanceSummary = await EmployeeAttendance.aggregate([
      {
        $match: {
          checkInTime: { $gte: StartDate, $lte: EndDate },
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalHoursWorked: { $sum: "$totalHoursWorked" },
          overtimeHours: { $sum: "$overtimeHours" },
        },
      },
    ]);
    res.json(attendanceSummary);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// export const GetAllUserData = async (req, res) => {

//   try {
//     const StartDate = moment([req.body.year, req.body.month - 1]).startOf('month').toDate();
//     const EndDate = moment(StartDate).endOf('month').toDate();
//     const AttendnceSummary = await LeaveManager.aggregate([
//       {
//         $match:
//         {
//           $or: [
//             { startDate: { $gte: StartDate, $lte: EndDate } },
//             { endDate: { $gte: StartDate, $lte: EndDate } },
//             {
//               startDate: { $gte: StartDate, $lte: EndDate },
//               endDate: { $gte: StartDate, $lte: EndDate }
//             }]
//         }
//       },
//       {
//         $group: {
//           _id: "$employeeId",
//           noOfDays: { $sum: "$noOfDays" }
//         }
//       }
//     ])
//     const employeeAttendanceSummary = await personal_info.aggregate([
//       {
//         $lookup: {
//           from: "AttendnceSummary",
//           localField: "_id",
//           foreignField: "_id",
//           as: "attendanceSummary"
//         }
//       }
//     ]);
//     res.json(employeeAttendanceSummary);
//   } catch (err) {
//     res.json(err.message);
//   }
// }

export const GetAllUserData = async (req, res) => {
  try {
    if (isNaN(req.params.year)) {
      return res.json({ message: "Enter valid year" });
    }
    if (isNaN(req.params.month)) {
      return res.json({ message: "Enter valid month" });
    }
    if (!req.params.year || !req.params.month) {
      return res.json({
        message:
          "Invalid request .. please check your inputs ...month and year cant be empty",
      });
    }
    const daysInMonth = new Date(
      req.params.year,
      req.params.month,
      0
    ).getDate();

    const StartDate = moment([req.params.year, req.params.month - 1])
      .startOf("month")
      .toDate();
    const EndDate = moment(StartDate).endOf("month").toDate();
    console.log(req.params.year);
    console.log(StartDate);
    console.log(EndDate);
    const AttendanceDataperMonth = await EmployeeAttendance.find({
      checkInTime: { $gte: StartDate, $lte: EndDate },
    });

    if (AttendanceDataperMonth.length !== 0) {
      const EmployeeIDArray = await personal_info.find();

      const AttendanceData = await Promise.all(
        EmployeeIDArray.map(async (EmpId) => {
          let PresentDays = 0;
          let totalLeaveDays = 0;
          let WeekendDaysCount = 0;
          PresentDays = AttendanceDataperMonth.filter(
            (data) => data.employeeId === EmpId.EmployeeId
          ).length;
          for (
            let date = StartDate;
            date <= EndDate;
            date.setDate(date.getDate() + 1)
          ) {
            if (date.getDay() === 0 || date.getDay() === 6) {
              WeekendDaysCount++;
            }
          }
          totalLeaveDays = await CalculateLeaveDays(
            EmpId.EmployeeId,
            req.params.year,
            req.params.month
          ).then((data) => {
            return data;
          });
          return {
            employeeId: EmpId.EmployeeId,
            PresentDays,
            daysInMonth,
            // WeekendDaysCount,
            totalLeaveDays: totalLeaveDays,
          };
        })
      );
      res.json(AttendanceData);
    }
  } catch (err) {
    res.json(err.message);
    console.log(err);
  }
};

async function CalculateLeaveDays(EmpId, year, month) {
  let LeaveDays = 0;
  let leaveDuration = 0;

  const StartDate1 = moment([year, month - 1])
    .startOf("month")
    .toDate();
  const EndDate1 = moment(StartDate1).endOf("month").toDate();

  // const StartDate1 = moment([req.body.year, req.body.month - 1]).startOf('month').toDate();
  // const EndDate1 = moment(StartDate1).endOf('month').toDate();

  const leaveRecords = await LeaveManager.find({
    employeeId: EmpId,
    $or: [
      { startDate: { $gte: StartDate1, $lte: EndDate1 } },
      { endDate: { $gte: StartDate1, $lte: EndDate1 } },
      {
        startDate: { $gte: StartDate1, $lte: EndDate1 },
        endDate: { $gte: StartDate1, $lte: EndDate1 },
      },
    ],
  });
  // .then(leaveRecords => {
  leaveRecords.map((leaveRecord) => {
    if (
      new Date(leaveRecord.startDate).getDate() ===
        new Date(EndDate1).getDate() ||
      new Date(leaveRecord.endDate).getDate() === new Date(StartDate1).getDate()
    ) {
      leaveDuration = 1;
      LeaveDays += leaveDuration;
    } else {
      leaveDuration = leaveRecord.noOfDays;
      LeaveDays += leaveDuration;
    }
  });

  // })
  console.log("LeaveDays");
  console.log(LeaveDays);
  return LeaveDays;
}

export const GetByManager = async (req, res) => {
  const year = req.params.year;
  const month = req.params.month;
  const ManagerId = req.params.ManagerID;

  const DesignationData = await positionData.find();
  const filteredData = [];
  await Promise.all(
    DesignationData.map(async (d) => {
      if (d.designation.length !== 0) {
        let lastIndex = d.designation.length - 1;
        if (Number(d.designation[lastIndex].managerId) === Number(ManagerId)) {
          filteredData.push(d.employeeId);
        }
      }
    })
  );
  console.log(filteredData);
  const daysInMonth = new Date(year, month, 0).getDate();

  const StartDate = moment([year, month - 1])
    .startOf("month")
    .toDate();
  const EndDate = moment(StartDate).endOf("month").toDate();
  console.log(year);
  console.log(StartDate);
  console.log(EndDate);
  const AttendanceDataperMonth = await EmployeeAttendance.find({
    checkInTime: { $gte: StartDate, $lte: EndDate },
  });

  if (AttendanceDataperMonth.length !== 0) {
    const AttendanceData = await Promise.all(
      filteredData.map(async (EmpId) => {
        let PresentDays = 0;
        let totalLeaveDays = 0;
        let WeekendDaysCount = 0;
        PresentDays = AttendanceDataperMonth.filter(
          (data) => data.employeeId === EmpId
        ).length;
        for (
          let date = StartDate;
          date <= EndDate;
          date.setDate(date.getDate() + 1)
        ) {
          if (date.getDay() === 0 || date.getDay() === 6) {
            WeekendDaysCount++;
          }
        }
        totalLeaveDays = await CalculateLeaveDays(
          EmpId,
          req.params.year,
          req.params.month
        ).then((data) => {
          return data;
        });
        return {
          employeeId: EmpId,
          PresentDays,
          daysInMonth,
          // WeekendDaysCount,
          totalLeaveDays: totalLeaveDays,
        };
      })
    );
    res.json(AttendanceData);
  }
};
