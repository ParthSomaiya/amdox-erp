export const predictRevenue =
  (data) => {

    if (!data.length) {

      return [];

    }

    const result = [];

    let avg = 0;

    data.forEach((d) => {

      avg += d.revenue;

    });

    avg =
      avg / data.length;

    for (
      let i = 1;
      i <= 6;
      i++
    ) {

      result.push({

        month:
          `Future-${i}`,

        predictedRevenue:
          Math.round(
            avg * (1 + i * 0.08)
          ),

      });

    }

    return result;

  };