import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CpdCategoryChartProps {
  categoryData: Record<string, number>;
}

const CpdCategoryChart = ({ categoryData }: CpdCategoryChartProps) => {
  const categories = Object.keys(categoryData);
  const points = Object.values(categoryData);
  
  const data = {
    labels: categories,
    datasets: [
      {
        data: points,
        backgroundColor: [
          '#0ea5e9',
          '#14b8a6',
          '#ec4899',
          '#8b5cf6',
          '#f59e0b',
          '#84cc16',
          '#ef4444',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} points`;
          }
        }
      }
    },
  };

  return (
    <div className="card h-full">
      <h3 className="text-lg font-semibold mb-4">CPD by Category</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default CpdCategoryChart;
