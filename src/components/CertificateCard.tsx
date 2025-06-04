import { UserWebinar } from '../types';
import { format } from 'date-fns';
import { FiDownload, FiExternalLink } from 'react-icons/fi';

interface CertificateCardProps {
  userWebinar: UserWebinar;
  onDownload: (userWebinar: UserWebinar) => void;
}

const CertificateCard = ({ userWebinar, onDownload }: CertificateCardProps) => {
  if (!userWebinar.webinar) return null;
  
  const completedDate = userWebinar.completed_at 
    ? format(new Date(userWebinar.completed_at), 'MMMM d, yyyy')
    : 'N/A';
  
  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-1">{userWebinar.webinar.title}</h3>
          <p className="text-sm text-gray-500 mb-3">
            Completed on {completedDate}
          </p>
          <div className="flex items-center mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {userWebinar.webinar.cpd_points} CPD Points
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {userWebinar.webinar.category}
            </span>
          </div>
        </div>
        
        <div className="flex">
          <button
            onClick={() => onDownload(userWebinar)}
            className="flex items-center text-primary-600 hover:text-primary-800 mr-2"
          >
            <FiDownload className="mr-1" />
            <span className="text-sm">Download</span>
          </button>
          
          <a
            href={`/accreditation`}
            className="flex items-center text-secondary-600 hover:text-secondary-800"
          >
            <FiExternalLink className="mr-1" />
            <span className="text-sm">Submit</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
