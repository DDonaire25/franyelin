import { useState, useEffect } from 'react';
import { EventFormData, EventFilters } from '../types';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'cultural-events';
const REMINDERS_KEY = 'event-reminders';
const FAVORITES_KEY = 'favorite-events';

const alarmSound = new Audio('/alarm.mp3');

const generateRecurringEvents = (baseEvent: EventFormData): EventFormData[] => {
  const events: EventFormData[] = [];
  const baseDate = new Date(baseEvent.datetime);
  const now = new Date();
  const MAX_EVENTS = 100; // Límite para evitar sobrecarga

  switch (baseEvent.recurrence.type) {
    case 'diaria': {
      for (let i = 0; i < 30 && events.length < MAX_EVENTS; i++) {
        const newDate = new Date(baseDate);
        newDate.setDate(newDate.getDate() + i);
        if (newDate > now) {
          events.push({
            ...baseEvent,
            id: crypto.randomUUID(),
            datetime: newDate.toISOString(),
          });
        }
      }
      break;
    }

    case 'anual': {
      for (let i = 0; i < 5 && events.length < MAX_EVENTS; i++) {
        const newDate = new Date(baseDate);
        newDate.setFullYear(newDate.getFullYear() + i);
        if (newDate > now) {
          events.push({
            ...baseEvent,
            id: crypto.randomUUID(),
            datetime: newDate.toISOString(),
          });
        }
      }
      break;
    }

    case 'personalizada': {
      if (!baseEvent.recurrence.daysOfWeek?.length && !baseEvent.recurrence.endDate && !baseEvent.recurrence.occurrences) {
        events.push({
          ...baseEvent,
          id: crypto.randomUUID(),
        });
        break;
      }

      const endDate = baseEvent.recurrence.endDate 
        ? new Date(baseEvent.recurrence.endDate)
        : new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // Default to 1 year

      const maxOccurrences = baseEvent.recurrence.occurrences || MAX_EVENTS;
      const daysOfWeek = baseEvent.recurrence.daysOfWeek || [];
      
      let currentDate = new Date(baseDate);
      
      while (events.length < maxOccurrences && currentDate <= endDate && events.length < MAX_EVENTS) {
        const dayName = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
        const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

        if (daysOfWeek.includes(capitalizedDayName) && currentDate > now) {
          events.push({
            ...baseEvent,
            id: crypto.randomUUID(),
            datetime: currentDate.toISOString(),
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;
    }

    default: {
      // Una sola vez
      if (baseDate > now) {
        events.push({
          ...baseEvent,
          id: crypto.randomUUID(),
        });
      }
    }
  }

  return events;
};

export const useEvents = () => {
  const [events, setEvents] = useState<EventFormData[]>([]);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: undefined,
    eventType: undefined,
    date: undefined,
  });

  useEffect(() => {
    const loadStoredData = () => {
      const storedEvents = localStorage.getItem(STORAGE_KEY);
      const storedReminders = localStorage.getItem(REMINDERS_KEY);
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        
        // Apply reminders
        if (storedReminders) {
          const reminders = JSON.parse(storedReminders);
          parsedEvents.forEach((event: EventFormData) => {
            event.reminder = reminders[event.id];
          });
        }

        // Apply favorites
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          parsedEvents.forEach((event: EventFormData) => {
            event.isFavorite = favorites.includes(event.id);
          });
        }

        // Filter out past events and sort
        const now = new Date();
        const validEvents = parsedEvents
          .filter((event: EventFormData) => new Date(event.datetime) > now)
          .sort((a: EventFormData, b: EventFormData) => 
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
          );

        setEvents(validEvents);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      events.forEach(event => {
        if (event.reminder?.enabled) {
          const eventTime = new Date(event.datetime).getTime();
          const reminderTime = eventTime - (event.reminder.minutesBefore * 60 * 1000);
          const now = new Date().getTime();

          if (now >= reminderTime && now < eventTime && !event.reminder.triggered) {
            alarmSound.play().catch(console.error);

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Recordatorio de Evento', {
                body: `El evento "${event.title}" comenzará en ${event.reminder.minutesBefore} minutos`,
                icon: '/icon.png'
              });
            }

            const updatedEvents = events.map(e => {
              if (e.id === event.id && e.reminder) {
                return {
                  ...e,
                  reminder: {
                    ...e.reminder,
                    triggered: true
                  }
                };
              }
              return e;
            });
            saveEvents(updatedEvents);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [events]);

  const saveEvents = (newEvents: EventFormData[]) => {
    // Filter out past events and sort by date
    const now = new Date();
    const validEvents = newEvents
      .filter(event => new Date(event.datetime) > now)
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validEvents));
    
    const reminders = validEvents.reduce((acc, event) => {
      if (event.reminder) {
        acc[event.id] = event.reminder;
      }
      return acc;
    }, {} as Record<string, { enabled: boolean; minutesBefore: number; triggered?: boolean }>);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));

    const favorites = validEvents
      .filter(event => event.isFavorite)
      .map(event => event.id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    setEvents(validEvents);
  };

  const addEvent = (event: Omit<EventFormData, 'id'>) => {
    const baseEvent = { ...event, id: crypto.randomUUID() };
    
    // Generate recurring events
    const recurringEvents = generateRecurringEvents(baseEvent);

    if (recurringEvents.length === 0) {
      toast.error('No se pueden crear eventos en el pasado');
      return;
    }

    // Filter out any potential duplicates
    const newEvents = recurringEvents.filter(
      newEvent => !events.some(existing => 
        existing.title === newEvent.title && 
        existing.datetime === newEvent.datetime
      )
    );

    if (newEvents.length === 0) {
      toast.error('Los eventos ya existen en el calendario');
      return;
    }

    saveEvents([...events, ...newEvents]);
    toast.success(`${newEvents.length} evento(s) creado(s) exitosamente`);
  };

  const updateEvent = (event: EventFormData) => {
    // For updates, we only modify the specific event
    const newEvents = events.map(e => e.id === event.id ? event : e);
    saveEvents(newEvents);
    toast.success('Evento actualizado exitosamente');
  };

  const deleteEvent = (id: string) => {
    const newEvents = events.filter(e => e.id !== id);
    saveEvents(newEvents);
    toast.success('Evento eliminado exitosamente');
  };

  const toggleFavorite = (id: string) => {
    const newEvents = events.map(event =>
      event.id === id
        ? { ...event, isFavorite: !event.isFavorite }
        : event
    );
    saveEvents(newEvents);
    const event = newEvents.find(e => e.id === id);
    toast.success(event?.isFavorite ? 'Añadido a favoritos' : 'Eliminado de favoritos');
  };

  const toggleReminder = (id: string, minutesBefore: number) => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const newEvents = events.map(event =>
      event.id === id
        ? {
            ...event,
            reminder: {
              enabled: true,
              minutesBefore,
              triggered: false
            },
          }
        : event
    );
    saveEvents(newEvents);
    toast.success('Recordatorio configurado exitosamente');
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
    toggleReminder,
    toggleFavorite,
    filters,
    setFilters,
  };
};
