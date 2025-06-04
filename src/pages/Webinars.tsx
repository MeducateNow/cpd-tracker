import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Webinar, UserWebinar } from '../types';
import WebinarCard from '../components/WebinarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiFilter } from 'react-icons/fi';

const Webinars = () => {
  const { user } = useAuth();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [userWebinars, setUserWebinars] = useState<UserWebinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchWebinars = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch all webinars
        const { data: webinarsData, error: webinarsError } = await supabase
          .from('webinars')
          .select('*')
          .order('date', { ascending: false });
          
        if (webinarsError) throw webinarsError;
        
        // Fetch user's webinars
        const { data: userWebinarsData, error: userWebinarsError } = await supabase
          .from('user_webinars')
          .select('*')
          .eq('user_id', user.id);
          
        if (userWebinarsError) throw userWebinarsError;
        
        setWebinars(webinarsData as Webinar[]);
        setUserWebinars(userWebinarsData as UserWebinar[]);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set((webinarsData as Webinar[]).map((w) => w.category))
        );
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('Error fetching webinars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, [user]);

  const getWebinarStatus = (webinarId: string) => {
    const userWebinar = userWebinars.find((uw) => uw.webinar_id === webinarId);
    return userWebinar ? userWebinar.status : undefined;
  };

  const filteredWebinars = webinars.filter((webinar) => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          webinar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          webinar.presenter.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesCategory = categoryFilter ? webinar.category === categoryFilter : true;
    
    const webinarStatus = getWebinarStatus(webinar.id);
    const matchesStatus = statusFilter 
      ? (statusFilter === 'registered' && webinarStatus === 'registered') ||
        (statusFilter === 'in_progress' && webinarStatus === 'in_progress') ||
        (statusFilter === 'completed' && webinarStatus === 'completed') ||
        (statusFilter === 'not_registered' && !webinarStatus)
      : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Webinars</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search webinars..."
              className="pl-10 input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="registered">Registered</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not_registered">Not Registered</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Webinars Grid */}
      {filteredWebinars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebinars.map((webinar) => (
            <WebinarCard
              key={webinar.id}
              webinar={webinar}
              status={getWebinarStatus(webinar.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No webinars found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Webinars;
