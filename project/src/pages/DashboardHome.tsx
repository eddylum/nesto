import React from 'react';
import { Building2, Package, CreditCard } from 'lucide-react';

const stats = [
  {
    name: 'Propriétés',
    value: '3',
    icon: Building2,
    change: '+2 ce mois-ci',
    changeType: 'increase'
  },
  {
    name: 'Services Vendus',
    value: '28',
    icon: Package,
    change: '+12 ce mois-ci',
    changeType: 'increase'
  },
  {
    name: 'Revenus du Mois',
    value: '1 250 €',
    icon: CreditCard,
    change: '+18% vs. mois dernier',
    changeType: 'increase'
  }
];

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <p className="ml-2 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className={`text-${stat.changeType === 'increase' ? 'green' : 'red'}-600 font-semibold`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Revenus Mensuels</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Graphique des revenus à venir
        </div>
      </div>
    </div>
  );
}