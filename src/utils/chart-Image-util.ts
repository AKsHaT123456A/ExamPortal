import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ChartConfiguration } from "chart.js";
import * as fs from "fs";
import * as path from "path";

// Set chart dimensions and instance
const width = 800; // width of the chart
const height = 600; // height of the chart
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Title and labels for the chart
const title = "Answer Distribution";
const labels = ["Correct", "Wrong", "Marked Correct", "Marked Wrong"];

/**
 * Generate a chart image from the provided entries.
 * @param data - Array of corresponding data values.
 * @param fileName - Name of the file to save the chart.
 */
export async function createChartFromEntries(
  data: number[],
  fileName: string
) {
  if (labels.length !== data.length) {
    throw new Error("Labels and data arrays must have the same length.");
  }

  // Chart configuration
  const configuration: ChartConfiguration = {
    type: "bar", // Bar chart
    data: {
      labels: labels,
      datasets: [
        {
          label: "Answer Distribution",
          data: data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)", // Correct answers
            "rgba(255, 99, 132, 0.2)", // Wrong answers
            "rgba(54, 162, 235, 0.2)", // Marked Correct answers
            "rgba(255, 206, 86, 0.2)", // Marked Wrong answers
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 18, // Title font size
            weight: "bold", // Title font weight
          },
        },
        legend: {
          position: "top", // Position of the legend
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Answer Types", // X-axis label
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1, // Ensure proper scaling
          },
          title: {
            display: true,
            text: "Count", // Y-axis label
            font: {
              size: 14,
              weight: "bold",
            },
          },
          grid: {
            color: "rgba(200, 200, 200, 0.5)", // Grid line color
            lineWidth: 1, // Grid line width
          },
        },
      },
      elements: {
        bar: {
          borderRadius: 5, // Smooth rounded corners for bars
        },
      },
      layout: {
        padding: 20, // Space around the chart
      },
      backgroundColor: "#fff", // White background color
    },
  };

  // Generate chart as buffer
  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

  // Create file path to save the chart in the same directory
  const filePath = path.join(__dirname, fileName);

  // Write chart image buffer to a file
  fs.writeFileSync(filePath, imageBuffer);
  console.log(`Chart saved as ${filePath}`);
}
