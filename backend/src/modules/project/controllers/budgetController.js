import Budget from "../models/Budget.js";

export const createBudget =
  async (req, res) => {

    try {

      const budget =
        await Budget.create({
          ...req.body,
          companyId:
            req.companyId,
        });

      res.json(budget);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Budget create failed",
      });
    }
  };

export const getBudgets =
  async (req, res) => {

    try {

      const budgets =
        await Budget.find()
          .populate("projectId");

      const formatted =
        budgets.map((b) => ({
          ...b.toObject(),

          remaining:
            b.plannedBudget -
            b.actualCost,

          burnRate:
            (
              (b.actualCost /
                b.plannedBudget) *
              100
            ).toFixed(2),
        }));

      res.json(formatted);

    } catch (err) {

      res.status(500).json({
        message:
          "Budget fetch failed",
      });
    }
  };