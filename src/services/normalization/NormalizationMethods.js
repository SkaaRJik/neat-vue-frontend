export default {
  Linear_Method: (dataContainer, minRange, maxRange) =>
    new Promise((resolve, reject) => {
      if (!dataContainer) reject("parsedData is null");
      const data = dataContainer.data;

      if (!data) reject("Data is null");
      if (!data[0]) reject("Data is empty");
      let min = 0;
      let max = 0;

      const columns = [];
      const statistic = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (let i = 0; i < data[0].length; i++) {
        columns.push({
          data: [],
          columnName: dataContainer.headers[i],
          columnType:
            i <= dataContainer.headers.length - 2 ? "Input" : "Output",
          minValue: 0,
          maxValue: 0
        });
        for (let j = 0; j < data.length; j++) {
          if (j == 0) {
            if (data[j][i] != null) {
              min = data[j][i];
              max = data[j][i];
            }
            continue;
          }
          if (data[j][i] != null) {
            min = Math.min(min, data[j][i]);
            max = Math.max(max, data[j][i]);
          }
        }
        columns[i].minValue = min;
        columns[i].maxValue = max;

        for (let j = 0; j < data.length; j++) {
          if (data[j][i] == null) {
            columns[i].data.push(null);
            continue;
          }
          const newValue = (data[j][i] - min) / (max - min);
          if (minRange >= 0) {
            const rangedValue = newValue * (maxRange - minRange) + minRange;
            columns[i].data.push(rangedValue);
          } else {
            const rangedValue = newValue * (maxRange * 2) + minRange;
            columns[i].data.push(rangedValue);
          }

          if (newValue >= 0 && newValue < 0.1) {
            statistic[0]++;
          } else if (newValue >= 0.1 && newValue < 0.2) {
            statistic[1]++;
          } else if (newValue >= 0.2 && newValue < 0.3) {
            statistic[2]++;
          } else if (newValue >= 0.3 && newValue < 0.4) {
            statistic[3]++;
          } else if (newValue >= 0.4 && newValue < 0.5) {
            statistic[4]++;
          } else if (newValue >= 0.5 && newValue < 0.6) {
            statistic[5]++;
          } else if (newValue >= 0.6 && newValue < 0.7) {
            statistic[6]++;
          } else if (newValue >= 0.7 && newValue < 0.8) {
            statistic[7]++;
          } else if (newValue >= 0.8 && newValue < 0.9) {
            statistic[8]++;
          } else if (newValue >= 0.9 && newValue <= 1.0) {
            statistic[9]++;
          } else if (newValue < 0 && newValue > 1.0) {
            statistic[10]++;
          }
        }
      }
      resolve({
        normalizationServiceData: {
          minRange,
          maxRange,
          method: "Linear_Method"
        },
        columns,
        statistic
      });
    })
};
