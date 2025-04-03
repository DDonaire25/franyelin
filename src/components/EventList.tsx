import React from 'react';
import { EventFormData, EventFilters } from '../types';
import { EventCard } from './EventCard';
import { Search } from 'lucide-react';

interface EventListProps {
  events: EventFormData[];
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Todas las categorías</option>
            <option value="Artes Escenicas y Musicales">Artes Escénicas y Musicales</option>
            <option value="Artes Visuales y del espacio">Artes Visuales y del espacio</option>
            <option value="Cine y medios audiovisual">Cine y medios audiovisual</option>
            <option value="Promocion del Libro y la Lectura">Promoción del Libro y la Lectura</option>
            <option value="Patrimonio cultural">Patrimonio cultural</option>
          </select>

          <select
            value={filters.eventType}
            onChange={(e) => onFilterChange({ ...filters, eventType: e.target.value || undefined })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Todos los tipos</option>
            <option value="Taller">Taller</option>
            <option value="Festival">Festival</option>
            <option value="Exposicion">Exposición</option>
            <option value="Toma Cultural">Toma Cultural</option>
            <option value="Encuentros">Encuentros</option>
            <option value="Proyeccion de cine">Proyección de cine</option>
            <option value="Otros">Otros</option>
          </select>

          <input
            type="date"
            value={filters.date || ''}
            onChange={(e) => onFilterChange({ ...filters, date: e.target.value || undefined })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {events.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron eventos que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};