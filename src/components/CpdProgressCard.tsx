import { FiAward } from 'react-icons/fi';

interface CpdProgressCardProps {
  totalPoints: number;
  requiredPoints: number;
}

const CpdProgressCard = ({ totalPoints, requiredPoints }: CpdProgressCardProps) => {
  const percentage = Math.min(Math.round((totalPoints / requiredPoints) * 100), 100);
  
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <FiAward className="h-6 w-6 text-primary-500 mr-2" />
        <h3 className="text-lg font-semibold">CPD Progress</h3>
      </div>
      
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-3xl font-bold text-primary-600">{totalPoints}</p>
          <p className="text-sm text-gray-500">of {requiredPoints} points</p>
        </div>
        <p className="text-2xl font-semibold text-primary-600">{percentage}%</p>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="mt-4">
        {percentage >= 100 ? (
          <p className="text-green-600 font-medium">
            Congratulations! You've met your CPD requirements.
          </p>
        ) : (
          <p className="text-gray-600">
            You need {requiredPoints - totalPoints} more points to meet your annual requirement.
          </p>
        )}
      </div>
    </div>
  );
};

export default CpdProgressCard;
