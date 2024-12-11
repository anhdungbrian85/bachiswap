import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const ChartUI = ({
  Node,
  NodeFree,
  TotalBalance,
  SelectChart,
  SelectChartSecond,
  UserWallet,
  UserBuyNode,
  TotalReferral,
}) => {
  const selectedData =
    SelectChart !== undefined
      ? SelectChart === 0
        ? Node
        : SelectChart === 1
          ? NodeFree
          : SelectChart === 2
            ? TotalBalance
            : undefined
      : undefined;

  const selectedDataSecond =
    SelectChartSecond !== undefined
      ? SelectChartSecond === 0
        ? UserWallet
        : SelectChartSecond === 1
          ? UserBuyNode
          : SelectChartSecond === 2
            ? TotalReferral
            : undefined
      : undefined;

  const dataToDisplay =
    selectedData !== undefined ? selectedData : selectedDataSecond;
  const labels = dataToDisplay.map((_, index) => `Day ${index + 1}`);
  const lineData = {
    labels: labels,
    datasets: [
      {
        data: dataToDisplay,
        Node,
        fill: false,
        borderColor: "#e42493",
        tension: 0.1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div>
      <div style={{ width: "100%", height: "100%" }}>
        <Line data={lineData} options={options} />
      </div>
    </div>
  );
};

export default ChartUI;
