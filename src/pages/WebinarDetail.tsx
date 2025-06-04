import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Webinar, UserWebinar } from '../types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FiClock, FiCalendar, FiUser, FiAward, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';

const WebinarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [userWebinar, setUserWebinar] = useState<UserWebinar | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    const fetchWebinarDetails = async () => {
      if (!id || !user) return;
      
      setLoading(true);
      
      try {
        // Fetch webinar details
        const { data: webinarData, error: webinarError } = await supabase
          .from('webinars')
          .select('*')
          .eq('id', id)
          .single();
          
        if (webinarError) throw webinarError;
        
        // Fetch user's registration status
        const { data: userWebinarData, error: userWebinarError } = await supabase
          .from('user_webinars')
          .select('*')
          .eq('user_id', user.id)
          .eq('webinar_id', id)
          .maybeSingle();
          
        if (userWebinarError) throw userWebinarError;
        
        setWebinar(webinarData as Webinar);
        setUserWebinar(userWebinarData as UserWebinar);
      } catch (error) {
        console.error('Error fetching webinar details:', error);
        toast.error('Failed to load webinar details');
        navigate('/webinars');
      } finally {
        setLoading(false);
      }
    };

    fetchWebinarDetails();
  }, [id, user, navigate]);

  const handleRegister = async () => {
    if (!webinar || !user) return;
    
    setRegistering(true);
    
    try {
      const { data, error } = await supabase
        .from('user_webinars')
        .insert({
          user_id: user.id,
          webinar_id: webinar.id,
          status: 'registered',
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setUserWebinar(data as UserWebinar);
      toast.success('Successfully registered for the webinar');
    } catch (error) {
      console.error('Error registering for webinar:', error);
      toast.error('Failed to register for the webinar');
    } finally {
      setRegistering(false);
    }
  };

  const handleComplete = async () => {
    if (!webinar || !userWebinar || !user) return;
    
    setCompleting(true);
    
    try {
      // Generate certificate
      const certificateUrl = await generateCertificate();
      
      // Update user webinar status
      const { error: updateError } = await supabase
        .from('user_webinars')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          certificate_url: certificateUrl,
        })
        .eq('id', userWebinar.id);
        
      if (updateError) throw updateError;
      
      // Update user's total CPD points
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          total_cpd_points: user.total_cpd_points + webinar.cpd_points,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Refresh user webinar data
      const { data: refreshedData, error: refreshError } = await supabase
        .from('user_webinars')
        .select('*')
        .eq('id', userWebinar.id)
        .single();
        
      if (refreshError) throw refreshError;
      
      setUserWebinar(refreshedData as UserWebinar);
      toast.success('Webinar marked as completed');
    } catch (error) {
      console.error('Error completing webinar:', error);
      toast.error('Failed to mark webinar as completed');
    } finally {
      setCompleting(false);
    }
  };

  const generateCertificate = async (): Promise<string> => {
    if (!webinar || !user) return '';
    
    setGeneratingCertificate(true);
    
    try {
      // Create PDF certificate
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      // Set background color
      doc.setFillColor(240, 249, 255);
      doc.rect(0, 0, 297, 210, 'F');
      
      // Add border
      doc.setDrawColor(14, 165, 233);
      doc.setLineWidth(5);
      doc.rect(10, 10, 277, 190);
      
      // Add header
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 165, 233);
      doc.setFontSize(30);
      doc.text('CERTIFICATE OF COMPLETION', 148.5, 40, { align: 'center' });
      
      // Add content
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('This is to certify that', 148.5, 70, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text(user.full_name, 148.5, 85, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.text('has successfully completed the webinar', 148.5, 100, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(webinar.title, 148.5, 115, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.text(`Presented by: ${webinar.presenter}`, 148.5, 130, { align: 'center' });
      doc.text(`Date: ${format(new Date(webinar.date), 'MMMM d, yyyy')}`, 148.5, 140, { align: 'center' });
      doc.text(`Duration: ${webinar.duration_minutes} minutes`, 148.5, 150, { align: 'center' });
      doc.text(`CPD Points: ${webinar.cpd_points}`, 148.5, 160, { align: 'center' });
      
      // Add footer
      doc.setFontSize(12);
      doc.text('CPD Meducate Now', 148.5, 180, { align: 'center' });
      doc.text(`Certificate ID: ${Date.now()}`, 148.5, 187, { align: 'center' });
      
      // Save PDF
      const pdfOutput = doc.output('datauristring');
      
      // In a real app, you would upload this to storage
      // For this demo, we'll just return the data URI
      return pdfOutput;
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
      return '';
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const downloadCertificate = () => {
    if (!userWebinar?.certificate_url) return;
    
    // In a real app, this would download from storage
    // For this demo, we'll just open the data URI
    window.open(userWebinar.certificate_url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Webinar not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{webinar.title}</h1>
        
        <div>
          {!userWebinar ? (
            <button
              className="btn btn-primary"
              onClick={handleRegister}
              disabled={registering}
            >
              {registering ? 'Registering...' : 'Register for Webinar'}
            </button>
          ) : userWebinar.status === 'registered' ? (
            <button
              className="btn btn-primary"
              onClick={handleComplete}
              disabled={completing}
            >
              {completing ? 'Processing...' : 'Mark as Completed'}
            </button>
          ) : userWebinar.status === 'completed' ? (
            <button
              className="btn btn-secondary flex items-center"
              onClick={downloadCertificate}
              disabled={!userWebinar.certificate_url}
            >
              <FiDownload className="mr-2" />
              Download Certificate
            </button>
          ) : null}
        </div>
      </div>
      
      {/* Webinar Image */}
      <div className="relative h-64 rounded-lg overflow-hidden">
        <img
          src={webinar.image_url || 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg'}
          alt={webinar.title}
          className="w-full h-full object-cover"
        />
        
        {userWebinar && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              userWebinar.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : userWebinar.status === 'in_progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {userWebinar.status === 'completed'
                ? 'Completed'
                : userWebinar.status === 'in_progress'
                ? 'In Progress'
                : 'Registered'}
            </span>
          </div>
        )}
      </div>
      
      {/* Webinar Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">About this Webinar</h2>
            <p className="text-gray-700 mb-6">{webinar.description}</p>
            
            <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Latest research and developments in {webinar.category}</li>
              <li>Practical applications and case studies</li>
              <li>Best practices and guidelines</li>
              <li>Q&A with the presenter</li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-3">Who Should Attend</h3>
            <p className="text-gray-700">
              This webinar is designed for healthcare professionals interested in {webinar.category}, 
              including doctors, nurses, pharmacists, and allied health professionals.
            </p>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Webinar Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FiCalendar className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Date</h3>
                  <p className="text-gray-600">{format(new Date(webinar.date), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiClock className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p className="text-gray-600">{webinar.duration_minutes} minutes</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiUser className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Presenter</h3>
                  <p className="text-gray-600">{webinar.presenter}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiAward className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">CPD Points</h3>
                  <p className="text-gray-600">{webinar.cpd_points} points</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiCheckCircle className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Accreditation</h3>
                  <p className="text-gray-600">{webinar.accreditation_body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarDetail;
