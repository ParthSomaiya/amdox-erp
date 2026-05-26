export const getDashboard = async (req, res) => {

  try {

    const role = req.user.role;

    let data = {
      stats: {},
      monthly: [],
    };

    // DEMO MONTHLY DATA
    const monthly = [
      {
        month: "Jan",
        employees: 20,
        revenue: 40000,
      },
      {
        month: "Feb",
        employees: 25,
        revenue: 50000,
      },
      {
        month: "Mar",
        employees: 30,
        revenue: 70000,
      },
      {
        month: "Apr",
        employees: 40,
        revenue: 90000,
      },
    ];

    if (role === "ADMIN") {

      data = {
        stats: {
          employees: 50,
          payroll: 25,
          leaves: 10,
        },

        monthly,
      };

    }

    if (role === "HR") {

      data = {
        stats: {
          employees: 20,
          payroll: 10,
          leaves: 5,
        },

        monthly,
      };

    }

    if (role === "FINANCE") {

      data = {
        stats: {
          employees: 10,
          payroll: 15,
          leaves: 2,
        },

        monthly,
      };

    }

    if (role === "EMPLOYEE") {

      data = {
        stats: {
          employees: 1,
          payroll: 1,
          leaves: 2,
        },

        monthly,
      };

    }

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};