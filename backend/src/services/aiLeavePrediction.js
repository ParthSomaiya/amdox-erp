import Leave from "../models/Leave.js";

export const predictLeaveRisk =
  async (employeeId) => {

    const leaves =
      await Leave.find({
        employee: employeeId,
      });

    let total = leaves.length;

    let score = 0;

    if (total > 10) {

      score = 90;

    } else if (total > 5) {

      score = 60;

    } else {

      score = 20;

    }

    let prediction =
      "Low Risk";

    if (score >= 80) {

      prediction =
        "High Leave Risk";

    } else if (
      score >= 50
    ) {

      prediction =
        "Medium Leave Risk";

    }

    return {

      totalLeaves: total,

      score,

      prediction,

    };

  };