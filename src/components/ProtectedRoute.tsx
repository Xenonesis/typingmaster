import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { AuthModal } from '@/components/auth/AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { guestUser, isGuest } = useGuest();
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  // Get feature name from the path
  const getFeatureName = () => {
    const path = location.pathname;
    const feature = path.split('/')[1];
    return feature ? feature.replace(/-/g, ' ') : 'this feature';
  };

  useEffect(() => {
    // If there's no authenticated user and no guest user, show the auth modal
    if (!loading && !user && !isGuest) {
      setShowModal(true);
    }
  }, [loading, user, isGuest]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated or is a guest, render children
  if (user || isGuest) {
    return <>{children}</>;
  }

  // Render auth modal for users to choose between login or guest
  return (
    <AuthModal 
      isOpen={showModal} 
      onClose={() => {
        setShowModal(false);
        navigate('/');
      }} 
      feature={getFeatureName()}
      returnPath={location.pathname}
    />
  );
};

export default ProtectedRoute; 