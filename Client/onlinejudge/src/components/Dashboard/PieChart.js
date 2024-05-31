import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Submission Status",
        data: Object.values(data),
        backgroundColor: [
          "#4caf50",
          "#f44336",
          "#ffeb3b",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Submission Status Distribution",
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
