import React from 'react';
import { Calendar, Users, Ticket, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Eventos Próximos',
      value: '12',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Tareas Pendientes',
      value: '8',
      icon: Ticket,
      color: 'bg-purple-500',
    },
    {
      title: 'Eventos Grupales',
      value: '3',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Logros del Mes',
      value: '15',
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">¡Bienvenido a tu Agenda Cultural!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Próximos Eventos</h2>
          <div className="space-y-4">
            {/* Aquí irán los eventos próximos */}
            <p className="text-gray-600">Cargando eventos...</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tareas Prioritarias</h2>
          <div className="space-y-4">
            {/* Aquí irán las tareas prioritarias */}
            <p className="text-gray-600">Cargando tareas...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;