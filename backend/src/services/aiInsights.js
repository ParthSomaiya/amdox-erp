export const generateInsights =
  (analytics) => {

    const insights = [];

    if (
      analytics.revenue >
      analytics.expense
    ) {

      insights.push(
        "Revenue growth is healthy."
      );

    }

    if (
      analytics.expense >
      analytics.revenue * 0.7
    ) {

      insights.push(
        "Expenses are too high."
      );

    }

    if (
      analytics.newUsers > 100
    ) {

      insights.push(
        "User acquisition is increasing rapidly."
      );

    }

    if (
      analytics.inventoryLow > 10
    ) {

      insights.push(
        "Inventory restock required soon."
      );

    }

    return insights;

  };