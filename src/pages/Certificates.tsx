import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserWebinar } from '../types';
import { useAuth } from '../context/AuthContext';
import CertificateCard from '../components/CertificateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiFilter } from 'react-icons/fi';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<UserWebinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_webinars')
          .select('*, webinar:webinars(*)')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false });
          
        if (error) throw error;
        
        setCertificates(data as UserWebinar[]);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((c: UserWebinar) => (c.webinar as any)?.category).filter(Boolean))
        );
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  const handleDownload = (userWebinar: UserWebinar) => {
    if (!userWebinar.certificate_url) return;
    
    // In a real app, this would download from storage
    // For this demo, we'll just open the data URI
    window.open(userWebinar.certificate_url, '_blank');
  };

  const filteredCertificates = certificates.filter((cert) => {
    if (!cert.webinar) return false;
    
    const matchesSearch = cert.webinar.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? cert.webinar.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
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
      <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search certificates..."
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
        </div>
      </div>
      
      {/* Certificates List */}
      {filteredCertificates.length > 0 ? (
        <div className="space-y-4">
          {filteredCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              userWebinar={cert}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
          <p className="text-gray-500 mb-4">
            Complete webinars to earn certificates and CPD points.
          </p>
          <a href="/webinars" className="btn btn-primary">
            Browse Webinars
          </a>
        </div>
      )}
    </div>
  );
};

export default Certificates;
