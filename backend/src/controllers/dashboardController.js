export const getDashboard = async (req, res) => {
  const role = req.user.role;

  let data = {};

  if (role === "ADMIN") {
    data = {
      message: "Admin Dashboard",
      stats: {
        totalEmployees: 50,
        revenue: 1000000,
      },
    };
  }

  if (role === "HR") {
    data = {
      message: "HR Dashboard",
      stats: {
        employees: 20,
        pendingLeaves: 5,
      },
    };
  }

  if (role === "FINANCE") {
    data = {
      message: "Finance Dashboard",
      stats: {
        invoices: 10,
        payments: 5,
      },
    };
  }

  if (role === "EMPLOYEE") {
    data = {
      message: "Employee Dashboard",
      stats: {
        leaves: 2,
        attendance: "Present",
      },
    };
  }

  res.json(data);
};