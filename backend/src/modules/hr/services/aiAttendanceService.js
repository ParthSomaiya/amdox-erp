export const detectAnomaly = (records) => {
  const anomalies = [];

  records.forEach((r) => {
    const hours =
      (new Date(r.checkOut) - new Date(r.checkIn)) /
      (1000 * 60 * 60);

    if (hours < 4 || hours > 12) {
      anomalies.push({
        userId: r.userId,
        issue: "Unusual working hours",
      });
    }
  });

  return anomalies;
};