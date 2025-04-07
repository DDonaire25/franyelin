import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import EventForm from '../components/EventForm';
import { EventFormData } from '../types/events';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Events = () => {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<EventFormData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: EventFormData) => {
    try {
      if (selectedEvent?.id) {
        const { error } = await supabase
          .from('events')
          .update(data)
          .eq('id', selectedEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([data]);

        if (error) throw error;
      }

      await loadEvents();
      setShowForm(false);
      setSelectedEvent(undefined);
    } catch (error) {
      console.error('Error guardando evento:', error);
    }
  };

  const handleEdit = (event: EventFormData) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await loadEvents();
      } catch (error) {
        console.error('Error eliminando evento:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Eventos Culturales</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-cultural-600 text-white rounded-lg hover:bg-cultural-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Evento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-cultural-500 focus:border-cultural-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cultural-500 focus:border-cultural-500">
            <option value="">Todas las categorías</option>
            {/* Opciones de categorías */}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cultural-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay eventos programados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-cultural-100 text-cultural-800 text-sm rounded-full">
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {event.cost_type === 'free' ? 'Gratis' : `$${event.cost_amount}`}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {format(new Date(event.date_time), "d 'de' MMMM, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 text-sm text-cultural-600 hover:text-cultural-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => event.id && handleDelete(event.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <EventForm
          initialData={selectedEvent}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedEvent(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Events;