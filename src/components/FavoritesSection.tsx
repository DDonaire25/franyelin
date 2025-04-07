import React from 'react';
import { EventCard } from './EventCard';
import { EventFormData } from '../types';
import { motion } from 'framer-motion';

interface FavoritesSectionProps {
  events: EventFormData[];
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
  onToggleFavorite: (id: string) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  events,
  onEdit,
  onDelete,
  onToggleReminder,
  onToggleFavorite,
}) => {
  const favoriteEvents = events.filter(event => event.isFavorite);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Eventos Favoritos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteEvents.map(event => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EventCard
              event={event}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleReminder={onToggleReminder}
              onToggleFavorite={onToggleFavorite}
            />
          </motion.div>
        ))}
        {favoriteEvents.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No tienes eventos favoritos aún.
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Marca eventos como favoritos para verlos aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};