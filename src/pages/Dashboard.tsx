import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CpdSummary, UserWebinar, Webinar } from '../types';
import CpdProgressCard from '../components/CpdProgressCard';
import CpdCategoryChart from '../components/CpdCategoryChart';
import CpdMonthlyChart from '../components/CpdMonthlyChart';
import WebinarCard from '../components/WebinarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { FiCalendar, FiCheckCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [cpdSummary, setCpdSummary] = useState<CpdSummary>({
    total: 0,
    required: 0,
    byCategory: {},
    byMonth: {},
  });
  const [recentWebinars, setRecentWebinars] = useState<UserWebinar[]>([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch user's webinars
        const { data: userWebinars, error: userWebinarsError } = await supabase
          .from('user_webinars')
          .select('*, webinar:webinars(*)')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(3);
          
        if (userWebinarsError) throw userWebinarsError;
        
        // Fetch upcoming webinars
        const today = new Date().toISOString();
        const { data: upcoming, error: upcomingError } = await supabase
          .from('webinars')
          .select('*')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(3);
          
        if (upcomingError) throw upcomingError;
        
        // Process CPD data
        const completedWebinars = userWebinars.filter(
          (uw: UserWebinar) => uw.status === 'completed'
        );
        
        const categoryData: Record<string, number> = {};
        const monthlyData: Record<string, number> = {};
        
        completedWebinars.forEach((uw: UserWebinar) => {
          const webinar = uw.webinar as Webinar;
          
          // Category data
          if (webinar.category) {
            categoryData[webinar.category] = (categoryData[webinar.category] || 0) + webinar.cpd_points;
          }
          
          // Monthly data
          if (uw.completed_at) {
            const month = format(new Date(uw.completed_at), 'MMM yyyy');
            monthlyData[month] = (monthlyData[month] || 0) + webinar.cpd_points;
          }
        });
        
        setCpdSummary({
          total: user.total_cpd_points,
          required: user.required_annual_points,
          byCategory: categoryData,
          byMonth: monthlyData,
        });
        
        setRecentWebinars(userWebinars as UserWebinar[]);
        setUpcomingWebinars(upcoming as Webinar[]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* CPD Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CpdProgressCard 
            totalPoints={cpdSummary.total} 
            requiredPoints={cpdSummary.required} 
          />
        </div>
        <div className="md:col-span-1">
          <CpdCategoryChart categoryData={cpdSummary.byCategory} />
        </div>
        <div className="md:col-span-1">
          <CpdMonthlyChart monthlyData={cpdSummary.byMonth} />
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Webinars */}
          <div className="card">
            <div className="flex items-center mb-4">
              <FiCheckCircle className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-lg font-semibold">Recent Webinars</h3>
            </div>
            
            {recentWebinars.length > 0 ? (
              <div className="space-y-4">
                {recentWebinars.map((userWebinar) => (
                  <div key={userWebinar.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-medium">{userWebinar.webinar?.title}</h4>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Status: {userWebinar.status.replace('_', ' ')}</span>
                      <span>{userWebinar.webinar?.cpd_points} points</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent webinar activity.</p>
            )}
          </div>
          
          {/* Upcoming Webinars */}
          <div className="card">
            <div className="flex items-center mb-4">
              <FiCalendar className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-lg font-semibold">Upcoming Webinars</h3>
            </div>
            
            {upcomingWebinars.length > 0 ? (
              <div className="space-y-4">
                {upcomingWebinars.map((webinar) => (
                  <div key={webinar.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-medium">{webinar.title}</h4>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{format(new Date(webinar.date), 'MMM d, yyyy')}</span>
                      <span>{webinar.cpd_points} points</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming webinars.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommended Webinars */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Webinars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WebinarCard 
            webinar={{
              id: '1',
              title: 'Advanced Cardiac Life Support Update',
              description: 'Learn the latest guidelines and techniques for advanced cardiac life support in emergency situations.',
              presenter: 'Dr. Sarah Johnson',
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              duration_minutes: 120,
              cpd_points: 4,
              accreditation_body: 'Medical Council',
              category: 'Emergency Medicine',
              image_url: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
            }}
          />
          
          <WebinarCard 
            webinar={{
              id: '2',
              title: 'Ethical Considerations in Telemedicine',
              description: 'Explore the ethical challenges and considerations when practicing medicine through telehealth platforms.',
              presenter: 'Prof. Michael Chen',
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              duration_minutes: 90,
              cpd_points: 3,
              accreditation_body: 'Ethics Board',
              category: 'Medical Ethics',
              image_url: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg',
            }}
          />
          
          <WebinarCard 
            webinar={{
              id: '3',
              title: 'Updates in Pharmacotherapy',
              description: 'Review the latest developments in drug therapies and treatment protocols across various medical specialties.',
              presenter: 'Dr. Emily Rodriguez',
              date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
              duration_minutes: 150,
              cpd_points: 5,
              accreditation_body: 'Pharmacy Board',
              category: 'Pharmacology',
              image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
