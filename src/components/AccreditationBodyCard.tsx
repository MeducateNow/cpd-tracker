import { AccreditationBody } from '../types';
import { FiExternalLink } from 'react-icons/fi';

interface AccreditationBodyCardProps {
  body: AccreditationBody;
}

const AccreditationBodyCard = ({ body }: AccreditationBodyCardProps) => {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        {body.logo_url ? (
          <img 
            src={body.logo_url} 
            alt={body.name} 
            className="w-12 h-12 object-contain mr-4"
          />
        ) : (
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-primary-700 font-bold text-lg">
              {body.name.charAt(0)}
            </span>
          </div>
        )}
        <h3 className="text-lg font-semibold">{body.name}</h3>
      </div>
      
      <p className="text-gray-600 mb-4">{body.description}</p>
      
      <div className="flex justify-between">
        <a
          href={body.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-800 flex items-center"
        >
          <span>Visit Website</span>
          <FiExternalLink className="ml-1" />
        </a>
        
        <a
          href={body.submission_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary py-1"
        >
          Submit CPD
        </a>
      </div>
    </div>
  );
};

export default AccreditationBodyCard;
