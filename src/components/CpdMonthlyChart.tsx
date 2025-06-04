import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CpdMonthlyChartProps {
  monthlyData: Record<string, number>;
}

const CpdMonthlyChart = ({ monthlyData }: CpdMonthlyChartProps) => {
  const months = Object.keys(monthlyData);
  const points = Object.values(monthlyData);
  
  const data = {
    labels: months,
    datasets: [
      {
        label: 'CPD Points',
        data: points,
        backgroundColor: '#0ea5e9',
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Points',
        },
      },
    },
  };

  return (
    <div className="card h-full">
      <h3 className="text-lg font-semibold mb-4">Monthly CPD Activity</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CpdMonthlyChart;
