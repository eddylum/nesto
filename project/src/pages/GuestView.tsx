import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { supabase } from '../lib/supabase';
import { createPaymentSession } from '../lib/stripe';
import toast from 'react-hot-toast';
import type { Property, Service } from '../lib/supabase-types';

export default function GuestView() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setError('ID de propriété manquant');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select()
          .eq('id', propertyId)
          .maybeSingle();

        if (propertyError) {
          console.error('Property error:', propertyError);
          throw new Error('Impossible de charger la propriété');
        }
        
        if (!propertyData) {
          throw new Error('Propriété non trouvée');
        }

        setProperty(propertyData);

        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select()
          .eq('property_id', propertyId);

        if (servicesError) {
          console.error('Services error:', servicesError);
          throw new Error('Impossible de charger les services');
        }
        
        setServices(servicesData || []);

      } catch (error) {
        console.error('Error in loadData:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
        toast.error('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propertyId]);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const selectedServiceItems = services.filter(service => 
    selectedServices.includes(service.id)
  );

  const totalAmount = selectedServiceItems.reduce(
    (sum, service) => sum + service.price, 
    0
  );

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      await createPaymentSession(selectedServiceItems, propertyId!);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erreur lors du paiement');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Propriété non trouvée'}
          </h2>
          <p className="text-gray-600">
            Vérifiez l'URL ou contactez le propriétaire.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px] mb-8">
        <img
          src={property.image_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994'}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {property.name}
            </h1>
            <p className="text-xl text-white/90 mt-2 drop-shadow-lg">
              {property.address}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Services Disponibles</h2>
          {selectedServices.length > 0 && (
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-lg font-medium text-gray-900">
                Total: {totalAmount.toFixed(2)} €
              </span>
              <button
                className={`ml-4 px-4 py-2 btn-primary rounded-lg ${
                  processingPayment ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handlePayment}
                disabled={processingPayment}
              >
                {processingPayment ? 'Traitement...' : 'Payer'}
              </button>
            </div>
          )}
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun service n'est disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`cursor-pointer transition-transform transform hover:scale-105 ${
                  selectedServices.includes(service.id) ? 'ring-2 ring-indigo-500 rounded-lg' : ''
                }`}
                onClick={() => toggleService(service.id)}
              >
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}