import Task from "../models/Task.js";

export const getBudgetReport = async (projectId) => {
  const tasks = await Task.find({ projectId });

  let planned = 0;
  let actual = 0;

  tasks.forEach(t => {
    planned += t.estimatedCost || 0;
    actual += t.actualCost || 0;
  });

  return { planned, actual };
};