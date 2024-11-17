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
              <Building2 className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RentalHub</span>
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Monétisez vos services</span>
            <span className="block text-emerald-600">pour locations courte durée</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Créez facilement un catalogue de services personnalisé pour vos locations. Partagez-le avec vos invités et gérez vos revenus additionnels en toute simplicité.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="w-full flex items-center justify-center px-8 py-3 rounded-md btn-primary md:py-4 md:text-lg md:px-10"
              >
                Démarrer gratuitement
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative bg-white p-6 rounded-xl shadow-sm">
            <div className="absolute -top-4 left-4 bg-emerald-50 rounded-lg p-3">
              <Key className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Gestion simplifiée</h3>
            <p className="mt-2 text-gray-500">
              Créez et gérez facilement vos services additionnels pour chaque propriété.
            </p>
          </div>

          <div className="relative bg-white p-6 rounded-xl shadow-sm">
            <div className="absolute -top-4 left-4 bg-emerald-50 rounded-lg p-3">
              <CreditCard className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Paiements sécurisés</h3>
            <p className="mt-2 text-gray-500">
              Recevez les paiements de vos clients en toute sécurité et automatiquement.
            </p>
          </div>

          <div className="relative bg-white p-6 rounded-xl shadow-sm">
            <div className="absolute -top-4 left-4 bg-emerald-50 rounded-lg p-3">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Suivi des performances</h3>
            <p className="mt-2 text-gray-500">
              Analysez vos revenus et optimisez votre offre de services.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}