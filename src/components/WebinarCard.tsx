import { Link } from 'react-router-dom';
import { Webinar } from '../types';
import { format } from 'date-fns';
import { FiClock, FiAward } from 'react-icons/fi';

interface WebinarCardProps {
  webinar: Webinar;
  status?: 'registered' | 'in_progress' | 'completed';
}

const WebinarCard = ({ webinar, status }: WebinarCardProps) => {
  const formattedDate = format(new Date(webinar.date), 'MMM d, yyyy');
  
  const statusBadge = () => {
    if (!status) return null;
    
    const badgeClasses = {
      registered: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
    };
    
    const badgeText = {
      registered: 'Registered',
      in_progress: 'In Progress',
      completed: 'Completed',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClasses[status]}`}>
        {badgeText[status]}
      </span>
    );
  };
  
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={webinar.image_url || 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg'} 
          alt={webinar.title} 
          className="w-full h-40 object-cover rounded-t-lg mb-4"
        />
        {status && (
          <div className="absolute top-2 right-2">
            {statusBadge()}
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{webinar.title}</h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{webinar.description}</p>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <FiClock className="mr-1" />
        <span>{webinar.duration_minutes} minutes</span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <FiAward className="mr-1" />
        <span>{webinar.cpd_points} CPD points</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{formattedDate}</span>
        <Link 
          to={`/webinars/${webinar.id}`} 
          className="btn btn-primary py-1"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default WebinarCard;
