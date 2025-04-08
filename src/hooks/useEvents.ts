import { useState, useEffect } from 'react';
import { EventFormData, EventFilters, Recurrence } from '../types';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'cultural-events';
const REMINDERS_KEY = 'event-reminders';

const alarmSound = new Audio('/alarm.mp3');

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
      
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          setEvents(parsedEvents);
        } catch (error) {
          console.error('Error parsing stored events:', error);
          toast.error('Error al cargar los eventos guardados');
        }
      }

      if (storedReminders && storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          const reminders = JSON.parse(storedReminders);
          parsedEvents.forEach((event: EventFormData) => {
            event.reminder = reminders[event.id];
          });
          setEvents(parsedEvents);
        } catch (error) {
          console.error('Error parsing stored reminders:', error);
        }
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

  const generateRecurringEvents = (baseEvent: EventFormData): EventFormData[] => {
    const events: EventFormData[] = [];
    const baseDate = new Date(baseEvent.datetime);
    const recurrence = baseEvent.recurrence;

    switch (recurrence.type) {
      case 'diaria':
        // Generar eventos para los próximos 30 días
        for (let i = 0; i < 30; i++) {
          const newDate = new Date(baseDate);
          newDate.setDate(newDate.getDate() + i);
          events.push({
            ...baseEvent,
            id: crypto.randomUUID(),
            datetime: newDate.toISOString(),
          });
        }
        break;

      case 'anual':
        // Generar eventos para los próximos 3 años
        for (let i = 0; i < 3; i++) {
          const newDate = new Date(baseDate);
          newDate.setFullYear(newDate.getFullYear() + i);
          events.push({
            ...baseEvent,
            id: crypto.randomUUID(),
            datetime: newDate.toISOString(),
          });
        }
        break;

      case 'personalizada':
        if (recurrence.daysOfWeek?.length) {
          const endDate = recurrence.endDate ? new Date(recurrence.endDate) : null;
          const maxOccurrences = recurrence.occurrences || 52; // Default to 52 weeks if no occurrences specified
          let currentDate = new Date(baseDate);
          let occurrenceCount = 0;

          while ((!endDate || currentDate <= endDate) && occurrenceCount < maxOccurrences) {
            const dayOfWeek = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
            if (recurrence.daysOfWeek.includes(dayOfWeek)) {
              events.push({
                ...baseEvent,
                id: crypto.randomUUID(),
                datetime: currentDate.toISOString(),
              });
              occurrenceCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
        break;

      default:
        events.push(baseEvent);
    }

    return events;
  };

  const saveEvents = (newEvents: EventFormData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      
      const reminders = newEvents.reduce((acc, event) => {
        if (event.reminder) {
          acc[event.id] = event.reminder;
        }
        return acc;
      }, {} as Record<string, { enabled: boolean; minutesBefore: number; triggered?: boolean }>);
      
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
      setEvents(newEvents);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast.error('Error al guardar los eventos');
    }
  };

  // Añadir en el hook useEvents:
const addEvent = (event: Omit<EventFormData, 'id'>) => {
  try {
    const baseEvent: EventFormData = {
      ...event,
      id: crypto.randomUUID(),
      isFavorite: false,
    };

    // Generar eventos recurrentes
    const recurringEvents = generateRecurringEvents(baseEvent);
    
    // Combinar con eventos existentes
    const updatedEvents = [...events, ...recurringEvents];
    
    // Guardar inmediatamente
    saveEvents(updatedEvents);
    toast.success('Evento(s) creado(s) exitosamente');
  } catch (error) {
    console.error('Error creating event:', error);
    toast.error('Error al crear el evento');
  }
};
  const updateEvent = (event: EventFormData) => {
    const updatedEvents = events.map(e => e.id === event.id ? event : e);
    saveEvents(updatedEvents);
    toast.success('Evento actualizado exitosamente');
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    saveEvents(updatedEvents);
    toast.success('Evento eliminado exitosamente');
  };

  const toggleReminder = (id: string, minutesBefore: number) => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const updatedEvents = events.map(event =>
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
    saveEvents(updatedEvents);
    toast.success('Recordatorio configurado exitosamente');
  };

  const toggleFavorite = (id: string) => {
    const updatedEvents = events.map(event =>
      event.id === id
        ? { ...event, isFavorite: !event.isFavorite }
        : event
    );
    saveEvents(updatedEvents);
    toast.success(
      updatedEvents.find(e => e.id === id)?.isFavorite
        ? 'Evento añadido a favoritos'
        : 'Evento eliminado de favoritos'
    );
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
