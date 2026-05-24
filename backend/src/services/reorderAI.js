export const predictReorder =
  (product) => {

    const {
      stock,
      avgSalesPerWeek,
      reorderLevel,
    } = product;

    const estimatedWeeks =
      stock /
      avgSalesPerWeek;

    if (
      estimatedWeeks < 2
    ) {

      return {

        reorder: true,

        priority:
          "HIGH",

        suggestedQty:
          reorderLevel * 2,

      };

    }

    if (
      estimatedWeeks < 4
    ) {

      return {

        reorder: true,

        priority:
          "MEDIUM",

        suggestedQty:
          reorderLevel,

      };

    }

    return {

      reorder: false,

      priority: "LOW",

      suggestedQty: 0,

    };

  };