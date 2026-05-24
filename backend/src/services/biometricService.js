import Attendance from "../models/Attendance.js";

export const syncBiometricAttendance =
  async (employees) => {

    try {

      for (const emp of employees) {

        const already =
          await Attendance.findOne({
            employee: emp.employeeId,

            date: new Date(
              emp.date
            ).toDateString(),
          });

        if (!already) {

          await Attendance.create({

            employee:
              emp.employeeId,

            checkIn:
              emp.checkIn,

            checkOut:
              emp.checkOut,

            status:
              "Present",

            biometric: true,

            date: emp.date,
          });

        }

      }

      return {
        success: true,
      };

    } catch (err) {

      console.log(err);

      return {
        success: false,
      };

    }

  };