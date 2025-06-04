import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CPDActivity } from '../types';

// Mock data for testing
const mockActivities: CPDActivity[] = [
  {
    id: '1',
    user_id: 'default-user-id',
    title: 'Advanced Cardiac Life Support',
    description: 'Certification course covering advanced interventions for cardiac emergencies',
    activity_type: 'Course',
    provider: 'American Heart Association',
    points: 10,
    date_completed: '2023-10-15',
    certificate_url: 'https://example.com/cert1',
    created_at: '2023-10-16T10:30:00Z'
  },
  {
    id: '2',
    user_id: 'default-user-id',
    title: 'Medical Ethics Symposium',
    description: 'Annual symposium on current ethical issues in medicine',
    activity_type: 'Conference',
    provider: 'Medical Ethics Association',
    points: 8,
    date_completed: '2023-09-22',
    created_at: '2023-09-23T14:15:00Z'
  },
  {
    id: '3',
    user_id: 'default-user-id',
    title: 'New Approaches in Pain Management',
    description: 'Online course covering latest research and techniques in pain management',
    activity_type: 'Online Course',
    provider: 'International Pain Society',
    points: 7,
    date_completed: '2023-08-05',
    certificate_url: 'https://example.com/cert3',
    created_at: '2023-08-06T09:45:00Z'
  }
];

// Mock upcoming webinars
const upcomingWebinars = [
  {
    id: '1',
    title: 'Advances in Telemedicine',
    date: '2023-12-10',
    provider: 'Digital Health Association',
    points: 5
  },
  {
    id: '2',
    title: 'Mental Health in Primary Care',
    date: '2023-12-15',
    provider: 'Primary Care Mental Health Alliance',
    points: 6
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<CPDActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a call to Supabase
        // For now, we'll use mock data
        setTimeout(() => {
          setActivities(mockActivities);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading activities:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Calculate total points
  const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0);
  const pointsPercentage = user ? Math.min(100, (totalPoints / user.required_annual_points) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">CPD Progress</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={pointsPercentage}
                  text={`${totalPoints}/${user.required_annual_points}`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: pointsPercentage >= 100 ? '#10B981' : '#3B82F6',
                    textColor: '#1F2937',
                    trailColor: '#E5E7EB',
                  })}
                />
              </div>
            </div>
            <p className="text-center text-gray-600">
              {pointsPercentage >= 100 
                ? 'Congratulations! You\'ve met your annual CPD requirement.' 
                : `${Math.round(pointsPercentage)}% of your annual requirement complete`}
            </p>
          </div>
          
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {user.full_name}</p>
              <p><span className="font-medium">Profession:</span> {user.profession}</p>
              <p><span className="font-medium">License:</span> {user.license_number}</p>
              <p><span className="font-medium">Required Points:</span> {user.required_annual_points} per year</p>
            </div>
            <div className="mt-4">
              <Link 
                to="/profile" 
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Edit Profile →
              </Link>
            </div>
          </div>
          
          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to="/webinars" 
                className="block w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-center font-medium"
              >
                Browse Webinars
              </Link>
              <Link 
                to="/certificates" 
                className="block w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-center font-medium"
              >
                View Certificates
              </Link>
              <Link 
                to="/accreditation" 
                className="block w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-center font-medium"
              >
                Accreditation Bodies
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent CPD Activities</h2>
          <Link 
            to="/certificates" 
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            View All →
          </Link>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading activities...</div>
        ) : activities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-500">{activity.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {activity.activity_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.date_completed).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {activity.certificate_url ? (
                        <a href={activity.certificate_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900">
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No CPD activities recorded yet.</p>
            <p className="mt-2">
              <Link to="/webinars" className="text-primary-600 hover:text-primary-800 font-medium">
                Browse webinars
              </Link> to start earning CPD points.
            </p>
          </div>
        )}
      </div>
      
      {/* Upcoming Webinars */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upcoming Webinars</h2>
          <Link 
            to="/webinars" 
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingWebinars.map((webinar) => (
            <div key={webinar.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-lg mb-1">{webinar.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(webinar.date).toLocaleDateString()} • {webinar.provider}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {webinar.points} CPD Points
                </span>
                <Link 
                  to={`/webinars/${webinar.id}`} 
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
