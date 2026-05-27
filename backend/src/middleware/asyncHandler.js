import asyncHandler
from "../middleware/asyncHandler.js";

const asyncHandler =
  (fn) =>
  (req, res, next) => {

    Promise.resolve(
      fn(req, res, next)
    ).catch(next);

  };

  
export const getUsers =
  asyncHandler(async (req, res) => {

    const users =
      await User.find();

    res.json(users);

  });