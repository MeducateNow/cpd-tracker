import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Webinar } from '../types';
import WebinarCard from './WebinarCard';
import LoadingSpinner from './LoadingSpinner';

const UpcomingWebinars = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingWebinars = async () => {
      setLoading(true);
      
      const today = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(3);
        
      if (error) {
        console.error('Error fetching upcoming webinars:', error);
      } else {
        setWebinars(data as Webinar[]);
      }
      
      setLoading(false);
    };

    fetchUpcomingWebinars();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Upcoming Webinars</h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (webinars.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Upcoming Webinars</h3>
        <p className="text-gray-500 py-4 text-center">No upcoming webinars found.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Upcoming Webinars</h3>
      <div className="space-y-4">
        {webinars.map((webinar) => (
          <WebinarCard key={webinar.id} webinar={webinar} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingWebinars;
