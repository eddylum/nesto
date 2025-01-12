import React from 'react';
import { Trash2, Clock, Bed, Car, DoorOpen, Bath, Sparkles, Heart, Baby, Dog, Key, Utensils } from 'lucide-react';

const serviceIcons = {
  clock: Clock,
  bed: Bed,
  car: Car,
  door: DoorOpen,
  bath: Bath,
  sparkles: Sparkles,
  heart: Heart,
  baby: Baby,
  dog: Dog,
  key: Key,
  utensils: Utensils
};

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: keyof typeof serviceIcons;
  onDelete?: (id: string) => void;
  isManagement?: boolean;
}

export default function ServiceCard({ 
  id, 
  name, 
  description, 
  price, 
  icon,
  onDelete,
  isManagement = false 
}: ServiceCardProps) {
  const Icon = serviceIcons[icon] || Utensils;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Icon className="h-6 w-6 text-emerald-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          <p className="mt-2 text-lg font-medium text-emerald-600">{price.toFixed(2)} €</p>
        </div>
        {isManagement && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="text-gray-400 hover:text-red-500 ml-4"
            title="Supprimer le service"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}