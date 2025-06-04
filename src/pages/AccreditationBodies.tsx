import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AccreditationBody } from '../types';
import AccreditationBodyCard from '../components/AccreditationBodyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch } from 'react-icons/fi';

const AccreditationBodies = () => {
  const [bodies, setBodies] = useState<AccreditationBody[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAccreditationBodies = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('accreditation_bodies')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        setBodies(data as AccreditationBody[]);
      } catch (error) {
        console.error('Error fetching accreditation bodies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccreditationBodies();
  }, []);

  const filteredBodies = bodies.filter((body) =>
    body.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    body.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If no real data is available, use sample data
  const sampleBodies: AccreditationBody[] = [
    {
      id: '1',
      name: 'Medical Council',
      website_url: 'https://example.com/medical-council',
      logo_url: null,
      submission_url: 'https://example.com/medical-council/submit',
      description: 'The Medical Council is responsible for maintaining the register of medical practitioners and ensuring high standards in medical education, training, and practice.',
    },
    {
      id: '2',
      name: 'Nursing and Midwifery Board',
      website_url: 'https://example.com/nursing-board',
      logo_url: null,
      submission_url: 'https://example.com/nursing-board/submit',
      description: 'The Nursing and Midwifery Board regulates the practice of nursing and midwifery to protect the public and ensure high standards of care.',
    },
    {
      id: '3',
      name: 'Pharmacy Board',
      website_url: 'https://example.com/pharmacy-board',
      logo_url: null,
      submission_url: 'https://example.com/pharmacy-board/submit',
      description: 'The Pharmacy Board is responsible for registering pharmacists and setting standards for pharmacy practice to ensure the safe and effective delivery of pharmacy services.',
    },
    {
      id: '4',
      name: 'Dental Council',
      website_url: 'https://example.com/dental-council',
      logo_url: null,
      submission_url: 'https://example.com/dental-council/submit',
      description: 'The Dental Council regulates dental professionals to ensure they meet and maintain professional standards for the protection of the public.',
    },
  ];

  const displayBodies = bodies.length > 0 ? filteredBodies : sampleBodies;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Accreditation Bodies</h1>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search accreditation bodies..."
            className="pl-10 input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Information Card */}
      <div className="card bg-primary-50 border border-primary-100">
        <h2 className="text-lg font-semibold text-primary-800 mb-2">Submit Your CPD Points</h2>
        <p className="text-primary-700 mb-4">
          Use the links below to submit your completed CPD activities to the relevant accreditation bodies.
          Each body has its own submission process and requirements.
        </p>
        <div className="bg-white p-4 rounded border border-primary-100">
          <h3 className="font-medium text-primary-800 mb-2">Tips for Submission:</h3>
          <ul className="list-disc list-inside text-primary-700 space-y-1">
            <li>Keep all your certificates in one place</li>
            <li>Check submission deadlines for each body</li>
            <li>Ensure you meet the minimum CPD requirements</li>
            <li>Maintain records for the required retention period</li>
          </ul>
        </div>
      </div>
      
      {/* Accreditation Bodies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayBodies.map((body) => (
          <AccreditationBodyCard key={body.id} body={body} />
        ))}
      </div>
    </div>
  );
};

export default AccreditationBodies;
