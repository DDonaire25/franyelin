import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { EventCard } from './EventCard';
import { EventFormData } from '../types';

interface VirtualizedEventListProps {
  events: EventFormData[];
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
  onToggleFavorite: (id: string) => void;
}

export const VirtualizedEventList: React.FC<VirtualizedEventListProps> = ({
  events,
  onEdit,
  onDelete,
  onToggleReminder,
  onToggleFavorite,
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="px-4">
      <EventCard
        event={events[index]}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleReminder={onToggleReminder}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );

  return (
    <List
      height={800}
      itemCount={events.length}
      itemSize={400}
      width="100%"
      className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
    >
      {Row}
    </List>
  );
};