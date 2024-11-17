import React, { useState } from 'react';
import { X, Plane, Package, Car, Coffee, Utensils, Wifi } from 'lucide-react';

const serviceIcons = {
  plane: { icon: Plane, label: 'Transport Aéroport' },
  package: { icon: Package, label: 'Pack de Bienvenue' },
  car: { icon: Car, label: 'Transport Local' },
  coffee: { icon: Coffee, label: 'Petit-déjeuner' },
  utensils: { icon: Utensils, label: 'Restauration' },
  wifi: { icon: Wifi, label: 'Internet' },
} as const;

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: { name: string; description: string; price: number; icon: keyof typeof serviceIcons }) => void;
}

export default function AddServiceModal({ isOpen, onClose, onAdd }: AddServiceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof serviceIcons>('package');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      description,
      price: parseFloat(price),
      icon: selectedIcon
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Ajouter un Service</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de Service
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(serviceIcons).map(([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedIcon(key as keyof typeof serviceIcons)}
                    className={`p-3 flex flex-col items-center justify-center border rounded-lg ${
                      selectedIcon === key
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-1" />
                    <span className="text-xs text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du Service
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Transfert Aéroport"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={3}
                placeholder="Transport confortable depuis/vers l'aéroport"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="49.99"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-sm font-medium rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2 text-sm font-medium rounded-md"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}