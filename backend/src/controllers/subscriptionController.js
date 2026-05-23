import Subscription
from "../models/Subscription.js";

export const createSubscription =
  async (req, res) => {

    const subscription =
      await Subscription.create({

        ...req.body,

        companyId:
          req.user.companyId,

      });

    res.json(subscription);

};

export const getSubscriptions =
  async (req, res) => {

    const data =
      await Subscription.find()
        .populate("companyId");

    res.json(data);

};