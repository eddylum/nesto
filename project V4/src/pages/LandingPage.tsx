import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Key, CreditCard, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from '../components/AuthModal';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Plaazo" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuthModal(true);
                }}
                className="btn-secondary px-4 py-2 rounded-lg"
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="btn-primary px-4 py-2 rounded-lg"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Rest of the component remains the same */}
      {/* ... */}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}