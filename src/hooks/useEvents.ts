import { useState, useEffect } from 'react';
import { EventFormData, EventFilters } from '../types';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'cultural-events';

export const useEvents = () => {
  const [events, setEvents] = useState<EventFormData[]>([]);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: undefined,
    eventType: undefined,
    date: undefined,
  });

  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const saveEvents = (newEvents: EventFormData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const addEvent = (event: Omit<EventFormData, 'id'>) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    const newEvents = [...events, newEvent];
    saveEvents(newEvents);
    toast.success('Evento creado exitosamente');
  };

  const updateEvent = (event: EventFormData) => {
    const newEvents = events.map(e => e.id === event.id ? event : e);
    saveEvents(newEvents);
    toast.success('Evento actualizado exitosamente');
  };

  const deleteEvent = (id: string) => {
    const newEvents = events.filter(e => e.id !== id);
    saveEvents(newEvents);
    toast.success('Evento eliminado exitosamente');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || event.category === filters.category;
    const matchesType = !filters.eventType || event.eventType === filters.eventType;
    const matchesDate = !filters.date || event.datetime.startsWith(filters.date);

    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  return {
    events: filteredEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    filters,
    setFilters,
  };
};