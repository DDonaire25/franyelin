import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventFormData } from '../types';
import { EventCard } from './EventCard';
import { ArrowLeft } from 'lucide-react';

interface EventDetailsProps {
  events: EventFormData[];
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ events, onEdit, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Evento no encontrado</h2>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Volver al listado
      </button>

      <div className="max-w-2xl mx-auto">
        <EventCard
          event={event}
          onEdit={onEdit}
          onDelete={(eventId) => {
            onDelete(eventId);
            navigate('/');
          }}
        />
      </div>
    </div>
  );
};